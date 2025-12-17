import { PageContent, IPageContent } from '../models/page-content.model';
import { Types, FilterQuery } from 'mongoose';

/**
 * PageContent Repository - MongoDB/Mongoose implementation
 * Simplified: chỉ lưu pageSlug + raw JSON content
 */
export class PageContentRepository {
  /**
   * Find page by slug
   * @param activeOnly - if true, only return active pages (default: false for admin operations)
   */
  async findBySlug(pageSlug: string, activeOnly = false): Promise<IPageContent | null> {
    const query: FilterQuery<IPageContent> = { pageSlug };
    if (activeOnly) {
      query.isActive = true;
    }
    return PageContent.findOne(query).lean({ virtuals: true }) as unknown as IPageContent | null;
  }

  /**
   * Find page by ID
   */
  async findById(id: string): Promise<IPageContent | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return PageContent.findById(id).lean({ virtuals: true }) as unknown as IPageContent | null;
  }

  /**
   * Get all pages
   */
  async findAll(activeOnly = true): Promise<IPageContent[]> {
    const query: FilterQuery<IPageContent> = {};
    if (activeOnly) {
      query.isActive = true;
    }
    return PageContent.find(query)
      .sort({ pageName: 1 })
      .lean({ virtuals: true }) as unknown as IPageContent[];
  }

  /**
   * Create new page
   */
  async create(data: Partial<IPageContent>): Promise<IPageContent> {
    const pageContent = new PageContent(data);
    const saved = await pageContent.save();
    return saved.toObject();
  }

  /**
   * Update page by slug
   */
  async updateBySlug(pageSlug: string, data: Partial<IPageContent>): Promise<IPageContent | null> {
    return PageContent.findOneAndUpdate(
      { pageSlug },
      data,
      { new: true }
    ).lean({ virtuals: true }) as unknown as IPageContent | null;
  }

  /**
   * Upsert page by slug
   */
  async upsert(pageSlug: string, data: Partial<IPageContent>): Promise<IPageContent> {
    const result = await PageContent.findOneAndUpdate(
      { pageSlug },
      { ...data, pageSlug },
      { upsert: true, new: true }
    ).lean({ virtuals: true }) as unknown as IPageContent;
    return result;
  }

  /**
   * Delete page by slug
   */
  async deleteBySlug(pageSlug: string): Promise<boolean> {
    const result = await PageContent.findOneAndDelete({ pageSlug });
    return result !== null;
  }

  /**
   * Check if page exists
   */
  async exists(pageSlug: string): Promise<boolean> {
    const count = await PageContent.countDocuments({ pageSlug });
    return count > 0;
  }
}

// Singleton instance
export const pageContentRepository = new PageContentRepository();
