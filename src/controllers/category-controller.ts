import { Request, Response } from 'express';
import { categoryService } from '../services';
import { CreateCategoryDto, UpdateCategoryDto, CategoryFilterDto } from '../dtos';
import {
  errorResponse,
  notFoundResponse,
} from '../utils';

/**
 * Category Controller
 */
export class CategoryController {
  /**
   * GET /api/categories
   * Get all categories with filters
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: CategoryFilterDto = {
        search: req.query.search as string,
        parentId: req.query.parentId as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        sortBy: (req.query.sortBy as CategoryFilterDto['sortBy']) || 'sortOrder',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC',
      };

      const categories = await categoryService.getAll(filters);
      return res.json(categories);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch categories', 500);
    }
  };

  /**
   * GET /api/categories/tree
   * Get categories as tree structure
   */
  getTree = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const tree = await categoryService.getTree();
      return res.json(tree);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch category tree', 500);
    }
  };

  /**
   * GET /api/categories/dropdown
   * Get categories for dropdown selection
   */
  getDropdown = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const categories = await categoryService.getForDropdown();
      return res.json(categories);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch categories', 500);
    }
  };

  /**
   * GET /api/categories/:id
   * Get category by ID
   */
  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const category = await categoryService.getById(id);

      if (!category) {
        return notFoundResponse(res, 'Category');
      }

      return res.json(category);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch category', 500);
    }
  };

  /**
   * GET /api/categories/slug/:slug
   * Get category by slug
   */
  getBySlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { slug } = req.params;
      const category = await categoryService.getBySlug(slug);

      if (!category) {
        return notFoundResponse(res, 'Category');
      }

      return res.json(category);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch category', 500);
    }
  };

  /**
   * POST /api/categories
   * Create new category
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dto: CreateCategoryDto = req.body;

      // Validation
      if (!dto.name || dto.name.trim() === '') {
        return errorResponse(res, 'Name is required', 400);
      }

      const category = await categoryService.create(dto);
      return res.status(201).json(category);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create category';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * PUT /api/categories/:id
   * Update category
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const dto: UpdateCategoryDto = req.body;

      const category = await categoryService.update(id, dto);

      if (!category) {
        return notFoundResponse(res, 'Category');
      }

      return res.json(category);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update category';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * DELETE /api/categories/:id
   * Delete category
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const result = await categoryService.delete(id);

      if (!result.success) {
        return errorResponse(res, result.message || 'Cannot delete category', 400);
      }

      return res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      return errorResponse(res, 'Failed to delete category', 500);
    }
  };

  /**
   * PATCH /api/categories/:id/toggle-active
   * Toggle category active status
   */
  toggleActive = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const category = await categoryService.toggleActive(id);

      if (!category) {
        return notFoundResponse(res, 'Category');
      }

      return res.json(category);
    } catch (error) {
      return errorResponse(res, 'Failed to update status', 500);
    }
  };

  /**
   * POST /api/categories/generate-slug
   * Generate slug preview from name
   */
  generateSlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name } = req.body;

      if (!name) {
        return errorResponse(res, 'Name is required', 400);
      }

      const slug = categoryService.generateSlugPreview(name);
      return res.json({ slug });
    } catch (error) {
      return errorResponse(res, 'Failed to generate slug', 500);
    }
  };
}

// Export singleton instance
export const categoryController = new CategoryController();
