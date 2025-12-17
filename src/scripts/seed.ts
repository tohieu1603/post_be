import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Load environment variables
config();

// Import models
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import { Post, ContentStructure, ContentSection } from '../models/post.model';
import { Settings } from '../models/settings.model';
import { Media } from '../models/media.model';
import { Keyword } from '../models/keyword.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';

// ============== SEED DATA ==============

// Users
const usersData = [
  {
    email: 'admin@managepost.com',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'admin' as const,
    isActive: true,
  },
  {
    email: 'editor@managepost.com',
    password: 'Editor@123',
    name: 'Editor User',
    role: 'editor' as const,
    isActive: true,
  },
  {
    email: 'author@managepost.com',
    password: 'Author@123',
    name: 'Author User',
    role: 'author' as const,
    isActive: true,
  },
];

// Categories - Vietnamese construction materials focus
const categoriesData = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech news, reviews, and tutorials',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Tin nhanh',
    slug: 'tin-nhanh',
    description: 'Tin tức nhanh về ngành vật liệu xây dựng',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Programming tutorials, tips, and best practices',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Vật liệu xây dựng',
    slug: 'vat-lieu-xay-dung',
    description: 'Thông tin về các loại vật liệu xây dựng: xi măng, gạch, thép, sơn...',
    sortOrder: 4,
    isActive: true,
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend, backend, and full-stack web development',
    sortOrder: 5,
    isActive: true,
  },
  {
    name: 'Công nghệ xây dựng',
    slug: 'cong-nghe-xay-dung',
    description: 'Công nghệ mới trong xây dựng: BIM, Smart Building, IoT...',
    sortOrder: 6,
    isActive: true,
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'iOS, Android, and cross-platform mobile development',
    sortOrder: 7,
    isActive: true,
  },
  {
    name: 'Tiêu chuẩn & Pháp lý',
    slug: 'tieu-chuan-phap-ly',
    description: 'Quy chuẩn, tiêu chuẩn và văn bản pháp lý ngành xây dựng',
    sortOrder: 8,
    isActive: true,
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, deployment, and infrastructure management',
    sortOrder: 9,
    isActive: true,
  },
  {
    name: 'Hướng dẫn',
    slug: 'huong-dan',
    description: 'Hướng dẫn thi công, lắp đặt và bảo trì công trình',
    sortOrder: 10,
    isActive: true,
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Artificial intelligence and machine learning insights',
    sortOrder: 11,
    isActive: true,
  },
  {
    name: 'Case Study',
    slug: 'case-study',
    description: 'Case study các công trình tiêu biểu',
    sortOrder: 12,
    isActive: true,
  },
];

// Tags - Mixed tech and construction
const tagsData = [
  { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E', isActive: true },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6', isActive: true },
  { name: 'React', slug: 'react', color: '#61DAFB', isActive: true },
  { name: 'Node.js', slug: 'nodejs', color: '#339933', isActive: true },
  { name: 'Python', slug: 'python', color: '#3776AB', isActive: true },
  { name: 'MongoDB', slug: 'mongodb', color: '#47A248', isActive: true },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#336791', isActive: true },
  { name: 'Docker', slug: 'docker', color: '#2496ED', isActive: true },
  { name: 'Kubernetes', slug: 'kubernetes', color: '#326CE5', isActive: true },
  { name: 'AWS', slug: 'aws', color: '#FF9900', isActive: true },
  { name: 'Next.js', slug: 'nextjs', color: '#000000', isActive: true },
  { name: 'Vue.js', slug: 'vuejs', color: '#4FC08D', isActive: true },
  { name: 'GraphQL', slug: 'graphql', color: '#E10098', isActive: true },
  { name: 'REST API', slug: 'rest-api', color: '#009688', isActive: true },
  { name: 'SEO', slug: 'seo', color: '#4285F4', isActive: true },
  // Vietnamese construction tags
  { name: 'Xi măng', slug: 'xi-mang', color: '#78909C', isActive: true },
  { name: 'Bê tông', slug: 'be-tong', color: '#607D8B', isActive: true },
  { name: 'Gạch', slug: 'gach', color: '#E57373', isActive: true },
  { name: 'Sơn', slug: 'son', color: '#BA68C8', isActive: true },
  { name: 'Kính Low-E', slug: 'kinh-low-e', color: '#06B6D4', isActive: true },
  { name: 'Tiết kiệm năng lượng', slug: 'tiet-kiem-nang-luong', color: '#22C55E', isActive: true },
  { name: 'Smart Building', slug: 'smart-building', color: '#10B981', isActive: true },
  { name: 'IoT', slug: 'iot', color: '#8B5CF6', isActive: true },
  { name: 'Nhà thầu', slug: 'nha-thau', color: '#F59E0B', isActive: true },
  { name: 'Chủ đầu tư', slug: 'chu-dau-tu', color: '#059669', isActive: true },
  { name: 'Nhà ở', slug: 'nha-o', color: '#EF4444', isActive: true },
  { name: 'Cao ốc', slug: 'cao-oc', color: '#60A5FA', isActive: true },
  { name: 'Xây nhà', slug: 'xay-nha', color: '#F97316', isActive: true },
];

// Settings
const settingsData = [
  {
    key: 'site_name',
    value: 'ManagePost',
    category: 'site' as const,
    label: 'Site Name',
    description: 'The name of your website',
  },
  {
    key: 'site_description',
    value: 'A modern content management system for articles',
    category: 'site' as const,
    label: 'Site Description',
    description: 'Brief description of your website',
  },
  {
    key: 'site_url',
    value: 'https://managepost.com',
    category: 'site' as const,
    label: 'Site URL',
    description: 'Full URL of your website',
  },
  {
    key: 'posts_per_page',
    value: 10,
    category: 'general' as const,
    label: 'Posts Per Page',
    description: 'Number of posts to display per page',
  },
  {
    key: 'enable_comments',
    value: true,
    category: 'general' as const,
    label: 'Enable Comments',
    description: 'Allow comments on posts by default',
  },
  {
    key: 'default_meta_title',
    value: 'ManagePost - Content Management',
    category: 'seo' as const,
    label: 'Default Meta Title',
    description: 'Default SEO title for pages without custom title',
  },
  {
    key: 'default_meta_description',
    value: 'Manage your content efficiently with ManagePost CMS',
    category: 'seo' as const,
    label: 'Default Meta Description',
    description: 'Default SEO description for pages',
  },
  {
    key: 'google_analytics_id',
    value: '',
    category: 'seo' as const,
    label: 'Google Analytics ID',
    description: 'Google Analytics tracking ID',
  },
];

// Helper function to generate content structure
function generateContentStructure(_title: string, content: string): ContentStructure {
  const sections: ContentSection[] = [
    {
      id: 'intro',
      type: 'paragraph',
      order: 0,
      content: content.substring(0, 500),
    },
    {
      id: 'h2-overview',
      type: 'heading',
      order: 1,
      level: 2,
      text: 'Overview',
      anchor: 'overview',
    },
    {
      id: 'overview-content',
      type: 'paragraph',
      order: 2,
      content: 'This section provides an overview of the topic discussed in this article.',
    },
    {
      id: 'h2-details',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'Key Details',
      anchor: 'key-details',
    },
    {
      id: 'details-list',
      type: 'list',
      order: 4,
      list: {
        type: 'unordered',
        items: ['Important point 1', 'Important point 2', 'Important point 3'],
      },
    },
    {
      id: 'h2-conclusion',
      type: 'heading',
      order: 5,
      level: 2,
      text: 'Conclusion',
      anchor: 'conclusion',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      order: 6,
      content: 'In conclusion, this article has covered the essential aspects of the topic.',
    },
  ];

  return {
    summary: content.substring(0, 200),
    toc: [
      { id: 'h2-overview', text: 'Overview', level: 2, anchor: 'overview' },
      { id: 'h2-details', text: 'Key Details', level: 2, anchor: 'key-details' },
      { id: 'h2-conclusion', text: 'Conclusion', level: 2, anchor: 'conclusion' },
    ],
    sections,
    wordCount: content.split(/\s+/).length,
    estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
    lastStructureUpdate: new Date().toISOString(),
  };
}

