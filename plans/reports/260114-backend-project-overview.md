# Báo Cáo: Tổng Quan Backend AI.News

**Ngày:** 2026-01-14
**Phạm vi:** Khám phá codebase - cấu trúc và tính năng backend hiện tại

---

## Tóm Tắt

Đây là **ManagePost Backend API** - Hệ thống quản lý nội dung (CMS) cho tin tức/bài viết. Xây dựng bằng **Express.js + TypeScript + MongoDB**, cung cấp đầy đủ tính năng xuất bản nội dung, tối ưu SEO, quản lý người dùng và xử lý media.

Đặc điểm chính:
- Kiến trúc Repository pattern (Model → Repository → Service → Controller)
- Xác thực dựa trên RBAC (admin, editor, author, viewer)
- Tính năng SEO phong phú bao gồm auto-SEO tích hợp DeepSeek AI
- Cấu trúc nội dung dạng block (kiểu Notion)
- Sẵn sàng Docker với middleware bảo mật

---

## Công Nghệ Sử Dụng

| Lớp | Công nghệ |
|-----|-----------|
| Runtime | Node.js |
| Framework | Express.js 4.18 |
| Ngôn ngữ | TypeScript 5.3 |
| Database | MongoDB (Mongoose 8.9) |
| Xác thực | JWT (jsonwebtoken) |
| Testing | Jest 30 + Supertest |
| Tài liệu | Swagger UI |
| Upload | Multer 2.0 |

### Thư Viện Bảo Mật
- `helmet` - Security headers
- `express-rate-limit` - Giới hạn request
- `express-mongo-sanitize` - Chống NoSQL injection
- `hpp` - Chống HTTP parameter pollution
- `sanitize-html`, `xss-clean` - Chống XSS

---

## Cấu Trúc Dự Án

```
src/
├── config/           # Cấu hình Database, JWT, Swagger
├── controllers/      # 14 controllers (API endpoints)
├── dtos/            # Data Transfer Objects
├── middleware/      # Auth, RBAC, Security, Cache, v.v.
├── models/          # 15 Mongoose models
├── repositories/    # Lớp truy cập dữ liệu
├── routes/          # Định nghĩa routes
├── services/        # Lớp logic nghiệp vụ
├── scripts/         # Scripts seed
├── seeds/           # Dữ liệu seed
├── utils/           # Utilities
└── __tests__/       # Files test
```

---

## Models (15 tổng cộng)

| Model | Mô tả |
|-------|-------|
| **Post** | Bài viết với content blocks, SEO meta, trending |
| **Category** | Danh mục bài viết |
| **Tag** | Thẻ bài viết |
| **Author** | Thông tin tác giả (hỗ trợ E-E-A-T) |
| **User** | Người dùng hệ thống với RBAC |
| **Media** | File media đã upload |
| **Banner** | Quản lý banner/quảng cáo |
| **Dictionary** | Từ điển/định nghĩa |
| **PageContent** | Nội dung trang tĩnh |
| **Settings** | Cài đặt ứng dụng |
| **Redirect** | SEO redirects (301/302) |
| **SeoScore** | Điểm SEO cho bài viết |
| **SeoLog** | Log hoạt động SEO |
| **IndexStatus** | Trạng thái index Google |
| **Analytics** | Phân tích trang |
| **ActivityLog** | Theo dõi hoạt động người dùng |
| **Keyword** | Quản lý từ khóa |

---

## API Routes (16 nhóm)

| Route | Mục đích |
|-------|----------|
| `/api/auth` | Xác thực (đăng nhập, đăng ký) |
| `/api/users` | Quản lý người dùng |
| `/api/posts` | CRUD bài viết |
| `/api/categories` | Quản lý danh mục |
| `/api/tags` | Quản lý thẻ |
| `/api/authors` | Quản lý tác giả |
| `/api/media` | Upload file |
| `/api/banners` | Quản lý banner |
| `/api/dictionary` | Từ điển |
| `/api/settings` | Cài đặt ứng dụng |
| `/api/page-content` | Trang tĩnh |
| `/api/seo` | Quản lý SEO |
| `/api/auto-seo` | SEO tự động với AI |
| `/api/analytics` | Phân tích |
| `/api/public` | API công khai (giới hạn rate) |
| `/api/docs` | Tài liệu Swagger |

### Routes Công Khai (không có prefix /api)
- `sitemap.xml` - Sitemap động
- `robots.txt` - Cấu hình robots

