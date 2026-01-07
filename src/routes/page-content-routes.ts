import { Router } from 'express';
import { body, param } from 'express-validator';
import { pageContentController } from '../controllers';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { sanitizeJsonHtml } from '../utils/security.util';

const router = Router();

/**
 * Validation middleware for PageContent
 */
const pageContentValidation = {
  create: [
    body('pageSlug')
      .trim()
      .notEmpty().withMessage('pageSlug is required')
      .matches(/^[a-z0-9-]+$/).withMessage('pageSlug must contain only lowercase letters, numbers, and hyphens')
      .isLength({ min: 2, max: 255 }).withMessage('pageSlug must be 2-255 characters'),
    body('pageName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 }).withMessage('pageName must be 1-255 characters'),
    body('content')
      .notEmpty().withMessage('content is required')
      .isObject().withMessage('content must be an object')
      .customSanitizer((value) => sanitizeJsonHtml(value, 'rich')), // Sanitize HTML in JSON
  ],
  update: [
    param('pageSlug')
      .trim()
      .notEmpty().withMessage('pageSlug is required'),
    body('pageName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 }).withMessage('pageName must be 1-255 characters'),
    body('content')
      .optional()
      .isObject().withMessage('content must be an object')
      .customSanitizer((value) => value ? sanitizeJsonHtml(value, 'rich') : value),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean'),
  ],
  slug: [
    param('pageSlug')
      .trim()
      .notEmpty().withMessage('pageSlug is required'),
  ],
};

/**
 * @swagger
 * /page-content:
 *   get:
 *     summary: Lấy tất cả pages
 *     tags: [PageContent]
 *     parameters:
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Chỉ lấy pages đang active
 *     responses:
 *       200:
 *         description: Danh sách tất cả pages
 */
router.get('/', pageContentController.getAll);

/**
 * @swagger
 * /page-content/{pageSlug}:
 *   get:
 *     summary: Lấy page theo slug - trả về raw JSON content
 *     tags: [PageContent]
 *     parameters:
 *       - in: path
 *         name: pageSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của trang
 *     responses:
 *       200:
 *         description: Thông tin page với raw JSON content
 *       404:
 *         description: Không tìm thấy trang
 */
router.get('/:pageSlug', validate(pageContentValidation.slug), pageContentController.getBySlug);

// ==================== PROTECTED ROUTES (require auth) ====================

/**
 * @swagger
 * /page-content/import:
 *   post:
 *     summary: Import page từ JSON - lưu nguyên cục JSON
 *     tags: [PageContent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageSlug
 *               - content
 *             properties:
 *               pageSlug:
 *                 type: string
 *                 example: "thiet-ke-website-doanh-nghiep"
 *               pageName:
 *                 type: string
 *                 example: "Thiết kế website doanh nghiệp"
 *               content:
 *                 type: object
 *                 description: Raw JSON content từ file
 *     responses:
 *       200:
 *         description: Import thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - không có quyền
 */
router.post(
  '/import',
  requireAuth,
  requirePermission('content:import'),
  validate(pageContentValidation.create),
  pageContentController.importFromJson
);

/**
 * @swagger
 * /page-content:
 *   post:
 *     summary: Tạo page mới
 *     tags: [PageContent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageSlug
 *               - content
 *             properties:
 *               pageSlug:
 *                 type: string
 *               pageName:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       201:
 *         description: Page đã được tạo
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  requireAuth,
  requirePermission('content:create'),
  validate(pageContentValidation.create),
  pageContentController.create
);

/**
 * @swagger
 * /page-content/{pageSlug}/upsert:
 *   put:
 *     summary: Upsert page (tạo mới hoặc cập nhật)
 *     tags: [PageContent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageSlug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               pageName:
 *                 type: string
 *               content:
 *                 type: object
 *     responses:
 *       200:
 *         description: Page đã được upsert
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  '/:pageSlug/upsert',
  requireAuth,
  requirePermission('content:edit'),
  validate(pageContentValidation.update),
  pageContentController.upsert
);

/**
 * @swagger
 * /page-content/{pageSlug}/toggle-active:
 *   patch:
 *     summary: Bật/tắt trạng thái active của page
 *     tags: [PageContent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái đã được cập nhật
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/:pageSlug/toggle-active',
  requireAuth,
  requirePermission('content:edit'),
  validate(pageContentValidation.slug),
  pageContentController.toggleActive
);

/**
 * @swagger
 * /page-content/{pageSlug}:
 *   put:
 *     summary: Cập nhật page
 *     tags: [PageContent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageSlug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageName:
 *                 type: string
 *               content:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Page đã được cập nhật
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Không tìm thấy page
 */
router.put(
  '/:pageSlug',
  requireAuth,
  requirePermission('content:edit'),
  validate(pageContentValidation.update),
  pageContentController.update
);

/**
 * @swagger
 * /page-content/{pageSlug}:
 *   delete:
 *     summary: Xóa page
 *     tags: [PageContent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page đã được xóa
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Không tìm thấy page
 */
router.delete(
  '/:pageSlug',
  requireAuth,
  requirePermission('content:delete'),
  validate(pageContentValidation.slug),
  pageContentController.delete
);

export default router;
