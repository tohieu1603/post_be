import { Router } from 'express';
import { authorController } from '../controllers';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, isValidObjectId, searchValidation } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ExperienceItem:
 *       type: object
 *       required:
 *         - id
 *         - company
 *         - position
 *         - startDate
 *       properties:
 *         id:
 *           type: string
 *         company:
 *           type: string
 *         position:
 *           type: string
 *         startDate:
 *           type: string
 *         endDate:
 *           type: string
 *         isCurrent:
 *           type: boolean
 *         description:
 *           type: string
 *         location:
 *           type: string
 *     EducationItem:
 *       type: object
 *       required:
 *         - id
 *         - school
 *         - degree
 *       properties:
 *         id:
 *           type: string
 *         school:
 *           type: string
 *         degree:
 *           type: string
 *         field:
 *           type: string
 *         startYear:
 *           type: number
 *         endYear:
 *           type: number
 *         description:
 *           type: string
 *     CertificationItem:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - issuer
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         issuer:
 *           type: string
 *         issueDate:
 *           type: string
 *         expiryDate:
 *           type: string
 *         credentialId:
 *           type: string
 *         credentialUrl:
 *           type: string
 *     AchievementItem:
 *       type: object
 *       required:
 *         - id
 *         - title
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         issuer:
 *           type: string
 *         date:
 *           type: string
 *         description:
 *           type: string
 *     SkillItem:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *         yearsOfExperience:
 *           type: number
 *     PublicationItem:
 *       type: object
 *       required:
 *         - id
 *         - title
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         publisher:
 *           type: string
 *         date:
 *           type: string
 *         url:
 *           type: string
 *         description:
 *           type: string
 *     ArticleItem:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - url
 *       properties:
 *         id:
 *           type: string
 *           description: ID bài viết
 *         title:
 *           type: string
 *           description: Tiêu đề bài viết
 *         url:
 *           type: string
 *           description: Link bài viết
 *         imageUrl:
 *           type: string
 *           description: Ảnh đại diện (optional)
 *         description:
 *           type: string
 *           description: Mô tả ngắn
 *         publishedDate:
 *           type: string
 *           description: Ngày đăng
 *     Author:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         email:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         bio:
 *           type: string
 *         shortBio:
 *           type: string
 *         jobTitle:
 *           type: string
 *         company:
 *           type: string
 *         location:
 *           type: string
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExperienceItem'
 *         education:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EducationItem'
 *         certifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CertificationItem'
 *         achievements:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AchievementItem'
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SkillItem'
 *         publications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PublicationItem'
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ArticleItem'
 *           description: Danh sách bài viết (link, tiêu đề, ảnh)
 *         website:
 *           type: string
 *         twitter:
 *           type: string
 *         linkedin:
 *           type: string
 *         facebook:
 *           type: string
 *         github:
 *           type: string
 *         youtube:
 *           type: string
 *         sameAs:
 *           type: array
 *           items:
 *             type: string
 *         metaTitle:
 *           type: string
 *         metaDescription:
 *           type: string
 *         isActive:
 *           type: boolean
 *         isFeatured:
 *           type: boolean
 *         sortOrder:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateAuthorDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         slug:
 *           type: string
 *           example: "nguyen-van-a"
 *         email:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         bio:
 *           type: string
 *         shortBio:
 *           type: string
 *         jobTitle:
 *           type: string
 *         company:
 *           type: string
 *         location:
 *           type: string
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ExperienceItem'
 *         education:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EducationItem'
 *         certifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CertificationItem'
 *         articles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ArticleItem'
 *           description: Danh sách bài viết (link, tiêu đề, ảnh optional)
 *         isActive:
 *           type: boolean
 *           default: true
 *         isFeatured:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Lấy danh sách tất cả tác giả
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên, bio, chức danh
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Lọc theo trạng thái hoạt động
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Lọc tác giả nổi bật
 *       - in: query
 *         name: expertise
 *         schema:
 *           type: string
 *         description: Lọc theo chuyên môn
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, sortOrder, createdAt, yearsExperience]
 *         description: Sắp xếp theo trường
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Thứ tự sắp xếp
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
 *           default: 20
 *         description: Số lượng mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách tác giả
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/', validate(searchValidation), authorController.getAll);

