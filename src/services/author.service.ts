import { authorRepository } from '../repositories';
import { CreateAuthorDto, UpdateAuthorDto, AuthorFilterDto, PaginatedAuthorsDto } from '../dtos';
import { IAuthor } from '../models/author.model';
import { generateSlug } from '../utils';
import { Types } from 'mongoose';

/**
 * Author Service - Business logic layer
 */
export class AuthorService {
  /**
   * Get all authors with filters and pagination
   */
  async getAll(filters: AuthorFilterDto = {}): Promise<PaginatedAuthorsDto> {
    const { page = 1, limit = 20 } = filters;
    const { data, total } = await authorRepository.findAllWithFilters(filters);

    return {
      data: data as any, // Will be mapped to AuthorResponseDto
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all active authors for dropdown
   */
  async getForDropdown(): Promise<IAuthor[]> {
    return authorRepository.findAllActive();
  }

  /**
   * Get featured authors
   */
  async getFeatured(limit = 10): Promise<IAuthor[]> {
    return authorRepository.findFeatured(limit);
  }

  /**
   * Get author by ID
   */
  async getById(id: string): Promise<IAuthor | null> {
    return authorRepository.findByIdWithPostCount(id);
  }

  /**
   * Get author by slug
   */
  async getBySlug(slug: string): Promise<IAuthor | null> {
    return authorRepository.findBySlugWithPostCount(slug);
  }

  /**
   * Create new author with auto-generated slug
   */
  async create(dto: CreateAuthorDto): Promise<IAuthor> {
    // Auto-generate slug if not provided
    let slug = dto.slug;
    if (!slug && dto.name) {
      slug = generateSlug(dto.name);
    }

    // Ensure slug is unique
    if (slug) {
      const baseSlug = slug;
      let counter = 1;
      while (await authorRepository.slugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Validate email uniqueness if provided
    if (dto.email) {
      const emailExists = await authorRepository.emailExists(dto.email);
      if (emailExists) {
        throw new Error('Email đã được sử dụng');
      }
    }

    // Validate userId if provided
    if (dto.userId && !Types.ObjectId.isValid(dto.userId)) {
      throw new Error('User ID không hợp lệ');
    }

    return authorRepository.create({
      ...dto,
      slug: slug || generateSlug(dto.name),
      userId: dto.userId ? new Types.ObjectId(dto.userId) : null,
      expertise: dto.expertise || [],
      experience: dto.experience || [],
      education: dto.education || [],
      certifications: dto.certifications || [],
      achievements: dto.achievements || [],
      skills: dto.skills || [],
      publications: dto.publications || [],
      sameAs: dto.sameAs || [],
    });
  }

  /**
   * Update author
   */
  async update(id: string, dto: UpdateAuthorDto): Promise<IAuthor | null> {
    const existing = await authorRepository.findById(id);
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
      while (await authorRepository.slugExists(slug, id)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Validate email uniqueness if changed
    if (dto.email && dto.email !== existing.email) {
      const emailExists = await authorRepository.emailExists(dto.email, id);
      if (emailExists) {
        throw new Error('Email đã được sử dụng');
      }
    }

    // Handle userId update
    let userId = existing.userId;
    if (dto.userId !== undefined) {
      if (dto.userId === null) {
        userId = null;
      } else if (!Types.ObjectId.isValid(dto.userId)) {
        throw new Error('User ID không hợp lệ');
      } else {
        userId = new Types.ObjectId(dto.userId);
      }
    }

    return authorRepository.update(id, {
      ...dto,
      ...(slug && { slug }),
      userId,
    });
  }

  /**
   * Delete author
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    // Check if author has posts
    const postsCount = await authorRepository.countPosts(id);
    if (postsCount > 0) {
      return {
        success: false,
        message: `Không thể xóa tác giả đang có ${postsCount} bài viết.`,
      };
    }

    const deleted = await authorRepository.delete(id);
    return { success: deleted };
  }

  /**
   * Toggle author active status
   */
  async toggleActive(id: string): Promise<IAuthor | null> {
    const author = await authorRepository.findById(id);
    if (!author) return null;

    return authorRepository.update(id, {
      isActive: !author.isActive,
    });
  }

  /**
   * Toggle author featured status
   */
  async toggleFeatured(id: string): Promise<IAuthor | null> {
    const author = await authorRepository.findById(id);
    if (!author) return null;

    return authorRepository.update(id, {
      isFeatured: !author.isFeatured,
    });
  }

  /**
   * Get all unique expertise tags
   */
  async getAllExpertiseTags(): Promise<string[]> {
    return authorRepository.getAllExpertiseTags();
  }

  /**
   * Update sort order for multiple authors
   */
  async updateSortOrder(items: { id: string; sortOrder: number }[]): Promise<void> {
    await authorRepository.bulkUpdateSortOrder(items);
  }

  /**
   * Generate slug preview
   */
  generateSlugPreview(name: string): string {
    return generateSlug(name);
  }
}

// Singleton instance
export const authorService = new AuthorService();
