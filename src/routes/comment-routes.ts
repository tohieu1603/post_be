import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import { Comment } from '../models/comment.model';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// ─── Rate limiting: max 5 comments per user per minute ───────────────────────
// Simple in-memory map; keyed by userId → array of timestamps
const rateLimitMap = new Map<string, number[]>();

// Clean up entries older than 1 minute to prevent unbounded memory growth
function pruneRateLimitMap() {
  const cutoff = Date.now() - 60_000;
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, fresh);
    }
  }
}

function isRateLimited(userId: string): boolean {
  pruneRateLimitMap();
  const now = Date.now();
  const cutoff = now - 60_000;
  const timestamps = (rateLimitMap.get(userId) ?? []).filter((t) => t > cutoff);
  if (timestamps.length >= 5) return true;
  rateLimitMap.set(userId, [...timestamps, now]);
  return false;
}

// ─── Duplicate detection: same user, same content within 5 minutes ───────────
// Keyed by `${userId}:${content}` → last posted timestamp
const recentPostMap = new Map<string, number>();

function isDuplicate(userId: string, content: string): boolean {
  const key = `${userId}:${content}`;
  const last = recentPostMap.get(key);
  if (last && Date.now() - last < 5 * 60_000) return true;
  recentPostMap.set(key, Date.now());
  // Evict entries older than 5 min periodically (keep map small)
  if (recentPostMap.size > 500) {
    const cutoff = Date.now() - 5 * 60_000;
    for (const [k, ts] of recentPostMap.entries()) {
      if (ts < cutoff) recentPostMap.delete(k);
    }
  }
  return false;
}

/**
 * Strip ALL HTML tags and decode common encoded entities to prevent XSS.
 * Enhanced to handle double-encoded and entity-encoded payloads like &lt;script&gt;
 */
function sanitizeContent(input: string): string {
  let s = input;
  // Decode common HTML entities so encoded tags are also stripped
  s = s
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  // Strip any HTML tags (including now-decoded ones)
  s = s.replace(/<[^>]*>/g, '');
  // Collapse multiple blank lines to at most two
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

/**
 * GET /api/comments/:postId
 * Get top-level comments with nested replies (max 2 levels). Public with optional auth.
 */
router.get('/:postId', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, error: 'Valid postId is required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [topLevelComments, total] = await Promise.all([
      Comment.find({ postId, parentId: null })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'userId', select: 'name avatar' })
        .lean(),
      Comment.countDocuments({ postId, parentId: null }),
    ]);

    // Fetch replies for each top-level comment (1 level deep)
    const commentIds = topLevelComments.map((c) => c._id);
    const replies = await Comment.find({ postId, parentId: { $in: commentIds } })
      .sort({ createdAt: 1 })
      .populate({ path: 'userId', select: 'name avatar' })
      .lean();

    // Group replies by parentId
    const repliesByParent = new Map<string, typeof replies>();
    for (const reply of replies) {
      const key = reply.parentId!.toString();
      if (!repliesByParent.has(key)) repliesByParent.set(key, []);
      repliesByParent.get(key)!.push(reply);
    }

    const formatComment = (c: (typeof topLevelComments)[number]) => ({
      _id: c._id,
      content: c.content,
      user: c.userId,
      likes: c.likes,
      likesCount: c.likesCount,
      isEdited: c.isEdited,
      isDeleted: c.isDeleted,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    });

    const data = topLevelComments.map((c) => ({
      ...formatComment(c),
      replies: (repliesByParent.get(c._id.toString()) || []).map(formatComment),
    }));

    res.json({
      success: true,
      data,
      pagination: { page, limit, total },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch comments' });
  }
});

/**
 * GET /api/comments/:postId/count
 * Get total comment count for a post (public).
 */
router.get('/:postId/count', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, error: 'Valid postId is required' });
    }

    const count = await Comment.countDocuments({ postId, isDeleted: false });
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch comment count' });
  }
});

