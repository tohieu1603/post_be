import { categoryRepository } from '../repositories';
import { CreateCategoryDto, UpdateCategoryDto, CategoryFilterDto } from '../dtos';
import { ICategory } from '../models/category.model';
import { generateSlug } from '../utils';
import { Types } from 'mongoose';

/**
 * Category Service - Business logic layer
 */
export class CategoryService {
  /**
   * Get all categories with filters
   */
  async getAll(filters: CategoryFilterDto = {}): Promise<ICategory[]> {
    return categoryRepository.findAllWithFilters(filters);
  }

  /**
   * Get categories as tree structure
   */
  async getTree(): Promise<ICategory[]> {
    return categoryRepository.findTree();
  }

  /**
   * Get categories for dropdown
   */
  async getForDropdown(): Promise<ICategory[]> {
    return categoryRepository.findForDropdown();
  }

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<ICategory | null> {
    return categoryRepository.findByIdWithRelations(id);
  }

  /**
   * Create new category with auto-generated slug
   */
  async create(dto: CreateCategoryDto): Promise<ICategory> {
    // Auto-generate slug if not provided
    let slug = dto.slug;
    if (!slug && dto.name) {
      slug = generateSlug(dto.name);
    }

    // Ensure slug is unique
    if (slug) {
      const baseSlug = slug;
      let counter = 1;
      while (await categoryRepository.slugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    if (dto.parentId && !Types.ObjectId.isValid(dto.parentId)) {
      throw new Error('Invalid parent category');
    }

    return categoryRepository.create({
      ...dto,
      slug: slug || generateSlug(dto.name),
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : null,
    });
  }

  /**
   * Update category
   */
  async update(id: string, dto: UpdateCategoryDto): Promise<ICategory | null> {
    const existing = await categoryRepository.findById(id);
    if (!existing) return null;

    // If name changed and slug not provided, regenerate slug
    let slug = dto.slug;
    if (dto.name && !dto.slug && dto.name !== existing.name) {
      slug = generateSlug(dto.name);
    }

    // Ensure slug is unique if changed
    if (slug && slug !== existing.slug) {
      const baseSlug = slug;
      let counter = 1;
      while (await categoryRepository.slugExists(slug, id)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Prevent circular reference
    if (dto.parentId === id) {
      throw new Error('Category cannot be its own parent');
    }

    let parentId = existing.parentId;
    if (dto.parentId !== undefined) {
      if (dto.parentId === null) {
        parentId = null;
      } else if (!Types.ObjectId.isValid(dto.parentId)) {
        throw new Error('Invalid parent category');
      } else {
        parentId = new Types.ObjectId(dto.parentId);
      }
    }

    return categoryRepository.update(id, {
      ...dto,
      ...(slug && { slug }),
      parentId,
    });
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    // Check if has children
    const hasChildren = await categoryRepository.hasChildren(id);
    if (hasChildren) {
      return {
        success: false,
        message: 'Không thể xóa danh mục có danh mục con. Vui lòng xóa danh mục con trước.',
      };
    }

    // Check if has posts
    const postsCount = await categoryRepository.hasPostsCount(id);
    if (postsCount > 0) {
      return {
        success: false,
        message: `Không thể xóa danh mục đang có ${postsCount} bài viết.`,
      };
    }

    const deleted = await categoryRepository.delete(id);
    return { success: deleted };
  }

  /**
   * Toggle category active status
   */
  async toggleActive(id: string): Promise<ICategory | null> {
    const category = await categoryRepository.findById(id);
    if (!category) return null;

    return categoryRepository.update(id, {
      isActive: !category.isActive,
    });
  }

  /**
   * Generate slug preview
   */
  generateSlugPreview(name: string): string {
    return generateSlug(name);
  }
}

// Singleton instance
export const categoryService = new CategoryService();
