import { Request, Response } from 'express';
import { authorService } from '../services';
import { CreateAuthorDto, UpdateAuthorDto, AuthorFilterDto } from '../dtos';
import { errorResponse, notFoundResponse } from '../utils';

/**
 * Author Controller
 */
export class AuthorController {
  /**
   * GET /api/authors
   * Get all authors with filters and pagination
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: AuthorFilterDto = {
        search: req.query.search as string,
        isActive:
          req.query.isActive === 'true'
            ? true
            : req.query.isActive === 'false'
            ? false
            : undefined,
        isFeatured:
          req.query.isFeatured === 'true'
            ? true
            : req.query.isFeatured === 'false'
            ? false
            : undefined,
        expertise: req.query.expertise as string,
        sortBy: (req.query.sortBy as AuthorFilterDto['sortBy']) || 'sortOrder',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC',
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };

      const result = await authorService.getAll(filters);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch authors', 500);
    }
  };

  /**
   * GET /api/authors/dropdown
   * Get authors for dropdown selection
   */
  getDropdown = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const authors = await authorService.getForDropdown();
      return res.json(authors);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch authors', 500);
    }
  };

  /**
   * GET /api/authors/featured
   * Get featured authors
   */
  getFeatured = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const authors = await authorService.getFeatured(limit);
      return res.json(authors);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch featured authors', 500);
    }
  };

  /**
   * GET /api/authors/expertise-tags
   * Get all unique expertise tags
   */
  getExpertiseTags = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const tags = await authorService.getAllExpertiseTags();
      return res.json(tags);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch expertise tags', 500);
    }
  };

  /**
   * GET /api/authors/:id
   * Get author by ID
   */
  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const author = await authorService.getById(id);

      if (!author) {
        return notFoundResponse(res, 'Author');
      }

      return res.json(author);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch author', 500);
    }
  };

  /**
   * GET /api/authors/slug/:slug
   * Get author by slug
   */
  getBySlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { slug } = req.params;
      const author = await authorService.getBySlug(slug);

      if (!author) {
        return notFoundResponse(res, 'Author');
      }

      return res.json(author);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch author', 500);
    }
  };

  /**
   * POST /api/authors
   * Create new author
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dto: CreateAuthorDto = req.body;

      // Validation
      if (!dto.name || dto.name.trim() === '') {
        return errorResponse(res, 'Tên tác giả là bắt buộc', 400);
      }

      const author = await authorService.create(dto);
      return res.status(201).json(author);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create author';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * PUT /api/authors/:id
   * Update author
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const dto: UpdateAuthorDto = req.body;

      const author = await authorService.update(id, dto);

      if (!author) {
        return notFoundResponse(res, 'Author');
      }

      return res.json(author);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update author';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * DELETE /api/authors/:id
   * Delete author
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const result = await authorService.delete(id);

      if (!result.success) {
        return errorResponse(res, result.message || 'Cannot delete author', 400);
      }

      return res.json({ message: 'Xóa tác giả thành công' });
    } catch (error) {
      return errorResponse(res, 'Failed to delete author', 500);
    }
  };

  /**
   * PATCH /api/authors/:id/toggle-active
   * Toggle author active status
   */
  toggleActive = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const author = await authorService.toggleActive(id);

      if (!author) {
        return notFoundResponse(res, 'Author');
      }

      return res.json(author);
    } catch (error) {
      return errorResponse(res, 'Failed to update status', 500);
    }
  };

  /**
   * PATCH /api/authors/:id/toggle-featured
   * Toggle author featured status
   */
  toggleFeatured = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const author = await authorService.toggleFeatured(id);

      if (!author) {
        return notFoundResponse(res, 'Author');
      }

      return res.json(author);
    } catch (error) {
      return errorResponse(res, 'Failed to update featured status', 500);
    }
  };

  /**
   * POST /api/authors/generate-slug
   * Generate slug preview from name
   */
  generateSlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name } = req.body;

      if (!name) {
        return errorResponse(res, 'Name is required', 400);
      }

      const slug = authorService.generateSlugPreview(name);
      return res.json({ slug });
    } catch (error) {
      return errorResponse(res, 'Failed to generate slug', 500);
    }
  };

  /**
   * PUT /api/authors/sort-order
   * Update sort order for multiple authors
   */
  updateSortOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { items } = req.body;

      if (!Array.isArray(items)) {
        return errorResponse(res, 'Items must be an array', 400);
      }

      await authorService.updateSortOrder(items);
      return res.json({ message: 'Sort order updated successfully' });
    } catch (error) {
      return errorResponse(res, 'Failed to update sort order', 500);
    }
  };
}

// Export singleton instance
export const authorController = new AuthorController();
