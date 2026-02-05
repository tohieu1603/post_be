# MCP Media Tools Implementation Plan

**Date**: 2026-02-05
**Project**: ManagePost Backend - MCP Server
**Objective**: Thêm MCP tools để upload và quản lý ảnh trong hệ thống

---

## 📋 Executive Summary

Hiện tại MCP server có 20 tools (Post: 3, Category: 9, Tag: 3, Author: 5) nhưng chưa có tools để quản lý media/ảnh. Cần implement MCP tools để:
1. Upload ảnh lên hệ thống
2. Quản lý media library
3. Thêm ảnh vào bài viết

**Challenge**: MCP protocol sử dụng JSON-RPC, không hỗ trợ multipart/form-data upload trực tiếp.

---

## 🔍 Current Architecture Analysis

### Media System (Existing)

#### Endpoints
```
POST   /api/media/upload      - Upload file (requires multipart/form-data)
GET    /api/media             - List all media
GET    /api/media/:id         - Get media by ID
PUT    /api/media/:id         - Update media metadata
DELETE /api/media/:id         - Delete media
GET    /api/media/:id/usage   - Get media usage
GET    /api/media/folders     - Get folders
GET    /api/media/by-section  - Get media by section
POST   /api/media/:id/assign  - Assign to page/section
POST   /api/media/:id/unassign - Unassign from page/section
```

