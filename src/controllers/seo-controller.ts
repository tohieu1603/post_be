import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';
import { successResponse, errorResponse } from '../utils/response.util';

const settingsService = new SettingsService();

// === Redirects ===

/**
 * @swagger
 * /api/seo/redirects:
 *   get:
 *     summary: Get all redirects
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: List of redirects
 */
export const getAllRedirects = async (req: Request, res: Response) => {
  try {
    const redirects = await settingsService.getAllRedirects();
    res.json(redirects);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch redirects';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/seo/redirects/{id}:
 *   get:
 *     summary: Get redirect by ID
 *     tags: [SEO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Redirect found
 */
export const getRedirectById = async (req: Request, res: Response) => {
  try {
    const redirect = await settingsService.getRedirectById(req.params.id);
    if (!redirect) {
      return res.status(404).json({ error: 'Redirect not found' });
    }
    res.json(redirect);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch redirect';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/seo/redirects:
 *   post:
 *     summary: Create a redirect
 *     tags: [SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromPath
 *               - toPath
 *             properties:
 *               fromPath:
 *                 type: string
 *               toPath:
 *                 type: string
 *               statusCode:
 *                 type: integer
 *                 enum: [301, 302, 307, 308]
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Redirect created
 */
export const createRedirect = async (req: Request, res: Response) => {
  try {
    const redirect = await settingsService.createRedirect(req.body);
    res.status(201).json(redirect);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create redirect';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/seo/redirects/{id}:
 *   put:
 *     summary: Update a redirect
 *     tags: [SEO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromPath:
 *                 type: string
 *               toPath:
 *                 type: string
 *               statusCode:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Redirect updated
 */
export const updateRedirect = async (req: Request, res: Response) => {
  try {
    const redirect = await settingsService.updateRedirect(req.params.id, req.body);
    res.json(redirect);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update redirect';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/seo/redirects/{id}:
 *   delete:
 *     summary: Delete a redirect
 *     tags: [SEO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Redirect deleted
 */
export const deleteRedirect = async (req: Request, res: Response) => {
  try {
    await settingsService.deleteRedirect(req.params.id);
    successResponse(res, { message: 'Redirect deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete redirect';
    errorResponse(res, message, 500);
  }
};

// === Robots.txt ===

/**
 * @swagger
 * /api/seo/robots:
 *   get:
 *     summary: Get robots.txt content
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: Robots.txt content
 */
export const getRobotsTxt = async (req: Request, res: Response) => {
  try {
    const content = await settingsService.getRobotsTxt();
    res.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch robots.txt';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/seo/robots:
 *   put:
 *     summary: Update robots.txt content
 *     tags: [SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Robots.txt updated
 */
export const updateRobotsTxt = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (content === undefined) {
      return res.status(400).json({ error: 'content is required' });
    }

    await settingsService.updateRobotsTxt(content);
    successResponse(res, { message: 'Robots.txt updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update robots.txt';
    errorResponse(res, message, 500);
  }
};

// === Sitemap Config ===

/**
 * @swagger
 * /api/seo/sitemap-config:
 *   get:
 *     summary: Get sitemap configuration
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: Sitemap config
 */
export const getSitemapConfig = async (req: Request, res: Response) => {
  try {
    const config = await settingsService.getSitemapConfig();
    res.json(config);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sitemap config';
    errorResponse(res, message, 500);
  }
};

/**
 * @swagger
 * /api/seo/sitemap-config:
 *   put:
 *     summary: Update sitemap configuration
 *     tags: [SEO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *               excludePatterns:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sitemap config updated
 */
export const updateSitemapConfig = async (req: Request, res: Response) => {
  try {
    await settingsService.updateSitemapConfig(req.body);
    successResponse(res, { message: 'Sitemap config updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update sitemap config';
    errorResponse(res, message, 500);
  }
};
