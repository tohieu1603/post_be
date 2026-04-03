/**
 * Webhook Controller
 * Thin handlers that delegate all business logic to webhookService.
 * All routes require the CMS API key (applied at router level).
 */

import { Request, Response } from 'express';
import { webhookService } from '../services/webhook.service';

// ─── Shared error handler ──────────────────────────────────────────────────

function handleWebhookError(res: Response, error: any): Response {
  const code: string = error.code || 'INTERNAL_ERROR';
  const statusMap: Record<string, number> = {
    VALIDATION_ERROR: 400,
    DUPLICATE: 409,
    NOT_FOUND: 404,
  };
  const status = statusMap[code] ?? 500;
  return res.status(status).json({
    success: false,
    error: {
      code,
      message: error.message || 'Lỗi server',
      ...(error.details ? { details: error.details } : {}),
    },
  });
}

// ─── Handlers ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/webhook/article:
 *   post:
 *     summary: Publish a new article from CMS
 *     tags: [Webhook]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [external_id, type, language, title, content, image, category, author]
 *             properties:
 *               external_id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [news, opinion, analysis, factcheck, liveblog, explainer]
 *               language:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: object
 *                 properties:
 *                   url: { type: string }
 *                   alt: { type: string }
 *               category:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 *               author:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 *     responses:
 *       201:
 *         description: Article published successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Article already exists
 */
export const publishArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    // API-CONTRACT: { action: "publish", article: {...} } or flat article
    const article = req.body.article || req.body;
    const result = await webhookService.publishArticle(article);
    return res.status(201).json(result);
  } catch (error: any) {
    return handleWebhookError(res, error);
  }
};

/**
 * @swagger
 * /api/webhook/article:
 *   put:
 *     summary: Update an existing article by external_id
 *     tags: [Webhook]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [external_id]
 *             properties:
 *               external_id:
 *                 type: string
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
export const updateArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    // API-CONTRACT: { action: "update", article: {...} } or flat article
    const article = req.body.article || req.body;
    const result = await webhookService.updateArticle(article);
    return res.status(200).json(result);
  } catch (error: any) {
    return handleWebhookError(res, error);
  }
};

/**
 * @swagger
 * /api/webhook/article:
 *   delete:
 *     summary: Unpublish (archive) an article by external_id
 *     tags: [Webhook]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [external_id]
 *             properties:
 *               external_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article archived successfully
 *       400:
 *         description: Missing external_id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
export const unpublishArticle = async (req: Request, res: Response): Promise<Response> => {
  try {
    // API-CONTRACT: { action: "unpublish", external_id: "..." }
    const external_id = req.body.external_id;
    if (!external_id) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Thiếu trường bắt buộc', details: [{ field: 'external_id', message: 'external_id là bắt buộc' }] },
      });
    }
    const result = await webhookService.unpublishArticle(external_id);
    return res.status(200).json(result);
  } catch (error: any) {
    return handleWebhookError(res, error);
  }
};

/**
 * @swagger
 * /api/webhook/articles/batch:
 *   post:
 *     summary: Batch publish up to 50 articles
 *     tags: [Webhook]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [articles]
 *             properties:
 *               articles:
 *                 type: array
 *                 maxItems: 50
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Batch result with per-article success/failure
 *       400:
 *         description: Validation error (empty array or > 50 items)
 *       401:
 *         description: Unauthorized
 */
export const batchPublish = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { articles } = req.body;
    const result = await webhookService.batchPublish(articles);
    return res.status(201).json(result);
  } catch (error: any) {
    return handleWebhookError(res, error);
  }
};

/**
 * @swagger
 * /api/webhook/category:
 *   post:
 *     summary: Sync (upsert) categories from CMS
 *     tags: [Webhook]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categories]
 *             properties:
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [id, name]
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *     responses:
 *       200:
 *         description: Categories synced successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export const syncCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { categories } = req.body;
    const result = await webhookService.syncCategories(categories);
    return res.status(200).json(result);
  } catch (error: any) {
    return handleWebhookError(res, error);
  }
};

/**
 * @swagger
 * /api/webhook/author:
 *   post:
 *     summary: Sync (upsert) authors from CMS
 *     tags: [Webhook]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [authors]
 *             properties:
 *               authors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [id, name]
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *     responses:
 *       200:
 *         description: Authors synced successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export const syncAuthors = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { authors } = req.body;
    const result = await webhookService.syncAuthors(authors);
    return res.status(200).json(result);
  } catch (error: any) {
    return handleWebhookError(res, error);
  }
};
