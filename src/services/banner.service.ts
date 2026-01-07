import { bannerRepository } from '../repositories/banner.repository';
import { postRepository } from '../repositories/post.repository';
import {
  CreateBannerDto,
  UpdateBannerDto,
  BannerFilterDto,
  TrendingConfigDto,
  BannerPosition,
} from '../dtos/banner.dto';
import { IBanner } from '../models/banner.model';
import { IPost } from '../models/post.model';
import { PaginatedResponse } from '../types';

/**
 * Banner Service - Business logic for banner management
 * Includes auto-assign logic for trending posts
 */
export class BannerService {
  private readonly DEFAULT_TOP_COUNT = 10;
  private readonly DEFAULT_POSITION: BannerPosition = 'hero';

  /**
   * Get all banners with pagination and filters
   */
  async getAll(filters: BannerFilterDto = {}): Promise<PaginatedResponse<IBanner>> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { data, total } = await bannerRepository.findAllWithFilters(filters);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get banner by ID
   */
  async getById(id: string): Promise<IBanner | null> {
    return bannerRepository.findById(id);
  }

  /**
   * Get banner by post ID
   */
  async getByPostId(postId: string): Promise<IBanner | null> {
    return bannerRepository.findByPostId(postId);
  }

  /**
   * Get active banners for a position (for public display)
   */
  async getActiveByPosition(position: BannerPosition, limit = 10): Promise<IBanner[]> {
    return bannerRepository.findActiveByPosition(position, limit);
  }

  /**
   * Get trending banners (hero position, active, auto-assigned)
   */
  async getTrending(limit = 10): Promise<IBanner[]> {
    const banners = await bannerRepository.findActiveByPosition('hero', limit);
    return banners.filter(b => b.isAutoAssigned);
  }

