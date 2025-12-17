import { Router, Request, Response } from 'express';
import { Post } from '../models/post.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import { AnalyticsEvent, DailyStats } from '../models/analytics.model';
import { Types } from 'mongoose';
import crypto from 'crypto';

const router = Router();

// ==================== HOMEPAGE APIs ====================

/**
 * @swagger
 * /public/home/featured:
 *   get:
 *     summary: Lấy bài viết nổi bật cho homepage
 *     tags: [Public API]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Danh sách bài viết nổi bật
 */
router.get('/home/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const posts = await Post.find({
      status: 'published',
      isFeatured: true,
    })
      .select('title slug excerpt coverImage publishedAt viewCount category')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch featured posts' });
  }
});

/**
 * @swagger
 * /public/home/latest:
 *   get:
 *     summary: Lấy tin mới nhất (timeline 24h)
 *     tags: [Public API]
 */
router.get('/home/latest', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ status: 'published' })
        .select('title slug excerpt coverImage publishedAt viewCount category createdAt')
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ status: 'published' }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch latest posts' });
  }
});

/**
 * @swagger
 * /public/home/sections:
 *   get:
 *     summary: Lấy tin theo từng category cho homepage sections
 *     tags: [Public API]
 */
router.get('/home/sections', async (req: Request, res: Response) => {
  try {
    const limitPerCategory = parseInt(req.query.limit as string) || 5;

    // Get root categories (parent categories)
    const categories = await Category.find({
      parentId: null,
      isActive: true,
    })
      .select('name slug description')
      .sort({ sortOrder: 1 })
      .lean();

    // Get posts for each category
    const sections = await Promise.all(
      categories.map(async (category) => {
        // Get all subcategory IDs
        const subcategories = await Category.find({ parentId: category._id }).select('_id').lean();
        const categoryIds = [category._id, ...subcategories.map((s) => s._id)];

        const posts = await Post.find({
          status: 'published',
          categoryId: { $in: categoryIds },
        })
          .select('title slug excerpt coverImage publishedAt viewCount isFeatured')
          .sort({ isFeatured: -1, publishedAt: -1 })
          .limit(limitPerCategory)
          .lean();

        return {
          category: {
            id: category._id,
            name: category.name,
            slug: category.slug,
          },
          posts,
        };
      })
    );

    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sections' });
  }
});

// ==================== CATEGORY APIs ====================

/**
 * @swagger
 * /public/category/{slug}:
 *   get:
 *     summary: Lấy thông tin category và bài viết
 *     tags: [Public API]
 */
