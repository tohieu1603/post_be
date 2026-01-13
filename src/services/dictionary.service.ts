import { dictionaryRepository } from '../repositories/dictionary.repository';
import {
  CreateDictionaryTermDto,
  UpdateDictionaryTermDto,
  DictionaryFilterDto,
  DictionaryStatsDto,
} from '../dtos/dictionary.dto';
import { IDictionaryTerm } from '../models/dictionary.model';
import { PaginatedResponse } from '../types';
import { generateSlug } from '../utils/slug.util';
import { sanitizeHtmlContent } from '../utils/security.util';
import { Types } from 'mongoose';

/**
 * Dictionary Service - Business logic for dictionary/glossary management
 */
export class DictionaryService {
  /**
   * Get all terms with pagination and filters
   */
  async getAll(filters: DictionaryFilterDto = {}): Promise<PaginatedResponse<IDictionaryTerm>> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const { data, total } = await dictionaryRepository.findAllWithFilters(filters);

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
   * Get term by ID
   */
  async getById(id: string): Promise<IDictionaryTerm | null> {
    return dictionaryRepository.findById(id);
  }

  /**
   * Get term by slug
   */
  async getBySlug(slug: string): Promise<IDictionaryTerm | null> {
    return dictionaryRepository.findBySlug(slug);
  }

  /**
   * Get term by slug for public view (increments view count)
   */
  async getBySlugPublic(slug: string): Promise<IDictionaryTerm | null> {
    const term = await dictionaryRepository.findBySlug(slug);
    if (term && term.isActive) {
      await dictionaryRepository.incrementViewCount(term._id.toString());
      return term;
    }
    return term?.isActive ? term : null;
  }

  /**
   * Create new term
   */
  async create(dto: CreateDictionaryTermDto, userId?: string): Promise<IDictionaryTerm> {
    // Check if term already exists
    const existing = await dictionaryRepository.findByTerm(dto.term);
    if (existing) {
      throw new Error('Term already exists');
    }

    // Generate slug if not provided
    const slug = dto.slug || generateSlug(dto.term);

    // Check if slug is unique
    const slugExists = await dictionaryRepository.findBySlug(slug);
    if (slugExists) {
      throw new Error('Slug already exists');
    }

    // Sanitize HTML content in description
    const sanitizedDescription = dto.description
      ? sanitizeHtmlContent(dto.description, 'rich')
      : undefined;

    const termData: Partial<IDictionaryTerm> = {
      term: dto.term.trim(),
      slug,
      definition: dto.definition.trim(),
      description: sanitizedDescription,
      synonym: dto.synonym?.trim(),
      relatedTerms: dto.relatedTerms?.map(t => t.trim()).filter(Boolean),
      examples: dto.examples?.map(e => e.trim()).filter(Boolean),
      categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
      tags: dto.tags?.map(t => t.toLowerCase().trim()).filter(Boolean),
      source: dto.source?.trim(),
      imageUrl: dto.imageUrl,
      audioUrl: dto.audioUrl,
      videoUrl: dto.videoUrl,
      isActive: dto.isActive ?? true,
      isFeatured: dto.isFeatured ?? false,
      sortOrder: dto.sortOrder ?? 0,
      seo: dto.seo,
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
    };

    return dictionaryRepository.create(termData);
  }

  /**
   * Update term
   */
  async update(id: string, dto: UpdateDictionaryTermDto, userId?: string): Promise<IDictionaryTerm | null> {
    const existing = await dictionaryRepository.findById(id);
    if (!existing) {
      return null;
    }

    // Check if new term conflicts with another
    if (dto.term && dto.term !== existing.term) {
      const termExists = await dictionaryRepository.findByTerm(dto.term);
      if (termExists && termExists._id.toString() !== id) {
        throw new Error('Term already exists');
      }
    }

    // Check if new slug conflicts with another
    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await dictionaryRepository.findBySlug(dto.slug);
      if (slugExists && slugExists._id.toString() !== id) {
        throw new Error('Slug already exists');
      }
    }

    // Sanitize HTML content in description
    const sanitizedDescription = dto.description
      ? sanitizeHtmlContent(dto.description, 'rich')
      : dto.description;

    const updateData: Partial<IDictionaryTerm> = {
      ...dto,
      description: sanitizedDescription,
      synonym: dto.synonym?.trim(),
      relatedTerms: dto.relatedTerms?.map(t => t.trim()).filter(Boolean),
      categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
      tags: dto.tags?.map(t => t.toLowerCase().trim()).filter(Boolean),
      updatedBy: userId ? new Types.ObjectId(userId) : undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    return dictionaryRepository.update(id, updateData);
  }

