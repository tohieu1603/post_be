import { Request, Response } from 'express';
import { pageContentService } from '../services/page-content.service';
import { errorResponse, notFoundResponse } from '../utils';

/**
 * PageContent Controller - Simplified
 * Chỉ lưu pageSlug + raw JSON content
 */
export class PageContentController {
  /**
   * GET /api/page-content
   * Get all pages
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const activeOnly = req.query.activeOnly !== 'false';
      const pages = await pageContentService.getAll(activeOnly);
      return res.json(pages);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch pages', 500);
    }
  };

  /**
   * GET /api/page-content/:pageSlug
   * Get page by slug - trả về raw JSON content
   */
  getBySlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { pageSlug } = req.params;

      const page = await pageContentService.getBySlug(pageSlug);

      if (!page) {
        return notFoundResponse(res, 'Page');
      }

      return res.json(page);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch page', 500);
    }
  };

  /**
   * POST /api/page-content
   * Create new page
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { pageSlug, pageName, content } = req.body;

      if (!pageSlug || !content) {
        return errorResponse(res, 'pageSlug and content are required', 400);
      }

      const page = await pageContentService.create({
        pageSlug,
        pageName: pageName || pageSlug,
        content,
      });

      return res.status(201).json(page);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create page';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * PUT /api/page-content/:pageSlug
   * Update page by slug
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { pageSlug } = req.params;
      const { pageName, content, isActive } = req.body;

      const page = await pageContentService.updateBySlug(pageSlug, {
        ...(pageName !== undefined && { pageName }),
        ...(content !== undefined && { content }),
        ...(isActive !== undefined && { isActive }),
      });

      if (!page) {
        return notFoundResponse(res, 'Page');
      }

      return res.json(page);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update page';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * PUT /api/page-content/:pageSlug/upsert
   * Upsert page (create or update)
   */
  upsert = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { pageSlug } = req.params;
      const { pageName, content } = req.body;

      if (!content) {
        return errorResponse(res, 'content is required', 400);
      }

      const page = await pageContentService.upsert(pageSlug, {
        pageName: pageName || pageSlug,
        content,
      });

      return res.json(page);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upsert page';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * DELETE /api/page-content/:pageSlug
   * Delete page by slug
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { pageSlug } = req.params;

      const deleted = await pageContentService.delete(pageSlug);

      if (!deleted) {
        return notFoundResponse(res, 'Page');
      }

      return res.json({ message: `Page ${pageSlug} deleted successfully` });
    } catch (error) {
      return errorResponse(res, 'Failed to delete page', 500);
    }
  };

  /**
   * PATCH /api/page-content/:pageSlug/toggle-active
   * Toggle page active status
   */
  toggleActive = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { pageSlug } = req.params;

      const page = await pageContentService.toggleActive(pageSlug);

      if (!page) {
        return notFoundResponse(res, 'Page');
      }

      return res.json(page);
    } catch (error) {
      return errorResponse(res, 'Failed to toggle status', 500);
    }
  };

  /**
   * POST /api/page-content/import
   * Import page from JSON - lưu nguyên cục JSON
   */
  importFromJson = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { pageSlug, pageName, content } = req.body;

      if (!pageSlug || !content || typeof content !== 'object') {
        return errorResponse(res, 'pageSlug and content object are required', 400);
      }

      const page = await pageContentService.importFromJson(pageSlug, pageName || pageSlug, content);

      return res.json({
        message: `Page ${pageSlug} imported successfully`,
        page,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import page';
      return errorResponse(res, message, 500);
    }
  };
}

// Export singleton instance
export const pageContentController = new PageContentController();
