/**
 * Seed data for Construction Materials News Site
 * Categories: Hierarchical structure for main sections
 * Tags: Flat structure for cross-cutting topics
 */

import mongoose from 'mongoose';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// CATEGORIES - Cấu trúc phân cấp
// ============================================
const categoriesData = [
  // 1. Tin nhanh (parent)
  {
    name: 'Tin nhanh',
    slug: 'tin-nhanh',
    description: 'Tin tức nóng hổi cập nhật hàng ngày về ngành vật liệu xây dựng',
    sortOrder: 1,
    children: [
      {
        name: 'Thị trường & Giá vật liệu',
        slug: 'thi-truong-gia-vat-lieu',
        description: 'Cập nhật giá xi măng, thép, cát đá, nhôm kính và các vật liệu xây dựng',
        sortOrder: 1,
      },
      {
        name: 'Dự án & Công trình',
        slug: 'du-an-cong-trinh',
        description: 'Tin khởi công, hoàn thành, ứng dụng vật liệu và công nghệ mới',
        sortOrder: 2,
      },
      {
        name: 'Doanh nghiệp & Sản phẩm mới',
        slug: 'doanh-nghiep-san-pham-moi',
        description: 'Ra mắt sản phẩm, hợp tác, nhà máy, M&A trong ngành',
        sortOrder: 3,
      },
    ],
  },

  // 2. Vật liệu xây dựng (parent)
  {
    name: 'Vật liệu xây dựng',
    slug: 'vat-lieu-xay-dung',
    description: 'Thông tin chi tiết về các loại vật liệu xây dựng',
    sortOrder: 2,
    children: [
      {
        name: 'Kết cấu & Nền móng',
        slug: 'ket-cau-nen-mong',
        description: 'Bê tông, cốt thép, phụ gia, geopolymer và vật liệu kết cấu',
        sortOrder: 1,
      },
      {
        name: 'Vật liệu hoàn thiện',
        slug: 'vat-lieu-hoan-thien',
        description: 'Sơn, gạch, đá, gỗ, nội thất bề mặt và vật liệu trang trí',
        sortOrder: 2,
      },
      {
        name: 'Nhôm kính & Facade',
        slug: 'nhom-kinh-facade',
        description: 'Kính low-e, curtain wall, chống nóng, mặt dựng nhôm kính',
        sortOrder: 3,
      },
      {
        name: 'Chống thấm - Cách âm - Cách nhiệt',
        slug: 'chong-tham-cach-am-cach-nhiet',
        description: 'Membrane, PU, rockwool và các giải pháp chống thấm, cách nhiệt',
        sortOrder: 4,
      },
      {
        name: 'MEP & Vật tư kỹ thuật',
        slug: 'mep-vat-tu-ky-thuat',
        description: 'Ống, dây cáp, thiết bị điện-nước, HVAC và hệ thống kỹ thuật',
        sortOrder: 5,
      },
    ],
  },

  // 3. Công nghệ xây dựng (parent)
  {
    name: 'Công nghệ xây dựng',
    slug: 'cong-nghe-xay-dung',
    description: 'Công nghệ mới trong ngành xây dựng và vật liệu',
    sortOrder: 3,
    children: [
      {
        name: 'BIM & Digital Construction',
        slug: 'bim-digital-construction',
        description: 'BIM, CDE, clash detection, tiêu chuẩn hóa dữ liệu xây dựng số',
        sortOrder: 1,
      },
      {
        name: 'Thi công thông minh',
        slug: 'thi-cong-thong-minh',
        description: 'Prefab, modular, robot, 3D printing, drone trong xây dựng',
        sortOrder: 2,
      },
      {
        name: 'Vật liệu công nghệ mới',
        slug: 'vat-lieu-cong-nghe-moi',
        description: 'Self-healing concrete, vật liệu nhẹ cường độ cao, graphene',
        sortOrder: 3,
      },
      {
        name: 'IoT & Smart Building',
        slug: 'iot-smart-building',
        description: 'BMS, cảm biến, đo năng lượng, tối ưu vận hành tòa nhà',
        sortOrder: 4,
      },
    ],
  },

  // 4. Tiêu chuẩn - Pháp lý - Chứng chỉ (parent)
  {
    name: 'Tiêu chuẩn & Pháp lý',
    slug: 'tieu-chuan-phap-ly',
    description: 'Tiêu chuẩn, quy chuẩn và chứng chỉ trong ngành xây dựng',
    sortOrder: 4,
    children: [
      {
        name: 'Tiêu chuẩn & Quy chuẩn',
        slug: 'tieu-chuan-quy-chuan',
        description: 'TCVN, QCVN, test report, quy định kỹ thuật',
        sortOrder: 1,
      },
      {
        name: 'Chứng chỉ xanh',
        slug: 'chung-chi-xanh',
        description: 'LEED, LOTUS, WELL, EDGE và các chứng chỉ công trình xanh',
        sortOrder: 2,
      },
    ],
  },

  // 5. Hướng dẫn chuyên sâu (parent)
  {
    name: 'Hướng dẫn',
    slug: 'huong-dan',
    description: 'Bài viết chuyên sâu, hướng dẫn kỹ thuật và so sánh vật liệu',
    sortOrder: 5,
    children: [
      {
        name: 'So sánh & Lựa chọn vật liệu',
        slug: 'so-sanh-lua-chon-vat-lieu',
        description: 'A vs B, ưu nhược điểm, chi phí vòng đời, tư vấn lựa chọn',
        sortOrder: 1,
      },
      {
        name: 'Quy trình thi công chuẩn',
        slug: 'quy-trinh-thi-cong-chuan',
        description: 'Checklist, lỗi thường gặp, cách nghiệm thu công trình',
        sortOrder: 2,
      },
      {
        name: 'Dự toán & Định mức',
        slug: 'du-toan-dinh-muc',
        description: 'Bóc tách khối lượng, định mức vật liệu, dự toán chi phí',
        sortOrder: 3,
      },
    ],
  },

  // 6. Review & Case study (parent)
  {
    name: 'Case Study',
    slug: 'case-study',
    description: 'Review sản phẩm và case study công trình thực tế',
    sortOrder: 6,
    children: [
      {
        name: 'Review sản phẩm',
        slug: 'review-san-pham',
        description: 'Test thực tế, đánh giá sản phẩm, công trình mẫu',
        sortOrder: 1,
      },
      {
        name: 'Case study công trình',
        slug: 'case-study-cong-trinh',
        description: 'Phân tích lựa chọn vật liệu, hiệu quả sau 6-12 tháng',
        sortOrder: 2,
      },
    ],
  },
];

