import { Router } from 'express';
import { bannerController } from '../controllers/banner-controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, isValidObjectId } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Lấy danh sách banners (có phân trang)
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [hero, sidebar, category, footer]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: isAutoAssigned
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Danh sách banners
 */
router.get('/', bannerController.getAll);

/**
 * @swagger
 * /banners/trending:
 *   get:
 *     summary: Lấy banners trending (Top 10 posts theo viewCount)
 *     tags: [Banners]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách trending banners
 */
router.get('/trending', bannerController.getTrending);

/**
 * @swagger
 * /banners/statistics:
 *   get:
 *     summary: Lấy thống kê banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Thống kê banners
 */
router.get('/statistics', bannerController.getStatistics);

/**
 * @swagger
 * /banners/position/{position}:
 *   get:
 *     summary: Lấy banners theo vị trí (public)
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: position
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hero, sidebar, category, footer]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách banners active tại vị trí
 */
router.get('/position/:position', bannerController.getByPosition);

/**
 * @swagger
 * /banners/category/{categoryId}:
 *   get:
 *     summary: Lấy banners theo danh mục (public)
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách banners active trong danh mục
 */
router.get('/category/:categoryId', validate([isValidObjectId('categoryId')]), bannerController.getByCategory);

/**
 * @swagger
 * /banners/post/{postId}:
 *   get:
 *     summary: Lấy banner theo Post ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: Banner của post
 *       404:
 *         description: Không tìm thấy banner
 */
router.get('/post/:postId', validate([isValidObjectId('postId')]), bannerController.getByPostId);

/**
 * @swagger
 * /banners/post/{postId}/rank:
 *   get:
 *     summary: Lấy thứ hạng trending của post
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: topCount
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Thứ hạng trending
 */
router.get('/post/:postId/rank', validate([isValidObjectId('postId')]), bannerController.getPostRank);

/**
 * @swagger
 * /banners/{id}:
 *   get:
 *     summary: Lấy banner theo ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: Thông tin banner
 *       404:
 *         description: Không tìm thấy banner
 */
router.get('/:id', validate([isValidObjectId('id')]), bannerController.getById);

/**
 * @swagger
 * /banners:
 *   post:
 *     summary: Tạo banner thủ công
 *     tags: [Banners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               linkUrl:
 *                 type: string
 *               position:
 *                 type: string
 *                 enum: [hero, sidebar, category, footer]
 *               sortOrder:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Banner đã tạo
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Banner cho post này đã tồn tại
 */
router.post('/', requireAuth, requirePermission('banner:create'), bannerController.create);

/**
 * @swagger
 * /banners/sync-trending:
 *   post:
 *     summary: Đồng bộ banners với top trending posts
 *     tags: [Banners]
 *     description: |
 *       Tự động tạo/cập nhật banners cho Top N bài viết có viewCount cao nhất.
 *       Xóa banners của bài viết không còn trong top.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topCount:
 *                 type: integer
 *                 default: 10
 *                 description: Số lượng top posts
 *               position:
 *                 type: string
 *                 enum: [hero, sidebar, category, footer]
 *                 default: hero
 *               minViewCount:
 *                 type: integer
 *                 default: 0
 *                 description: Số view tối thiểu để vào top
 *     responses:
 *       200:
 *         description: Kết quả đồng bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 created:
 *                   type: integer
 *                 updated:
 *                   type: integer
 *                 removed:
 *                   type: integer
 *                 topPosts:
 *                   type: array
 */
router.post('/sync-trending', requireAuth, requirePermission('banner:sync'), bannerController.syncTrending);

/**
 * @swagger
 * /banners/{id}:
 *   put:
 *     summary: Cập nhật banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               linkUrl:
 *                 type: string
 *               position:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner đã cập nhật
 */
router.put('/:id', requireAuth, requirePermission('banner:edit'), validate([isValidObjectId('id')]), bannerController.update);

/**
 * @swagger
 * /banners/{id}:
 *   delete:
 *     summary: Xóa banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', requireAuth, requirePermission('banner:delete'), validate([isValidObjectId('id')]), bannerController.delete);

/**
 * @swagger
 * /banners/{id}/view:
 *   post:
 *     summary: Track lượt xem banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã ghi nhận
 */
router.post('/:id/view', bannerController.trackView);

/**
 * @swagger
 * /banners/{id}/click:
 *   post:
 *     summary: Track lượt click banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã ghi nhận
 */
router.post('/:id/click', bannerController.trackClick);

export default router;