router.get('/category/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Find category by slug
    const category = await Category.findOne({ slug, isActive: true })
      .populate('parent', 'name slug')
      .lean();

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Get subcategories
    const subcategories = await Category.find({
      parentId: category._id,
      isActive: true,
    })
      .select('name slug description')
      .sort({ sortOrder: 1 })
      .lean();

    // Get all category IDs (including subcategories)
    const categoryIds = [category._id, ...subcategories.map((s) => s._id)];

    // Get posts
    const [posts, total] = await Promise.all([
      Post.find({
        status: 'published',
        categoryId: { $in: categoryIds },
      })
        .select('title slug excerpt coverImage publishedAt viewCount isFeatured category')
        .populate('category', 'name slug')
        .sort({ isFeatured: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({
        status: 'published',
        categoryId: { $in: categoryIds },
      }),
    ]);

    res.json({
      success: true,
      data: {
        category,
        subcategories,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

/**
 * @swagger
 * /public/category/{slug}/featured:
 *   get:
 *     summary: Lấy bài viết nổi bật trong category
 *     tags: [Public API]
 */
router.get('/category/:slug/featured', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    const category = await Category.findOne({ slug, isActive: true }).lean();
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Get subcategory IDs
    const subcategories = await Category.find({ parentId: category._id }).select('_id').lean();
    const categoryIds = [category._id, ...subcategories.map((s) => s._id)];

    const posts = await Post.find({
      status: 'published',
      categoryId: { $in: categoryIds },
      isFeatured: true,
    })
      .select('title slug excerpt coverImage publishedAt viewCount')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch featured posts' });
  }
});

// ==================== TAG APIs ====================

/**
 * @swagger
 * /public/tag/{slug}:
 *   get:
 *     summary: Lấy bài viết theo tag
 *     tags: [Public API]
 */
router.get('/tag/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Find tag
    const tag = await Tag.findOne({ slug, isActive: true }).lean();
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }

    // Get posts with this tag
    const [posts, total] = await Promise.all([
      Post.find({
        status: 'published',
        tagsRelation: tag._id,
      })
        .select('title slug excerpt coverImage publishedAt viewCount category')
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({
        status: 'published',
        tagsRelation: tag._id,
      }),
    ]);

    res.json({
      success: true,
      data: {
        tag,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tag posts' });
  }
});

// ==================== POST DETAIL APIs ====================

/**
 * @swagger
 * /public/post/{slug}:
 *   get:
 *     summary: Lấy chi tiết bài viết (public)
 *     tags: [Public API]
 */
router.get('/post/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug, status: 'published' })
      .select('title slug excerpt coverImage content publishedAt createdAt updatedAt viewCount isFeatured author readingTime contentStructure category tagsRelation')
      .populate('category', 'name slug')
      .populate('tagsRelation', 'name slug color')
      .lean();

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Note: viewCount is incremented via /public/track endpoint to enable session deduplication
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

/**
 * @swagger
 * /public/post/{slug}/related:
 *   get:
 *     summary: Lấy bài viết liên quan
 *     tags: [Public API]
 */
router.get('/post/:slug/related', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    // Find current post
    const currentPost = await Post.findOne({ slug, status: 'published' }).lean();
    if (!currentPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Find related posts by same category or tags
    const relatedPosts = await Post.find({
      _id: { $ne: currentPost._id },
      status: 'published',
      $or: [
        { categoryId: currentPost.categoryId },
        { tagsRelation: { $in: currentPost.tagsRelation || [] } },
      ],
    })
      .select('title slug excerpt coverImage publishedAt viewCount category')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: relatedPosts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch related posts' });
  }
});

// ==================== SEARCH APIs ====================

/**
 * @swagger
 * /public/search:
 *   get:
 *     summary: Tìm kiếm bài viết
 *     tags: [Public API]
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const categorySlug = req.query.category as string;
    const tagSlug = req.query.tag as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Search query must be at least 2 characters' });
    }

    // Build query
    const query: any = {
      status: 'published',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ],
    };

    // Filter by category
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).lean();
      if (category) {
        const subcategories = await Category.find({ parentId: category._id }).select('_id').lean();
        query.categoryId = { $in: [category._id, ...subcategories.map((s) => s._id)] };
      }
    }

    // Filter by tag
    if (tagSlug) {
      const tag = await Tag.findOne({ slug: tagSlug }).lean();
      if (tag) {
        query.tagsRelation = tag._id;
      }
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .select('title slug excerpt coverImage publishedAt viewCount category')
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        query: q,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

/**
 * @swagger
 * /public/search/suggest:
 *   get:
 *     summary: Gợi ý tìm kiếm (autocomplete)
 *     tags: [Public API]
 */
router.get('/search/suggest', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const posts = await Post.find({
      status: 'published',
      title: { $regex: q, $options: 'i' },
    })
      .select('title slug')
      .limit(limit)
      .lean();

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Suggestion failed' });
  }
});

// ==================== WIDGET APIs ====================

/**
 * @swagger
 * /public/widget/most-viewed:
 *   get:
 *     summary: Tin xem nhiều nhất
 *     tags: [Public API]
 */
router.get('/widget/most-viewed', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const period = req.query.period as string || 'all'; // all, week, month

    const query: any = { status: 'published' };

    // Filter by period
    if (period === 'week') {
      query.publishedAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    } else if (period === 'month') {
      query.publishedAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const posts = await Post.find(query)
      .select('title slug coverImage viewCount publishedAt category')
      .populate('category', 'name slug')
      .sort({ viewCount: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch most viewed' });
  }
});

/**
 * @swagger
 * /public/widget/trending-tags:
 *   get:
 *     summary: Tags đang hot
 *     tags: [Public API]
 */
router.get('/widget/trending-tags', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Get tags with post count
    const tags = await Tag.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'tagsRelation',
          as: 'posts',
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          color: 1,
          postCount: {
            $size: {
              $filter: {
                input: '$posts',
                cond: { $eq: ['$$this.status', 'published'] },
              },
            },
          },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: limit },
    ]);

    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch trending tags' });
  }
});

/**
 * @swagger
 * /public/widget/categories:
 *   get:
 *     summary: Danh sách categories với số bài viết
 *     tags: [Public API]
 */