// Posts data generator - Using proper Markdown format
function generatePostsData(categoryIds: mongoose.Types.ObjectId[], tagIds: mongoose.Types.ObjectId[]) {
  const postsContent = [
    // ============ TECH POSTS (English) ============
    {
      title: 'Getting Started with TypeScript in 2024',
      slug: 'getting-started-typescript-2024',
      excerpt: 'Learn the fundamentals of TypeScript and why it has become essential for modern web development.',
      content: `TypeScript has become the de facto standard for building scalable JavaScript applications. In this comprehensive guide, we'll explore the fundamentals of TypeScript and how to get started with it in your projects.

## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds optional static typing and class-based object-oriented programming to the language.

### Key Features

- **Static Type Checking**: Catch errors at compile time rather than runtime
- **Enhanced IDE Support**: Better IntelliSense, code completion, and refactoring
- **Modern JavaScript Features**: Use ES6+ features with backward compatibility
- **Gradual Adoption**: Add types incrementally to existing JavaScript projects

## Why Use TypeScript?

- Catch errors early in development
- Better IDE support and IntelliSense
- Improved code documentation
- Easier refactoring

## Setting Up Your First TypeScript Project

To get started with TypeScript, you need to install it globally or as a dev dependency in your project:

\`\`\`bash
npm install -g typescript
# or
npm install --save-dev typescript
\`\`\`

### Basic Configuration

Create a \`tsconfig.json\` file:

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist"
  }
}
\`\`\`

## Conclusion

TypeScript is an invaluable tool for modern JavaScript development. Start using it today to improve your code quality and developer experience.`,
      categoryIndex: 2, // Programming
      tagIndices: [0, 1], // JavaScript, TypeScript
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80',
    },
    {
      title: 'Building RESTful APIs with Node.js and Express',
      slug: 'building-restful-apis-nodejs-express',
      excerpt: 'A complete guide to creating robust REST APIs using Node.js and Express framework.',
      content: `REST APIs are the backbone of modern web applications. In this tutorial, we'll build a complete REST API using Node.js and Express.

## Prerequisites

Before we begin, make sure you have Node.js installed on your system. We'll also use npm to manage our dependencies.

## Setting Up the Project

Let's start by creating a new Node.js project and installing the necessary dependencies:

\`\`\`bash
npm init -y
npm install express mongoose dotenv cors helmet
npm install --save-dev nodemon typescript @types/express
\`\`\`

## Project Structure

\`\`\`
src/
├── controllers/
├── models/
├── routes/
├── middleware/
└── index.ts
\`\`\`

## Creating the Server

\`\`\`typescript
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Best Practices

- Use proper HTTP status codes
- Implement input validation
- Add authentication and authorization
- Document your API with Swagger/OpenAPI
- Implement rate limiting

## Conclusion

Building REST APIs with Node.js and Express is straightforward and efficient. Follow these patterns to create scalable APIs.`,
      categoryIndex: 4, // Web Development
      tagIndices: [3, 13], // Node.js, REST API
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    },
    {
      title: 'React Hooks: A Complete Guide',
      slug: 'react-hooks-complete-guide',
      excerpt: 'Master React Hooks with practical examples and best practices.',
      content: `React Hooks were introduced in React 16.8 and have revolutionized how we write React components. This guide covers all the essential hooks.

## useState Hook

The useState hook allows you to add state to functional components:

\`\`\`typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in functional components:

\`\`\`typescript
useEffect(() => {
  document.title = \`Count: \${count}\`;

  return () => {
    // Cleanup function
  };
}, [count]); // Dependency array
\`\`\`

## useContext Hook

The useContext hook provides a way to pass data through the component tree without having to pass props manually.

## Custom Hooks

You can create your own hooks to extract and reuse stateful logic between components:

\`\`\`typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
\`\`\`

## Best Practices

- Follow the Rules of Hooks
- Use the exhaustive-deps ESLint rule
- Keep hooks at the top level
- Name custom hooks with "use" prefix

## Conclusion

React Hooks make it easier to reuse stateful logic and write cleaner code.`,
      categoryIndex: 4, // Web Development
      tagIndices: [0, 2], // JavaScript, React
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    },

    // ============ VIETNAMESE CONSTRUCTION POSTS ============
    {
      title: 'Kính Low-E là gì? Có nên sử dụng cho nhà ở?',
      slug: 'kinh-low-e-la-gi-co-nen-su-dung-cho-nha-o',
      excerpt: 'Tìm hiểu về kính Low-E, nguyên lý hoạt động, ưu nhược điểm và chi phí để quyết định có nên sử dụng cho ngôi nhà của bạn.',
      content: `Kính Low-E (Low Emissivity) đang trở thành lựa chọn phổ biến trong xây dựng nhà ở hiện đại. Bài viết này sẽ giúp bạn hiểu rõ về loại kính này.

## Kính Low-E là gì?

Kính Low-E là loại kính có lớp phủ kim loại oxide siêu mỏng (thường là bạc hoặc thiếc) trên bề mặt, giúp phản xạ tia hồng ngoại và tia UV trong khi vẫn cho ánh sáng khả kiến đi qua.

### Cấu tạo kính Low-E

| Lớp | Chức năng |
|-----|-----------|
| Lớp kính ngoài | Bảo vệ, chịu thời tiết |
| Lớp phủ Low-E | Phản xạ nhiệt, UV |
| Khoảng không khí/Argon | Cách nhiệt |
| Lớp kính trong | Bảo vệ lớp phủ |

## Nguyên lý hoạt động

1. **Mùa hè**: Phản xạ 70-80% bức xạ nhiệt từ mặt trời ra ngoài
2. **Mùa đông**: Giữ lại 90% nhiệt trong nhà
3. **Quanh năm**: Chặn 99% tia UV gây hại

## So sánh với kính thường

| Tiêu chí | Kính thường | Kính Low-E |
|----------|-------------|------------|
| Hệ số U | 5.8 W/m²K | 1.6-2.0 W/m²K |
| Truyền sáng | 85-90% | 70-80% |
| Chống UV | 30% | 99% |
| Giá thành | 300-500k/m² | 800k-1.5tr/m² |

## Ưu điểm

- ✅ Tiết kiệm 25-30% chi phí điều hòa
- ✅ Bảo vệ nội thất khỏi phai màu do UV
- ✅ Giảm tiếng ồn (loại 2 lớp)
- ✅ Tăng giá trị bất động sản

## Nhược điểm

- ❌ Chi phí cao hơn 2-3 lần kính thường
- ❌ Màu sắc có thể hơi xanh/xám
- ❌ Không phù hợp cho cây cần nhiều nắng
- ❌ Khó sửa chữa nếu lớp phủ bị hỏng

## Có nên dùng cho nhà ở?

**Nên dùng khi:**
- Nhà hướng Tây/Tây Nam
- Vùng khí hậu nóng (miền Nam, miền Trung)
- Căn hộ cao tầng nhiều kính
- Có nhu cầu tiết kiệm năng lượng

**Cân nhắc thêm khi:**
- Nhà hướng Bắc (ít nắng)
- Ngân sách hạn chế
- Nhà có mái che rộng

## Chi phí tham khảo 2024

- **Kính Low-E đơn**: 800.000 - 1.200.000 VNĐ/m²
- **Kính Low-E hộp (2 lớp)**: 1.500.000 - 2.500.000 VNĐ/m²
- **Kính Low-E 3 lớp cao cấp**: 3.000.000 - 5.000.000 VNĐ/m²

## Kết luận

Kính Low-E là giải pháp đáng đầu tư cho nhà ở hiện đại, đặc biệt ở vùng khí hậu nhiệt đới như Việt Nam. Chi phí ban đầu cao hơn nhưng sẽ thu hồi qua tiết kiệm điện năng trong 5-7 năm.`,
      categoryIndex: 3, // Vật liệu xây dựng
      tagIndices: [19, 20, 26], // Kính Low-E, Tiết kiệm năng lượng, Nhà ở
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    },
    {
      title: 'Bê tông cường độ cao C80 - Giải pháp cho siêu cao ốc Việt Nam',
      slug: 'be-tong-cuong-do-cao-c80-sieu-cao-oc',
      excerpt: 'Phân tích chi tiết về bê tông cường độ cao C80, thành phần, quy trình sản xuất và ứng dụng trong các công trình cao tầng tại Việt Nam.',
      content: `Bê tông cường độ cao (High Performance Concrete - HPC) C80 đang được sử dụng rộng rãi trong các dự án siêu cao ốc tại Việt Nam. Hãy tìm hiểu về loại vật liệu đặc biệt này.

## Bê tông C80 là gì?

Bê tông C80 là loại bê tông có cường độ nén đặc trưng ≥ 80 MPa (tương đương 800 kg/cm²) sau 28 ngày bảo dưỡng. So với bê tông thường (C25-C30), C80 có cường độ gấp 2.5-3 lần.

### Phân loại bê tông theo cường độ

| Loại | Cường độ (MPa) | Ứng dụng |
|------|----------------|----------|
| Thường | 20-40 | Nhà dân dụng 1-5 tầng |
| Cao | 50-80 | Cao ốc 20-50 tầng |
| Siêu cao | 80-120 | Siêu cao ốc >50 tầng |
| Cực cao | >120 | Công trình đặc biệt |

## Thành phần cấp phối

Cấp phối bê tông C80 điển hình (cho 1m³):

\`\`\`
Xi măng PC50:        480-520 kg
Silica fume:         40-60 kg (8-10% xi măng)
Cát vàng (Mn 2.5):   650-700 kg
Đá 1x2 (granite):    1050-1100 kg
Nước:                150-165 lít (N/X = 0.28-0.32)
Phụ gia siêu dẻo:    8-12 lít (1.5-2.5% xi măng)
\`\`\`

### Vai trò từng thành phần

1. **Xi măng PC50**: Cung cấp cường độ nền
2. **Silica fume**: Tăng cường độ, giảm độ rỗng
3. **Phụ gia siêu dẻo**: Giảm nước, tăng độ sụt
4. **Cốt liệu chất lượng cao**: Đảm bảo cường độ tổng thể

## Quy trình sản xuất

### Bước 1: Chuẩn bị nguyên liệu
- Kiểm tra chất lượng từng thành phần
- Cân đong chính xác (sai số ≤1%)
- Làm ẩm cốt liệu (độ ẩm 3-5%)

### Bước 2: Trộn bê tông
- Thời gian trộn: 90-120 giây (dài hơn bê tông thường)
- Nhiệt độ trộn: 20-25°C
- Kiểm tra độ sụt: 18-22cm

### Bước 3: Vận chuyển và đổ
- Thời gian tối đa: 60 phút từ khi trộn
- Xe bồn phải quay liên tục
- Đổ từng lớp 30-40cm

### Bước 4: Bảo dưỡng
- Phủ kín bề mặt ngay sau đổ
- Tưới nước liên tục 7-14 ngày
- Tháo ván khuôn sau 3-7 ngày

## Ứng dụng tại Việt Nam

### Các công trình tiêu biểu

| Công trình | Tầng | Bê tông sử dụng |
|------------|------|-----------------|
| Landmark 81 | 81 | C80-C100 |
| Keangnam Hanoi | 72 | C60-C80 |
| Bitexco Tower | 68 | C50-C70 |
| Vietinbank Tower | 68 | C60-C80 |

### Lý do sử dụng C80 cho cao ốc

1. **Giảm kích thước cột**: Tiết kiệm 20-30% diện tích sàn
2. **Giảm tải trọng bản thân**: Nhẹ hơn 15-20% so với bê tông thường
3. **Tăng độ cứng**: Giảm dao động do gió
4. **Độ bền cao**: Tuổi thọ công trình >100 năm

## Thách thức khi sử dụng

- ⚠️ Yêu cầu kỹ thuật cao trong thi công
- ⚠️ Chi phí cao hơn 40-60% so với bê tông thường
- ⚠️ Cần thiết bị bơm chuyên dụng
- ⚠️ Kiểm soát nhiệt thủy hóa nghiêm ngặt

## Giá thành tham khảo 2024

- **Bê tông C80 thương phẩm**: 2.500.000 - 3.200.000 VNĐ/m³
- **Chi phí bơm cao tầng**: 150.000 - 300.000 VNĐ/m³
- **Tổng chi phí hoàn thiện**: 3.000.000 - 4.000.000 VNĐ/m³

## Kết luận

Bê tông C80 là giải pháp không thể thiếu cho các siêu cao ốc tại Việt Nam. Mặc dù chi phí cao hơn, nhưng lợi ích về diện tích sử dụng và độ bền công trình hoàn toàn xứng đáng với khoản đầu tư.`,
      categoryIndex: 3, // Vật liệu xây dựng
      tagIndices: [16, 27], // Bê tông, Cao ốc
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    },
    {
      title: 'Hướng dẫn chống thấm sân thượng bằng màng Bitum tự dính',
      slug: 'huong-dan-chong-tham-san-thuong-mang-bitum',
      excerpt: 'Hướng dẫn chi tiết từng bước thi công chống thấm sân thượng bằng màng bitum tự dính, từ chuẩn bị bề mặt đến hoàn thiện.',
      content: `Chống thấm sân thượng là công việc quan trọng để bảo vệ ngôi nhà. Màng bitum tự dính là giải pháp hiệu quả và dễ thi công. Bài viết này hướng dẫn chi tiết quy trình.

## Vật liệu cần chuẩn bị

### Vật liệu chính
- Màng bitum tự dính (3-4mm): 1.1 x diện tích sân thượng
- Sơn lót gốc bitum: 0.3-0.4 kg/m²
- Băng keo bitum góc: 20cm x chiều dài góc

### Dụng cụ
- Chổi quét sơn lót
- Dao rọc giấy
- Rulô ép màng
- Đèn khò gas (tùy chọn)
- Găng tay, kính bảo hộ

## Quy trình thi công

### Bước 1: Chuẩn bị bề mặt

**Yêu cầu bề mặt:**
- Khô ráo (độ ẩm < 8%)
- Sạch bụi, dầu mỡ
- Phẳng, không có vết nứt > 3mm
- Bo tròn góc tường-sàn (R ≥ 5cm)

**Xử lý vết nứt:**
\`\`\`
1. Đục mở rộng vết nứt hình chữ V
2. Vệ sinh sạch, thổi bụi
3. Trám vữa không co ngót
4. Chờ khô 24-48 giờ
\`\`\`

### Bước 2: Quét sơn lót

1. Khuấy đều sơn lót trước khi dùng
2. Quét đều 1-2 lớp lên toàn bộ bề mặt
3. Chú ý quét kỹ các góc, cạnh
4. Chờ khô 4-6 giờ (bề mặt không dính tay)

### Bước 3: Dán màng bitum

**Thứ tự dán:**
1. Dán góc tường-sàn trước
2. Dán đáy (điểm thấp nhất)
3. Dán các vạt từ thấp lên cao
4. Dán chồng mí 10cm

**Kỹ thuật dán:**
\`\`\`
1. Cắt màng theo kích thước + 20cm dự phòng
2. Định vị màng, đánh dấu
3. Bóc lớp film bảo vệ 1/2 chiều dài
4. Dán và ép từ giữa ra hai bên
5. Bóc tiếp film, dán phần còn lại
6. Rulô ép chặt toàn bộ bề mặt
\`\`\`

### Bước 4: Xử lý mối nối

| Vị trí | Độ chồng mí | Ghi chú |
|--------|-------------|---------|
| Chiều dọc | ≥ 10cm | Hướng dốc nước |
| Chiều ngang | ≥ 15cm | Tại điểm nối cuộn |
| Góc tường | 15-20cm | Dán lên tường |
| Hố thu nước | Toàn bộ miệng | Ép chặt |

### Bước 5: Kiểm tra và hoàn thiện

**Kiểm tra chất lượng:**
- [ ] Không có bọt khí
- [ ] Mối nối kín, không hở
- [ ] Bám dính tốt vào bề mặt
- [ ] Không có chỗ nhăn, gấp

**Thử nước:**
1. Bịt các lỗ thoát nước
2. Đổ nước cao 3-5cm
3. Ngâm 48-72 giờ
4. Kiểm tra trần tầng dưới

## Sai lầm thường gặp

❌ **Không xử lý bề mặt kỹ**
→ Màng không bám dính, bong tróc

❌ **Dán khi trời ẩm/mưa**
→ Nước đọng dưới màng, phồng rộp

❌ **Chồng mí không đủ**
→ Nước thấm qua mối nối

❌ **Không xử lý góc**
→ Điểm yếu, dễ rò rỉ

## Chi phí tham khảo

| Hạng mục | Đơn giá | Ghi chú |
|----------|---------|---------|
| Màng bitum 3mm | 85.000-120.000 đ/m² | Nhập khẩu cao hơn |
| Sơn lót | 15.000-25.000 đ/m² | Tùy hãng |
| Băng keo góc | 50.000-80.000 đ/m | Cuộn 10m |
| Nhân công | 50.000-80.000 đ/m² | Tùy địa phương |
| **Tổng cộng** | **200.000-300.000 đ/m²** | - |

## Bảo trì sau thi công

- Kiểm tra định kỳ 6 tháng/lần
- Không để vật nặng/sắc nhọn trên mái
- Sơn phủ bảo vệ UV sau 3-5 năm
- Sửa chữa ngay khi phát hiện hư hỏng

## Kết luận

Màng bitum tự dính là giải pháp chống thấm hiệu quả, dễ thi công cho sân thượng. Với quy trình đúng kỹ thuật, tuổi thọ có thể đạt 10-15 năm.`,
      categoryIndex: 9, // Hướng dẫn
      tagIndices: [26, 24], // Nhà ở, Nhà thầu
      status: 'published' as const,
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    },
    {
      title: 'BIM Level 2 là gì? Lộ trình áp dụng BIM tại Việt Nam',
      slug: 'bim-level-2-la-gi-lo-trinh-ap-dung-tai-viet-nam',
      excerpt: 'Tìm hiểu về các cấp độ BIM, đặc biệt là BIM Level 2 và lộ trình áp dụng BIM bắt buộc tại Việt Nam theo quy định mới.',
      content: `Building Information Modeling (BIM) đang trở thành xu hướng bắt buộc trong ngành xây dựng Việt Nam. Bài viết này giải thích các cấp độ BIM và lộ trình triển khai.

## BIM là gì?

BIM (Building Information Modeling) là quy trình tạo và quản lý thông tin công trình xây dựng trong suốt vòng đời dự án, từ thiết kế đến thi công, vận hành và phá dỡ.

### So sánh CAD truyền thống và BIM

| Tiêu chí | CAD | BIM |
|----------|-----|-----|
| Dữ liệu | 2D, tĩnh | 3D+, động |
| Thông tin | Hình học | Hình học + Thuộc tính |
| Phối hợp | Thủ công | Tự động |
| Xung đột | Phát hiện tại công trường | Phát hiện trên mô hình |
| Bóc tách KL | Đo thủ công | Tự động |

## Các cấp độ BIM

### Level 0: CAD không kết nối
- Bản vẽ 2D độc lập
- Không chia sẻ dữ liệu
- Xuất giấy để phối hợp

### Level 1: CAD có quản lý
- CAD 2D/3D có tiêu chuẩn
- Dữ liệu được quản lý tập trung
- Chưa có mô hình chung

### Level 2: BIM phối hợp ⭐
- Mô hình 3D riêng của từng bộ môn
- Trao đổi qua định dạng chung (IFC, COBie)
- Phát hiện xung đột (Clash Detection)
- **Đây là cấp độ Việt Nam đang hướng đến**

### Level 3: BIM tích hợp
- Mô hình chung trên cloud
- Làm việc đồng thời real-time
- Tích hợp IoT, AI

## BIM Level 2 chi tiết

### Yêu cầu kỹ thuật

\`\`\`
1. Phần mềm BIM (Revit, ArchiCAD, Tekla...)
2. Định dạng trao đổi: IFC 2x3 trở lên
3. CDE (Common Data Environment)
4. Quy trình phối hợp tiêu chuẩn
5. BIM Execution Plan (BEP)
\`\`\`

### Các use case phổ biến

| Use Case | Mô tả | Lợi ích |
|----------|-------|---------|
| Clash Detection | Phát hiện xung đột MEP-Kết cấu | Giảm 80% lỗi tại công trường |
| 4D Simulation | Mô phỏng tiến độ | Tối ưu 15-20% thời gian |
| 5D Estimation | Bóc tách khối lượng | Chính xác 95%+ |
| Visualization | Render, VR | Duyệt thiết kế nhanh |

## Lộ trình BIM tại Việt Nam

### Văn bản pháp lý

- **Quyết định 258/QĐ-BXD (2023)**: Lộ trình BIM giai đoạn 2 (2023-2025)
- **TCVN 12910:2020**: Tiêu chuẩn BIM quốc gia

### Lộ trình bắt buộc

| Năm | Yêu cầu |
|-----|---------|
| 2023 | Khuyến khích dự án vốn nhà nước >120 tỷ |
| 2024 | Bắt buộc dự án vốn nhà nước >200 tỷ |
| 2025 | Bắt buộc dự án vốn nhà nước >100 tỷ |
| 2026+ | Mở rộng sang dự án tư nhân |

### Chi phí triển khai BIM

| Hạng mục | Chi phí | Ghi chú |
|----------|---------|---------|
| Phần mềm | 50-200 tr/user/năm | Revit, Navisworks |
| Đào tạo | 10-30 tr/người | Khóa 2-4 tuần |
| Phần cứng | 30-80 tr/máy | Workstation |
| Tư vấn BIM | 1-3% giá trị dự án | BIM Manager |

## Thách thức tại Việt Nam

### Rào cản áp dụng

1. **Nhân lực**: Thiếu kỹ sư BIM có kinh nghiệm
2. **Chi phí**: Đầu tư ban đầu lớn
3. **Thói quen**: Quen làm việc với CAD 2D
4. **Hợp đồng**: Chưa có mẫu hợp đồng BIM chuẩn

### Giải pháp

- Đào tạo nội bộ kết hợp thuê ngoài
- Triển khai từ dự án pilot
- Xây dựng thư viện BIM Việt Nam
- Tham khảo tiêu chuẩn quốc tế (UK, Singapore)

## Kết luận

BIM Level 2 là bước đi tất yếu của ngành xây dựng Việt Nam. Doanh nghiệp cần chuẩn bị từ bây giờ để đáp ứng yêu cầu pháp lý và nâng cao năng lực cạnh tranh.`,
      categoryIndex: 5, // Công nghệ xây dựng
      tagIndices: [21, 22, 25], // Smart Building, IoT, Chủ đầu tư
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    },
    {
      title: 'So sánh chứng chỉ LEED và LOTUS - Nên chọn loại nào?',
      slug: 'so-sanh-chung-chi-leed-va-lotus-nen-chon-loai-nao',
      excerpt: 'Phân tích chi tiết hai hệ thống chứng chỉ công trình xanh phổ biến nhất tại Việt Nam: LEED (Mỹ) và LOTUS (Việt Nam).',
      content: `Chứng chỉ công trình xanh đang trở thành yếu tố quan trọng trong các dự án bất động sản cao cấp. LEED và LOTUS là hai lựa chọn phổ biến nhất tại Việt Nam.

## Tổng quan

### LEED (Leadership in Energy and Environmental Design)
- **Nguồn gốc**: Hội đồng Công trình Xanh Mỹ (USGBC)
- **Năm ra đời**: 1998
- **Phạm vi**: Toàn cầu (190+ quốc gia)
- **Số dự án VN**: ~200 dự án (2024)

### LOTUS (Leaders in Sustainable Design)
- **Nguồn gốc**: Hội đồng Công trình Xanh Việt Nam (VGBC)
- **Năm ra đời**: 2010
- **Phạm vi**: Việt Nam
- **Số dự án VN**: ~100 dự án (2024)

## So sánh chi tiết

### Hạng mục đánh giá

| Hạng mục | LEED v4.1 | LOTUS v3 |
|----------|-----------|----------|
| Năng lượng | 33 điểm | 26 điểm |
| Nước | 11 điểm | 12 điểm |
| Vật liệu | 13 điểm | 14 điểm |
| Chất lượng không khí | 16 điểm | 10 điểm |
| Vị trí & Giao thông | 16 điểm | 12 điểm |
| Đổi mới | 6 điểm | 6 điểm |
| **Tổng** | **110 điểm** | **100 điểm** |

### Cấp độ chứng chỉ

| Cấp độ | LEED | LOTUS |
|--------|------|-------|
| Đạt chuẩn | 40-49 | 45-54 |
| Bạc | 50-59 | 55-64 |
| Vàng | 60-79 | 65-79 |
| Bạch kim | 80+ | 80+ |

### Chi phí

| Hạng mục | LEED | LOTUS |
|----------|------|-------|
| Phí đăng ký | $1,500-3,000 | 25-50 triệu VNĐ |
| Phí chứng nhận | $3,500-27,500 | 50-150 triệu VNĐ |
| Tư vấn | 0.5-1.5% giá trị XD | 0.3-0.8% giá trị XD |
| **Tổng chi phí** | **$50,000-200,000** | **200-600 triệu VNĐ** |

## Ưu nhược điểm

### LEED

**Ưu điểm:**
- ✅ Uy tín quốc tế cao
- ✅ Thu hút khách thuê nước ngoài
- ✅ Tài liệu, hướng dẫn phong phú
- ✅ Giá trị bất động sản tăng 10-30%

**Nhược điểm:**
- ❌ Chi phí cao
- ❌ Tiêu chí chưa phù hợp khí hậu nhiệt đới
- ❌ Quy trình phức tạp, thời gian dài
- ❌ Yêu cầu Commissioning Agent

### LOTUS

**Ưu điểm:**
- ✅ Chi phí thấp hơn 50-70%
- ✅ Phù hợp điều kiện Việt Nam
- ✅ Hỗ trợ tiếng Việt
- ✅ Được Bộ Xây dựng công nhận
- ✅ Quy trình đơn giản hơn

**Nhược điểm:**
- ❌ Ít được quốc tế biết đến
- ❌ Ít dự án tham chiếu
- ❌ Chưa có phiên bản cho tất cả loại công trình

## Nên chọn loại nào?

### Chọn LEED khi:
- Dự án có nhà đầu tư/khách thuê quốc tế
- Cao ốc văn phòng hạng A
- Muốn tạo thương hiệu "xanh" quốc tế
- Ngân sách dồi dào

### Chọn LOTUS khi:
- Dự án trong nước, ngân sách hạn chế
- Nhà ở, trường học, bệnh viện
- Cần chứng chỉ nhanh
- Muốn tối ưu cho khí hậu Việt Nam

### Có thể kết hợp:
- LEED cho tòa nhà chính
- LOTUS cho các hạng mục phụ

## Lợi ích kinh doanh

| Chỉ số | LEED | LOTUS |
|--------|------|-------|
| Tiết kiệm năng lượng | 25-35% | 20-30% |
| Tiết kiệm nước | 30-50% | 25-40% |
| Tăng giá thuê | 10-20% | 5-15% |
| Giảm chi phí vận hành | 15-25% | 10-20% |
| Tăng tỷ lệ lấp đầy | 5-10% | 3-8% |

## Xu hướng 2024-2025

1. **LEED Zero**: Chứng nhận Net Zero Energy/Carbon
2. **LOTUS cho nhà ở**: Phiên bản mới cho chung cư
3. **Kết hợp WELL**: Sức khỏe người sử dụng
4. **ESG Reporting**: Tích hợp báo cáo phát triển bền vững

## Kết luận

Cả LEED và LOTUS đều là lựa chọn tốt cho công trình xanh tại Việt Nam. LEED phù hợp với dự án cao cấp hướng đến khách hàng quốc tế, trong khi LOTUS là lựa chọn thực tế và tiết kiệm cho đa số dự án nội địa.`,
      categoryIndex: 7, // Tiêu chuẩn & Pháp lý
      tagIndices: [20, 21, 25], // Tiết kiệm năng lượng, Smart Building, Chủ đầu tư
      status: 'published' as const,
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
    },
    {
      title: 'Viglacera ra mắt dòng gạch porcelain siêu mỏng 3mm cho facade',
      slug: 'viglacera-ra-mat-gach-porcelain-sieu-mong-3mm',
      excerpt: 'Viglacera giới thiệu dòng gạch porcelain siêu mỏng 3mm dùng cho facade tòa nhà, mở ra xu hướng mới trong ngành vật liệu xây dựng Việt Nam.',
      content: `Ngày 15/12/2024, Viglacera chính thức ra mắt dòng sản phẩm gạch porcelain siêu mỏng 3mm - Viglacera Ultra Thin, đánh dấu bước tiến mới trong ngành sản xuất vật liệu xây dựng Việt Nam.

## Thông tin sản phẩm

### Thông số kỹ thuật

| Thông số | Giá trị |
|----------|---------|
| Độ dày | 3mm (±0.2mm) |
| Kích thước | 1200x2400mm, 1200x3000mm |
| Trọng lượng | 7.2 kg/m² |
| Độ hút nước | <0.1% |
| Độ cứng Mohs | 7-8 |
| Chịu uốn | >35 N/mm² |

### Ưu điểm nổi bật

1. **Siêu nhẹ**: Nhẹ hơn gạch thường 70%
2. **Dễ thi công**: Cắt bằng dao cắt kính
3. **Linh hoạt**: Uốn cong được (bán kính ≥5m)
4. **Đa dạng bề mặt**: 20+ mẫu vân đá, vân gỗ
5. **Chống phai màu**: Đảm bảo 30 năm

## Ứng dụng

### Facade tòa nhà
- Cao ốc văn phòng
- Trung tâm thương mại
- Khách sạn cao cấp

### Nội thất
- Ốp tường phòng khách
- Bàn countertop
- Cửa tủ bếp

## So sánh với vật liệu truyền thống

| Tiêu chí | Gạch 3mm | Gạch 10mm | Đá granite |
|----------|----------|-----------|------------|
| Trọng lượng | 7.2 kg/m² | 24 kg/m² | 27 kg/m² |
| Giá thành | 800k/m² | 450k/m² | 1.2tr/m² |
| Thi công | Dễ | TB | Khó |
| Bảo trì | Thấp | Thấp | TB |

## Giá bán tham khảo

- **Dòng Standard**: 650.000 - 800.000 VNĐ/m²
- **Dòng Premium**: 900.000 - 1.200.000 VNĐ/m²
- **Dòng Luxury**: 1.500.000 - 2.000.000 VNĐ/m²

## Dự án áp dụng đầu tiên

Viglacera Ultra Thin sẽ được sử dụng cho:
- Tòa nhà Viglacera Tower (Hà Nội)
- Khu đô thị Vinhomes Ocean Park 3
- Khách sạn Marriott Đà Nẵng (renovate)

## Nhận định chuyên gia

> "Đây là bước đột phá của ngành gốm sứ Việt Nam. Viglacera Ultra Thin mở ra cơ hội cạnh tranh với các thương hiệu quốc tế như Laminam (Ý), Neolith (Tây Ban Nha)."
>
> — KTS. Nguyễn Văn A, Hội KTS Việt Nam

## Kết luận

Viglacera Ultra Thin đánh dấu bước tiến quan trọng trong ngành vật liệu xây dựng Việt Nam, mang đến giải pháp facade hiện đại, tiết kiệm chi phí vận chuyển và thi công.`,
      categoryIndex: 1, // Tin nhanh
      tagIndices: [17, 27, 25], // Gạch, Cao ốc, Chủ đầu tư
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    },
    {
      title: 'Hệ thống điều hòa VRV/VRF - Giải pháp cho tòa nhà văn phòng',
      slug: 'he-thong-dieu-hoa-vrv-vrf-toa-nha-van-phong',
      excerpt: 'Tìm hiểu về hệ thống điều hòa VRV/VRF, nguyên lý hoạt động, ưu nhược điểm và chi phí đầu tư cho tòa nhà văn phòng.',
      content: `Hệ thống điều hòa VRV/VRF (Variable Refrigerant Volume/Flow) đang trở thành lựa chọn phổ biến cho các tòa nhà văn phòng tại Việt Nam nhờ khả năng tiết kiệm năng lượng và linh hoạt trong vận hành.

## VRV/VRF là gì?

VRV (Variable Refrigerant Volume) là công nghệ điều hòa do Daikin phát minh năm 1982. VRF (Variable Refrigerant Flow) là tên gọi chung của công nghệ này từ các hãng khác.

### Nguyên lý hoạt động

1. **Một dàn nóng - nhiều dàn lạnh**: 1 outdoor có thể kết nối 2-64 indoor
2. **Biến tần Inverter**: Điều chỉnh tốc độ máy nén liên tục
3. **Điều khiển lưu lượng gas**: Cấp đúng lượng gas cần thiết cho từng phòng
4. **Thu hồi nhiệt**: Một số phòng làm lạnh, phòng khác sưởi đồng thời

## So sánh các hệ thống HVAC

| Tiêu chí | Split | VRV/VRF | Chiller |
|----------|-------|---------|---------|
| Công suất | 2-5HP | 8-60HP | >100HP |
| Số indoor/outdoor | 1-4 | 2-64 | Unlimited |
| Hiệu suất COP | 2.5-3.5 | 4.0-5.5 | 5.0-7.0 |
| Chi phí đầu tư | Thấp | TB | Cao |
| Chi phí vận hành | Cao | Thấp | TB |
| Độ phức tạp | Thấp | TB | Cao |

## Các hãng VRV/VRF phổ biến tại VN

| Hãng | Xuất xứ | Model | Đặc điểm |
|------|---------|-------|----------|
| Daikin | Nhật | VRV X | Uy tín nhất, giá cao |
| Mitsubishi | Nhật | City Multi | Bền, ít hỏng |
| LG | Hàn | Multi V | Giá tốt, công nghệ mới |
| Samsung | Hàn | DVM S2 | Giá cạnh tranh |
| Midea | TQ | V6 | Giá rẻ nhất |

## Ưu điểm VRV/VRF

### Tiết kiệm năng lượng
- Giảm 30-50% điện năng so với hệ thống split
- Biến tần điều chỉnh theo tải thực tế
- Thu hồi nhiệt giữa các zone

### Linh hoạt thiết kế
- Đường ống gas dài đến 165m
- Chênh cao outdoor-indoor đến 90m
- Nhiều loại indoor: cassette, ống gió, treo tường...

### Dễ vận hành
- Điều khiển tập trung qua BMS
- Tính năng tự chẩn đoán lỗi
- Bảo trì từng cụm, không ảnh hưởng toàn bộ

## Nhược điểm cần lưu ý

- ❌ Chi phí đầu tư ban đầu cao
- ❌ Cần nhà thầu có kinh nghiệm
- ❌ Sửa chữa phức tạp hơn split
- ❌ Rủi ro rò gas ảnh hưởng nhiều phòng

## Chi phí đầu tư tham khảo

### Văn phòng 1000m² (20 phòng)

| Hạng mục | Chi phí |
|----------|---------|
| Thiết bị Daikin | 1.5 - 1.8 tỷ |
| Thiết bị LG/Samsung | 1.2 - 1.4 tỷ |
| Thiết bị Midea | 0.8 - 1.0 tỷ |
| Lắp đặt + Vật tư | 300 - 500 triệu |
| **Tổng (Daikin)** | **1.8 - 2.3 tỷ** |

### Chi phí vận hành

- Điện năng: 15.000 - 25.000 VNĐ/m²/tháng
- Bảo trì: 3.000 - 5.000 VNĐ/m²/tháng

## Lưu ý khi thiết kế

1. **Tính toán tải nhiệt chính xác** (25-35°C ngoài trời)
2. **Chọn vị trí outdoor** (thông gió, ít tiếng ồn)
3. **Thiết kế đường ống** (ngắn nhất, ít gấp khúc)
4. **Dự phòng công suất** 10-15%
5. **Tích hợp BMS** từ đầu

## Kết luận

VRV/VRF là giải pháp tối ưu cho tòa nhà văn phòng 500-5000m² tại Việt Nam. Mặc dù chi phí đầu tư cao hơn split, nhưng tiết kiệm năng lượng sẽ hoàn vốn trong 3-5 năm.`,
      categoryIndex: 5, // Công nghệ xây dựng
      tagIndices: [20, 21, 27], // Tiết kiệm năng lượng, Smart Building, Cao ốc
      status: 'published' as const,
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80',
    },
    {
      title: 'Review sơn chống thấm Kova CT-11A sau 2 năm sử dụng',
      slug: 'review-son-chong-tham-kova-ct-11a-sau-2-nam',
      excerpt: 'Đánh giá thực tế sơn chống thấm Kova CT-11A sau 2 năm sử dụng cho sân thượng nhà phố, ưu nhược điểm và kinh nghiệm thi công.',
      content: `Sau 2 năm sử dụng sơn chống thấm Kova CT-11A cho sân thượng nhà phố tại TP.HCM, tôi chia sẻ đánh giá thực tế về sản phẩm này.

## Thông tin sản phẩm

- **Tên**: Kova CT-11A Nano
- **Hãng**: Công ty Sơn Kova
- **Loại**: Sơn chống thấm gốc xi măng polymer
- **Màu sắc**: Trắng, xám
- **Đóng gói**: 4kg, 20kg

### Giá mua (2022)

- Thùng 4kg: 320.000 VNĐ
- Thùng 20kg: 1.400.000 VNĐ
- Định mức: 1.2-1.5 kg/m²/2 lớp

## Quá trình thi công

### Bề mặt trước khi sơn
- Sân thượng bê tông 45m²
- Có vết nứt chân chim nhỏ
- Đã chống thấm Sika trước đó nhưng bong tróc

### Quy trình

1. **Xử lý bề mặt** (1 ngày)
   - Cạo sạch lớp sơn cũ
   - Vệ sinh bụi bẩn
   - Trám vết nứt bằng Kova K261

2. **Sơn lớp 1** (sáng ngày 2)
   - Pha loãng 20% nước
   - Quét đều bằng rulô

3. **Sơn lớp 2** (chiều ngày 2)
   - Không pha loãng
   - Quét vuông góc với lớp 1

4. **Sơn phủ màu** (ngày 3)
   - Sơn Kova K5500 màu xám

## Kết quả sau 2 năm

### Điểm tốt ✅

| Tiêu chí | Đánh giá |
|----------|----------|
| Chống thấm | 9/10 - Không rò rỉ xuống trần |
| Độ bám dính | 8/10 - Bám tốt, không bong |
| Chống nứt | 7/10 - Che được vết nứt nhỏ |
| Dễ thi công | 9/10 - Tự làm được |

### Điểm chưa tốt ❌

- Bề mặt hơi xỉn màu sau 18 tháng
- Có vài điểm bong nhỏ ở góc (do xử lý chưa kỹ)
- Lớp phủ màu cần sơn lại sau 3-4 năm

## So sánh với sản phẩm khác

| Sản phẩm | Giá/kg | Độ bền | Thi công | Rating |
|----------|--------|--------|----------|--------|
| Kova CT-11A | 70k | 5-7 năm | Dễ | ⭐⭐⭐⭐ |
| Sika 107 | 110k | 7-10 năm | TB | ⭐⭐⭐⭐⭐ |
| Dulux Weathershield | 150k | 5-8 năm | Dễ | ⭐⭐⭐⭐ |
| Jotun Waterguard | 130k | 5-7 năm | Dễ | ⭐⭐⭐⭐ |

## Kinh nghiệm rút ra

### Nên làm
- ✅ Xử lý bề mặt thật kỹ
- ✅ Sơn vào mùa khô
- ✅ Đợi khô hoàn toàn giữa các lớp
- ✅ Sơn phủ bảo vệ UV

### Không nên
- ❌ Sơn khi trời sắp mưa
- ❌ Pha quá nhiều nước
- ❌ Bỏ qua xử lý vết nứt
- ❌ Sơn mỏng để tiết kiệm

## Chi phí thực tế

| Hạng mục | Chi phí |
|----------|---------|
| Kova CT-11A (20kg x 3) | 4.200.000 |
| Kova K261 trám nứt | 180.000 |
| Kova K5500 phủ màu | 650.000 |
| Dụng cụ | 200.000 |
| **Tổng (45m²)** | **5.230.000** |
| **Đơn giá** | **~116.000/m²** |

## Đánh giá tổng thể

**Rating: 4/5 ⭐⭐⭐⭐**

**Ưu điểm:**
- Giá thành hợp lý
- Thi công dễ, tự làm được
- Hiệu quả chống thấm tốt

**Nhược điểm:**
- Độ bền trung bình
- Cần sơn phủ bảo vệ

**Khuyến nghị:** Phù hợp cho hộ gia đình tự thi công, ngân sách hạn chế. Nếu cần độ bền cao hơn, nên chọn Sika 107 hoặc thuê thợ chuyên nghiệp.`,
      categoryIndex: 3, // Vật liệu xây dựng
      tagIndices: [18, 26, 24], // Sơn, Nhà ở, Nhà thầu
      status: 'published' as const,
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
    },
    {
      title: 'Hệ thống BMS là gì? Tổng quan về quản lý tòa nhà thông minh',
      slug: 'he-thong-bms-la-gi-quan-ly-toa-nha-thong-minh',
      excerpt: 'Tìm hiểu về hệ thống BMS (Building Management System), các thành phần, chức năng và lợi ích trong quản lý tòa nhà thông minh.',
      content: `BMS (Building Management System) là "bộ não" của các tòa nhà thông minh hiện đại. Bài viết này cung cấp cái nhìn tổng quan về hệ thống này.

## BMS là gì?

BMS (Building Management System) hay còn gọi là BAS (Building Automation System) là hệ thống điều khiển tự động hóa và giám sát các hệ thống kỹ thuật trong tòa nhà.

### Các hệ thống được tích hợp

1. **HVAC**: Điều hòa không khí, thông gió
2. **Chiếu sáng**: Đèn, rèm tự động
3. **PCCC**: Báo cháy, chữa cháy
4. **An ninh**: Camera, kiểm soát ra vào
5. **Thang máy**: Giám sát vận hành
6. **Điện**: Đo đếm, phân phối
7. **Nước**: Bơm, xử lý nước thải

## Kiến trúc hệ thống BMS

\`\`\`
┌─────────────────────────────────────────┐
│           Management Level              │
│    (Server, Workstation, Web Client)    │
└────────────────┬────────────────────────┘
                 │ TCP/IP
┌────────────────┴────────────────────────┐
│          Automation Level               │
│   (DDC Controllers, Network Switches)   │
└────────────────┬────────────────────────┘
                 │ BACnet/Modbus
┌────────────────┴────────────────────────┐
│            Field Level                  │
│  (Sensors, Actuators, Meters, VFDs)     │
└─────────────────────────────────────────┘
\`\`\`

## Chức năng chính

### 1. Giám sát (Monitoring)
- Hiển thị trạng thái real-time
- Cảnh báo sự cố tức thời
- Lưu trữ dữ liệu lịch sử
- Báo cáo năng lượng

### 2. Điều khiển (Control)
- Điều khiển tự động theo lịch
- Điều khiển theo điều kiện
- Điều khiển từ xa
- Override thủ công

### 3. Tối ưu hóa (Optimization)
- Tối ưu năng lượng
- Predictive maintenance
- Demand response
- Load balancing

## Giao thức truyền thông

| Giao thức | Ứng dụng | Đặc điểm |
|-----------|----------|----------|
| BACnet | HVAC, chiếu sáng | Chuẩn quốc tế, mở |
| Modbus | Điện, đo đếm | Đơn giản, phổ biến |
| LonWorks | Chiếu sáng | Peer-to-peer |
| KNX | Nhà thông minh | Châu Âu |
| OPC | Gateway | Kết nối legacy |

## Các hãng BMS phổ biến

| Hãng | Nguồn gốc | Thị phần VN |
|------|-----------|-------------|
| Honeywell | Mỹ | 25% |
| Siemens | Đức | 20% |
| Schneider | Pháp | 15% |
| Johnson Controls | Mỹ | 15% |
| Delta Controls | Canada | 10% |
| Tridium | Mỹ | 10% |
| Khác | - | 5% |

## Chi phí đầu tư

### Tòa nhà văn phòng 10.000m²

| Hạng mục | Chi phí |
|----------|---------|
| Phần cứng (DDC, sensors) | 1.5 - 2.5 tỷ |
| Phần mềm | 300 - 800 triệu |
| Tích hợp, cài đặt | 500 - 800 triệu |
| Đào tạo | 50 - 100 triệu |
| **Tổng** | **2.5 - 4.5 tỷ** |
| **Đơn giá** | **250.000 - 450.000/m²** |

## Lợi ích

### Tiết kiệm năng lượng
- Giảm 15-30% chi phí điện
- ROI: 3-5 năm

### Tăng hiệu quả vận hành
- Giảm 20-30% nhân sự vận hành
- Phát hiện sự cố nhanh hơn 80%

### Tăng tuổi thọ thiết bị
- Bảo trì dự đoán
- Giảm 25% chi phí sửa chữa

### Tăng giá trị bất động sản
- Đạt chứng chỉ xanh (LEED, LOTUS)
- Tăng giá thuê 10-15%

## Xu hướng 2024-2025

1. **AI/ML**: Tối ưu tự động bằng machine learning
2. **Cloud BMS**: Quản lý đa tòa nhà từ xa
3. **IoT Integration**: Kết nối nhiều thiết bị hơn
4. **Digital Twin**: Mô phỏng số tòa nhà
5. **Cybersecurity**: Bảo mật mạng OT

## Kết luận

BMS là đầu tư thiết yếu cho các tòa nhà thương mại hiện đại. Mặc dù chi phí ban đầu cao, lợi ích về tiết kiệm năng lượng và hiệu quả vận hành sẽ nhanh chóng hoàn vốn.`,
      categoryIndex: 5, // Công nghệ xây dựng
      tagIndices: [21, 22, 27], // Smart Building, IoT, Cao ốc
      status: 'published' as const,
      isFeatured: true,
      coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    },
    {
      title: 'Case study: Tiết kiệm 35% năng lượng tại tòa nhà văn phòng ABC Tower',
      slug: 'case-study-tiet-kiem-nang-luong-abc-tower',
      excerpt: 'Phân tích chi tiết các giải pháp đã giúp tòa nhà ABC Tower giảm 35% chi phí năng lượng sau 1 năm vận hành.',
      content: `## Thông tin công trình

- **Tên**: ABC Tower
- **Diện tích**: 25.000m² sàn
- **Quy mô**: 20 tầng văn phòng
- **Hoàn thành**: 2022

## Các giải pháp áp dụng

### 1. Vỏ bao che (Facade)

- Kính Low-E double: giảm 45% nhiệt hấp thụ
- Lam che nắng tự động theo vị trí mặt trời

### 2. Hệ thống HVAC

- Chiller biến tần hiệu suất cao COP 6.5
- Hệ thống VAV điều chỉnh gió theo nhu cầu

### 3. Chiếu sáng

- 100% đèn LED với cảm biến ánh sáng tự nhiên
- Sensor chiếm chỗ (occupancy sensor)

## Kết quả

| Chỉ số | Trước | Sau |
|--------|-------|-----|
| EUI (kWh/m²/năm) | 180 | 117 |
| Chi phí điện/tháng | 850 triệu | 550 triệu |

**ROI:** 3.5 năm hoàn vốn đầu tư.`,
      categoryIndex: 11, // Case Study
      tagIndices: [20, 21, 19, 27, 25], // Tiết kiệm năng lượng, Smart Building, Kính Low-E, Cao ốc, Chủ đầu tư
      status: 'published' as const,
      isFeatured: false,
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    },
  ];

  return postsContent.map((post, index) => ({
    ...post,
    categoryId: categoryIds[post.categoryIndex],
    tagsRelation: post.tagIndices.map(i => tagIds[i]),
    tags: post.tagIndices.map(i => tagsData[i].name),
    author: 'Admin',
    coverImage: post.coverImage || `https://picsum.photos/seed/${post.slug}/1200/630`,
    metaTitle: post.title,
    metaDescription: post.excerpt,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    publishedAt: new Date(Date.now() - index * 86400000), // Each post 1 day apart
    viewCount: Math.floor(Math.random() * 1000) + 100,
    readingTime: Math.ceil(post.content.split(/\s+/).length / 200),
    contentStructure: generateContentStructure(post.title, post.content),
  }));
}

