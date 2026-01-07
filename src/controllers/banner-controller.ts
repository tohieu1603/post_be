import { Request, Response } from 'express';
import { bannerService } from '../services/banner.service';
import {
  CreateBannerDto,
  UpdateBannerDto,
  BannerFilterDto,
  BannerPosition,
  BannerStatus,
  TrendingConfigDto,
} from '../dtos/banner.dto';
import { errorResponse, notFoundResponse } from '../utils';

/**
 * Banner Controller
 */
export class BannerController {
  /**
   * GET /api/banners
   * Get all banners with pagination and filters
   */
  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: BannerFilterDto = {
        position: req.query.position as BannerPosition,
        status: req.query.status as BannerStatus,
        isAutoAssigned: req.query.isAutoAssigned === 'true' ? true :
                        req.query.isAutoAssigned === 'false' ? false : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as BannerFilterDto['sortBy']) || 'rank',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC',
      };

      const result = await bannerService.getAll(filters);
      return res.json(result);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      return errorResponse(res, 'Failed to fetch banners', 500);
    }
  };

  /**
   * GET /api/banners/trending
   * Get trending banners (auto-assigned, hero position)
   */
  getTrending = async (req: Request, res: Response): Promise<Response> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const banners = await bannerService.getTrending(limit);
      return res.json(banners);
    } catch (error) {
      console.error('Failed to fetch trending banners:', error);
      return errorResponse(res, 'Failed to fetch trending banners', 500);
    }
  };

  /**
   * GET /api/banners/position/:position
   * Get active banners by position (for public display)
   */
  getByPosition = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { position } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!['hero', 'sidebar', 'category', 'footer'].includes(position)) {
        return errorResponse(res, 'Invalid position', 400);
      }

      const banners = await bannerService.getActiveByPosition(position as BannerPosition, limit);
      return res.json(banners);
    } catch (error) {
      console.error('Failed to fetch banners by position:', error);
      return errorResponse(res, 'Failed to fetch banners', 500);
    }
  };

  /**
   * GET /api/banners/statistics
   * Get banner statistics
   */
  getStatistics = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const stats = await bannerService.getStatistics();
      return res.json(stats);
    } catch (error) {
      console.error('Failed to fetch banner statistics:', error);
      return errorResponse(res, 'Failed to fetch statistics', 500);
    }
  };

  /**
   * GET /api/banners/:id
   * Get banner by ID
   */
  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const banner = await bannerService.getById(id);

      if (!banner) {
        return notFoundResponse(res, 'Banner');
      }

      return res.json(banner);
    } catch (error) {
      console.error('Failed to fetch banner:', error);
      return errorResponse(res, 'Failed to fetch banner', 500);
    }
  };

  /**
   * GET /api/banners/post/:postId
   * Get banner by post ID
   */
  getByPostId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { postId } = req.params;
      const banner = await bannerService.getByPostId(postId);

      if (!banner) {
        return notFoundResponse(res, 'Banner for this post');
      }

      return res.json(banner);
    } catch (error) {
      console.error('Failed to fetch banner:', error);
      return errorResponse(res, 'Failed to fetch banner', 500);
    }
  };

  /**
   * POST /api/banners
   * Create new banner manually
   */
  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const dto: CreateBannerDto = req.body;

      // Validation
      if (!dto.postId) {
        return errorResponse(res, 'Post ID is required', 400);
      }

      const banner = await bannerService.create(dto);
      return res.status(201).json(banner);
    } catch (error: any) {
      console.error('Failed to create banner:', error);
      if (error.message === 'Post not found') {
        return errorResponse(res, 'Post not found', 404);
      }
      if (error.code === 11000) {
        return errorResponse(res, 'Banner for this post already exists', 409);
      }
      return errorResponse(res, 'Failed to create banner', 500);
    }
  };

  /**
   * PUT /api/banners/:id
   * Update banner
   */
  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const dto: UpdateBannerDto = req.body;

      const banner = await bannerService.update(id, dto);

      if (!banner) {
        return notFoundResponse(res, 'Banner');
      }

      return res.json(banner);
    } catch (error) {
      console.error('Failed to update banner:', error);
      return errorResponse(res, 'Failed to update banner', 500);
    }
  };

  /**
   * DELETE /api/banners/:id
   * Delete banner
   */
  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const deleted = await bannerService.delete(id);

      if (!deleted) {
        return notFoundResponse(res, 'Banner');
      }

      return res.json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
      console.error('Failed to delete banner:', error);
      return errorResponse(res, 'Failed to delete banner', 500);
    }
  };

  /**
   * POST /api/banners/sync-trending
   * Manually trigger trending banner sync
   */
  syncTrending = async (req: Request, res: Response): Promise<Response> => {
    try {
      const config: TrendingConfigDto = {
        topCount: parseInt(req.body.topCount as string) || 10,
        position: req.body.position as BannerPosition,
        minViewCount: parseInt(req.body.minViewCount as string) || 0,
        categoryId: req.body.categoryId as string | undefined,
      };

      const result = await bannerService.syncTrendingBanners(config);
      return res.json({
        success: true,
        message: `Synced ${result.created + result.updated} banners, removed ${result.removed}`,
        ...result,
      });
    } catch (error) {
      console.error('Failed to sync trending banners:', error);
      return errorResponse(res, 'Failed to sync trending banners', 500);
    }
  };

  /**
   * GET /api/banners/category/:categoryId
   * Get active banners by category (for public display)
   */
  getByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const banners = await bannerService.getActiveByCategory(categoryId, limit);
      return res.json(banners);
    } catch (error) {
      console.error('Failed to fetch banners by category:', error);
      return errorResponse(res, 'Failed to fetch banners by category', 500);
    }
  };

  /**
   * POST /api/banners/:id/view
   * Track banner view
   */
  trackView = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await bannerService.trackView(id);
      return res.json({ success: true });
    } catch (error) {
      console.error('Failed to track banner view:', error);
      return errorResponse(res, 'Failed to track view', 500);
    }
  };

  /**
   * POST /api/banners/:id/click
   * Track banner click
   */
  trackClick = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      await bannerService.trackClick(id);
      return res.json({ success: true });
    } catch (error) {
      console.error('Failed to track banner click:', error);
      return errorResponse(res, 'Failed to track click', 500);
    }
  };

  /**
   * GET /api/banners/post/:postId/rank
   * Get post's trending rank
   */
  getPostRank = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { postId } = req.params;
      const topCount = parseInt(req.query.topCount as string) || 10;

      const rank = await bannerService.getPostTrendingRank(postId, topCount);
      const isInTrending = rank > 0;

      return res.json({ postId, rank, isInTrending });
    } catch (error) {
      console.error('Failed to get post rank:', error);
      return errorResponse(res, 'Failed to get post rank', 500);
    }
  };
}

// Singleton instance
export const bannerController = new BannerController();
