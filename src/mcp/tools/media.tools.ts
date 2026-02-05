/**
 * Media Tools for MCP Server
 *
 * Tools:
 * - upload_media_base64: Upload ảnh bằng base64 encoding
 * - upload_media_from_url: Upload ảnh từ URL
 * - get_media: Lấy danh sách media với filters
 * - get_media_by_id: Lấy chi tiết media theo ID
 * - update_media: Cập nhật metadata
 * - delete_media: Xóa media
 * - get_media_usage: Kiểm tra usage
 * - get_media_folders: Lấy danh sách folders
 * - search_media_for_post: Tìm ảnh phù hợp cho bài viết
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { successResponse, errorResponse } from '../utils/response';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

// ============================================
// CONSTANTS
// ============================================
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_BASE64_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_URL_DOWNLOAD_SIZE = 10 * 1024 * 1024; // 10MB
const DOWNLOAD_TIMEOUT = 30000; // 30s

// Magic bytes for file validation
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header
};

// ============================================
// SERVICE INTERFACE
// ============================================
interface MediaService {
  create(dto: any): Promise<unknown>;
  findAll(params: any): Promise<{ data: any[]; total: number; totalPages: number }>;
  findById(id: string): Promise<any>;
  update(id: string, dto: any): Promise<any>;
  delete(id: string): Promise<void>;
  getUsage(id: string): Promise<any[]>;
  getFolders(): Promise<string[]>;
  getMediaType(mimeType: string): string;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validate magic bytes of file buffer
 */
function validateMagicBytes(buffer: Buffer, mimeType: string): { valid: boolean; error?: string } {
  if (!MAGIC_BYTES[mimeType]) {
    return { valid: true }; // Skip validation if no magic bytes defined
  }

  const fileHeader = Array.from(buffer.slice(0, 8));
  const validSignatures = MAGIC_BYTES[mimeType];

  const hasValidSignature = validSignatures.some((signature) =>
    signature.every((byte, index) => fileHeader[index] === byte)
  );

  if (!hasValidSignature) {
    return {
      valid: false,
      error: 'File content does not match its declared type. Possible file spoofing detected.',
    };
  }

  return { valid: true };
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename: string): string {
  let sanitized = path.basename(filename);
  sanitized = sanitized.replace(/\0/g, '');
  sanitized = sanitized.replace(/[<>:"/\\|?*]/g, '_');
  sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');

  if (sanitized.length > 200) {
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    sanitized = name.substring(0, 200 - ext.length) + ext;
  }

  if (!sanitized) {
    sanitized = 'unnamed_file';
  }

  return sanitized;
}

/**
 * Check if IP is private (SSRF protection)
 */
function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);

  // 127.0.0.0/8 (localhost)
  if (parts[0] === 127) return true;

  // 10.0.0.0/8 (private)
  if (parts[0] === 10) return true;

  // 172.16.0.0/12 (private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

  // 192.168.0.0/16 (private)
  if (parts[0] === 192 && parts[1] === 168) return true;

  // 169.254.0.0/16 (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;

  return false;
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  return extensions[mimeType] || 'bin';
}