router.get('/widget/categories', async (req: Request, res: Response) => {
  try {
    const categories = await Category.aggregate([
      { $match: { isActive: true, parentId: null } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'posts',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'parentId',
          as: 'subcategories',
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          description: 1,
          postCount: {
            $size: {
              $filter: {
                input: '$posts',
                cond: { $eq: ['$$this.status', 'published'] },
              },
            },
          },
          subcategoryCount: { $size: '$subcategories' },
        },
      },
      { $sort: { sortOrder: 1, name: 1 } },
    ]);

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// ==================== ARCHIVE APIs ====================

/**
 * @swagger
 * /public/archive/{year}/{month}:
 *   get:
 *     summary: Tin theo tháng/năm
 *     tags: [Public API]
 */
router.get('/archive/:year/:month', async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [posts, total] = await Promise.all([
      Post.find({
        status: 'published',
        publishedAt: { $gte: startDate, $lte: endDate },
      })
        .select('title slug excerpt coverImage publishedAt viewCount category')
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({
        status: 'published',
        publishedAt: { $gte: startDate, $lte: endDate },
      }),
    ]);

    res.json({
      success: true,
      data: {
        year,
        month,
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch archive' });
  }
});

/**
 * @swagger
 * /public/archive/timeline:
 *   get:
 *     summary: Timeline tin 24h (grouped by hour)
 *     tags: [Public API]
 */
router.get('/archive/timeline', async (req: Request, res: Response) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const posts = await Post.find({
      status: 'published',
      publishedAt: { $gte: since },
    })
      .select('title slug excerpt coverImage publishedAt viewCount category')
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .lean();

    // Group by hour
    const timeline: Record<string, typeof posts> = {};
    posts.forEach((post) => {
      const hourKey = new Date(post.publishedAt!).toISOString().slice(0, 13);
      if (!timeline[hourKey]) {
        timeline[hourKey] = [];
      }
      timeline[hourKey].push(post);
    });

    res.json({ success: true, data: { timeline, total: posts.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch timeline' });
  }
});

// ==================== NAVIGATION APIs ====================

/**
 * @swagger
 * /public/navigation/menu:
 *   get:
 *     summary: Lấy menu navigation (categories tree)
 *     tags: [Public API]
 */
router.get('/navigation/menu', async (req: Request, res: Response) => {
  try {
    // Get all active categories
    const categories = await Category.find({ isActive: true })
      .select('name slug parentId sortOrder')
      .sort({ sortOrder: 1 })
      .lean();

    // Build tree
    const buildTree = (parentId: any = null): any[] => {
      return categories
        .filter((c) => String(c.parentId || null) === String(parentId))
        .map((c) => ({
          id: c._id,
          name: c.name,
          slug: c.slug,
          children: buildTree(c._id),
        }));
    };

    const menu = buildTree(null);

    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch menu' });
  }
});

// ==================== ANALYTICS TRACKING ====================

/**
 * Generate session ID from IP + UserAgent
 */
function generateSessionId(ipAddress?: string, userAgent?: string): string {
  const raw = `${ipAddress || 'unknown'}-${userAgent || 'unknown'}`;
  return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 32);
}

/**
 * Get start of day for date aggregation
 */
function getDateOnly(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * @swagger
 * /public/track:
 *   post:
 *     summary: Track user interaction events
 *     tags: [Public API]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventType
 *               - entityType
 *             properties:
 *               eventType:
 *                 type: string
 *                 enum: [page_view, post_view, category_view, faq_click, toc_click, link_click]
 *               entityType:
 *                 type: string
 *                 enum: [post, category, page, faq, toc, link]
 *               entityId:
 *                 type: string
 *               entitySlug:
 *                 type: string
 *               metadata:
 *                 type: object
 */
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { eventType, entityType, entityId, entitySlug, metadata } = req.body;

    if (!eventType || !entityType) {
      return res.status(400).json({ success: false, error: 'eventType and entityType required' });
    }

    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const referrer = req.get('Referer') || null;
    const sessionId = generateSessionId(ipAddress, userAgent);
    const today = getDateOnly();

    // Check for duplicate (same session + entity + day)
    const existingEvent = await AnalyticsEvent.findOne({
      sessionId,
      entityType,
      entityId: entityId && Types.ObjectId.isValid(entityId) ? new Types.ObjectId(entityId) : null,
      date: today,
      eventType,
    });

    const isUniqueView = !existingEvent;

    // Create event
    await AnalyticsEvent.create({
      eventType,
      entityType,
      entityId: entityId && Types.ObjectId.isValid(entityId) ? new Types.ObjectId(entityId) : null,
      entitySlug: entitySlug || null,
      sessionId,
      ipAddress,
      userAgent,
      referrer,
      date: today,
      metadata: metadata || null,
    });

    // Update daily stats (for post/category views)
    if (['post_view', 'category_view', 'page_view'].includes(eventType)) {
      await DailyStats.findOneAndUpdate(
        {
          date: today,
          entityType: entityType as 'post' | 'category' | 'page',
          entityId: entityId && Types.ObjectId.isValid(entityId) ? new Types.ObjectId(entityId) : null,
        },
        {
          $inc: {
            totalViews: 1,
            uniqueViews: isUniqueView ? 1 : 0,
          },
          $setOnInsert: { entitySlug: entitySlug || null },
        },
        { upsert: true }
      );

      // Update viewCount on entity
      if (entityId && Types.ObjectId.isValid(entityId)) {
        if (entityType === 'post') {
          await Post.updateOne({ _id: entityId }, { $inc: { viewCount: 1 } });
        } else if (entityType === 'category') {
          await Category.updateOne({ _id: entityId }, { $inc: { viewCount: 1 } });
        }
      }
    }

    res.json({ success: true, tracked: true, unique: isUniqueView });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ success: false, error: 'Failed to track event' });
  }
});

/**
 * @swagger
 * /public/stats/post/{id}:
 *   get:
 *     summary: Get public stats for a post
 *     tags: [Public API]
 */
router.get('/stats/post/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid post ID' });
    }

    const post = await Post.findById(id).select('viewCount').lean();
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Get FAQ clicks count
    const faqClicks = await AnalyticsEvent.countDocuments({
      eventType: 'faq_click',
      entityId: new Types.ObjectId(id),
    });

    // Get TOC clicks count
    const tocClicks = await AnalyticsEvent.countDocuments({
      eventType: 'toc_click',
      entityId: new Types.ObjectId(id),
    });

    res.json({
      success: true,
      data: {
        viewCount: post.viewCount || 0,
        faqClicks,
        tocClicks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

export default router;
