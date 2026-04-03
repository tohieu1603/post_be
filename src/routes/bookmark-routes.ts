import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import { Bookmark } from '../models/bookmark.model';
import { Post } from '../models/post.model';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All bookmark routes require authentication
router.use(requireAuth);

/**
 * GET /api/bookmarks
 * Get current user's bookmarks with populated post data
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      Bookmark.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'postId',
          select: 'title slug excerpt coverImage publishedAt viewCount category author',
          populate: [
            { path: 'category', select: 'name slug' },
            { path: 'authorInfo', select: 'name slug avatarUrl' },
          ],
        })
        .lean(),
      Bookmark.countDocuments({ userId }),
    ]);

    // Filter out bookmarks where post was deleted
    const validBookmarks = bookmarks.filter((b) => b.postId != null);

    res.json({
      success: true,
      data: validBookmarks.map((b) => ({
        id: b._id,
        post: b.postId,
        savedAt: b.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookmarks' });
  }
});

/**
 * POST /api/bookmarks
 * Bookmark a post
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.body;

    if (!postId || !Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, error: 'Valid postId is required' });
    }

    // Verify post exists and is published
    const post = await Post.findOne({ _id: postId, status: 'published' }).lean();
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Upsert to avoid duplicate errors
    const bookmark = await Bookmark.findOneAndUpdate(
      { userId, postId },
      { userId, postId },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, data: { id: bookmark._id, postId, savedAt: bookmark.createdAt } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to bookmark post' });
  }
});

/**
 * DELETE /api/bookmarks/:postId
 * Remove a bookmark
 */
router.delete('/:postId', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, error: 'Valid postId is required' });
    }

    const result = await Bookmark.deleteOne({ userId, postId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Bookmark not found' });
    }

    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove bookmark' });
  }
});

/**
 * GET /api/bookmarks/check/:postId
 * Check if a post is bookmarked
 */
router.get('/check/:postId', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, error: 'Valid postId is required' });
    }

    const exists = await Bookmark.exists({ userId, postId });
    res.json({ success: true, data: { bookmarked: !!exists } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to check bookmark' });
  }
});

export default router;
