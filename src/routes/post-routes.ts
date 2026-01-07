import { Router } from 'express';
import { postController } from '../controllers';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, postValidation, isValidObjectId, searchValidation } from '../middleware/validation.middleware';
import { imageUpload, handleUploadError, validateUploadedFile, ALLOWED_IMAGE_TYPES } from '../middleware/upload.middleware';

const router = Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lấy danh sách bài viết (có phân trang)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số bài viết mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tiêu đề, slug, excerpt
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, createdAt, updatedAt, viewCount]
 *         description: Sắp xếp theo trường
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Danh sách bài viết với phân trang
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPostsResponse'
 */
router.get('/', validate(searchValidation), postController.getAll);

/**
 * @swagger
 * /posts/recent:
 *   get:
 *     summary: Lấy bài viết mới nhất
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số bài viết
 *     responses:
 *       200:
 *         description: Danh sách bài viết mới nhất
 */
router.get('/recent', postController.getRecent);

/**
 * @swagger
 * /posts/statistics:
 *   get:
 *     summary: Lấy thống kê bài viết
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Thống kê số lượng bài viết theo trạng thái
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 byStatus:
 *                   type: object
 *                   properties:
 *                     draft:
 *                       type: integer
 *                     published:
 *                       type: integer
 *                     archived:
 *                       type: integer
 */
router.get('/statistics', postController.getStatistics);

/**
 * @swagger
 * /posts/generate-slug:
 *   post:
 *     summary: Tạo slug từ tiêu đề bài viết
 *     tags: [Posts]
 *     description: Auto-generate slug từ tiêu đề tiếng Việt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Hướng dẫn lập trình NodeJS cho người mới"
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
 *                   example: "huong-dan-lap-trinh-nodejs-cho-nguoi-moi"
 */
router.post('/generate-slug', postController.generateSlug);

/**
 * @swagger
 * /posts/category/{slug}:
 *   get:
 *     summary: Lấy bài viết theo slug danh mục
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: "vat-lieu-xay-dung"
 *         description: Slug của danh mục
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách bài viết trong danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get('/category/:slug', postController.getByCategorySlug);

/**
 * @swagger
 * /posts/slug/{slug}:
 *   get:
 *     summary: Lấy bài viết theo slug (public)
 *     tags: [Posts]
 *     description: Dùng cho trang public để hiển thị bài viết theo template
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: "huong-dan-lap-trinh-nodejs"
 *     responses:
 *       200:
 *         description: Thông tin bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.get('/slug/:slug', postController.getBySlug);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Lấy thông tin bài viết theo ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: Thông tin bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.get('/:id', postController.getById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Posts]
 *     description: |
 *       Tạo bài viết mới với đầy đủ tính năng:
 *       - Auto-generate slug từ tiêu đề
 *       - Hỗ trợ Markdown content
 *       - Nhiều trường SEO (meta, OG, Twitter)
 *       - Tags và các tùy chọn nâng cao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostDto'
 *     responses:
 *       201:
 *         description: Bài viết đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', requireAuth, requirePermission('post:create_draft'), validate(postValidation.create), postController.create);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Posts]
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
 *             $ref: '#/components/schemas/CreatePostDto'
 *     responses:
 *       200:
 *         description: Bài viết đã được cập nhật
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.put('/:id', requireAuth, requirePermission('post:edit_own'), validate([isValidObjectId('id'), ...postValidation.update]), postController.update);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     tags: [Posts]
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
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.delete('/:id', requireAuth, requirePermission('post:delete'), validate([isValidObjectId('id')]), postController.delete);

/**
 * @swagger
 * /posts/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái bài viết
 *     tags: [Posts]
 *     description: Thay đổi trạng thái nhanh (draft -> published -> archived)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Trạng thái đã được cập nhật
 */
router.patch('/:id/status', requireAuth, requirePermission('post:publish'), validate([isValidObjectId('id')]), postController.updateStatus);

// ========== Content Structure Routes ==========

/**
 * @swagger
 * /posts/{id}/structure:
 *   get:
 *     summary: Lấy cấu trúc nội dung bài viết
 *     tags: [Posts - Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: Cấu trúc nội dung
 */
