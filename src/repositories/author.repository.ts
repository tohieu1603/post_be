import { Author, IAuthor } from '../models/author.model';
import { AuthorFilterDto } from '../dtos';
import { Types, FilterQuery, SortOrder } from 'mongoose';
import { Post } from '../models/post.model';

/**
 * Author Repository - MongoDB/Mongoose implementation
 */
export class AuthorRepository {
  /**
   * Find all authors with optional filters and pagination
   */
  async findAllWithFilters(
    filters: AuthorFilterDto = {}
  ): Promise<{ data: IAuthor[]; total: number }> {
    const {
      search,
      isActive,
      isFeatured,
      expertise,
      sortBy = 'sortOrder',
      sortOrder = 'ASC',
      page = 1,
      limit = 20,
    } = filters;

    const query: FilterQuery<IAuthor> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured;
    }

    if (expertise) {
      query.expertise = { $in: [expertise] };
    }

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'ASC' ? 1 : -1,
    };

    const skip = (page - 1) * limit;
    const total = await Author.countDocuments(query);
    const data = (await Author.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true })) as unknown as IAuthor[];

    return { data, total };
  }

  /**
   * Find all active authors (no pagination, for dropdown)
   */
  async findAllActive(): Promise<IAuthor[]> {
    return Author.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select('_id name slug avatarUrl jobTitle company isActive')
      .lean({ virtuals: true }) as unknown as IAuthor[];
  }

  /**
   * Find featured authors
   */
  async findFeatured(limit = 10): Promise<IAuthor[]> {
    return Author.find({ isActive: true, isFeatured: true })
      .sort({ sortOrder: 1, name: 1 })
      .limit(limit)
      .lean({ virtuals: true }) as unknown as IAuthor[];
  }

  /**
   * Find author by ID
   */
  async findById(id: string): Promise<IAuthor | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Author.findById(id).lean({ virtuals: true }) as unknown as IAuthor | null;
  }

  /**
   * Find author by ID with post count
   */
  async findByIdWithPostCount(id: string): Promise<(IAuthor & { postsCount: number }) | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const author = (await Author.findById(id).lean({ virtuals: true })) as IAuthor | null;
    if (!author) return null;

    const postsCount = await Post.countDocuments({ authorId: new Types.ObjectId(id) });
    return { ...author, postsCount } as IAuthor & { postsCount: number };
  }

  /**
   * Find author by slug
   */
  async findBySlug(slug: string): Promise<IAuthor | null> {
    return Author.findOne({ slug }).lean({ virtuals: true }) as unknown as IAuthor | null;
  }

  /**
   * Find author by slug with post count
   */
  async findBySlugWithPostCount(slug: string): Promise<(IAuthor & { postsCount: number }) | null> {
    const author = (await Author.findOne({ slug }).lean({ virtuals: true })) as IAuthor | null;
    if (!author) return null;

    const postsCount = await Post.countDocuments({ authorId: author._id });
    return { ...author, postsCount } as IAuthor & { postsCount: number };
  }

  /**
   * Check if slug exists (optionally excluding an ID)
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<IAuthor> = { slug };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await Author.countDocuments(query);
    return count > 0;
  }

  /**
   * Check if email exists (optionally excluding an ID)
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<IAuthor> = { email };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await Author.countDocuments(query);
    return count > 0;
  }

  /**
   * Count posts by author
   */
  async countPosts(authorId: string): Promise<number> {
    if (!Types.ObjectId.isValid(authorId)) return 0;
    return Post.countDocuments({ authorId: new Types.ObjectId(authorId) });
  }

  /**
   * Create new author
   */
  async create(data: Partial<IAuthor>): Promise<IAuthor> {
    const author = new Author(data);
    const saved = await author.save();
    return saved.toObject();
  }

  /**
   * Update author
   */
  async update(id: string, data: Partial<IAuthor>): Promise<IAuthor | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Author.findByIdAndUpdate(id, data, { new: true }).lean({
      virtuals: true,
    }) as unknown as IAuthor | null;
  }

  /**
   * Delete author
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Author.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Get all unique expertise tags
   */
  async getAllExpertiseTags(): Promise<string[]> {
    const result = await Author.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$expertise' },
      { $group: { _id: '$expertise' } },
      { $sort: { _id: 1 } },
    ]);
    return result.map((r) => r._id);
  }

  /**
   * Bulk update sortOrder
   */
  async bulkUpdateSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const operations = items.map((item) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(item.id) },
        update: { $set: { sortOrder: item.sortOrder } },
      },
    }));
    await Author.bulkWrite(operations);
  }
}

// Singleton instance
export const authorRepository = new AuthorRepository();
