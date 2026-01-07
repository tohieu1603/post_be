import { Category, ICategory } from '../models/category.model';
import { CategoryFilterDto } from '../dtos';
import { Types, FilterQuery, SortOrder } from 'mongoose';
import { Post } from '../models/post.model';
import { escapeRegex } from '../utils/security.util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeanResult<T> = T extends Array<infer U> ? U[] : T;

/**
 * Category Repository - MongoDB/Mongoose implementation
 */
export class CategoryRepository {
  /**
   * Find all categories with optional filters
   */
  async findAllWithFilters(filters: CategoryFilterDto = {}): Promise<ICategory[]> {
    const { search, parentId, isActive, sortBy = 'sortOrder', sortOrder = 'ASC' } = filters;

    const query: FilterQuery<ICategory> = {};

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { slug: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (parentId !== undefined) {
      if (parentId === 'root') {
        query.parentId = null;
      } else {
        query.parentId = new Types.ObjectId(parentId);
      }
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'ASC' ? 1 : -1,
    };

    return Category.find(query)
      .populate('parent')
      .populate('children')
      .sort(sort)
      .lean({ virtuals: true }) as unknown as ICategory[];
  }

  /**
   * Find all categories
   */
  async findAll(): Promise<ICategory[]> {
    return Category.find().sort({ sortOrder: 1, name: 1 });
  }

  /**
   * Find category by ID
   */
  async findById(id: string): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Category.findById(id).lean({ virtuals: true }) as unknown as ICategory | null;
  }

  /**
   * Find category by ID with relations
   */
  async findByIdWithRelations(id: string): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Category.findById(id)
      .populate('parent')
      .populate('children')
      .lean({ virtuals: true }) as unknown as ICategory | null;
  }

  /**
   * Find root categories (no parent) with their children
   */
  async findTree(): Promise<ICategory[]> {
    return Category.find({ parentId: null })
      .populate({
        path: 'children',
        populate: { path: 'children' },
      })
      .sort({ sortOrder: 1, name: 1 })
      .lean({ virtuals: true }) as unknown as ICategory[];
  }

  /**
   * Check if slug exists (optionally excluding an ID)
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<ICategory> = { slug };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await Category.countDocuments(query);
    return count > 0;
  }

  /**
   * Find categories for dropdown (flat list)
   */
  async findForDropdown(): Promise<ICategory[]> {
    return Category.find()
      .populate('parent')
      .sort({ sortOrder: 1, name: 1 })
      .lean({ virtuals: true }) as unknown as ICategory[];
  }

  /**
   * Check if category has children
   */
  async hasChildren(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const count = await Category.countDocuments({ parentId: new Types.ObjectId(id) });
    return count > 0;
  }

  /**
   * Check if category has posts
   */
  async hasPostsCount(id: string): Promise<number> {
    if (!Types.ObjectId.isValid(id)) return 0;
    return Post.countDocuments({ categoryId: new Types.ObjectId(id) });
  }

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug })
      .populate('parent')
      .populate('children')
      .lean({ virtuals: true }) as unknown as ICategory | null;
  }

  /**
   * Create new category
   */
  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    const saved = await category.save();
    return saved.toObject();
  }

  /**
   * Update category
   */
  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Category.findByIdAndUpdate(id, data, { new: true }).lean({ virtuals: true }) as unknown as ICategory | null;
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Category.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Check if exists
   */
  async exists(query: FilterQuery<ICategory>): Promise<boolean> {
    const count = await Category.countDocuments(query);
    return count > 0;
  }
}

// Singleton instance
export const categoryRepository = new CategoryRepository();