  /**
   * Delete term
   */
  async delete(id: string): Promise<boolean> {
    return dictionaryRepository.delete(id);
  }

  /**
   * Get alphabet index
   */
  async getAlphabetIndex(isActive = true): Promise<{ letter: string; count: number }[]> {
    return dictionaryRepository.getAlphabetIndex(isActive);
  }

  /**
   * Get featured terms
   */
  async getFeatured(limit = 10): Promise<IDictionaryTerm[]> {
    return dictionaryRepository.getFeatured(limit);
  }

  /**
   * Get popular terms
   */
  async getPopular(limit = 10): Promise<IDictionaryTerm[]> {
    return dictionaryRepository.getPopular(limit);
  }

  /**
   * Get recent terms
   */
  async getRecent(limit = 10): Promise<IDictionaryTerm[]> {
    return dictionaryRepository.getRecent(limit);
  }

  /**
   * Get random terms (word of the day feature)
   */
  async getRandom(limit = 1): Promise<IDictionaryTerm[]> {
    return dictionaryRepository.getRandom(limit);
  }

  /**
   * Get terms by category
   */
  async getByCategory(categoryId: string, limit = 50): Promise<IDictionaryTerm[]> {
    return dictionaryRepository.findByCategory(categoryId, limit);
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string, limit = 10): Promise<{ term: string; slug: string }[]> {
    return dictionaryRepository.getSuggestions(query, limit);
  }

  /**
   * Track view
   */
  async trackView(id: string): Promise<void> {
    await dictionaryRepository.incrementViewCount(id);
  }

  /**
   * Get statistics
   */
  async getStatistics(): Promise<DictionaryStatsDto> {
    const [
      total,
      active,
      featured,
      byCategory,
      byPartOfSpeech,
      alphabetIndex,
      popular,
    ] = await Promise.all([
      dictionaryRepository.count(),
      dictionaryRepository.count({ isActive: true }),
      dictionaryRepository.count({ isFeatured: true }),
      dictionaryRepository.getStatsByCategory(),
      dictionaryRepository.getStatsByPartOfSpeech(),
      dictionaryRepository.getAlphabetIndex(true),
      dictionaryRepository.getPopular(5),
    ]);

    // Count terms added in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyAdded = await dictionaryRepository.count({
      createdAt: { $gte: thirtyDaysAgo } as any,
    });

    return {
      total,
      active,
      featured,
      byCategory,
      byPartOfSpeech,
      alphabetIndex,
      recentlyAdded,
      mostViewed: popular.map(t => ({
        id: t._id.toString(),
        term: t.term,
        viewCount: t.viewCount,
      })),
    };
  }

  /**
   * Toggle active status
   */
  async toggleActive(id: string): Promise<IDictionaryTerm | null> {
    const term = await dictionaryRepository.findById(id);
    if (!term) return null;
    return dictionaryRepository.update(id, { isActive: !term.isActive });
  }

  /**
   * Toggle featured status
   */
  async toggleFeatured(id: string): Promise<IDictionaryTerm | null> {
    const term = await dictionaryRepository.findById(id);
    if (!term) return null;
    return dictionaryRepository.update(id, { isFeatured: !term.isFeatured });
  }

  /**
   * Bulk import terms
   */
  async bulkImport(terms: CreateDictionaryTermDto[], userId?: string): Promise<{ inserted: number; errors: string[] }> {
    const termsData = terms.map(dto => ({
      term: dto.term.trim(),
      slug: dto.slug || generateSlug(dto.term),
      definition: dto.definition.trim(),
      description: dto.description ? sanitizeHtmlContent(dto.description, 'rich') : undefined,
      synonym: dto.synonym?.trim(),
      relatedTerms: dto.relatedTerms?.map(t => t.trim()).filter(Boolean),
      examples: dto.examples?.map(e => e.trim()).filter(Boolean),
      categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
      tags: dto.tags?.map(t => t.toLowerCase().trim()).filter(Boolean),
      source: dto.source?.trim(),
      imageUrl: dto.imageUrl,
      audioUrl: dto.audioUrl,
      videoUrl: dto.videoUrl,
      isActive: dto.isActive ?? true,
      isFeatured: dto.isFeatured ?? false,
      sortOrder: dto.sortOrder ?? 0,
      seo: dto.seo,
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
    }));

    return dictionaryRepository.bulkImport(termsData as Partial<IDictionaryTerm>[]);
  }
}

// Singleton instance
export const dictionaryService = new DictionaryService();
