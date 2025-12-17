import { Request, Response } from 'express';
import { postService } from '../services';
import { CreatePostDto, UpdatePostDto, PostFilterDto, PostStatus } from '../dtos';
import {
  errorResponse,
  notFoundResponse,
} from '../utils';
import { contentStructureService } from '../services/content-structure.service';

/**
 * Post Controller
 */
export class PostController {
  /**
   * GET /api/posts
   * Get all posts with pagination and filters
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: PostFilterDto = {
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        status: req.query.status as PostStatus,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as PostFilterDto['sortBy']) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      };

      const result = await postService.getAll(filters);
      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch posts', 500);
    }
  };

  /**
   * GET /api/posts/recent
   * Get recent posts
   */
  getRecent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const posts = await postService.getRecent(limit);
      return res.json(posts);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch recent posts', 500);
    }
  };

  /**
   * GET /api/posts/statistics
   * Get post statistics
   */
  getStatistics = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const stats = await postService.getStatistics();
      return res.json(stats);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch statistics', 500);
    }
  };

  /**
   * GET /api/posts/:id
   * Get post by ID
   */
  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const post = await postService.getById(id);

      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      return res.json(post);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch post', 500);
    }
  };

  /**
   * POST /api/posts
   * Create new post
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dto: CreatePostDto = req.body;

      // Validation
      const errors: string[] = [];
      if (!dto.title || dto.title.trim() === '') {
        errors.push('Title is required');
      }
      if (!dto.content || dto.content.trim() === '') {
        errors.push('Content is required');
      }
      if (!dto.categoryId) {
        errors.push('Category is required');
      }

      if (errors.length > 0) {
        return errorResponse(res, errors.join(', '), 400);
      }

      const post = await postService.create(dto);
      return res.status(201).json(post);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create post';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * PUT /api/posts/:id
   * Update post
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const dto: UpdatePostDto = req.body;

      const post = await postService.update(id, dto);

      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      return res.json(post);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update post';
      return errorResponse(res, message, 500);
    }
  };

  /**
   * DELETE /api/posts/:id
   * Delete post
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const deleted = await postService.delete(id);

      if (!deleted) {
        return notFoundResponse(res, 'Post');
      }

      return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      return errorResponse(res, 'Failed to delete post', 500);
    }
  };

  /**
   * PATCH /api/posts/:id/status
   * Update post status
   */
  updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['draft', 'published', 'archived'].includes(status)) {
        return errorResponse(res, 'Invalid status', 400);
      }

      const post = await postService.updateStatus(id, status);

      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      return res.json(post);
    } catch (error) {
      return errorResponse(res, 'Failed to update status', 500);
    }
  };

  /**
   * GET /api/posts/slug/:slug
   * Get post by slug (public)
   */
  getBySlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { slug } = req.params;
      const post = await postService.getBySlug(slug);

      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      // Increment view count for public access
      await postService.incrementViewCount(post.id);

      return res.json(post);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch post', 500);
    }
  };

  /**
   * GET /api/posts/category/:categoryId
   * Get posts by category
   */
  getByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit as string) || undefined;

      const posts = await postService.getByCategory(categoryId, limit);
      return res.json(posts);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch posts', 500);
    }
  };

  /**
   * GET /api/posts/category-slug/:categorySlug
   * Get posts by category slug
   */
  getByCategorySlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { categorySlug } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await postService.getByCategorySlug(categorySlug, page, limit);

      if (!result) {
        return notFoundResponse(res, 'Category');
      }

      return res.json(result);
    } catch (error) {
      return errorResponse(res, 'Failed to fetch posts', 500);
    }
  };

  /**
   * POST /api/posts/generate-slug
   * Generate slug preview from title
   */
  generateSlug = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title } = req.body;

      if (!title) {
        return errorResponse(res, 'Title is required', 400);
      }

      const slug = postService.generateSlugPreview(title);
      return res.json({ slug });
    } catch (error) {
      return errorResponse(res, 'Failed to generate slug', 500);
    }
  };

  // ========== Content Structure APIs ==========

  /**
   * GET /api/posts/:id/structure
   * Get content structure for a post
   */
  getStructure = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const post = await postService.getById(id);

      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      // If structure exists, return it
      if (post.contentStructure) {
        return res.json({
          success: true,
          data: post.contentStructure,
        });
      }

      // Parse from HTML content if no structure
      const structure = contentStructureService.parseHtmlToStructure(post.content || '');
      return res.json({
        success: true,
        data: structure,
        parsed: true, // Indicate this was parsed, not saved
      });
    } catch (error) {
      return errorResponse(res, 'Failed to get structure', 500);
    }
  };

  /**
   * POST /api/posts/:id/structure/parse
   * Parse HTML content to structure (without saving)
   */
  parseToStructure = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { html } = req.body;

      if (!html) {
        return errorResponse(res, 'HTML content is required', 400);
      }

      const structure = contentStructureService.parseHtmlToStructure(html);
      return res.json({
        success: true,
        data: structure,
      });
    } catch (error) {
      return errorResponse(res, 'Failed to parse content', 500);
    }
  };

  /**
   * POST /api/posts/:id/structure/to-html
   * Convert structure to HTML (without saving)
   */
  structureToHtml = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { structure } = req.body;

      if (!structure) {
        return errorResponse(res, 'Structure is required', 400);
      }

      const html = contentStructureService.structureToHtml(structure);
      const tocHtml = contentStructureService.generateTocHtml(structure.toc || []);

      return res.json({
        success: true,
        data: {
          html,
          tocHtml,
        },
      });
    } catch (error) {
      return errorResponse(res, 'Failed to convert structure', 500);
    }
  };

  /**
   * PUT /api/posts/:id/structure
   * Save content structure for a post
   */
  saveStructure = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { structure, updateContent = false } = req.body;

      const post = await postService.getById(id);
      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      // Update structure
      const updateData: any = {
        contentStructure: {
          ...structure,
          lastStructureUpdate: new Date().toISOString(),
        },
      };

      // Optionally update HTML content from structure
      if (updateContent) {
        updateData.content = contentStructureService.structureToHtml(structure);
      }

      const updated = await postService.update(id, updateData);

      return res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      return errorResponse(res, 'Failed to save structure', 500);
    }
  };

  /**
   * POST /api/posts/:id/structure/section
   * Add a new section to the structure
   */
  addSection = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { section, afterSectionId } = req.body;

      const post = await postService.getById(id);
      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      // Get or create structure
      let structure = post.contentStructure || contentStructureService.createEmptyStructure();

      // Add section
      structure = contentStructureService.addSection(structure, section, afterSectionId);

      // Save
      const updated = await postService.update(id, {
        contentStructure: structure,
      });

      return res.json({
        success: true,
        data: updated?.contentStructure,
      });
    } catch (error) {
      return errorResponse(res, 'Failed to add section', 500);
    }
  };

  /**
   * PUT /api/posts/:id/structure/section/:sectionId
   * Update a section in the structure
   */
  updateSection = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, sectionId } = req.params;
      const { updates } = req.body;

      const post = await postService.getById(id);
      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      if (!post.contentStructure) {
        return errorResponse(res, 'Post has no structure', 400);
      }

      // Update section
      const structure = contentStructureService.updateSection(
        post.contentStructure,
        sectionId,
        updates
      );

      // Save
      const updated = await postService.update(id, {
        contentStructure: structure,
      });

      return res.json({
        success: true,
        data: updated?.contentStructure,
      });
    } catch (error) {
      return errorResponse(res, 'Failed to update section', 500);
    }
  };

  /**
   * DELETE /api/posts/:id/structure/section/:sectionId
   * Remove a section from the structure
   */
  removeSection = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id, sectionId } = req.params;

      const post = await postService.getById(id);
      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      if (!post.contentStructure) {
        return errorResponse(res, 'Post has no structure', 400);
      }

      // Remove section
      const structure = contentStructureService.removeSection(
        post.contentStructure,
        sectionId
      );

      // Save
      const updated = await postService.update(id, {
        contentStructure: structure,
      });

      return res.json({
        success: true,
        data: updated?.contentStructure,
      });
    } catch (error) {
      return errorResponse(res, 'Failed to remove section', 500);
    }
  };

  /**
   * PUT /api/posts/:id/structure/reorder
   * Reorder sections in the structure
   */
  reorderSections = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { sectionIds } = req.body;

      const post = await postService.getById(id);
      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      if (!post.contentStructure) {
        return errorResponse(res, 'Post has no structure', 400);
      }

      // Reorder
      const structure = contentStructureService.reorderSections(
        post.contentStructure,
        sectionIds
      );

      // Save
      const updated = await postService.update(id, {
        contentStructure: structure,
      });

      return res.json({
        success: true,
        data: updated?.contentStructure,
      });
    } catch (error) {
      return errorResponse(res, 'Failed to reorder sections', 500);
    }
  };

  /**
   * POST /api/posts/:id/structure/sync
   * Sync structure from current HTML content
   */
  syncStructureFromContent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const post = await postService.getById(id);
      if (!post) {
        return notFoundResponse(res, 'Post');
      }

      // Parse HTML to structure
      const structure = contentStructureService.parseHtmlToStructure(post.content || '');

      // Save
      const updated = await postService.update(id, {
        contentStructure: structure,
      });

      return res.json({
        success: true,
        data: updated?.contentStructure,
        message: `Synced ${structure.sections.length} sections, ${structure.toc.length} TOC items`,
      });
    } catch (error) {
      return errorResponse(res, 'Failed to sync structure', 500);
    }
  };
}

// Export singleton instance
export const postController = new PostController();