---

## Tính Năng Chính

### 1. Quản Lý Nội Dung
- **Nội dung dạng block** (kiểu Notion): heading, paragraph, image, review, faq, table, list, quote, code, html
- Tự động tạo: TOC, đếm từ, thời gian đọc
- Trạng thái bài: draft, published, archived
- Trending & social metrics (share, like, comment)

### 2. Tính Năng SEO
- **Auto-SEO** tích hợp DeepSeek AI
- Tích hợp Google Search Console API
- Meta tags đầy đủ (OG, Twitter Card)
- Canonical URLs, robots directives
- News keywords, cờ evergreen
- Tạo sitemap & robots.txt
- Chấm điểm SEO & logging

### 3. Xác Thực & Phân Quyền
- Xác thực JWT
- Vai trò RBAC: admin, editor, author, viewer
- Rate limiting theo loại route
- Tự động tạo admin ban đầu

### 4. Bảo Mật
- Helmet security headers
- Rate limiters (auth, upload, public API, general)
- Cấu hình CORS
- Giới hạn kích thước request
- Sanitize input

### 5. Quản Lý Media
- Upload file với Multer
- Thư mục upload có thể cấu hình
- Thuộc tính ảnh (srcset, sizes, lazy loading)

### 6. Hỗ Trợ E-E-A-T
- Model Author riêng biệt với User
- Profile tác giả cho attribution nội dung
- Hỗ trợ hướng dẫn E-E-A-T của Google

---

## Services (17 tổng cộng)

| Service | Chức năng |
|---------|-----------|
| `auth.service` | Xác thực, khởi tạo admin |
| `post.service` | Logic bài viết |
| `category.service` | Thao tác danh mục |
| `tag.service` | Thao tác thẻ |
| `author.service` | Quản lý tác giả |
| `banner.service` | Logic banner |
| `dictionary.service` | Từ điển |
| `media.service` | Xử lý file |
| `page-content.service` | Trang tĩnh |
| `settings.service` | Cài đặt ứng dụng |
| `user.service` | Quản lý người dùng |
| `auto-seo.service` | Tạo SEO tự động |
| `deepseek-seo.service` | Tích hợp DeepSeek AI |
| `google-seo-api.service` | Google Search Console |
| `seo-scheduler.service` | Cron job SEO |
| `content-structure.service` | Parse nội dung |

---

## Middleware

| Middleware | Mục đích |
|------------|----------|
| `auth.middleware` | Xác minh JWT |
| `rbac.middleware` | Phân quyền, gắn user |
| `security.middleware` | Helmet, rate limiters, CORS |
| `redirect.middleware` | Redirect từ database |
| `cache.middleware` | Cache headers |
| `upload.middleware` | Cấu hình Multer |
| `validation.middleware` | Validate input |

---

## Testing

- **Framework**: Jest + Supertest
- **Mock DB**: mongodb-memory-server
- **Coverage**: Tests cho module Banner (API, Repository, Service)
- **Lệnh**: `npm test`, `npm test:coverage`, `npm test:banner`

---

## Triển Khai

- **Docker**: Dockerfile + docker-compose.yml
- **Port**: 4000 (mặc định) hoặc qua biến PORT
- **Database**: MongoDB (local hoặc container)

### Biến Môi Trường (.env.example)
```
PORT=5445
NODE_ENV=development
MONGODB_URI=mongodb://...
CORS_ORIGIN=http://localhost:3007
JWT_SECRET=...
DEEPSEEK_API_KEY= (tùy chọn)
GOOGLE_SERVICE_ACCOUNT_EMAIL= (tùy chọn)
GOOGLE_PRIVATE_KEY= (tùy chọn)
GOOGLE_SITE_URL= (tùy chọn)
```

---

## Thống Kê

| Metric | Số lượng |
|--------|----------|
| Models | 15 |
| Controllers | 14 |
| Services | 17 |
| Routes | 16 nhóm |
| Middleware | 7 |
| DTOs | 10 |
| Dependencies | 21 |
| Dev Dependencies | 22 |

---

## Câu Hỏi Chưa Giải Quyết

- Không có README.md - tài liệu dự án chưa rõ
- Chưa thấy chiến lược versioning API
- Chưa triển khai dịch vụ email/notification
- Hệ thống comment được tham chiếu nhưng chưa hoàn chỉnh