#### Media Model
```typescript
interface IMedia {
  _id: ObjectId;
  filename: string;           // UUID-based filename
  originalName: string;
  mimeType: string;
  type: MediaType;            // image | video | document | audio | other
  size: number;               // bytes
  url: string;                // Full URL
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  title: string | null;
  altText: string | null;
  caption: string | null;
  uploadedBy: ObjectId | null;
  categoryId: ObjectId | null;
  usedIn: MediaUsage[];
  assignments: MediaAssignment[];
  folder: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Upload Flow
1. Client sends multipart/form-data to POST /api/media/upload
2. Multer middleware validates file (type, size, magic bytes)
3. File saved to disk with UUID filename
4. Media record created in MongoDB
5. Return media object with URL

#### Security Features
- File type whitelist (MIME + extension)
- Magic bytes validation
- Size limits (10MB images, 20MB docs, 100MB videos)
- Filename sanitization
- Dangerous extension blacklist

---

## 🎯 Problem Statement

### MCP Protocol Limitations
MCP uses JSON-RPC 2.0 over HTTP POST với `Content-Type: application/json`. Không thể gửi binary file trực tiếp qua MCP tool calls.

### Solutions Comparison

| Solution | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Base64 Encoding** | Simple, works with MCP | Large payload (33% increase), memory intensive | ✅ Recommended for small files |
| **URL-based** | Clean, delegate upload to client | Requires external storage, 2-step process | ✅ Recommended for production |
| **Hybrid** | Best of both worlds | More complex implementation | ⭐ **BEST** |

---

## 📝 Proposed MCP Tools

### Tool Group: Media Management (9 tools)

#### 1. `upload_media_base64` ⭐ NEW
**Description**: Upload ảnh lên hệ thống bằng base64 encoding
**Use Case**: AI agent tự tạo/có file nhỏ cần upload
**Input Schema**:
```typescript
{
  fileData: string;          // Base64 encoded file data (required)
  filename: string;          // Original filename (required)
  mimeType: string;          // MIME type (required, must be in whitelist)
  title?: string;            // Title for media
  altText?: string;          // Alt text for SEO
  caption?: string;          // Caption
  folder?: string;           // Folder to organize media
  categoryId?: string;       // Category ObjectId
}
```
**Output**: Media object with URL

**Validation**:
- Max base64 size: 10MB for images (after decode)
- MIME type must be in ALLOWED_IMAGE_TYPES
- Validate magic bytes after decode
- Sanitize filename

---

#### 2. `upload_media_from_url` ⭐ NEW
**Description**: Upload ảnh từ URL (download rồi lưu vào hệ thống)
**Use Case**: AI agent tìm được ảnh online, muốn import vào hệ thống
**Input Schema**:
```typescript
{
  imageUrl: string;          // URL của ảnh (required)
  title?: string;            // Title
  altText?: string;          // Alt text
  caption?: string;          // Caption
  folder?: string;           // Folder
  categoryId?: string;       // Category
}
```
**Flow**:
1. Validate URL format
2. Download file from URL (with timeout)
3. Validate file type & size
4. Save to disk
5. Create media record

**Security**:
- URL whitelist/blacklist
- Follow redirects limit (max 3)
- Timeout: 30s
- Max file size: 10MB
- Validate content-type header
- Magic bytes validation

---

#### 3. `get_media` (existing endpoint, add MCP wrapper)
**Description**: Lấy danh sách media với filters
**Input Schema**:
```typescript
{
  search?: string;           // Tìm kiếm theo title/filename
  type?: MediaType;          // Filter by type
  folder?: string;           // Filter by folder
  categoryId?: string;       // Filter by category
  page?: number;             // Page number (default: 1)
  limit?: number;            // Items per page (default: 20, max: 100)
  sortBy?: string;           // Sort field
  sortOrder?: 'ASC' | 'DESC'; // Sort order
}
```

---

#### 4. `get_media_by_id`
**Description**: Lấy chi tiết media theo ID
**Input Schema**:
```typescript
{
  id: string;                // Media ObjectId (required)
}
```

---

#### 5. `update_media`
**Description**: Cập nhật metadata của media
**Input Schema**:
```typescript
{
  id: string;                // Media ObjectId (required)
  title?: string;
  altText?: string;
  caption?: string;
  folder?: string;
  categoryId?: string | null;
}
```

---

#### 6. `delete_media`
**Description**: Xóa media (cả file vật lý và DB record)
**Input Schema**:
```typescript
{
  id: string;                // Media ObjectId (required)
}
```
**Note**: Kiểm tra usedIn trước khi xóa, warn nếu đang được sử dụng

---

#### 7. `get_media_usage`
**Description**: Kiểm tra media đang được sử dụng ở đâu
**Input Schema**:
```typescript
{
  id: string;                // Media ObjectId (required)
}
```
**Output**: Array of `{entityType, entityId, field}`

---

#### 8. `get_media_folders`
**Description**: Lấy danh sách folders
**Input Schema**: None
**Output**: Array of folder names

---

#### 9. `search_media_for_post`
**Description**: Tìm ảnh phù hợp cho bài viết (smart search)
**Use Case**: AI cần tìm ảnh cho bài viết dựa vào keyword
**Input Schema**:
```typescript
{
  keyword: string;           // Keyword to search (required)
  limit?: number;            // Max results (default: 10)
}
```
**Output**: Array of relevant media (search in title, altText, caption)

---

## 🔧 Implementation Plan

### Phase 1: Core Upload Tools (Priority: HIGH)
**Estimated Effort**: 3-4 hours

1. **Create `src/mcp/tools/media.tools.ts`**
   - Implement `upload_media_base64` tool
   - Implement `upload_media_from_url` tool
   - Add validation helpers

2. **Update `src/mcp/tools/index.ts`**
   - Export `registerMediaTools`

3. **Update `src/routes/mcp-routes.ts`**
   - Register media tools
   - Update TOOL_LIST

4. **Create utility helpers**
   - Base64 decode & validate
   - URL download with security
   - File type detection

**Testing**:
- Upload small PNG via base64
- Upload from valid URL
- Test security validations
- Test error handling

---

### Phase 2: Media Management Tools (Priority: MEDIUM)
**Estimated Effort**: 2-3 hours

1. **Implement remaining tools**:
   - `get_media`
   - `get_media_by_id`
   - `update_media`
   - `delete_media`
   - `get_media_usage`
   - `get_media_folders`
   - `search_media_for_post`

2. **Update TOOLS_CHECKLIST.md**
   - Add Media Tools section
   - Update progress

**Testing**:
- CRUD operations
- Search functionality
- Usage tracking

---

### Phase 3: Integration with Post Tools (Priority: HIGH)
**Estimated Effort**: 1-2 hours

1. **Update `create_post` tool**
   - Accept `coverImageId` (ObjectId) as alternative to `coverImage` (URL)
   - If `coverImageId` provided, fetch media URL and update usedIn

2. **Add `add_image_to_post` tool** (Optional)
   - Insert ImageBlock into post content
   - Track usage in media.usedIn

**Testing**:
- Create post with coverImageId
- Verify usedIn tracking

---

## 📊 Updated Tool Count

After implementation:
- **Post Tools**: 3
- **Category Tools**: 9
- **Tag Tools**: 3
- **Author Tools**: 5
- **Media Tools**: 9 (NEW)
- **Total**: 29 tools

---

## 🔒 Security Considerations

### Base64 Upload
1. Max decoded size: 10MB for images
2. Validate MIME type against whitelist
3. Magic bytes validation after decode
4. Sanitize filename
5. Rate limiting (prevent abuse)

### URL Upload
1. URL validation (format, protocol)
2. Domain whitelist/blacklist
3. Follow-redirect limits (max 3)
4. Timeout: 30 seconds
5. Content-Type header validation
6. Magic bytes validation
7. SSRF protection (block internal IPs)

### General
1. All media tools require authentication
2. Check permissions (media:upload, media:edit_own, media:delete_own)
3. File size limits enforcement
4. Disk space monitoring

---

## 📚 Technical Specifications

### Base64 Upload Implementation

```typescript
// Pseudo-code
async function uploadMediaBase64(params) {
  // 1. Decode base64
  const buffer = Buffer.from(params.fileData, 'base64');

  // 2. Validate size
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('File too large');
  }

  // 3. Validate MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(params.mimeType)) {
    throw new Error('Invalid file type');
  }

  // 4. Validate magic bytes
  const magicBytes = validateMagicBytes(buffer, params.mimeType);
  if (!magicBytes.valid) {
    throw new Error('File content mismatch');
  }

  // 5. Generate filename
  const ext = mime.extension(params.mimeType);
  const filename = `${uuidv4()}.${ext}`;

  // 6. Save to disk
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);

  // 7. Create media record
  const media = await mediaService.create({
    filename,
    originalName: sanitizeFilename(params.filename),
    mimeType: params.mimeType,
    type: 'image',
    size: buffer.length,
    url: `${baseUrl}/uploads/${filename}`,
    title: params.title,
    altText: params.altText,
    caption: params.caption,
    folder: params.folder,
    categoryId: params.categoryId,
  });

  return media;
}
```

### URL Upload Implementation

```typescript
async function uploadMediaFromUrl(params) {
  // 1. Validate URL
  const url = new URL(params.imageUrl); // throws if invalid
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Invalid protocol');
  }

  // 2. SSRF protection
  const ip = await dns.lookup(url.hostname);
  if (isPrivateIP(ip)) {
    throw new Error('Access to private IPs is not allowed');
  }

  // 3. Download file
  const response = await axios.get(params.imageUrl, {
    responseType: 'arraybuffer',
    timeout: 30000,
    maxRedirects: 3,
    maxContentLength: 10 * 1024 * 1024,
  });

  // 4. Validate content-type
  const contentType = response.headers['content-type'];
  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new Error('Invalid content type');
  }

  // 5. Validate magic bytes
  const buffer = Buffer.from(response.data);
  const magicBytes = validateMagicBytes(buffer, contentType);
  if (!magicBytes.valid) {
    throw new Error('File content mismatch');
  }

  // 6. Extract filename from URL
  const urlFilename = path.basename(url.pathname);
  const ext = mime.extension(contentType);
  const filename = `${uuidv4()}.${ext}`;

  // 7. Save & create record (same as base64)
  // ...
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- Base64 decode/encode
- Magic bytes validation
- Filename sanitization
- URL validation
- SSRF protection

