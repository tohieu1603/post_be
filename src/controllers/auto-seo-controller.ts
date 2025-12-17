/**
 * Auto SEO Controller
 * Handles SEO analysis, indexing, keyword tracking, and AI suggestions
 */

import { Request, Response } from 'express';
import { autoSeoService } from '../services/auto-seo.service';
import { googleSeoApiService } from '../services/google-seo-api.service';
import { successResponse, errorResponse } from '../utils/response.util';

// === SEO Analysis ===

/**
 * @swagger
 * /api/auto-seo/analyze/{postId}:
 *   post:
 *     summary: Analyze a post for SEO and generate scores/suggestions
 *     tags: [Auto SEO]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               focusKeyword:
 *                 type: string
 *                 description: Optional focus keyword for analysis
 *     responses:
 *       200:
 *         description: SEO analysis result
 */
export const analyzePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { focusKeyword } = req.body;

    const result = await autoSeoService.analyzePost(postId, focusKeyword);

    if (!result.success) {
      return errorResponse(res, result.error || 'Analysis failed', 400);
    }

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to analyze post';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/score/{postId}:
 *   get:
 *     summary: Get saved SEO score for a post
 *     tags: [Auto SEO]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SEO score data
 */
export const getSeoScore = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const score = await autoSeoService.getSeoScore(postId);

    if (!score) {
      return res.status(404).json({ error: 'SEO score not found' });
    }

    res.json(score);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch SEO score';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/scores:
 *   get:
 *     summary: Get SEO scores for multiple posts
 *     tags: [Auto SEO]
 *     parameters:
 *       - in: query
 *         name: postIds
 *         schema:
 *           type: string
 *         description: Comma-separated post IDs
 *     responses:
 *       200:
 *         description: SEO scores list
 */
export const getSeoScores = async (req: Request, res: Response) => {
  try {
    const { postIds } = req.query;

    if (!postIds || typeof postIds !== 'string') {
      return res.status(400).json({ error: 'postIds query parameter required' });
    }

    const ids = postIds.split(',').map((id) => id.trim());
    const scores = await Promise.all(ids.map((id) => autoSeoService.getSeoScore(id)));

    res.json(scores.filter(Boolean));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch SEO scores';
    errorResponse(res, message, 500);
  }
};

// === Google Indexing ===

/**
 * @swagger
 * /api/auto-seo/submit-index:
 *   post:
 *     summary: Submit URL to Google Indexing API
 *     tags: [Auto SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [URL_UPDATED, URL_DELETED]
 *     responses:
 *       200:
 *         description: Indexing submission result
 */
