import { Post, IPost, PostStatus } from '../models/post.model';
import { PostFilterDto } from '../dtos';
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
 * Post Repository - MongoDB/Mongoose implementation
 */
export class PostRepository {
  /**
   * Find all posts with pagination and filters
   */
  async findAllWithFilters(
    filters: PostFilterDto = {}
  ): Promise<{ data: IPost[]; total: number }> {
    const {
      search,
      categoryId,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const query: FilterQuery<IPost> = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (categoryId && Types.ObjectId.isValid(categoryId)) {
      query.categoryId = new Types.ObjectId(categoryId);
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Get total count before pagination
    const total = await Post.countDocuments(query);

    // Sorting
    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'ASC' ? 1 : -1,
    };

    // Pagination
    const skip = (page - 1) * limit;

    const rawData = await Post.find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    const data = addIdArray(rawData) as unknown as IPost[];
    return { data, total };
  }

  /**
   * Find post by ID
   */
  async findById(id: string): Promise<IPost | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await Post.findById(id).lean({ virtuals: true });
    return addId(doc) as unknown as IPost | null;
  }

  /**
   * Find post by ID with relations
   */
  async findByIdWithRelations(id: string): Promise<IPost | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await Post.findById(id).populate('category').lean({ virtuals: true });
    return addId(doc) as unknown as IPost | null;
  }

  /**
   * Find post by slug (for public page)
   */
  async findBySlug(slug: string): Promise<IPost | null> {
    const doc = await Post.findOne({ slug }).populate('category').lean({ virtuals: true });
    return addId(doc) as unknown as IPost | null;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await Post.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  }

  /**
   * Check if slug exists (optionally excluding an ID)
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<IPost> = { slug };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await Post.countDocuments(query);
    return count > 0;
  }

  /**
   * Update post status
   */
  async updateStatus(id: string, status: PostStatus): Promise<IPost | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const updateData: Partial<IPost> = { status };
    if (status === 'published') {
      updateData.publishedAt = new Date();
    }
    const doc = await Post.findByIdAndUpdate(id, updateData, { new: true })
      .populate('category')
      .lean({ virtuals: true });
    return addId(doc) as unknown as IPost | null;
  }

  /**
   * Find posts by category
   */
  async findByCategory(categoryId: string, limit?: number): Promise<IPost[]> {
    if (!Types.ObjectId.isValid(categoryId)) return [];
    const query = Post.find({
      categoryId: new Types.ObjectId(categoryId),
      status: 'published',
    }).sort({ createdAt: -1 });

    if (limit) {
      query.limit(limit);
    }

    const docs = await query.lean({ virtuals: true });
    return addIdArray(docs) as unknown as IPost[];
  }

  /**
   * Find recent posts
   */
  async findRecent(limit = 5): Promise<IPost[]> {
    const docs = await Post.find({ status: 'published' })
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean({ virtuals: true });
    return addIdArray(docs) as unknown as IPost[];
  }

  /**
   * Count posts by status
   */
  async countByStatus(): Promise<Record<PostStatus, number>> {
    const results = await Post.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<PostStatus, number> = {
      draft: 0,
      published: 0,
      archived: 0,
    };

    results.forEach((r) => {
      counts[r._id as PostStatus] = r.count;
    });

    return counts;
  }

  /**
   * Create new post
   */
  async create(data: Partial<IPost>): Promise<IPost> {
    const post = new Post(data);
    const saved = await post.save();
    return saved.toObject();
  }

  /**
   * Update post
   */
  async update(id: string, data: Partial<IPost>): Promise<IPost | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await Post.findByIdAndUpdate(id, data, { new: true })
      .populate('category')
      .lean({ virtuals: true });
    return addId(doc) as unknown as IPost | null;
  }

  /**
   * Delete post
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Post.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Find all posts (simple)
   */
  async findAll(): Promise<IPost[]> {
    const docs = await Post.find().populate('category').lean({ virtuals: true });
    return addIdArray(docs) as unknown as IPost[];
  }

  /**
   * Find one by query
   */
  async findOne(query: FilterQuery<IPost>): Promise<IPost | null> {
    const doc = await Post.findOne(query).lean({ virtuals: true });
    return addId(doc) as unknown as IPost | null;
  }

  /**
   * Check if exists
   */
  async exists(query: FilterQuery<IPost>): Promise<boolean> {
    const count = await Post.countDocuments(query);
    return count > 0;
  }
}

// Singleton instance
export const postRepository = new PostRepository();