/**
 * @swagger
 * /authors/dropdown:
 *   get:
 *     summary: Lấy danh sách tác giả cho dropdown
 *     tags: [Authors]
 *     description: Danh sách tác giả active, chỉ gồm thông tin cơ bản
 *     responses:
 *       200:
 *         description: Danh sách tác giả
 */
router.get('/dropdown', authorController.getDropdown);

/**
 * @swagger
 * /authors/featured:
 *   get:
 *     summary: Lấy danh sách tác giả nổi bật
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng tác giả
 *     responses:
 *       200:
 *         description: Danh sách tác giả nổi bật
 */
router.get('/featured', authorController.getFeatured);

/**
 * @swagger
 * /authors/expertise-tags:
 *   get:
 *     summary: Lấy tất cả tags chuyên môn
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Danh sách tags chuyên môn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/expertise-tags', authorController.getExpertiseTags);

/**
 * @swagger
 * /authors/generate-slug:
 *   post:
 *     summary: Tạo slug từ tên tác giả
 *     tags: [Authors]
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
 *                 example: "Nguyễn Văn A"
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
 *                   example: "nguyen-van-a"
 */
router.post('/generate-slug', authorController.generateSlug);

/**
 * @swagger
 * /authors/slug/{slug}:
 *   get:
 *     summary: Lấy thông tin tác giả theo slug
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: "nguyen-van-a"
 *         description: Slug của tác giả
 *     responses:
 *       200:
 *         description: Thông tin tác giả
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Không tìm thấy tác giả
 */
router.get('/slug/:slug', authorController.getBySlug);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Lấy thông tin tác giả theo ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *         description: ID tác giả
 *     responses:
 *       200:
 *         description: Thông tin tác giả
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Không tìm thấy tác giả
 */
router.get('/:id', validate([isValidObjectId('id')]), authorController.getById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Tạo tác giả mới
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Tạo tác giả mới với đầy đủ thông tin E-E-A-T.
 *       Slug sẽ tự động generate từ tên nếu không cung cấp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAuthorDto'
 *     responses:
 *       201:
 *         description: Tác giả đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', requireAuth, requirePermission('author:manage'), authorController.create);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Cập nhật tác giả
 *     tags: [Authors]
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
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAuthorDto'
 *     responses:
 *       200:
 *         description: Tác giả đã được cập nhật
 *       404:
 *         description: Không tìm thấy tác giả
 */
router.put(
  '/:id',
  requireAuth,
  requirePermission('author:manage'),
  validate([isValidObjectId('id')]),
  authorController.update
);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Xóa tác giả
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Không thể xóa tác giả đang có bài viết.
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
 *         description: Không thể xóa (đang có bài viết)
 *       404:
 *         description: Không tìm thấy tác giả
 */
router.delete(
  '/:id',
  requireAuth,
  requirePermission('author:manage'),
  validate([isValidObjectId('id')]),
  authorController.delete
);

/**
 * @swagger
 * /authors/{id}/toggle-active:
 *   patch:
 *     summary: Bật/tắt trạng thái hoạt động
 *     tags: [Authors]
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
 *         description: Trạng thái đã được cập nhật
 */
router.patch(
  '/:id/toggle-active',
  requireAuth,
  requirePermission('author:manage'),
  validate([isValidObjectId('id')]),
  authorController.toggleActive
);

/**
 * @swagger
 * /authors/{id}/toggle-featured:
 *   patch:
 *     summary: Bật/tắt trạng thái nổi bật
 *     tags: [Authors]
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
 *         description: Trạng thái nổi bật đã được cập nhật
 */
router.patch(
  '/:id/toggle-featured',
  requireAuth,
  requirePermission('author:manage'),
  validate([isValidObjectId('id')]),
  authorController.toggleFeatured
);

/**
 * @swagger
 * /authors/sort-order:
 *   put:
 *     summary: Cập nhật thứ tự hiển thị
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     sortOrder:
 *                       type: number
 *     responses:
 *       200:
 *         description: Thứ tự đã được cập nhật
 */
router.put('/sort-order', requireAuth, requirePermission('author:manage'), authorController.updateSortOrder);

export default router;