/**
 * POST /api/comments
 * Create a new comment or reply (requireAuth).
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { postId, content, parentId } = req.body;

    if (!postId || !Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, error: 'Valid postId is required' });
    }

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const sanitized = sanitizeContent(content);

    // Min/max length validation (after sanitization)
    if (!sanitized || sanitized.length < 1) {
      return res.status(400).json({ success: false, error: 'Content cannot be empty' });
    }
    if (sanitized.length > 2000) {
      return res.status(400).json({ success: false, error: 'Content exceeds 2000 characters' });
    }

    // Rate limit: max 5 comments per user per minute
    if (isRateLimited(userId)) {
      return res.status(429).json({ success: false, error: 'Bạn đang bình luận quá nhanh. Vui lòng chờ một chút.' });
    }

    // Duplicate detection: same content within 5 minutes
    if (isDuplicate(userId, sanitized)) {
      return res.status(400).json({ success: false, error: 'Bạn vừa gửi bình luận giống hệt này. Vui lòng không gửi lại.' });
    }

    // Validate parentId if provided
    if (parentId) {
      if (!Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ success: false, error: 'Valid parentId is required' });
      }
      const parent = await Comment.findOne({ _id: parentId, postId, isDeleted: false }).lean();
      if (!parent) {
        return res.status(404).json({ success: false, error: 'Parent comment not found' });
      }
    }

    const comment = await Comment.create({
      postId,
      userId,
      parentId: parentId || null,
      content: sanitized,
    });

    await comment.populate({ path: 'userId', select: 'name avatar' });

    res.status(201).json({
      success: true,
      data: {
        _id: comment._id,
        content: comment.content,
        user: comment.userId,
        likes: comment.likes,
        likesCount: comment.likesCount,
        isEdited: comment.isEdited,
        isDeleted: comment.isDeleted,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create comment' });
  }
});

/**
 * PUT /api/comments/:id
 * Edit own comment (requireAuth). Sets isEdited=true.
 */
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { content } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Valid comment id is required' });
    }

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const sanitized = sanitizeContent(content);
    if (!sanitized || sanitized.length < 1) {
      return res.status(400).json({ success: false, error: 'Content cannot be empty' });
    }
    if (sanitized.length > 2000) {
      return res.status(400).json({ success: false, error: 'Content exceeds 2000 characters' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this comment' });
    }

    if (comment.isDeleted) {
      return res.status(400).json({ success: false, error: 'Cannot edit a deleted comment' });
    }

    comment.content = sanitized;
    comment.isEdited = true;
    await comment.save();

    await comment.populate({ path: 'userId', select: 'name avatar' });

    res.json({
      success: true,
      data: {
        _id: comment._id,
        content: comment.content,
        user: comment.userId,
        likes: comment.likes,
        likesCount: comment.likesCount,
        isEdited: comment.isEdited,
        isDeleted: comment.isDeleted,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update comment' });
  }
});

/**
 * DELETE /api/comments/:id
 * Soft delete own comment (requireAuth). Admin can delete any.
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Valid comment id is required' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    const isOwner = comment.userId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this comment' });
    }

    comment.isDeleted = true;
    comment.content = 'Bình luận đã bị xóa';
    await comment.save();

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete comment' });
  }
});

/**
 * POST /api/comments/:id/like
 * Toggle like on a comment (requireAuth).
 */
router.post('/:id/like', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Valid comment id is required' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    if (comment.isDeleted) {
      return res.status(400).json({ success: false, error: 'Cannot like a deleted comment' });
    }

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = comment.likes.findIndex((uid) => uid.equals(userObjectId));

    let liked: boolean;
    if (likeIndex === -1) {
      comment.likes.push(userObjectId);
      comment.likesCount = comment.likes.length;
      liked = true;
    } else {
      comment.likes.splice(likeIndex, 1);
      comment.likesCount = comment.likes.length;
      liked = false;
    }

    await comment.save();

    res.json({ success: true, data: { liked, likesCount: comment.likesCount } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to toggle like' });
  }
});

export default router;
