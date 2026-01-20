/**
 * Category Tools for MCP Server
 *
 * Tools:
 * - get_categories: Lấy danh sách danh mục với filters
 * - get_category_tree: Lấy danh mục dạng cây phân cấp
 * - get_category_dropdown: Lấy danh mục cho dropdown
 * - get_category_by_id: Lấy danh mục theo ID
 * - get_category_by_slug: Lấy danh mục theo slug
 * - create_category: Tạo danh mục mới
 * - update_category: Cập nhật danh mục
 * - delete_category: Xóa danh mục
 * - toggle_category_active: Bật/tắt trạng thái danh mục
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { successResponse, errorResponse } from '../utils/response';

// Service type (will be injected)
interface CategoryService {
  getAll(filters: Record<string, unknown>): Promise<unknown>;
  getTree(): Promise<unknown>;
  getForDropdown(): Promise<unknown>;
  getById(id: string): Promise<unknown>;
  getBySlug(slug: string): Promise<unknown>;
  create(dto: Record<string, unknown>): Promise<unknown>;
  update(id: string, dto: Record<string, unknown>): Promise<unknown>;
  delete(id: string): Promise<{ success: boolean; message?: string }>;
  toggleActive(id: string): Promise<unknown>;
}

/**
 * Register all Category tools to the MCP server
 */
export function registerCategoryTools(server: McpServer, categoryService: CategoryService): void {
  // Tool 1: get_categories
  server.tool(
    'get_categories',
    'Lấy danh sách tất cả danh mục với filters',
    {
      search: z.string().optional().describe('Từ khóa tìm kiếm theo tên'),
      isActive: z.boolean().optional().describe('Lọc theo trạng thái active'),
      page: z.number().default(1).describe('Số trang'),
      limit: z.number().default(50).describe('Số lượng mỗi trang'),
    },
    async (params) => {
      try {
        const result = await categoryService.getAll({
          search: params.search,
          isActive: params.isActive,
          page: params.page,
          limit: params.limit,
        });
        return successResponse(result, 'Đã lấy danh sách danh mục thành công');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 2: get_category_tree
  server.tool(
    'get_category_tree',
    'Lấy danh mục dạng cây phân cấp (cha-con)',
    {},
    async () => {
      try {
        const tree = await categoryService.getTree();
        return successResponse(tree, 'Đã lấy cây danh mục thành công');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 3: get_category_dropdown
  server.tool(
    'get_category_dropdown',
    'Lấy danh mục dạng đơn giản cho dropdown/select',
    {},
    async () => {
      try {
        const categories = await categoryService.getForDropdown();
        return successResponse(categories, 'Đã lấy danh sách danh mục cho dropdown');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 4: get_category_by_id
  server.tool(
    'get_category_by_id',
    'Lấy chi tiết danh mục theo ID',
    {
      id: z.string().min(1).describe('ID của danh mục'),
    },
    async (params) => {
      try {
        const category = await categoryService.getById(params.id);
        if (!category) {
          return errorResponse(new Error('Không tìm thấy danh mục'));
        }
        return successResponse(category, 'Đã lấy thông tin danh mục');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 5: get_category_by_slug
  server.tool(
    'get_category_by_slug',
    'Lấy chi tiết danh mục theo slug',
    {
      slug: z.string().min(1).describe('Slug của danh mục'),
    },
    async (params) => {
      try {
        const category = await categoryService.getBySlug(params.slug);
        if (!category) {
          return errorResponse(new Error('Không tìm thấy danh mục'));
        }
        return successResponse(category, 'Đã lấy thông tin danh mục');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 6: create_category
  server.tool(
    'create_category',
    'Tạo danh mục mới (có thể có danh mục cha)',
    {
      name: z.string().min(1).describe('Tên danh mục (bắt buộc)'),
      slug: z.string().optional().describe('Slug tùy chỉnh (tự động tạo nếu không có)'),
      description: z.string().optional().describe('Mô tả danh mục'),
      parentId: z.string().nullable().optional().describe('ID danh mục cha (null nếu là root)'),
      isActive: z.boolean().default(true).describe('Trạng thái active'),
      metaTitle: z.string().optional().describe('Meta title cho SEO'),
      metaDescription: z.string().optional().describe('Meta description cho SEO'),
    },
    async (params) => {
      try {
        const category = await categoryService.create({
          name: params.name,
          slug: params.slug,
          description: params.description,
          parentId: params.parentId,
          isActive: params.isActive,
          metaTitle: params.metaTitle,
          metaDescription: params.metaDescription,
        }) as { name: string };

        return successResponse(category, `Đã tạo danh mục "${category.name}" thành công`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 7: update_category
  server.tool(
    'update_category',
    'Cập nhật thông tin danh mục',
    {
      id: z.string().min(1).describe('ID của danh mục cần cập nhật'),
      name: z.string().optional().describe('Tên mới'),
      slug: z.string().optional().describe('Slug mới'),
      description: z.string().optional().describe('Mô tả mới'),
      parentId: z.string().nullable().optional().describe('ID danh mục cha mới'),
      isActive: z.boolean().optional().describe('Trạng thái active mới'),
      metaTitle: z.string().optional().describe('Meta title mới'),
      metaDescription: z.string().optional().describe('Meta description mới'),
    },
    async (params) => {
      try {
        const { id, ...updateData } = params;
        const category = await categoryService.update(id, updateData);

        if (!category) {
          return errorResponse(new Error('Không tìm thấy danh mục'));
        }

        return successResponse(category, 'Đã cập nhật danh mục thành công');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 8: delete_category
  server.tool(
    'delete_category',
    'Xóa danh mục (không được có danh mục con hoặc bài viết)',
    {
      id: z.string().min(1).describe('ID của danh mục cần xóa'),
    },
    async (params) => {
      try {
        const result = await categoryService.delete(params.id);

        if (!result.success) {
          return errorResponse(new Error(result.message || 'Không thể xóa danh mục'));
        }

        return successResponse(result, 'Đã xóa danh mục thành công');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // Tool 9: toggle_category_active
  server.tool(
    'toggle_category_active',
    'Bật/tắt trạng thái active của danh mục',
    {
      id: z.string().min(1).describe('ID của danh mục'),
    },
    async (params) => {
      try {
        const category = await categoryService.toggleActive(params.id) as { isActive: boolean } | null;

        if (!category) {
          return errorResponse(new Error('Không tìm thấy danh mục'));
        }

        const status = category.isActive ? 'active' : 'inactive';
        return successResponse(category, `Đã chuyển danh mục sang trạng thái ${status}`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