// Keywords data
function generateKeywordsData(postIds: mongoose.Types.ObjectId[]) {
  const keywords = [
    { keyword: 'typescript tutorial', searchVolume: 12000, difficulty: 45 },
    { keyword: 'nodejs rest api', searchVolume: 8500, difficulty: 40 },
    { keyword: 'mongodb mongoose tutorial', searchVolume: 6200, difficulty: 35 },
    { keyword: 'react hooks guide', searchVolume: 15000, difficulty: 50 },
    { keyword: 'docker for developers', searchVolume: 9000, difficulty: 42 },
    { keyword: 'machine learning python', searchVolume: 22000, difficulty: 55 },
    { keyword: 'nextjs 14 features', searchVolume: 7500, difficulty: 38 },
    { keyword: 'graphql vs rest api', searchVolume: 5500, difficulty: 35 },
    { keyword: 'aws cloud computing', searchVolume: 18000, difficulty: 48 },
    { keyword: 'technical seo guide', searchVolume: 11000, difficulty: 43 },
  ];

  return keywords.map((kw, index) => ({
    ...kw,
    language: 'en',
    country: 'US',
    postId: postIds[index % postIds.length],
    currentPosition: Math.floor(Math.random() * 50) + 1,
    clicks: Math.floor(Math.random() * 500),
    impressions: Math.floor(Math.random() * 5000) + 1000,
    ctr: Math.random() * 10,
    isTracking: true,
  }));
}

