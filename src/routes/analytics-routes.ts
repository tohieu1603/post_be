import { Router, Request, Response } from 'express';
import { AnalyticsEvent, DailyStats } from '../models/analytics.model';
import { Types } from 'mongoose';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

/**
 * @swagger
 * /analytics/post/{id}:
 *   get:
 *     summary: Get detailed analytics for a post (admin)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/post/:id', requirePermission('analytics:view'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid post ID' });
    }

    const entityId = new Types.ObjectId(id);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get event counts by type
    const eventCounts = await AnalyticsEvent.aggregate([
      {
        $match: {
          entityId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Transform to object
    const stats: Record<string, number> = {};
    eventCounts.forEach((e) => {
      stats[e._id] = e.count;
    });

    // Get daily views for chart
    const dailyViews = await DailyStats.find({
      entityId,
      entityType: 'post',
      date: { $gte: startDate },
    })
      .select('date totalViews uniqueViews')
      .sort({ date: 1 })
      .lean();

    // Get hourly distribution
    const hourlyDistribution = await AnalyticsEvent.aggregate([
      {
        $match: {
          entityId,
          eventType: 'post_view',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get referrers
    const referrers = await AnalyticsEvent.aggregate([
      {
        $match: {
          entityId,
          eventType: 'post_view',
          referrer: { $ne: null, $exists: true },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get FAQ click details
    const faqDetails = await AnalyticsEvent.aggregate([
      {
        $match: {
          entityId,
          eventType: 'faq_click',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$metadata.question',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get TOC click details
    const tocDetails = await AnalyticsEvent.aggregate([
      {
        $match: {
          entityId,
          eventType: 'toc_click',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { heading: '$metadata.heading', anchor: '$metadata.anchor' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get share counts
    const shareStats = await AnalyticsEvent.aggregate([
      {
        $match: {
          entityId,
          eventType: { $in: ['share_facebook', 'share_twitter', 'share_copy_link'] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get tag click details
    const tagClicks = await AnalyticsEvent.aggregate([
      {
        $match: {
          entityId,
          eventType: 'tag_click',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { slug: '$entitySlug', name: '$metadata.tagName' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get related post clicks
    const relatedPostClicks = await AnalyticsEvent.aggregate([
      {
        $match: {
          'metadata.fromPostId': id,
          eventType: 'related_post_click',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$entitySlug',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get category link clicks
    const categoryLinkClicks = await AnalyticsEvent.countDocuments({
      'metadata.postId': id,
      eventType: 'category_link_click',
      createdAt: { $gte: startDate },
    });

    res.json({
      success: true,
      data: {
        period: { days, startDate },
        summary: {
          totalViews: stats['post_view'] || 0,
          uniqueViews: dailyViews.reduce((sum, d) => sum + d.uniqueViews, 0),
          faqClicks: stats['faq_click'] || 0,
          tocClicks: stats['toc_click'] || 0,
          shareFacebook: shareStats.find((s) => s._id === 'share_facebook')?.count || 0,
          shareTwitter: shareStats.find((s) => s._id === 'share_twitter')?.count || 0,
          shareCopyLink: shareStats.find((s) => s._id === 'share_copy_link')?.count || 0,
          tagClicks: stats['tag_click'] || 0,
          relatedPostClicks: stats['related_post_click'] || 0,
          categoryLinkClicks,
        },
        dailyViews,
        hourlyDistribution: hourlyDistribution.map((h) => ({ hour: h._id, count: h.count })),
        referrers: referrers.map((r) => ({ url: r._id, count: r.count })),
        faqDetails: faqDetails.map((f) => ({ question: f._id, count: f.count })),
        tocDetails: tocDetails.map((t) => ({ heading: t._id.heading, anchor: t._id.anchor, count: t.count })),
        tagClicks: tagClicks.map((t) => ({ slug: t._id.slug, name: t._id.name, count: t.count })),
        relatedPostClicks: relatedPostClicks.map((r) => ({ slug: r._id, count: r.count })),
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to get analytics' });
  }
});

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get overall site analytics (admin)
 *     tags: [Analytics]
 */
router.get('/overview', requirePermission('analytics:view'), async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Total events by type
    const eventsByType = await AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Daily totals
    const dailyTotals = await DailyStats.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: '$date',
          totalViews: { $sum: '$totalViews' },
          uniqueViews: { $sum: '$uniqueViews' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top posts by views
    const topPosts = await DailyStats.aggregate([
      { $match: { entityType: 'post', date: { $gte: startDate } } },
      {
        $group: {
          _id: '$entityId',
          slug: { $first: '$entitySlug' },
          totalViews: { $sum: '$totalViews' },
        },
      },
      { $sort: { totalViews: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        period: { days, startDate },
        eventsByType: eventsByType.map((e) => ({ type: e._id, count: e.count })),
        dailyTotals: dailyTotals.map((d) => ({
          date: d._id,
          totalViews: d.totalViews,
          uniqueViews: d.uniqueViews,
        })),
        topPosts,
      },
    });
  } catch (error) {
    console.error('Overview analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to get overview' });
  }
});

export default router;
