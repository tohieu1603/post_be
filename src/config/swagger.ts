import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5445;
const HOST = process.env.HOST || 'localhost';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ManagePost API',
      version: '1.0.0',
      description: `
# ManagePost API Documentation

API quản lý bài viết với đầy đủ tính năng:
- **Categories**: Quản lý danh mục đa cấp (cha-con)
- **Posts**: Quản lý bài viết với Markdown, SEO, và nhiều tính năng nâng cao

## Tính năng chính
- 🔄 Auto-generate slug từ tiêu đề
- 📝 Hỗ trợ Markdown content
- 🔍 SEO optimization với nhiều meta fields
- 📂 Danh mục phân cấp (tree structure)
- 📊 Pagination và filtering
      `,
      contact: {
        name: 'API Support',
        email: 'support@managepost.com',
      },
    },
    servers: [
      {
        url: `http://${HOST}:${PORT}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Categories',
        description: 'Quản lý danh mục bài viết (hỗ trợ cấu trúc cha-con)',
      },
      {
        name: 'Posts',
        description: 'Quản lý bài viết với Markdown và SEO',
      },
    ],
    components: {
      schemas: {
        // MongoDB ObjectId pattern (24 hex characters)
        ObjectId: {
          type: 'string',
          pattern: '^[a-fA-F0-9]{24}$',
          example: '507f1f77bcf86cd799439011',
          description: 'MongoDB ObjectId (24 hex characters)',
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'ID danh mục', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', description: 'Tên danh mục' },
            slug: { type: 'string', description: 'Slug (auto-generated từ tên)' },
            description: { type: 'string', nullable: true, description: 'Mô tả danh mục' },
            parentId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', nullable: true, description: 'ID danh mục cha' },
            sortOrder: { type: 'integer', description: 'Thứ tự sắp xếp' },
            isActive: { type: 'boolean', description: 'Trạng thái hoạt động' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            parent: { $ref: '#/components/schemas/Category', nullable: true },
            children: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
          },
        },
        CreateCategoryDto: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', description: 'Tên danh mục (bắt buộc)', example: 'Công nghệ' },
            slug: { type: 'string', description: 'Slug (tự động tạo nếu bỏ trống)', example: 'cong-nghe' },
            description: { type: 'string', description: 'Mô tả', example: 'Danh mục về công nghệ' },
            parentId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'ID danh mục cha' },
            sortOrder: { type: 'integer', default: 0, description: 'Thứ tự sắp xếp' },
            isActive: { type: 'boolean', default: true, description: 'Trạng thái hoạt động' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            _id: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', description: 'Tiêu đề bài viết' },
            slug: { type: 'string', description: 'Slug (auto-generated từ tiêu đề)' },
            excerpt: { type: 'string', nullable: true, description: 'Tóm tắt ngắn' },
            content: { type: 'string', description: 'Nội dung (Markdown)' },
            coverImage: { type: 'string', nullable: true, description: 'URL ảnh bìa' },
            categoryId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'ID danh mục' },
            status: { type: 'string', enum: ['draft', 'published', 'archived'], description: 'Trạng thái' },
            publishedAt: { type: 'string', format: 'date-time', nullable: true },
            viewCount: { type: 'integer', description: 'Lượt xem' },
            // SEO Fields
            metaTitle: { type: 'string', nullable: true, description: 'SEO: Meta title' },
            metaDescription: { type: 'string', nullable: true, description: 'SEO: Meta description' },
            metaKeywords: { type: 'string', nullable: true, description: 'SEO: Meta keywords' },
            canonicalUrl: { type: 'string', nullable: true, description: 'SEO: Canonical URL' },
            ogTitle: { type: 'string', nullable: true, description: 'SEO: Open Graph title' },
            ogDescription: { type: 'string', nullable: true, description: 'SEO: Open Graph description' },
            ogImage: { type: 'string', nullable: true, description: 'SEO: Open Graph image' },
            twitterTitle: { type: 'string', nullable: true, description: 'SEO: Twitter title' },
            twitterDescription: { type: 'string', nullable: true, description: 'SEO: Twitter description' },
            twitterImage: { type: 'string', nullable: true, description: 'SEO: Twitter image' },
            // Advanced fields
            author: { type: 'string', nullable: true, description: 'Tác giả' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
            isFeatured: { type: 'boolean', description: 'Bài viết nổi bật' },
            allowComments: { type: 'boolean', description: 'Cho phép bình luận' },
            readingTime: { type: 'integer', description: 'Thời gian đọc (phút)' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            category: { $ref: '#/components/schemas/Category' },
          },
        },
        CreatePostDto: {
          type: 'object',
          required: ['title', 'content', 'categoryId'],
          properties: {
            title: { type: 'string', description: 'Tiêu đề (bắt buộc)', example: 'Hướng dẫn lập trình NodeJS' },
            slug: { type: 'string', description: 'Slug (tự động tạo)' },
            excerpt: { type: 'string', description: 'Tóm tắt' },
            content: { type: 'string', description: 'Nội dung Markdown (bắt buộc)' },
            coverImage: { type: 'string', description: 'URL ảnh bìa' },
            categoryId: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', description: 'ID danh mục (bắt buộc)', example: '507f1f77bcf86cd799439011' },
            status: { type: 'string', enum: ['draft', 'published', 'archived'], default: 'draft' },
            metaTitle: { type: 'string' },
            metaDescription: { type: 'string' },
            metaKeywords: { type: 'string' },
            canonicalUrl: { type: 'string' },
            ogTitle: { type: 'string' },
            ogDescription: { type: 'string' },
            ogImage: { type: 'string' },
            twitterTitle: { type: 'string' },
            twitterDescription: { type: 'string' },
            twitterImage: { type: 'string' },
            author: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            isFeatured: { type: 'boolean', default: false },
            allowComments: { type: 'boolean', default: true },
          },
        },
        PaginatedPostsResponse: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
