import { Request, Response } from 'express';
import { dictionaryService } from '../services/dictionary.service';
import {
  CreateDictionaryTermDto,
  UpdateDictionaryTermDto,
  DictionaryFilterDto,
} from '../dtos/dictionary.dto';
import { errorResponse, notFoundResponse } from '../utils';

/**
 * Dictionary Controller - HTTP handlers for dictionary/glossary operations
 */
export class DictionaryController {
  /**
   * GET /api/dictionary
   * Get all terms with pagination and filters
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: DictionaryFilterDto = {
        search: req.query.search as string,
        letter: req.query.letter as string,
        categoryId: req.query.categoryId as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        partOfSpeech: req.query.partOfSpeech as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        sortBy: (req.query.sortBy as DictionaryFilterDto['sortBy']) || 'term',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC',
      };

      const result = await dictionaryService.getAll(filters);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch dictionary terms', 500);
    }
  };

  /**
   * GET /api/dictionary/alphabet
   * Get alphabet index with term counts
   */
  getAlphabetIndex = async (req: Request, res: Response): Promise<Response> => {
    try {
      const isActive = req.query.isActive !== 'false';
      const result = await dictionaryService.getAlphabetIndex(isActive);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch alphabet index', 500);
    }
  };

  /**
   * GET /api/dictionary/featured
   * Get featured terms
   */
  getFeatured = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await dictionaryService.getFeatured(limit);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch featured terms', 500);
    }
  };

  /**
   * GET /api/dictionary/popular
   * Get popular terms (most viewed)
   */
  getPopular = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await dictionaryService.getPopular(limit);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch popular terms', 500);
    }
  };

  /**
   * GET /api/dictionary/recent
   * Get recently added terms
   */
  getRecent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await dictionaryService.getRecent(limit);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch recent terms', 500);
    }
  };

  /**
   * GET /api/dictionary/random
   * Get random terms (word of the day)
   */
  getRandom = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = parseInt(req.query.limit as string) || 1;
      const result = await dictionaryService.getRandom(limit);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch random terms', 500);
    }
  };

  /**
   * GET /api/dictionary/suggestions
   * Get search suggestions (autocomplete)
   */
  getSuggestions = async (req: Request, res: Response): Promise<Response> => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await dictionaryService.getSuggestions(query, limit);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch suggestions', 500);
    }
  };

  /**
   * GET /api/dictionary/statistics
   * Get dictionary statistics
   */
  getStatistics = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await dictionaryService.getStatistics();
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch statistics', 500);
    }
  };

  /**
   * GET /api/dictionary/letter/:letter
   * Get terms by first letter
   */
  getByLetter = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { letter } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;

      const filters: DictionaryFilterDto = {
        letter: letter.toUpperCase(),
        isActive: true,
        page,
        limit,
        sortBy: 'term',
        sortOrder: 'ASC',
      };

      const result = await dictionaryService.getAll(filters);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch terms by letter', 500);
    }
  };

  /**
   * GET /api/dictionary/category/:categoryId
   * Get terms by category
   */
  getByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await dictionaryService.getByCategory(categoryId, limit);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch terms by category', 500);
    }
  };

  /**
   * GET /api/dictionary/:id
   * Get term by ID
   */
  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const term = await dictionaryService.getById(id);

      if (!term) {
        return notFoundResponse(res, 'Dictionary term');
      }

      return res.json(term);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch dictionary term', 500);
    }
  };

  /**
   * GET /api/dictionary/slug/:slug
   * Get term by slug (public view - increments view count)
   */
  getBySlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { slug } = req.params;
      const term = await dictionaryService.getBySlugPublic(slug);

      if (!term) {
        return notFoundResponse(res, 'Dictionary term');
      }

      return res.json(term);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch dictionary term', 500);
    }
  };

  /**
   * POST /api/dictionary
   * Create new term
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dto: CreateDictionaryTermDto = req.body;
      const userId = (req as any).user?.id;

      const term = await dictionaryService.create(dto, userId);
      return res.status(201).json(term);
    } catch (error: any) {
      if (error.message === 'Term already exists' || error.message === 'Slug already exists') {
        return errorResponse(res, error.message, 409);
      }
      return errorResponse(res, 'Failed to create dictionary term', 500);
    }
  };

  /**
   * PUT /api/dictionary/:id
   * Update term
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const dto: UpdateDictionaryTermDto = req.body;
      const userId = (req as any).user?.id;

      const term = await dictionaryService.update(id, dto, userId);

      if (!term) {
        return notFoundResponse(res, 'Dictionary term');
      }

      return res.json(term);
    } catch (error: any) {
      if (error.message === 'Term already exists' || error.message === 'Slug already exists') {
        return errorResponse(res, error.message, 409);
      }
      return errorResponse(res, 'Failed to update dictionary term', 500);
    }
  };

  /**
   * DELETE /api/dictionary/:id
   * Delete term
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const success = await dictionaryService.delete(id);

      if (!success) {
        return notFoundResponse(res, 'Dictionary term');
      }

      return res.json({ success: true, message: 'Dictionary term deleted successfully' });
    } catch (error) {
      return errorResponse(res, 'Failed to delete dictionary term', 500);
    }
  };

  /**
   * PATCH /api/dictionary/:id/toggle-active
   * Toggle active status
   */
  toggleActive = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const term = await dictionaryService.toggleActive(id);

      if (!term) {
        return notFoundResponse(res, 'Dictionary term');
      }

      return res.json(term);
    } catch (error) {
      return errorResponse(res, 'Failed to toggle active status', 500);
    }
  };

  /**
   * PATCH /api/dictionary/:id/toggle-featured
   * Toggle featured status
   */
  toggleFeatured = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const term = await dictionaryService.toggleFeatured(id);

      if (!term) {
        return notFoundResponse(res, 'Dictionary term');
      }

      return res.json(term);
    } catch (error) {
      return errorResponse(res, 'Failed to toggle featured status', 500);
    }
  };

  /**
   * POST /api/dictionary/:id/view
   * Track view (for API-based view tracking)
   */
  trackView = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await dictionaryService.trackView(id);
      return res.json({ success: true });
    } catch (error) {
      return errorResponse(res, 'Failed to track view', 500);
    }
  };

  /**
   * POST /api/dictionary/bulk-import
   * Bulk import terms
   */
  bulkImport = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { terms } = req.body;
      const userId = (req as any).user?.id;

      if (!Array.isArray(terms) || terms.length === 0) {
        return errorResponse(res, 'Terms array is required', 400);
      }

      if (terms.length > 100) {
        return errorResponse(res, 'Maximum 100 terms per import', 400);
      }

      const result = await dictionaryService.bulkImport(terms, userId);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to import terms', 500);
    }
  };
}

// Singleton instance
export const dictionaryController = new DictionaryController();
