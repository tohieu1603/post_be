/**
 * Author Tools for MCP Server
 *
 * Tools:
 * - get_author_by_id: Lấy tác giả theo ID
 * - create_author: Tạo tác giả mới
 * - update_author: Cập nhật tác giả
 * - toggle_author_featured: Bật/tắt featured tác giả
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { successResponse, errorResponse } from '../utils/response';

// Service type (will be injected)
interface AuthorService {
  getById(id: string): Promise<unknown>;
  create(dto: Record<string, unknown>): Promise<unknown>;
  update(id: string, dto: Record<string, unknown>): Promise<unknown>;
  toggleFeatured(id: string): Promise<unknown>;
}

/**
 * Register all Author tools to the MCP server
 */
export function registerAuthorTools(server: McpServer, authorService: AuthorService): void {
  // Tool 1: get_author_by_id
  server.tool(
    'get_author_by_id',
    'Lấy chi tiết tác giả theo ID (kèm số bài viết)',
    {
      id: z.string().min(1).describe('ID của tác giả'),
    },
    async (params) => {
      try {
        const author = await authorService.getById(params.id);

        if (!author) {
          return errorResponse(new Error('Không tìm thấy tác giả'));
        }

        return successResponse(author, 'Đã lấy thông tin tác giả');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 2: create_author
  server.tool(
    'create_author',
    'Tạo profile tác giả mới (E-E-A-T)',
    {
      name: z.string().min(1).describe('Tên tác giả (bắt buộc)'),
      slug: z.string().optional().describe('Slug tùy chỉnh (tự động tạo nếu không có)'),
      email: z.string().email().optional().describe('Email của tác giả'),
      bio: z.string().optional().describe('Tiểu sử đầy đủ'),
      shortBio: z.string().optional().describe('Tiểu sử ngắn'),
      jobTitle: z.string().optional().describe('Chức danh/nghề nghiệp'),
      avatarUrl: z.string().optional().describe('URL ảnh đại diện'),
      expertise: z.array(z.string()).optional().describe('Danh sách chuyên môn'),
      isActive: z.boolean().default(true).describe('Trạng thái active'),
      isFeatured: z.boolean().default(false).describe('Đánh dấu là tác giả nổi bật'),
    },
    async (params) => {
      try {
        const author = await authorService.create({
          name: params.name,
          slug: params.slug,
          email: params.email,
          bio: params.bio,
          shortBio: params.shortBio,
          jobTitle: params.jobTitle,
          avatarUrl: params.avatarUrl,
          expertise: params.expertise,
          isActive: params.isActive,
          isFeatured: params.isFeatured,
        }) as { name: string };

        return successResponse(author, `Đã tạo tác giả "${author.name}" thành công`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 3: update_author
  server.tool(
    'update_author',
    'Cập nhật thông tin tác giả',
    {
      id: z.string().min(1).describe('ID của tác giả cần cập nhật'),
      name: z.string().optional().describe('Tên mới'),
      slug: z.string().optional().describe('Slug mới'),
      email: z.string().email().optional().describe('Email mới'),
      bio: z.string().optional().describe('Tiểu sử mới'),
      shortBio: z.string().optional().describe('Tiểu sử ngắn mới'),
      jobTitle: z.string().optional().describe('Chức danh mới'),
      avatarUrl: z.string().optional().describe('URL ảnh đại diện mới'),
      expertise: z.array(z.string()).optional().describe('Danh sách chuyên môn mới'),
      isActive: z.boolean().optional().describe('Trạng thái active mới'),
    },
    async (params) => {
      try {
        const { id, ...updateData } = params;
        const author = await authorService.update(id, updateData);

        if (!author) {
          return errorResponse(new Error('Không tìm thấy tác giả'));
        }

        return successResponse(author, 'Đã cập nhật tác giả thành công');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 4: toggle_author_featured
  server.tool(
    'toggle_author_featured',
    'Bật/tắt trạng thái featured của tác giả',
    {
      id: z.string().min(1).describe('ID của tác giả'),
    },
    async (params) => {
      try {
        const author = await authorService.toggleFeatured(params.id) as { name: string; isFeatured: boolean } | null;

        if (!author) {
          return errorResponse(new Error('Không tìm thấy tác giả'));
        }

        const status = author.isFeatured ? 'featured' : 'unfeatured';
        return successResponse(author, `Đã chuyển tác giả "${author.name}" sang trạng thái ${status}`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