export const submitUrlForIndexing = async (req: Request, res: Response) => {
  try {
    const { url, type = 'URL_UPDATED' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    const result = await googleSeoApiService.submitUrlForIndexing(url, type);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit URL';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/inspect-url:
 *   post:
 *     summary: Inspect URL via Google Search Console
 *     tags: [Auto SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL inspection result
 */
export const inspectUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    const result = await googleSeoApiService.inspectUrl(url);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to inspect URL';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/index-status:
 *   get:
 *     summary: Get indexing status for URLs
 *     tags: [Auto SEO]
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: URL to check status for
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, submitted, indexed, not_indexed, error, removed]
 *     responses:
 *       200:
 *         description: Index status list
 */
export const getIndexStatus = async (req: Request, res: Response) => {
  try {
    const { url, status } = req.query;

    if (url && typeof url === 'string') {
      const result = await autoSeoService.getIndexStatus(url);
      return res.json(result || { url, status: 'unknown' });
    }

    // Get all statuses with optional filter
    const statuses = await autoSeoService.getAllIndexStatuses(status as string);
    res.json(statuses);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch index status';
    errorResponse(res, message, 500);
  }
};

// === PageSpeed Insights ===

/**
 * @swagger
 * /api/auto-seo/pagespeed:
 *   post:
 *     summary: Get PageSpeed Insights for a URL
 *     tags: [Auto SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *               strategy:
 *                 type: string
 *                 enum: [mobile, desktop]
 *     responses:
 *       200:
 *         description: PageSpeed results
 */
export const getPageSpeedInsights = async (req: Request, res: Response) => {
  try {
    const { url, strategy = 'mobile' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    const result = await googleSeoApiService.getPageSpeedInsights(url, strategy);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get PageSpeed insights';
    errorResponse(res, message, 500);
  }
};

// === Keywords ===

/**
 * @swagger
 * /api/auto-seo/keywords:
 *   get:
 *     summary: Get tracked keywords
 *     tags: [Auto SEO]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Keywords list
 */
export const getKeywords = async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;
    const keywords = await autoSeoService.getTrackedKeywords(postId as string);
    res.json(keywords);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch keywords';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/keywords:
 *   post:
 *     summary: Track a new keyword
 *     tags: [Auto SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keyword
 *             properties:
 *               keyword:
 *                 type: string
 *               targetUrl:
 *                 type: string
 *               postId:
 *                 type: string
 *               searchVolume:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Keyword tracked
 */
export const trackKeyword = async (req: Request, res: Response) => {
  try {
    const { keyword, targetUrl, postId, searchVolume } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: 'keyword is required' });
    }

    const result = await autoSeoService.trackKeyword({
      keyword,
      targetUrl,
      postId,
      searchVolume,
    });

    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to track keyword';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/keywords/{id}:
 *   delete:
 *     summary: Delete a tracked keyword
 *     tags: [Auto SEO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Keyword deleted
 */
export const deleteKeyword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await autoSeoService.deleteKeyword(id);
    successResponse(res, { message: 'Keyword deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete keyword';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/keywords/sync:
 *   post:
 *     summary: Sync keywords from Google Search Console
 *     tags: [Auto SEO]
 *     responses:
 *       200:
 *         description: Sync result
 */
export const syncKeywords = async (req: Request, res: Response) => {
  try {
    const result = await googleSeoApiService.syncKeywordRankings();
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync keywords';
    errorResponse(res, message, 500);
  }
};

// === Search Analytics ===

/**
 * @swagger
 * /api/auto-seo/search-analytics:
 *   post:
 *     summary: Get search analytics from Google Search Console
 *     tags: [Auto SEO]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 description: YYYY-MM-DD format
 *               endDate:
 *                 type: string
 *               dimensions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [query, page, country, device, date]
 *               rowLimit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Search analytics data
 */
export const getSearchAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, dimensions, rowLimit } = req.body;

    // Default to last 7 days if not specified
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const result = await googleSeoApiService.getSearchAnalytics({
      startDate: start,
      endDate: end,
      dimensions: dimensions || ['query', 'page'],
      rowLimit: rowLimit || 100,
    });

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get search analytics';
    errorResponse(res, message, 500);
  }
};

// === SEO Logs ===

/**
 * @swagger
 * /api/auto-seo/logs:
 *   get:
 *     summary: Get SEO activity logs
 *     tags: [Auto SEO]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SEO logs list
 */
export const getSeoLogs = async (req: Request, res: Response) => {
  try {
    const { limit = 100, action, status } = req.query;

    const logs = await autoSeoService.getRecentLogs(
      Number(limit),
      action as string,
      status as string
    );

    res.json(logs);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch SEO logs';
    errorResponse(res, message, 500);
  }
};

// === Dashboard Stats ===

/**
 * @swagger
 * /api/auto-seo/dashboard:
 *   get:
 *     summary: Get SEO dashboard stats
 *     tags: [Auto SEO]
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await autoSeoService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
    errorResponse(res, message, 500);
  }
};

// === Bulk Operations ===

/**
 * @swagger
 * /api/auto-seo/bulk-analyze:
 *   post:
 *     summary: Analyze multiple posts for SEO
 *     tags: [Auto SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postIds
 *             properties:
 *               postIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bulk analysis results
 */
export const bulkAnalyze = async (req: Request, res: Response) => {
  try {
    const { postIds } = req.body;

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({ error: 'postIds array is required' });
    }

    // Limit to 10 posts at a time
    const idsToProcess = postIds.slice(0, 10);

    const results = await Promise.all(
      idsToProcess.map(async (postId) => {
        try {
          return await autoSeoService.analyzePost(postId);
        } catch (e) {
          return { postId, success: false, error: (e as Error).message };
        }
      })
    );

    res.json({
      processed: results.length,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to bulk analyze';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/auto-seo/bulk-submit:
 *   post:
 *     summary: Submit multiple URLs for indexing
 *     tags: [Auto SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - urls
 *             properties:
 *               urls:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bulk submission results
 */
export const bulkSubmitForIndexing = async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'urls array is required' });
    }

    // Limit to 10 URLs at a time (Google API quotas)
    const urlsToProcess = urls.slice(0, 10);

    const results = await Promise.all(
      urlsToProcess.map(async (url) => {
        try {
          return await googleSeoApiService.submitUrlForIndexing(url);
        } catch (e) {
          return { url, success: false, error: (e as Error).message };
        }
      })
    );

    res.json({
      processed: results.length,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to bulk submit';
    errorResponse(res, message, 500);
  }
};
