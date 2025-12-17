import { postRepository } from '../repositories';
import { CreatePostDto, UpdatePostDto, PostFilterDto, PostStatus } from '../dtos';
import { IPost } from '../models/post.model';
import { generateSlug } from '../utils';
import { PaginatedResponse } from '../types';
import { googleSeoApiService } from './google-seo-api.service';
import { autoSeoService } from './auto-seo.service';
import { clearSitemapCache } from '../routes/public-seo-routes';

/**
 * Post Service - Business logic layer
 */
export class PostService {
  /**
   * Get all posts with pagination and filters
   */
  async getAll(filters: PostFilterDto = {}): Promise<PaginatedResponse<IPost>> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { data, total } = await postRepository.findAllWithFilters(filters);

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
   * Get post by ID
   */
  async getById(id: string): Promise<IPost | null> {
    return postRepository.findByIdWithRelations(id);
  }

  /**
   * Get post by slug (for public page)
   */
  async getBySlug(slug: string): Promise<IPost | null> {
    return postRepository.findBySlug(slug);
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    await postRepository.incrementViewCount(id);
  }

  /**
   * Create new post with auto-generated slug
   */
  async create(dto: CreatePostDto): Promise<IPost> {
    // Auto-generate slug if not provided
    let slug = dto.slug;
    if (!slug && dto.title) {
      slug = generateSlug(dto.title);
    }

    // Ensure slug is unique
    if (slug) {
      const baseSlug = slug;
      let counter = 1;
      while (await postRepository.slugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    return postRepository.create({
      ...dto,
      slug: slug || generateSlug(dto.title),
      status: dto.status || 'draft',
    } as any);
  }

  /**
   * Update post
   */
  async update(id: string, dto: UpdatePostDto): Promise<IPost | null> {
    const existing = await postRepository.findById(id);
    if (!existing) return null;

    const wasPublished = existing.status === 'published';

    // If title changed and slug not provided, regenerate slug
    let slug = dto.slug;
    if (dto.title && !dto.slug && dto.title !== existing.title) {
      slug = generateSlug(dto.title);
    }

    // Ensure slug is unique if changed
    if (slug && slug !== existing.slug) {
      const baseSlug = slug;
      let counter = 1;
      while (await postRepository.slugExists(slug, id)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const result = await postRepository.update(id, {
      ...dto,
      ...(slug && { slug }),
    } as any);

    // If status changed to published via update, trigger SEO actions
    if (result && dto.status === 'published' && !wasPublished) {
      await this.onPostPublished(result);
    }

    return result;
  }

  /**
   * Delete post
   */
  async delete(id: string): Promise<boolean> {
    return postRepository.delete(id);
  }

  /**
   * Update post status
   */
  async updateStatus(id: string, status: PostStatus): Promise<IPost | null> {
    const existing = await postRepository.findById(id);
    const wasPublished = existing?.status === 'published';

    const result = await postRepository.updateStatus(id, status);

    // If status changed to published, trigger SEO actions
    if (result && status === 'published' && !wasPublished) {
      await this.onPostPublished(result);
    }

    return result;
  }

  /**
   * Handle post publish event - Auto SEO actions
   */
  private async onPostPublished(post: IPost): Promise<void> {
    try {
      // Clear sitemap cache so new post appears
      clearSitemapCache();

      const postUrl = `/${post.slug}/`;

      // Auto-analyze post for SEO
      await autoSeoService.analyzePost(post._id.toString());

      // Submit URL to Google Indexing API
      await googleSeoApiService.submitUrlForIndexing(postUrl);

      console.log(`[Auto SEO] Post "${post.title}" published and submitted for indexing`);
    } catch (error) {
      console.error('[Auto SEO] Failed to process post publish:', error);
      // Don't throw - SEO actions shouldn't block publishing
    }
  }

  /**
   * Get posts by category
   */
  async getByCategory(categoryId: string, limit?: number): Promise<IPost[]> {
    return postRepository.findByCategory(categoryId, limit);
  }

  /**
   * Get recent posts
   */
  async getRecent(limit = 5): Promise<IPost[]> {
    return postRepository.findRecent(limit);
  }

  /**
   * Get post statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<PostStatus, number>;
  }> {
    const byStatus = await postRepository.countByStatus();
    const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);

    return { total, byStatus };
  }

  /**
   * Generate slug preview
   */
  generateSlugPreview(title: string): string {
    return generateSlug(title);
  }
}

// Singleton instance
export const postService = new PostService();
