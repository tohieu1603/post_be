import { Router } from 'express';
import { categoryController } from '../controllers';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, categoryValidation, isValidObjectId, searchValidation } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên hoặc slug
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục cha (hoặc "root" cho danh mục gốc)
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Lọc theo trạng thái hoạt động
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, sortOrder, createdAt]
 *         description: Sắp xếp theo trường
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', validate(searchValidation), categoryController.getAll);

/**
 * @swagger
 * /categories/tree:
 *   get:
 *     summary: Lấy danh mục dạng cây (cha-con)
 *     tags: [Categories]
 *     description: Trả về cấu trúc cây với danh mục gốc và các con lồng nhau
 *     responses:
 *       200:
 *         description: Cây danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/tree', categoryController.getTree);

/**
 * @swagger
 * /categories/dropdown:
 *   get:
 *     summary: Lấy danh mục cho dropdown select
 *     tags: [Categories]
 *     description: Danh sách phẳng với thông tin parent để hiển thị trong dropdown
 *     responses:
 *       200:
 *         description: Danh sách danh mục cho dropdown
 */
router.get('/dropdown', categoryController.getDropdown);

/**
 * @swagger
 * /categories/generate-slug:
 *   post:
 *     summary: Tạo slug từ tên danh mục
 *     tags: [Categories]
 *     description: Auto-generate slug từ tên tiếng Việt (chuyển đổi dấu, lowercase, hyphen)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Công nghệ thông tin"
 *     responses:
 *       200:
 *         description: Slug được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slug:
 *                   type: string
 *                   example: "cong-nghe-thong-tin"
 */
router.post('/generate-slug', categoryController.generateSlug);

/**
 * @swagger
 * /categories/slug/{slug}:
 *   get:
 *     summary: Lấy thông tin danh mục theo slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: "vat-lieu-xay-dung"
 *         description: Slug của danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get('/slug/:slug', categoryController.getBySlug);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get('/:id', validate([isValidObjectId('id')]), categoryController.getById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories]
 *     description: |
 *       Tạo danh mục mới. Slug sẽ tự động generate từ tên nếu không cung cấp.
 *       Hỗ trợ tiếng Việt có dấu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       201:
 *         description: Danh mục đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', requireAuth, requirePermission('category:manage'), validate(categoryValidation.create), categoryController.create);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       200:
 *         description: Danh mục đã được cập nhật
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.put('/:id', requireAuth, requirePermission('category:manage'), validate([isValidObjectId('id'), ...categoryValidation.create]), categoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Categories]
 *     description: |
 *       Không thể xóa danh mục có:
 *       - Danh mục con
 *       - Bài viết thuộc danh mục
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Không thể xóa (có danh mục con hoặc bài viết)
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.delete('/:id', requireAuth, requirePermission('category:manage'), validate([isValidObjectId('id')]), categoryController.delete);

/**
 * @swagger
 * /categories/{id}/toggle-active:
 *   patch:
 *     summary: Bật/tắt trạng thái hoạt động
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: Trạng thái đã được cập nhật
 */
router.patch('/:id/toggle-active', requireAuth, requirePermission('category:manage'), validate([isValidObjectId('id')]), categoryController.toggleActive);

export default router;
