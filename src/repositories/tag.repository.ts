import { Tag, ITag } from '../models/tag.model';
import { Post } from '../models/post.model';
import { Types, FilterQuery } from 'mongoose';
import { escapeRegex } from '../utils/security.util';

/**
 * Tag Repository - MongoDB/Mongoose implementation
 */
export class TagRepository {
  /**
   * Find all tags with post count
   */
  async findAllWithPostCount(): Promise<(ITag & { postCount: number })[]> {
    const tags = await Tag.find().sort({ name: 1 });

    // Get post counts for each tag
    const tagsWithCount = await Promise.all(
      tags.map(async (tagDoc) => {
        const postCount = await Post.countDocuments({
          tagsRelation: tagDoc._id,
        });
        const tag = tagDoc.toObject();
        return { ...tag, postCount };
      })
    );

    return tagsWithCount as unknown as (ITag & { postCount: number })[];
  }

  /**
   * Find all tags
   */
  async findAll(): Promise<ITag[]> {
    return Tag.find().sort({ name: 1 });
  }

  /**
   * Find tag by ID
   */
  async findById(id: string): Promise<ITag | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Tag.findById(id);
  }

  /**
   * Find tag by slug
   */
  async findBySlug(slug: string): Promise<ITag | null> {
    return Tag.findOne({ slug });
  }

  /**
   * Find tag by name
   */
  async findByName(name: string): Promise<ITag | null> {
    return Tag.findOne({ name });
  }

  /**
   * Search tags by query
   */
  async search(query: string): Promise<ITag[]> {
    const safeQuery = escapeRegex(query);
    return Tag.find({
      $or: [
        { name: { $regex: safeQuery, $options: 'i' } },
        { slug: { $regex: safeQuery, $options: 'i' } },
      ],
    })
      .sort({ name: 1 })
      .exec();
  }

  /**
   * Get tags for a specific post
   */
  async getTagsForPost(postId: string): Promise<ITag[]> {
    if (!Types.ObjectId.isValid(postId)) return [];
    const post = await Post.findById(postId).populate('tagsRelation');
    return (post?.tagsRelation as unknown as ITag[]) || [];
  }

  /**
   * Create new tag
   */
  async create(data: Partial<ITag>): Promise<ITag> {
    const tag = new Tag(data);
    const saved = await tag.save();
    return saved.toObject();
  }

  /**
   * Update tag
   */
  async update(id: string, data: Partial<ITag>): Promise<ITag | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Tag.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Delete tag
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Tag.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Check if slug exists
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<ITag> = { slug };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await Tag.countDocuments(query);
    return count > 0;
  }

  /**
   * Find one by query
   */
  async findOne(query: FilterQuery<ITag>): Promise<ITag | null> {
    return Tag.findOne(query);
  }
}

// Singleton instance
export const tagRepository = new TagRepository();
