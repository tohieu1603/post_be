import { pageContentRepository } from '../repositories';
import { IPageContent } from '../models/page-content.model';

/**
 * PageContent Service - Business logic layer
 * Simplified: lưu pageSlug + raw JSON content
 */
export class PageContentService {
  /**
   * Get page by slug - trả về raw JSON content
   */
  async getBySlug(pageSlug: string): Promise<IPageContent | null> {
    return pageContentRepository.findBySlug(pageSlug);
  }

  /**
   * Get page by ID
   */
  async getById(id: string): Promise<IPageContent | null> {
    return pageContentRepository.findById(id);
  }

  /**
   * Get all pages
   */
  async getAll(activeOnly = true): Promise<IPageContent[]> {
    return pageContentRepository.findAll(activeOnly);
  }

  /**
   * Create new page
   */
  async create(data: {
    pageSlug: string;
    pageName: string;
    content: Record<string, unknown>;
  }): Promise<IPageContent> {
    return pageContentRepository.create(data);
  }

  /**
   * Update page content by slug
   */
  async updateBySlug(
    pageSlug: string,
    data: Partial<IPageContent>
  ): Promise<IPageContent | null> {
    return pageContentRepository.updateBySlug(pageSlug, data);
  }

  /**
   * Upsert page (create or update)
   */
  async upsert(
    pageSlug: string,
    data: {
      pageName: string;
      content: Record<string, unknown>;
    }
  ): Promise<IPageContent> {
    return pageContentRepository.upsert(pageSlug, {
      ...data,
      pageSlug,
    });
  }

  /**
   * Delete page by slug
   */
  async delete(pageSlug: string): Promise<boolean> {
    return pageContentRepository.deleteBySlug(pageSlug);
  }

  /**
   * Import from JSON file - lưu nguyên cục JSON
   */
  async importFromJson(
    pageSlug: string,
    pageName: string,
    jsonContent: Record<string, unknown>
  ): Promise<IPageContent> {
    return pageContentRepository.upsert(pageSlug, {
      pageName,
      content: jsonContent,
      isActive: true,
    });
  }

  /**
   * Toggle page active status
   */
  async toggleActive(pageSlug: string): Promise<IPageContent | null> {
    const page = await pageContentRepository.findBySlug(pageSlug);
    if (!page) return null;

    return pageContentRepository.updateBySlug(pageSlug, {
      isActive: !page.isActive,
    });
  }

  /**
   * Check if page exists
   */
  async exists(pageSlug: string): Promise<boolean> {
    return pageContentRepository.exists(pageSlug);
  }
}

// Singleton instance
export const pageContentService = new PageContentService();