// ============== SEED FUNCTION ==============

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Post.deleteMany({}),
      Settings.deleteMany({}),
      Media.deleteMany({}),
      Keyword.deleteMany({}),
    ]);
    console.log('✅ Cleared existing data\n');

    // Seed Users
    console.log('👤 Seeding users...');
    const usersToCreate = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        passwordHash: await bcrypt.hash(user.password, 10),
      }))
    );
    const users = await User.insertMany(
      usersToCreate.map(({ password, ...user }) => user)
    );
    console.log(`✅ Created ${users.length} users\n`);

    // Seed Categories
    console.log('📁 Seeding categories...');
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${categories.length} categories\n`);

    // Seed Tags
    console.log('🏷️  Seeding tags...');
    const tags = await Tag.insertMany(tagsData);
    console.log(`✅ Created ${tags.length} tags\n`);

    // Seed Settings
    console.log('⚙️  Seeding settings...');
    const settings = await Settings.insertMany(settingsData);
    console.log(`✅ Created ${settings.length} settings\n`);

    // Seed Posts
    console.log('📝 Seeding posts...');
    const categoryIds = categories.map(c => c._id);
    const tagIds = tags.map(t => t._id);
    const postsData = generatePostsData(categoryIds, tagIds);
    const posts = await Post.insertMany(postsData);
    console.log(`✅ Created ${posts.length} posts\n`);

    // Seed Keywords
    console.log('🔑 Seeding keywords...');
    const postIds = posts.map(p => p._id);
    const keywordsData = generateKeywordsData(postIds);
    const keywords = await Keyword.insertMany(keywordsData);
    console.log(`✅ Created ${keywords.length} keywords\n`);

    // Summary
    console.log('═'.repeat(50));
    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Settings: ${settings.length}`);
    console.log(`   - Keywords: ${keywords.length}`);
    console.log('═'.repeat(50));
    console.log('\n👤 Test Accounts:');
    usersData.forEach(user => {
      console.log(`   - ${user.email} / ${user.password} (${user.role})`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

// Run seed
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