router.get('/:id/structure', postController.getStructure);

/**
 * @swagger
 * /posts/{id}/structure:
 *   put:
 *     summary: Lưu cấu trúc nội dung
 *     tags: [Posts - Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               structure:
 *                 type: object
 *               updateContent:
 *                 type: boolean
 *                 description: Có cập nhật HTML content từ structure không
 *     responses:
 *       200:
 *         description: Đã lưu cấu trúc
 */
router.put('/:id/structure', postController.saveStructure);

/**
 * @swagger
 * /posts/{id}/structure/parse:
 *   post:
 *     summary: Parse HTML thành structure (không lưu)
 *     tags: [Posts - Structure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               html:
 *                 type: string
 *     responses:
 *       200:
 *         description: Structure đã parse
 */
router.post('/:id/structure/parse', postController.parseToStructure);

/**
 * @swagger
 * /posts/{id}/structure/to-html:
 *   post:
 *     summary: Convert structure thành HTML (không lưu)
 *     tags: [Posts - Structure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               structure:
 *                 type: object
 *     responses:
 *       200:
 *         description: HTML và TOC HTML
 */
router.post('/:id/structure/to-html', postController.structureToHtml);

/**
 * @swagger
 * /posts/{id}/structure/sync:
 *   post:
 *     summary: Sync structure từ HTML content hiện tại
 *     tags: [Posts - Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     responses:
 *       200:
 *         description: Structure đã sync
 */
router.post('/:id/structure/sync', postController.syncStructureFromContent);

/**
 * @swagger
 * /posts/{id}/structure/section:
 *   post:
 *     summary: Thêm section mới vào structure
 *     tags: [Posts - Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               section:
 *                 type: object
 *               afterSectionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Section đã thêm
 */
router.post('/:id/structure/section', postController.addSection);

/**
 * @swagger
 * /posts/{id}/structure/section/{sectionId}:
 *   put:
 *     summary: Cập nhật section
 *     tags: [Posts - Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *       - in: path
 *         name: sectionId
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
 *               updates:
 *                 type: object
 *     responses:
 *       200:
 *         description: Section đã cập nhật
 */
router.put('/:id/structure/section/:sectionId', postController.updateSection);

/**
 * @swagger
 * /posts/{id}/structure/section/{sectionId}:
 *   delete:
 *     summary: Xóa section
 *     tags: [Posts - Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section đã xóa
 */
router.delete('/:id/structure/section/:sectionId', postController.removeSection);

/**
 * @swagger
 * /posts/{id}/structure/reorder:
 *   put:
 *     summary: Sắp xếp lại thứ tự sections
 *     tags: [Posts - Structure]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sectionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sections đã sắp xếp lại
 */
router.put('/:id/structure/reorder', postController.reorderSections);

// ========== Cover Image Upload Routes ==========

/**
 * @swagger
 * /posts/{id}/cover:
 *   post:
 *     summary: Upload ảnh bìa cho bài viết
 *     tags: [Posts - Cover]
 *     description: Upload ảnh bìa (cover image) cho bài viết. Hỗ trợ JPEG, PNG, GIF, WebP.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cover
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh bìa (max 10MB)
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 coverImage:
 *                   type: string
 *                   description: URL của ảnh bìa
 *       400:
 *         description: Không có file hoặc file không hợp lệ
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.post(
  '/:id/cover',
  requireAuth,
  requirePermission('post:edit_own'),
  validate([isValidObjectId('id')]),
  imageUpload.single('cover'),
  handleUploadError,
  validateUploadedFile(ALLOWED_IMAGE_TYPES),
  postController.uploadCover
);

/**
 * @swagger
 * /posts/{id}/cover:
 *   delete:
 *     summary: Xóa ảnh bìa của bài viết
 *     tags: [Posts - Cover]
 *     security:
 *       - bearerAuth: []
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
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.delete(
  '/:id/cover',
  requireAuth,
  requirePermission('post:edit_own'),
  validate([isValidObjectId('id')]),
  postController.removeCover
);

export default router;