  /**
   * Create new banner manually
   */
  async create(dto: CreateBannerDto): Promise<IBanner> {
    // Get post info to fill defaults
    const post = await postRepository.findById(dto.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    return bannerRepository.create({
      postId: post._id,
      title: dto.title || post.title,
      subtitle: dto.subtitle || null,
      imageUrl: dto.imageUrl || post.coverImage || '',
      linkUrl: dto.linkUrl || `/${post.slug}/`,
      position: dto.position || 'hero',
      sortOrder: dto.sortOrder || 0,
      status: dto.status || 'active',
      isAutoAssigned: dto.isAutoAssigned ?? false, // Manual creation = not auto-assigned
      startDate: dto.startDate || null,
      endDate: dto.endDate || null,
    } as any);
  }

  /**
   * Update banner
   */
  async update(id: string, dto: UpdateBannerDto): Promise<IBanner | null> {
    return bannerRepository.update(id, dto as any);
  }

  /**
   * Delete banner
   */
  async delete(id: string): Promise<boolean> {
    return bannerRepository.delete(id);
  }

  /**
   * Track banner view
   */
  async trackView(id: string): Promise<void> {
    await bannerRepository.incrementViewCount(id);
  }

  /**
   * Track banner click
   */
  async trackClick(id: string): Promise<void> {
    await bannerRepository.incrementClickCount(id);
  }

  /**
   * === TRENDING AUTO-ASSIGN LOGIC ===
   * Sync banners with top trending posts based on viewCount
   * Groups by category - each category has its own Top N
   */
  async syncTrendingBanners(config: TrendingConfigDto = {}): Promise<{
    created: number;
    updated: number;
    removed: number;
    topPosts: Array<{ id: string; title: string; viewCount: number; rank: number; categoryId: string; categoryName: string }>;
    byCategory: Array<{ categoryId: string; categoryName: string; count: number }>;
  }> {
    const topCount = config.topCount || this.DEFAULT_TOP_COUNT;
    const position = config.position || this.DEFAULT_POSITION;
    const minViewCount = config.minViewCount || 0;
    const categoryId = config.categoryId; // Optional: sync only specific category

    // Get top posts by viewCount, grouped by category
    const topPostsByCategory = await this.getTopPostsByCategory(topCount, minViewCount, categoryId);

    if (topPostsByCategory.length === 0) {
      // No qualifying posts
      if (categoryId) {
        // Only remove banners for specific category
        const removed = await bannerRepository.removeNonTrendingByCategory(categoryId, []);
        return { created: 0, updated: 0, removed, topPosts: [], byCategory: [] };
      }
      const removed = await bannerRepository.deleteAllAutoAssigned();
      return { created: 0, updated: 0, removed, topPosts: [], byCategory: [] };
    }

    // Get current auto-assigned banners
    const currentBanners = await bannerRepository.findAutoAssigned();
    const currentPostIds = new Set(currentBanners.map(b => b.postId.toString()));

    // Flatten all posts and prepare banner data with categoryId
    type PostWithMeta = IPost & { categoryName: string; rankInCategory: number };
    const allTopPosts: PostWithMeta[] = [];
    const byCategory: Array<{ categoryId: string; categoryName: string; count: number }> = [];

    for (const group of topPostsByCategory) {
      byCategory.push({
        categoryId: group.categoryId,
        categoryName: group.categoryName,
        count: group.posts.length,
      });
      group.posts.forEach((post, idx) => {
        allTopPosts.push({
          ...post,
          categoryName: group.categoryName,
          rankInCategory: idx + 1,
        } as PostWithMeta);
      });
    }

    // Prepare banner data for trending posts (with categoryId)
    const trendingBannerData = allTopPosts.map((post) => ({
      postId: post._id.toString(),
      categoryId: post.categoryId?.toString() || '',
      title: post.title,
      imageUrl: post.coverImage || '',
      linkUrl: `/${post.slug}/`,
      rank: post.rankInCategory,
    }));

    // Bulk upsert trending banners
    await bannerRepository.bulkUpsertTrending(trendingBannerData, position);

    // Update isTrending and trendingRank on posts
    await this.updatePostTrendingFlags(allTopPosts);

    // Remove banners for posts no longer in top (per category)
    let totalRemoved = 0;
    for (const group of topPostsByCategory) {
      const postIdsInCategory = group.posts.map(p => p._id.toString());
      const removed = await bannerRepository.removeNonTrendingByCategory(group.categoryId, postIdsInCategory);
      totalRemoved += removed;
    }

    // Calculate stats
    const created = allTopPosts.filter(p => !currentPostIds.has(p._id.toString())).length;
    const updated = allTopPosts.filter(p => currentPostIds.has(p._id.toString())).length;

    console.log(`[Banner Sync] Top ${topCount}/category: created=${created}, updated=${updated}, removed=${totalRemoved}, categories=${byCategory.length}`);

    return {
      created,
      updated,
      removed: totalRemoved,
      topPosts: allTopPosts.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        viewCount: p.viewCount,
        rank: p.rankInCategory,
        categoryId: p.categoryId?.toString() || '',
        categoryName: p.categoryName,
      })),
      byCategory,
    };
  }

  /**
   * Get active banners by category
   */
  async getActiveByCategory(categoryId: string, limit = 10): Promise<IBanner[]> {
    return bannerRepository.findActiveByCategory(categoryId, limit);
  }

  /**
   * Update isTrending and trendingRank flags on posts
   */
  private async updatePostTrendingFlags(topPosts: IPost[]): Promise<void> {
    const { Post } = await import('../models/post.model');

    // Reset all posts to not trending
    await Post.updateMany(
      { isTrending: true },
      { $set: { isTrending: false, trendingRank: null, trendingAt: null } }
    );

    // Set trending flags for top posts
    const bulkOps = topPosts.map((post, index) => ({
      updateOne: {
        filter: { _id: post._id },
        update: {
          $set: {
            isTrending: true,
            trendingRank: index + 1,
            trendingAt: new Date(),
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await Post.bulkWrite(bulkOps);
    }
  }

  /**
   * Get top posts by view count (global - all categories)
   */
  private async getTopPostsByViewCount(
    limit: number,
    minViewCount = 0
  ): Promise<IPost[]> {
    const { Post } = await import('../models/post.model');

    const posts = await Post.find({
      status: 'published',
      viewCount: { $gte: minViewCount },
      coverImage: { $nin: [null, ''] }, // Must have cover image for banner
    })
      .select('title slug coverImage viewCount excerpt categoryId')
      .sort({ viewCount: -1 })
      .limit(limit)
      .lean();

    return posts as unknown as IPost[];
  }

  /**
   * Get top posts grouped by category
   * Returns Top N posts for each category
   */
  private async getTopPostsByCategory(
    topCountPerCategory: number,
    minViewCount = 0,
    specificCategoryId?: string
  ): Promise<Array<{ categoryId: string; categoryName: string; posts: IPost[] }>> {
    const { Post } = await import('../models/post.model');
    const { Category } = await import('../models/category.model');

    // Build category filter
    const categoryQuery: Record<string, unknown> = { isActive: true };
    if (specificCategoryId) {
      categoryQuery._id = specificCategoryId;
    }

    // Get all active categories
    const categories = await Category.find(categoryQuery)
      .select('_id name slug')
      .lean();

    const result: Array<{ categoryId: string; categoryName: string; posts: IPost[] }> = [];

    // For each category, get top N posts
    for (const cat of categories) {
      const posts = await Post.find({
        status: 'published',
        categoryId: cat._id,
        viewCount: { $gte: minViewCount },
        coverImage: { $nin: [null, ''] },
      })
        .select('title slug coverImage viewCount excerpt categoryId')
        .sort({ viewCount: -1 })
        .limit(topCountPerCategory)
        .lean();

      if (posts.length > 0) {
        result.push({
          categoryId: cat._id.toString(),
          categoryName: cat.name,
          posts: posts as unknown as IPost[],
        });
      }
    }

    return result;
  }

  /**
   * Check if a post is in top trending
   */
  async isPostInTrending(postId: string, topCount = 10): Promise<boolean> {
    const topPosts = await this.getTopPostsByViewCount(topCount);
    return topPosts.some(p => p._id.toString() === postId);
  }

  /**
   * Get post's current trending rank (0 if not in top)
   */
  async getPostTrendingRank(postId: string, topCount = 10): Promise<number> {
    const topPosts = await this.getTopPostsByViewCount(topCount);
    const index = topPosts.findIndex(p => p._id.toString() === postId);
    return index >= 0 ? index + 1 : 0;
  }

  /**
   * Called when a post's viewCount changes
   * Triggers banner sync if needed
   */
  async onPostViewCountChanged(postId: string): Promise<void> {
    // Check if this post might affect trending
    const rank = await this.getPostTrendingRank(postId, this.DEFAULT_TOP_COUNT + 5);

    // If post is in or near top, sync banners
    if (rank > 0 && rank <= this.DEFAULT_TOP_COUNT + 5) {
      await this.syncTrendingBanners();
    }
  }

  /**
   * Get banner statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byPosition: Record<BannerPosition, number>;
    autoAssigned: number;
    manual: number;
  }> {
    const { Banner } = await import('../models/banner.model');

    const total = await Banner.countDocuments();
    const autoAssigned = await Banner.countDocuments({ isAutoAssigned: true });
    const manual = total - autoAssigned;

    const positionCounts = await Banner.aggregate([
      { $group: { _id: '$position', count: { $sum: 1 } } },
    ]);

    const byPosition: Record<BannerPosition, number> = {
      hero: 0,
      sidebar: 0,
      category: 0,
      footer: 0,
    };

    positionCounts.forEach((r) => {
      byPosition[r._id as BannerPosition] = r.count;
    });

    return { total, byPosition, autoAssigned, manual };
  }
}

// Singleton instance
export const bannerService = new BannerService();