// ============================================
// REGISTER MEDIA TOOLS
// ============================================
export function registerMediaTools(server: McpServer, mediaService: MediaService): void {

  // ==========================================
  // Tool 1: upload_media_base64
  // ==========================================
  server.tool(
    'upload_media_base64',
    'Upload ảnh lên hệ thống bằng base64 encoding (max 10MB)',
    {
      fileData: z.string().min(1).describe('Base64 encoded file data (bắt buộc)'),
      filename: z.string().min(1).describe('Tên file gốc (bắt buộc)'),
      mimeType: z
        .enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'])
        .describe('MIME type của file (bắt buộc)'),
      title: z.string().optional().describe('Tiêu đề ảnh'),
      altText: z.string().optional().describe('Alt text cho SEO'),
      caption: z.string().optional().describe('Caption mô tả'),
      folder: z.string().optional().describe('Folder để tổ chức media'),
      categoryId: z.string().optional().describe('Category ObjectId'),
    },
    async (params) => {
      try {
        // 1. Decode base64
        let buffer: Buffer;
        try {
          buffer = Buffer.from(params.fileData, 'base64');
        } catch (err) {
          return errorResponse(new Error('Invalid base64 data'));
        }

        // 2. Validate size
        if (buffer.length > MAX_BASE64_SIZE) {
          return errorResponse(new Error(`File too large. Maximum size is ${MAX_BASE64_SIZE / 1024 / 1024}MB`));
        }

        // 3. Validate MIME type
        if (!ALLOWED_IMAGE_TYPES.includes(params.mimeType)) {
          return errorResponse(new Error(`Invalid MIME type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`));
        }

        // 4. Validate magic bytes
        const magicValidation = validateMagicBytes(buffer, params.mimeType);
        if (!magicValidation.valid) {
          return errorResponse(new Error(magicValidation.error));
        }

        // 5. Generate filename
        const ext = getExtensionFromMimeType(params.mimeType);
        const filename = `${uuidv4()}.${ext}`;

        // 6. Save to disk
        const uploadDir = process.env.UPLOAD_DIR || 'uploads';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        // 7. Create media record
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
        const type = mediaService.getMediaType(params.mimeType);

        const media = await mediaService.create({
          filename,
          originalName: sanitizeFilename(params.filename),
          mimeType: params.mimeType,
          type,
          size: buffer.length,
          url: `${baseUrl}/uploads/${filename}`,
          title: params.title || null,
          altText: params.altText || null,
          caption: params.caption || null,
          folder: params.folder || null,
          categoryId: params.categoryId || null,
        }) as any;

        return successResponse(media, `Đã upload file "${params.filename}" thành công`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 2: upload_media_from_url
  // ==========================================
  server.tool(
    'upload_media_from_url',
    'Download và upload ảnh từ URL (max 10MB, timeout 30s)',
    {
      imageUrl: z.string().url().describe('URL của ảnh cần download (bắt buộc)'),
      title: z.string().optional().describe('Tiêu đề ảnh'),
      altText: z.string().optional().describe('Alt text cho SEO'),
      caption: z.string().optional().describe('Caption mô tả'),
      folder: z.string().optional().describe('Folder để tổ chức media'),
      categoryId: z.string().optional().describe('Category ObjectId'),
    },
    async (params) => {
      try {
        // 1. Validate URL
        let url: URL;
        try {
          url = new URL(params.imageUrl);
        } catch (err) {
          return errorResponse(new Error('Invalid URL format'));
        }

        // 2. Check protocol
        if (!['http:', 'https:'].includes(url.protocol)) {
          return errorResponse(new Error('Only HTTP/HTTPS protocols are allowed'));
        }

        // 3. SSRF protection - check for private IPs
        try {
          const { address } = await dnsLookup(url.hostname);
          if (isPrivateIP(address)) {
            return errorResponse(new Error('Access to private IP addresses is not allowed'));
          }
        } catch (err) {
          return errorResponse(new Error('Failed to resolve hostname'));
        }

        // 4. Download file
        let response;
        try {
          response = await axios.get(params.imageUrl, {
            responseType: 'arraybuffer',
            timeout: DOWNLOAD_TIMEOUT,
            maxRedirects: 3,
            maxContentLength: MAX_URL_DOWNLOAD_SIZE,
            headers: {
              'User-Agent': 'ManagePost-MCP-Server/1.0',
            },
          });
        } catch (err: any) {
          if (err.code === 'ECONNABORTED') {
            return errorResponse(new Error('Download timeout (30s limit)'));
          }
          return errorResponse(new Error(`Failed to download image: ${err.message}`));
        }

        // 5. Validate content-type
        const contentType = response.headers['content-type'];
        if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
          return errorResponse(new Error(`Invalid content type: ${contentType}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`));
        }

        // 6. Create buffer and validate
        const buffer = Buffer.from(response.data);

        if (buffer.length > MAX_URL_DOWNLOAD_SIZE) {
          return errorResponse(new Error(`File too large. Maximum size is ${MAX_URL_DOWNLOAD_SIZE / 1024 / 1024}MB`));
        }

        // 7. Validate magic bytes
        const magicValidation = validateMagicBytes(buffer, contentType);
        if (!magicValidation.valid) {
          return errorResponse(new Error(magicValidation.error));
        }

        // 8. Extract filename from URL
        const urlFilename = path.basename(url.pathname) || 'download';

        // 9. Generate filename
        const ext = getExtensionFromMimeType(contentType);
        const filename = `${uuidv4()}.${ext}`;

        // 10. Save to disk
        const uploadDir = process.env.UPLOAD_DIR || 'uploads';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);

        // 11. Create media record
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
        const type = mediaService.getMediaType(contentType);

        const media = await mediaService.create({
          filename,
          originalName: sanitizeFilename(urlFilename),
          mimeType: contentType,
          type,
          size: buffer.length,
          url: `${baseUrl}/uploads/${filename}`,
          title: params.title || null,
          altText: params.altText || null,
          caption: params.caption || null,
          folder: params.folder || null,
          categoryId: params.categoryId || null,
        }) as any;

        return successResponse(media, `Đã download và upload ảnh từ "${params.imageUrl}" thành công`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 3: get_media
  // ==========================================
  server.tool(
    'get_media',
    'Lấy danh sách media với filters (tìm kiếm, type, folder, phân trang)',
    {
      search: z.string().optional().describe('Tìm kiếm theo title/filename'),
      type: z.enum(['image', 'video', 'document', 'audio', 'other']).optional().describe('Lọc theo loại media'),
      folder: z.string().optional().describe('Lọc theo folder'),
      categoryId: z.string().optional().describe('Lọc theo category'),
      page: z.number().int().positive().default(1).describe('Số trang (mặc định: 1)'),
      limit: z.number().int().positive().max(100).default(20).describe('Số lượng mỗi trang (mặc định: 20, tối đa: 100)'),
      sortBy: z.string().optional().describe('Sắp xếp theo trường'),
      sortOrder: z.enum(['ASC', 'DESC']).optional().describe('Thứ tự sắp xếp'),
    },
    async (params) => {
      try {
        const result = await mediaService.findAll({
          search: params.search,
          type: params.type,
          folder: params.folder,
          categoryId: params.categoryId,
          page: params.page,
          limit: params.limit,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        });

        return successResponse(result, 'Đã lấy danh sách media');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 4: get_media_by_id
  // ==========================================
  server.tool(
    'get_media_by_id',
    'Lấy chi tiết media theo ID',
    {
      id: z.string().min(1).describe('ID của media (bắt buộc)'),
    },
    async (params) => {
      try {
        const media = await mediaService.findById(params.id);

        if (!media) {
          return errorResponse(new Error('Không tìm thấy media'));
        }

        return successResponse(media, 'Đã lấy thông tin media');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 5: update_media
  // ==========================================
  server.tool(
    'update_media',
    'Cập nhật metadata của media (title, altText, caption, folder, category)',
    {
      id: z.string().min(1).describe('ID của media cần cập nhật (bắt buộc)'),
      title: z.string().optional().describe('Tiêu đề mới'),
      altText: z.string().optional().describe('Alt text mới'),
      caption: z.string().optional().describe('Caption mới'),
      folder: z.string().optional().describe('Folder mới'),
      categoryId: z.string().nullable().optional().describe('Category ID mới (null để xóa)'),
    },
    async (params) => {
      try {
        const { id, ...updateData } = params;
        const media = await mediaService.update(id, updateData);

        if (!media) {
          return errorResponse(new Error('Không tìm thấy media'));
        }

        return successResponse(media, 'Đã cập nhật media thành công');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 6: delete_media
  // ==========================================
  server.tool(
    'delete_media',
    'Xóa media (bao gồm cả file vật lý)',
    {
      id: z.string().min(1).describe('ID của media cần xóa (bắt buộc)'),
    },
    async (params) => {
      try {
        await mediaService.delete(params.id);
        return successResponse({ deleted: true }, 'Đã xóa media thành công');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 7: get_media_usage
  // ==========================================
  server.tool(
    'get_media_usage',
    'Kiểm tra media đang được sử dụng ở đâu (posts, banners, etc)',
    {
      id: z.string().min(1).describe('ID của media (bắt buộc)'),
    },
    async (params) => {
      try {
        const usage = await mediaService.getUsage(params.id);
        return successResponse(usage, 'Đã lấy thông tin usage');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 8: get_media_folders
  // ==========================================
  server.tool(
    'get_media_folders',
    'Lấy danh sách tất cả folders trong media library',
    {},
    async () => {
      try {
        const folders = await mediaService.getFolders();
        return successResponse(folders, 'Đã lấy danh sách folders');
      } catch (error) {
        return errorResponse(error);
      }
    }
  );

  // ==========================================
  // Tool 9: search_media_for_post
  // ==========================================
  server.tool(
    'search_media_for_post',
    'Tìm kiếm ảnh phù hợp cho bài viết dựa vào keyword',
    {
      keyword: z.string().min(1).describe('Từ khóa tìm kiếm (bắt buộc)'),
      limit: z.number().int().positive().max(50).default(10).describe('Số lượng kết quả tối đa (mặc định: 10)'),
    },
    async (params) => {
      try {
        const result = await mediaService.findAll({
          search: params.keyword,
          type: 'image',
          page: 1,
          limit: params.limit,
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        });

        return successResponse(result.data, `Đã tìm thấy ${result.data.length} ảnh phù hợp với "${params.keyword}"`);
      } catch (error) {
        return errorResponse(error);
      }
    }
  );
}
