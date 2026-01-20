# MCP Server - Full Tools Checklist

Danh sách đầy đủ các tools có thể implement cho MCP Server của ManagePost Backend.

---

## Tiến độ tổng quan

| Metric | Value |
|--------|-------|
| **Tổng số tools có thể làm** | 102 |
| **Tools được chọn implement** | 18 |
| **Đã hoàn thành** | 18 |
| **Progress** | 18/18 (100%) ✅ |

---

## Tools được chọn để implement (18 tools)

> Các tools có đánh dấu `[SELECTED]` là tools được chọn để implement trong phase này.

---

## 1. Post Tools (11 tools)

| # | Tool Name | Mô tả | Method | Status | Selected |
|---|-----------|-------|--------|--------|----------|
| 1 | `get_posts` | Lấy danh sách bài viết với filters (tìm kiếm, danh mục, trạng thái, phân trang) | `postService.getAll(filters)` | [x] | **[SELECTED]** ✅ |
| 2 | `get_post_by_id` | Lấy chi tiết một bài viết theo ID | `postService.getById(id)` | [ ] | |
| 3 | `get_post_by_slug` | Lấy chi tiết bài viết theo slug (URL thân thiện) | `postService.getBySlug(slug)` | [ ] | |
| 4 | `get_posts_by_category` | Lấy danh sách bài viết theo slug danh mục | `postService.getByCategorySlug(slug, page, limit)` | [ ] | |
| 5 | `get_recent_posts` | Lấy các bài viết mới nhất | `postService.getRecent(limit)` | [ ] | |
| 6 | `get_post_statistics` | Lấy thống kê bài viết (tổng số, theo trạng thái) | `postService.getStatistics()` | [ ] | |
| 7 | `create_post` | Tạo bài viết mới với title, content, category, tags | `postService.create(dto)` | [x] | **[SELECTED]** ✅ |
| 8 | `update_post` | Cập nhật nội dung bài viết | `postService.update(id, dto)` | [ ] | |
| 9 | `delete_post` | Xóa bài viết | `postService.delete(id)` | [ ] | |
| 10 | `update_post_status` | Đổi trạng thái bài viết (draft/published/archived) | `postService.updateStatus(id, status)` | [x] | **[SELECTED]** ✅ |
| 11 | `generate_post_slug` | Tạo slug tự động từ tiêu đề | `postService.generateSlugPreview(title)` | [ ] | |

---

## 2. Category Tools (9 tools)

| # | Tool Name | Mô tả | Method | Status | Selected |
|---|-----------|-------|--------|--------|----------|
| 12 | `get_categories` | Lấy danh sách tất cả danh mục với filters | `categoryService.getAll(filters)` | [x] | **[SELECTED]** ✅ |
| 13 | `get_category_tree` | Lấy danh mục dạng cây phân cấp (cha-con) | `categoryService.getTree()` | [x] | **[SELECTED]** ✅ |
| 14 | `get_category_dropdown` | Lấy danh mục dạng đơn giản cho dropdown/select | `categoryService.getForDropdown()` | [x] | **[SELECTED]** ✅ |
| 15 | `get_category_by_id` | Lấy chi tiết danh mục theo ID | `categoryService.getById(id)` | [x] | **[SELECTED]** ✅ |
| 16 | `get_category_by_slug` | Lấy chi tiết danh mục theo slug | `categoryService.getBySlug(slug)` | [x] | **[SELECTED]** ✅ |
| 17 | `create_category` | Tạo danh mục mới (có thể có danh mục cha) | `categoryService.create(dto)` | [x] | **[SELECTED]** ✅ |
| 18 | `update_category` | Cập nhật thông tin danh mục | `categoryService.update(id, dto)` | [x] | **[SELECTED]** ✅ |
| 19 | `delete_category` | Xóa danh mục (không được có danh mục con hoặc bài viết) | `categoryService.delete(id)` | [x] | **[SELECTED]** ✅ |
| 20 | `toggle_category_active` | Bật/tắt trạng thái active của danh mục | `categoryService.toggleActive(id)` | [x] | **[SELECTED]** ✅ |

---

## 3. Tag Tools (9 tools)

| # | Tool Name | Mô tả | Method | Status | Selected |
|---|-----------|-------|--------|--------|----------|
| 21 | `get_tags` | Lấy danh sách tất cả tags kèm số bài viết | `tagService.findAll()` | [ ] | |
| 22 | `get_tag_by_id` | Lấy chi tiết tag theo ID | `tagService.findById(id)` | [ ] | |
| 23 | `get_tag_by_slug` | Lấy chi tiết tag theo slug | `tagService.findBySlug(slug)` | [ ] | |
| 24 | `search_tags` | Tìm kiếm tags theo từ khóa | `tagService.search(query)` | [ ] | |
| 25 | `create_tag` | Tạo tag mới với tên, màu sắc, mô tả | `tagService.create(dto)` | [x] | **[SELECTED]** ✅ |
| 26 | `update_tag` | Cập nhật thông tin tag | `tagService.update(id, dto)` | [ ] | |
| 27 | `delete_tag` | Xóa tag | `tagService.delete(id)` | [ ] | |
| 28 | `merge_tags` | Gộp nhiều tags thành một (chuyển bài viết sang tag đích) | `tagService.mergeTags(sourceIds, targetId)` | [ ] | |
| 29 | `toggle_tag_active` | Bật/tắt trạng thái active của tag | `tagService.toggleActive(id)` | [x] | **[SELECTED]** ✅ |