### Integration Tests
- Upload via base64
- Upload from URL
- CRUD operations
- Search functionality
- Usage tracking
- Post integration

### Security Tests
- Invalid MIME types
- File spoofing (fake headers)
- Oversized files
- SSRF attempts
- Path traversal attempts
- Malicious filenames

---

## 📈 Success Metrics

1. ✅ All 9 media tools implemented
2. ✅ All tests passing
3. ✅ Security validations working
4. ✅ Documentation updated
5. ✅ Integration with post tools working
6. ✅ No performance degradation

---

## 🚀 Next Steps

1. Review this plan
2. Get approval
3. Implement Phase 1 (core upload)
4. Test thoroughly
5. Implement Phase 2 (management)
6. Implement Phase 3 (integration)
7. Update documentation
8. Deploy to staging
9. Production deployment

---

## 📝 Notes & Considerations

### Performance
- Large base64 strings increase payload size (~33%)
- Consider streaming for large files
- Implement caching for frequently accessed media
- Add CDN support for media URLs

### Future Enhancements
- Image processing (resize, crop, optimize)
- Thumbnail generation
- Support for cloud storage (S3, Cloudinary)
- Batch upload
- Media analytics
- AI-powered alt text generation
- Smart cropping/focal point detection

### Dependencies
- `axios` for URL downloads (già có)
- `mime-types` for MIME detection (có thể cần thêm)
- `sharp` for image processing (future)

---

## 🔄 Changelog

| Date | Action | Details |
|------|--------|---------|
| 2026-02-05 | Created | Initial plan with 9 media tools |

---

## ✅ Checklist

### Before Implementation
- [ ] Review plan with team
- [ ] Approve security measures
- [ ] Check dependencies
- [ ] Prepare test data

### During Implementation
- [ ] Create media.tools.ts
- [ ] Implement upload_media_base64
- [ ] Implement upload_media_from_url
- [ ] Implement CRUD tools
- [ ] Add security validations
- [ ] Write tests
- [ ] Update documentation

### After Implementation
- [ ] All tests passing
- [ ] Security audit
- [ ] Performance testing
- [ ] Documentation complete
- [ ] Code review
- [ ] Deploy to staging
- [ ] Production deployment

---

**Status**: 🟡 Pending Approval
**Priority**: HIGH
**Est. Total Effort**: 6-9 hours
**Target Completion**: 2026-02-06
