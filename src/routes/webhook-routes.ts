import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  publishArticle,
  updateArticle,
  unpublishArticle,
  batchPublish,
  syncCategories,
  syncAuthors,
} from '../controllers/webhook-controller';
import { webhookAuth } from '../middleware/webhook-auth.middleware';

const router = Router();

// All webhook routes require CMS API key authentication
router.use(webhookAuth);

// Rate limiters per API-CONTRACT.md
const articleLimiter = rateLimit({
  windowMs: 60_000, max: 100,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Vượt rate limit, thử lại sau' } },
  standardHeaders: true, legacyHeaders: false,
});
const batchLimiter = rateLimit({
  windowMs: 60_000, max: 10,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Vượt rate limit, thử lại sau' } },
  standardHeaders: true, legacyHeaders: false,
});

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: CMS integration webhook endpoints
 */

/**
 * @swagger
 * /webhook/article:
 *   post:
 *     tags: [Webhook]
 *     summary: Publish a new article from CMS
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - external_id
 *               - type
 *               - language
 *               - title
 *               - excerpt
 *               - content
 *               - image
 *               - category
 *               - author
 *               - published_at
 *     responses:
 *       201:
 *         description: Article published successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate article
 */
router.post('/article', articleLimiter, publishArticle);

/**
 * @swagger
 * /webhook/article:
 *   put:
 *     tags: [Webhook]
 *     summary: Update an existing article from CMS
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - external_id
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.put('/article', articleLimiter, updateArticle);

/**
 * @swagger
 * /webhook/article:
 *   delete:
 *     tags: [Webhook]
 *     summary: Unpublish (archive) an article
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - external_id
 *             properties:
 *               external_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article unpublished successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.delete('/article', articleLimiter, unpublishArticle);

/**
 * @swagger
 * /webhook/articles/batch:
 *   post:
 *     tags: [Webhook]
 *     summary: Batch publish up to 50 articles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - articles
 *             properties:
 *               articles:
 *                 type: array
 *                 maxItems: 50
 *     responses:
 *       200:
 *         description: Batch results returned
 *       400:
 *         description: Validation error or batch too large
 *       401:
 *         description: Unauthorized
 */
router.post('/articles/batch', batchLimiter, batchPublish);

/**
 * @swagger
 * /webhook/category:
 *   post:
 *     tags: [Webhook]
 *     summary: Sync categories from CMS
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categories
 *             properties:
 *               categories:
 *                 type: array
 *     responses:
 *       200:
 *         description: Categories synced successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/category', batchLimiter, syncCategories);

/**
 * @swagger
 * /webhook/author:
 *   post:
 *     tags: [Webhook]
 *     summary: Sync authors from CMS
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authors
 *             properties:
 *               authors:
 *                 type: array
 *     responses:
 *       200:
 *         description: Authors synced successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/author', batchLimiter, syncAuthors);

export default router;