---

## 4. Author Tools (10 tools)

| # | Tool Name | Mô tả | Method | Status | Selected |
|---|-----------|-------|--------|--------|----------|
| 30 | `get_authors` | Lấy danh sách tác giả với phân trang và filters | `authorService.getAll(filters)` | [ ] | |
| 31 | `get_author_dropdown` | Lấy danh sách tác giả active cho dropdown | `authorService.getForDropdown()` | [ ] | |
| 32 | `get_featured_authors` | Lấy danh sách tác giả nổi bật | `authorService.getFeatured(limit)` | [ ] | |
| 33 | `get_author_by_id` | Lấy chi tiết tác giả theo ID (kèm số bài viết) | `authorService.getById(id)` | [x] | **[SELECTED]** ✅ |
| 34 | `get_author_by_slug` | Lấy chi tiết tác giả theo slug | `authorService.getBySlug(slug)` | [ ] | |
| 35 | `get_expertise_tags` | Lấy tất cả expertise tags từ các tác giả | `authorService.getAllExpertiseTags()` | [ ] | |
| 36 | `create_author` | Tạo profile tác giả mới (E-E-A-T) | `authorService.create(dto)` | [x] | **[SELECTED]** ✅ |
| 37 | `update_author` | Cập nhật thông tin tác giả | `authorService.update(id, dto)` | [x] | **[SELECTED]** ✅ |
| 38 | `delete_author` | Xóa tác giả (không được có bài viết) | `authorService.delete(id)` | [ ] | |
| 39 | `toggle_author_featured` | Bật/tắt trạng thái featured của tác giả | `authorService.toggleFeatured(id)` | [x] | **[SELECTED]** ✅ |

---

## 5. Media Tools (9 tools)

| # | Tool Name | Mô tả | Method | Status | Selected |
|---|-----------|-------|--------|--------|----------|
| 40 | `get_media` | Lấy danh sách media với filters (loại, folder, phân trang) | `mediaService.findAll(params)` | [ ] | |
| 41 | `get_media_by_id` | Lấy chi tiết media theo ID | `mediaService.findById(id)` | [ ] | |
| 42 | `get_media_usage` | Kiểm tra media đang được dùng ở đâu | `mediaService.getUsage(id)` | [ ] | |
| 43 | `get_media_folders` | Lấy danh sách tất cả folders | `mediaService.getFolders()` | [ ] | |
| 44 | `get_media_by_section` | Lấy media theo page/section assignment | `mediaService.findBySection(pageSlug, sectionKey)` | [ ] | |
| 45 | `update_media` | Cập nhật metadata media (title, alt, caption) | `mediaService.update(id, dto)` | [ ] | |
| 46 | `delete_media` | Xóa media (kèm file vật lý) | `mediaService.delete(id)` | [ ] | |
| 47 | `assign_media_to_section` | Gán media vào một page/section | `mediaService.assignToSection(id, assignment)` | [ ] | |
| 48 | `unassign_media` | Gỡ media khỏi page/section | `mediaService.unassignFromSection(id, pageSlug, sectionKey)` | [ ] | |

---

## 6-10. Other Tools (54 tools)

> Media (9), Banner (11), SEO (16), Dictionary (13), Settings (5), User (9) - Xem chi tiết tại phase sau.

---

## Summary: Selected Tools for Phase 1 (18 tools) ✅ COMPLETED

### Post Tools (3) ✅
- [x] `get_posts` - Lấy danh sách bài viết với filters
- [x] `create_post` - Tạo bài viết mới
- [x] `update_post_status` - Đổi trạng thái bài viết

### Category Tools (9) ✅
- [x] `get_categories` - Lấy danh sách danh mục
- [x] `get_category_tree` - Lấy danh mục dạng cây
- [x] `get_category_dropdown` - Lấy danh mục cho dropdown
- [x] `get_category_by_id` - Lấy danh mục theo ID
- [x] `get_category_by_slug` - Lấy danh mục theo slug
- [x] `create_category` - Tạo danh mục mới
- [x] `update_category` - Cập nhật danh mục
- [x] `delete_category` - Xóa danh mục
- [x] `toggle_category_active` - Bật/tắt trạng thái danh mục

### Tag Tools (2) ✅
- [x] `create_tag` - Tạo tag mới
- [x] `toggle_tag_active` - Bật/tắt trạng thái tag

### Author Tools (4) ✅
- [x] `get_author_by_id` - Lấy tác giả theo ID
- [x] `create_author` - Tạo tác giả mới
- [x] `update_author` - Cập nhật tác giả
- [x] `toggle_author_featured` - Bật/tắt featured tác giả

---

## Changelog

| Date | Action | Details |
|------|--------|---------|
| 2026-01-20 | Created | Tạo checklist với 102 tools, chọn 18 tools cho Phase 1 |
| 2026-01-20 | Implemented | Hoàn thành 18 tools Phase 1 (Post: 3, Category: 9, Tag: 2, Author: 4) |
| 2026-01-20 | Refactored | Chuyển sang cấu trúc modular trong src/mcp/ |

---

## Status Legend

- `[ ]` - Pending (chưa làm)
- `[x]` - Done (đã hoàn thành)
- `[~]` - In Progress (đang làm)
- `[!]` - Blocked (bị chặn)
- `**[SELECTED]**` - Được chọn để implement trong phase hiện tại
