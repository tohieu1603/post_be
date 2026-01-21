/**
 * Post Tools for MCP Server
 *
 * Tools:
 * - get_posts: Lấy danh sách bài viết với filters
 * - create_post: Tạo bài viết mới
 * - update_post_status: Đổi trạng thái bài viết
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { successResponse, errorResponse } from '../utils/response';

// Service type (will be injected)
interface PostService {
  getAll(filters: Record<string, unknown>): Promise<unknown>;
  create(dto: Record<string, unknown>): Promise<unknown>;
  updateStatus(id: string, status: string): Promise<unknown>;
}

/**
 * Register all Post tools to the MCP server
 */
export function registerPostTools(server: McpServer, postService: PostService): void {
  // Tool 1: get_posts
  server.tool(
    'get_posts',
    'Lấy danh sách bài viết với filters (tìm kiếm, danh mục, trạng thái, phân trang)',
    {
      search: z.string().optional().describe('Từ khóa tìm kiếm trong tiêu đề'),
      categoryId: z.string().optional().describe('Lọc theo ID danh mục'),
      status: z
        .enum(['draft', 'published', 'archived'])
        .optional()
        .describe('Lọc theo trạng thái'),
      page: z.number().int().positive().default(1).describe('Số trang (mặc định: 1)'),
      limit: z
        .number()
        .int()
        .positive()
        .max(100)
        .default(10)
        .describe('Số lượng mỗi trang (mặc định: 10, tối đa: 100)'),
    },
    async (params) => {
      try {
        const result = await postService.getAll({
          search: params.search,
          categoryId: params.categoryId,
          status: params.status,
          page: params.page,
          limit: params.limit,
        });

        return successResponse(result, 'Đã lấy danh sách bài viết');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 2: create_post
  server.tool(
    'create_post',
    'Tạo bài viết mới với title, content, category, tags',
    {
      title: z.string().min(1).describe('Tiêu đề bài viết (bắt buộc)'),
      slug: z.string().optional().describe('Slug tùy chỉnh (tự động tạo nếu không có)'),
      content: z.string().optional().describe('Nội dung bài viết (HTML)'),
      excerpt: z.string().optional().describe('Mô tả ngắn'),
      categoryId: z.string().optional().describe('ID danh mục'),
      tags: z.array(z.string()).optional().describe('Danh sách ID tags'),
      authorId: z.string().optional().describe('ID tác giả'),
      featuredImage: z.string().optional().describe('URL ảnh đại diện'),
      status: z
        .enum(['draft', 'published', 'archived'])
        .default('draft')
        .describe('Trạng thái bài viết'),
    },
    async (params) => {
      try {
        const post = await postService.create({
          title: params.title,
          slug: params.slug,
          content: params.content,
          excerpt: params.excerpt,
          categoryId: params.categoryId,
          tags: params.tags,
          authorId: params.authorId,
          featuredImage: params.featuredImage,
          status: params.status,
        }) as { title: string };

        return successResponse(post, `Đã tạo bài viết "${post.title}" thành công`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 3: update_post_status
  server.tool(
    'update_post_status',
    'Đổi trạng thái bài viết (draft/published/archived)',
    {
      id: z.string().min(1).describe('ID của bài viết'),
      status: z
        .enum(['draft', 'published', 'archived'])
        .describe('Trạng thái mới'),
    },
    async (params) => {
      try {
        const post = await postService.updateStatus(params.id, params.status) as { title: string } | null;

        if (!post) {
          return errorResponse(new Error('Không tìm thấy bài viết'));
        }

        return successResponse(post, `Đã chuyển bài viết "${post.title}" sang trạng thái ${params.status}`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
