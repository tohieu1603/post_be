import { Router } from 'express';
import { pageContentController } from '../controllers';

const router = Router();

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
 * /page-content/import:
 *   post:
 *     summary: Import page từ JSON - lưu nguyên cục JSON
 *     tags: [PageContent]
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
 */
router.post('/import', pageContentController.importFromJson);

/**
 * @swagger
 * /page-content:
 *   post:
 *     summary: Tạo page mới
 *     tags: [PageContent]
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
 */
router.post('/', pageContentController.create);

/**
 * @swagger
 * /page-content/{pageSlug}/upsert:
 *   put:
 *     summary: Upsert page (tạo mới hoặc cập nhật)
 *     tags: [PageContent]
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
 */
router.put('/:pageSlug/upsert', pageContentController.upsert);

/**
 * @swagger
 * /page-content/{pageSlug}/toggle-active:
 *   patch:
 *     summary: Bật/tắt trạng thái active của page
 *     tags: [PageContent]
 *     parameters:
 *       - in: path
 *         name: pageSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái đã được cập nhật
 */
router.patch('/:pageSlug/toggle-active', pageContentController.toggleActive);

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
router.get('/:pageSlug', pageContentController.getBySlug);

/**
 * @swagger
 * /page-content/{pageSlug}:
 *   put:
 *     summary: Cập nhật page
 *     tags: [PageContent]
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
 *       404:
 *         description: Không tìm thấy page
 */
router.put('/:pageSlug', pageContentController.update);

/**
 * @swagger
 * /page-content/{pageSlug}:
 *   delete:
 *     summary: Xóa page
 *     tags: [PageContent]
 *     parameters:
 *       - in: path
 *         name: pageSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page đã được xóa
 *       404:
 *         description: Không tìm thấy page
 */
router.delete('/:pageSlug', pageContentController.delete);

export default router;
