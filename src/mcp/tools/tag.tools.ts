/**
 * Tag Tools for MCP Server
 *
 * Tools:
 * - get_tags: Lấy danh sách tags
 * - create_tag: Tạo tag mới
 * - toggle_tag_active: Bật/tắt trạng thái tag
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { successResponse, errorResponse } from '../utils/response';

// Service type (will be injected)
interface TagService {
  findAll(): Promise<unknown>;
  search(query: string): Promise<unknown>;
  create(dto: Record<string, unknown>): Promise<unknown>;
  toggleActive(id: string): Promise<unknown>;
}

/**
 * Register all Tag tools to the MCP server
 */
export function registerTagTools(server: McpServer, tagService: TagService): void {
  // Tool 1: get_tags
  server.tool(
    'get_tags',
    'Lấy danh sách tất cả tags (kèm số lượng bài viết)',
    {
      search: z.string().optional().describe('Tìm kiếm theo tên tag'),
    },
    async (params) => {
      try {
        let result;
        if (params.search) {
          result = await tagService.search(params.search);
        } else {
          result = await tagService.findAll();
        }
        return successResponse(result, 'Đã lấy danh sách tags');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 2: create_tag
  server.tool(
    'create_tag',
    'Tạo tag mới với tên, màu sắc, mô tả',
    {
      name: z.string().min(1).describe('Tên tag (bắt buộc)'),
      slug: z.string().optional().describe('Slug tùy chỉnh (tự động tạo nếu không có)'),
      description: z.string().optional().describe('Mô tả tag'),
      color: z.string().optional().describe('Màu sắc (hex code, ví dụ: #FF5733)'),
      isActive: z.boolean().default(true).describe('Trạng thái active'),
    },
    async (params) => {
      try {
        const tag = await tagService.create({
          name: params.name,
          slug: params.slug,
          description: params.description,
          color: params.color,
          isActive: params.isActive,
        }) as { name: string };

        return successResponse(tag, `Đã tạo tag "${tag.name}" thành công`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 2: toggle_tag_active
  server.tool(
    'toggle_tag_active',
    'Bật/tắt trạng thái active của tag',
    {
      id: z.string().min(1).describe('ID của tag'),
    },
    async (params) => {
      try {
        const tag = await tagService.toggleActive(params.id) as { name: string; isActive: boolean } | null;

        if (!tag) {
          return errorResponse(new Error('Không tìm thấy tag'));
        }

        const status = tag.isActive ? 'active' : 'inactive';
        return successResponse(tag, `Đã chuyển tag "${tag.name}" sang trạng thái ${status}`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