// ============================================
// TAGS - Nhãn gắn bài viết
// ============================================
const tagsData = [
  // Vật liệu cụ thể
  { name: 'Xi măng', slug: 'xi-mang', color: '#6B7280', description: 'Các loại xi măng và ứng dụng' },
  { name: 'Thép', slug: 'thep', color: '#374151', description: 'Thép xây dựng, thép hình, thép cuộn' },
  { name: 'Cát đá', slug: 'cat-da', color: '#D97706', description: 'Cát, đá, cốt liệu xây dựng' },
  { name: 'Nhôm kính', slug: 'nhom-kinh', color: '#0EA5E9', description: 'Nhôm, kính và facade' },
  { name: 'Bê tông', slug: 'be-tong', color: '#64748B', description: 'Bê tông các loại' },
  { name: 'Gạch', slug: 'gach', color: '#DC2626', description: 'Gạch xây, gạch ốp lát' },
  { name: 'Sơn', slug: 'son', color: '#8B5CF6', description: 'Sơn tường, sơn công nghiệp' },
  { name: 'Gỗ', slug: 'go', color: '#92400E', description: 'Gỗ tự nhiên, gỗ công nghiệp' },
  { name: 'Đá', slug: 'da', color: '#78716C', description: 'Đá tự nhiên, đá nhân tạo' },
  { name: 'Kính Low-E', slug: 'kinh-low-e', color: '#06B6D4', description: 'Kính tiết kiệm năng lượng' },

  // Công nghệ
  { name: 'BIM', slug: 'bim', color: '#2563EB', description: 'Building Information Modeling' },
  { name: 'Prefab', slug: 'prefab', color: '#7C3AED', description: 'Công nghệ lắp ghép, modular' },
  { name: '3D Printing', slug: '3d-printing', color: '#EC4899', description: 'In 3D trong xây dựng' },
  { name: 'Drone', slug: 'drone', color: '#F97316', description: 'Ứng dụng drone trong xây dựng' },
  { name: 'IoT', slug: 'iot', color: '#14B8A6', description: 'Internet of Things' },
  { name: 'Smart Building', slug: 'smart-building', color: '#10B981', description: 'Tòa nhà thông minh' },

  // Chứng chỉ
  { name: 'LEED', slug: 'leed', color: '#22C55E', description: 'Chứng chỉ LEED' },
  { name: 'LOTUS', slug: 'lotus', color: '#84CC16', description: 'Chứng chỉ LOTUS Việt Nam' },
  { name: 'WELL', slug: 'well', color: '#EAB308', description: 'Chứng chỉ WELL' },
  { name: 'TCVN', slug: 'tcvn', color: '#EF4444', description: 'Tiêu chuẩn Việt Nam' },
  { name: 'QCVN', slug: 'qcvn', color: '#F43F5E', description: 'Quy chuẩn Việt Nam' },

  // Giải pháp
  { name: 'Chống thấm', slug: 'chong-tham', color: '#3B82F6', description: 'Giải pháp chống thấm' },
  { name: 'Cách nhiệt', slug: 'cach-nhiet', color: '#F59E0B', description: 'Vật liệu cách nhiệt' },
  { name: 'Cách âm', slug: 'cach-am', color: '#8B5CF6', description: 'Giải pháp cách âm' },
  { name: 'Tiết kiệm năng lượng', slug: 'tiet-kiem-nang-luong', color: '#22C55E', description: 'Giải pháp tiết kiệm năng lượng' },

  // Loại công trình
  { name: 'Nhà ở', slug: 'nha-o', color: '#F472B6', description: 'Công trình nhà ở dân dụng' },
  { name: 'Cao ốc', slug: 'cao-oc', color: '#60A5FA', description: 'Tòa nhà cao tầng' },
  { name: 'Công nghiệp', slug: 'cong-nghiep', color: '#A3A3A3', description: 'Công trình công nghiệp, nhà xưởng' },
  { name: 'Hạ tầng', slug: 'ha-tang', color: '#FB923C', description: 'Công trình hạ tầng, giao thông' },

  // Đối tượng
  { name: 'Nhà thầu', slug: 'nha-thau', color: '#0284C7', description: 'Dành cho nhà thầu thi công' },
  { name: 'Kiến trúc sư', slug: 'kien-truc-su', color: '#7C3AED', description: 'Dành cho kiến trúc sư' },
  { name: 'Chủ đầu tư', slug: 'chu-dau-tu', color: '#059669', description: 'Dành cho chủ đầu tư' },
  { name: 'Xây nhà', slug: 'xay-nha', color: '#DB2777', description: 'Dành cho người xây nhà' },

  // Giá cả
  { name: 'Giá thép', slug: 'gia-thep', color: '#374151', description: 'Cập nhật giá thép' },
  { name: 'Giá xi măng', slug: 'gia-xi-mang', color: '#6B7280', description: 'Cập nhật giá xi măng' },
  { name: 'Giá vật liệu', slug: 'gia-vat-lieu', color: '#EF4444', description: 'Cập nhật giá vật liệu' },
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing)
    // await Category.deleteMany({});
    // await Tag.deleteMany({});
    // console.log('Cleared existing categories and tags');

    // Seed Categories
    console.log('\n--- Seeding Categories ---');
    for (const parentCat of categoriesData) {
      // Check if parent exists
      let parent = await Category.findOne({ slug: parentCat.slug });

      if (!parent) {
        parent = await Category.create({
          name: parentCat.name,
          slug: parentCat.slug,
          description: parentCat.description,
          sortOrder: parentCat.sortOrder,
          parentId: null,
          isActive: true,
        });
        console.log(`✓ Created parent: ${parentCat.name}`);
      } else {
        console.log(`→ Exists: ${parentCat.name}`);
      }

      // Seed children
      if (parentCat.children) {
        for (const childCat of parentCat.children) {
          const existingChild = await Category.findOne({ slug: childCat.slug });

          if (!existingChild) {
            await Category.create({
              name: childCat.name,
              slug: childCat.slug,
              description: childCat.description,
              sortOrder: childCat.sortOrder,
              parentId: parent._id,
              isActive: true,
            });
            console.log(`  ✓ Created child: ${childCat.name}`);
          } else {
            console.log(`  → Exists: ${childCat.name}`);
          }
        }
      }
    }

    // Seed Tags
    console.log('\n--- Seeding Tags ---');
    for (const tagData of tagsData) {
      const existingTag = await Tag.findOne({ slug: tagData.slug });

      if (!existingTag) {
        await Tag.create({
          name: tagData.name,
          slug: tagData.slug,
          color: tagData.color,
          description: tagData.description,
          isActive: true,
        });
        console.log(`✓ Created tag: ${tagData.name}`);
      } else {
        console.log(`→ Exists: ${tagData.name}`);
      }
    }

    console.log('\n✅ Seed completed successfully!');

    // Summary
    const categoryCount = await Category.countDocuments();
    const tagCount = await Tag.countDocuments();
    console.log(`\nSummary:`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Tags: ${tagCount}`);

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
seedDatabase();
