import { Banner, IBanner, BannerPosition, BannerStatus } from '../models/banner.model';
import { BannerFilterDto } from '../dtos/banner.dto';
import { Types, FilterQuery, SortOrder } from 'mongoose';

/**
 * Helper to add id from _id for lean() results
 */
function addId<T extends { _id?: unknown }>(doc: T | null): (T & { id: string }) | null {
  if (!doc) return null;
  return { ...doc, id: String(doc._id) };
}

function addIdArray<T extends { _id?: unknown }>(docs: T[]): (T & { id: string })[] {
  return docs.map(doc => ({ ...doc, id: String(doc._id) }));
}

/**
 * Banner Repository - MongoDB/Mongoose implementation
 */
export class BannerRepository {
  /**
   * Find all banners with pagination and filters
   */
  async findAllWithFilters(
    filters: BannerFilterDto = {}
  ): Promise<{ data: IBanner[]; total: number }> {
    const {
      position,
      status,
      isAutoAssigned,
      page = 1,
      limit = 10,
      sortBy = 'rank',
      sortOrder = 'ASC',
    } = filters;

    const query: FilterQuery<IBanner> = {};

    if (position) query.position = position;
    if (status) query.status = status;
    if (isAutoAssigned !== undefined) query.isAutoAssigned = isAutoAssigned;

    const total = await Banner.countDocuments(query);

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'ASC' ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const rawData = await Banner.find(query)
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    const data = addIdArray(rawData) as unknown as IBanner[];
    return { data, total };
  }

  /**
   * Find banner by ID
   */
  async findById(id: string): Promise<IBanner | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await Banner.findById(id)
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .lean({ virtuals: true });
    return addId(doc) as unknown as IBanner | null;
  }

  /**
   * Find banner by post ID
   */
  async findByPostId(postId: string): Promise<IBanner | null> {
    if (!Types.ObjectId.isValid(postId)) return null;
    const doc = await Banner.findOne({ postId: new Types.ObjectId(postId) })
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .lean({ virtuals: true });
    return addId(doc) as unknown as IBanner | null;
  }

  /**
   * Find active banners by position
   */
  async findActiveByPosition(position: BannerPosition, limit = 10): Promise<IBanner[]> {
    const now = new Date();
    const docs = await Banner.find({
      position,
      status: 'active',
      $or: [
        { startDate: null },
        { startDate: { $lte: now } },
      ],
      $and: [
        {
          $or: [
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    })
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount excerpt categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .sort({ rank: 1, sortOrder: 1 })
      .limit(limit)
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IBanner[];
  }

  /**
   * Find all auto-assigned banners
   */
  async findAutoAssigned(): Promise<IBanner[]> {
    const docs = await Banner.find({ isAutoAssigned: true })
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .sort({ rank: 1 })
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IBanner[];
  }

  /**
   * Create new banner
   */
  async create(data: Partial<IBanner>): Promise<IBanner> {
    const banner = new Banner(data);
    const saved = await banner.save();
    return saved.toObject();
  }

  /**
   * Update banner
   */
  async update(id: string, data: Partial<IBanner>): Promise<IBanner | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await Banner.findByIdAndUpdate(id, data, { new: true })
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .lean({ virtuals: true });
    return addId(doc) as unknown as IBanner | null;
  }

  /**
   * Update banner by post ID
   */
  async updateByPostId(postId: string, data: Partial<IBanner>): Promise<IBanner | null> {
    if (!Types.ObjectId.isValid(postId)) return null;
    const doc = await Banner.findOneAndUpdate(
      { postId: new Types.ObjectId(postId) },
      data,
      { new: true }
    )
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .lean({ virtuals: true });
    return addId(doc) as unknown as IBanner | null;
  }

  /**
   * Upsert banner (create or update by postId)
   */
  async upsert(postId: string, data: Partial<IBanner>): Promise<IBanner> {
    const doc = await Banner.findOneAndUpdate(
      { postId: new Types.ObjectId(postId) },
      { ...data, postId: new Types.ObjectId(postId) },
      { new: true, upsert: true }
    )
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .lean({ virtuals: true });
    return addId(doc) as unknown as IBanner;
  }

  /**
   * Delete banner
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Banner.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Delete banner by post ID
   */
  async deleteByPostId(postId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(postId)) return false;
    const result = await Banner.findOneAndDelete({ postId: new Types.ObjectId(postId) });
    return result !== null;
  }

  /**
   * Delete all auto-assigned banners
   */
  async deleteAllAutoAssigned(): Promise<number> {
    const result = await Banner.deleteMany({ isAutoAssigned: true });
    return result.deletedCount;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await Banner.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  }

  /**
   * Increment click count
   */
  async incrementClickCount(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await Banner.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
  }

  /**
   * Count banners
   */
  async count(query: FilterQuery<IBanner> = {}): Promise<number> {
    return Banner.countDocuments(query);
  }

  /**
   * Bulk upsert banners for trending posts (with categoryId)
   */
  async bulkUpsertTrending(
    trendingPosts: Array<{
      postId: string;
      categoryId: string;
      title: string;
      imageUrl: string;
      linkUrl: string;
      rank: number;
    }>,
    position: BannerPosition = 'hero'
  ): Promise<void> {
    const bulkOps = trendingPosts.map((post, index) => ({
      updateOne: {
        filter: { postId: new Types.ObjectId(post.postId) },
        update: {
          $set: {
            postId: new Types.ObjectId(post.postId),
            categoryId: new Types.ObjectId(post.categoryId),
            title: post.title,
            imageUrl: post.imageUrl,
            linkUrl: post.linkUrl,
            position,
            rank: post.rank,
            sortOrder: index,
            status: 'active' as BannerStatus,
            isAutoAssigned: true,
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await Banner.bulkWrite(bulkOps);
    }
  }

  /**
   * Find active banners by category
   */
  async findActiveByCategory(categoryId: string, limit = 10): Promise<IBanner[]> {
    if (!Types.ObjectId.isValid(categoryId)) return [];
    const now = new Date();
    const docs = await Banner.find({
      categoryId: new Types.ObjectId(categoryId),
      status: 'active',
      $or: [
        { startDate: null },
        { startDate: { $lte: now } },
      ],
      $and: [
        {
          $or: [
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    })
      .populate({
        path: 'post',
        select: 'title slug coverImage viewCount excerpt categoryId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .sort({ rank: 1, sortOrder: 1 })
      .limit(limit)
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IBanner[];
  }

  /**
   * Remove auto-assigned banners by category that are not in trending list
   */
  async removeNonTrendingByCategory(categoryId: string, trendingPostIds: string[]): Promise<number> {
    if (!Types.ObjectId.isValid(categoryId)) return 0;
    const objectIds = trendingPostIds
      .filter(id => Types.ObjectId.isValid(id))
      .map(id => new Types.ObjectId(id));

    const result = await Banner.deleteMany({
      categoryId: new Types.ObjectId(categoryId),
      isAutoAssigned: true,
      postId: { $nin: objectIds },
    });

    return result.deletedCount;
  }

  /**
   * Remove banners for posts not in trending list
   */
  async removeNonTrendingAutoAssigned(trendingPostIds: string[]): Promise<number> {
    const objectIds = trendingPostIds
      .filter(id => Types.ObjectId.isValid(id))
      .map(id => new Types.ObjectId(id));

    const result = await Banner.deleteMany({
      isAutoAssigned: true,
      postId: { $nin: objectIds },
    });

    return result.deletedCount;
  }
}

// Singleton instance
export const bannerRepository = new BannerRepository();
