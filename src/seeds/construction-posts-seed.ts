/**
 * Seed sample posts for Construction Materials News Site
 * Includes realistic articles with images for each category
 */

import mongoose from 'mongoose';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import { Post } from '../models/post.model';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// SAMPLE POSTS DATA
// ============================================
const postsData = [
  // ========== TIN NHANH ==========
  // Thị trường & Giá vật liệu
  {
    categorySlug: 'thi-truong-gia-vat-lieu',
    posts: [
      {
        title: 'Giá thép xây dựng tăng 5% trong tuần đầu tháng 12/2024',
        slug: 'gia-thep-xay-dung-tang-5-thang-12-2024',
        excerpt: 'Giá thép xây dựng các loại đồng loạt tăng 5% so với cuối tháng 11, nguyên nhân chính do nhu cầu xây dựng cuối năm tăng cao.',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
        content: `<h2>Biến động giá thép tháng 12/2024</h2>
<p>Theo khảo sát thị trường, giá thép xây dựng các loại đã tăng trung bình 5% trong tuần đầu tháng 12/2024. Cụ thể:</p>
<ul>
<li>Thép cuộn CB240: 14.500 - 14.800 đồng/kg</li>
<li>Thép thanh vằn D10 CB300: 14.800 - 15.200 đồng/kg</li>
<li>Thép hình U, I, H: 16.500 - 17.500 đồng/kg</li>
</ul>
<h2>Nguyên nhân tăng giá</h2>
<p>Các chuyên gia nhận định nguyên nhân chính khiến giá thép tăng:</p>
<ol>
<li>Nhu cầu xây dựng cuối năm tăng cao</li>
<li>Giá nguyên liệu đầu vào (quặng sắt, than coke) tăng</li>
<li>Chi phí vận chuyển logistics tăng</li>
</ol>
<h2>Dự báo xu hướng</h2>
<p>Dự kiến giá thép sẽ tiếp tục duy trì ở mức cao trong tháng 12 và có thể điều chỉnh giảm nhẹ sau Tết Nguyên đán 2025.</p>`,
        tags: ['thep', 'gia-thep', 'gia-vat-lieu'],
        isFeatured: true,
      },
      {
        title: 'Cập nhật bảng giá xi măng các thương hiệu lớn tháng 12/2024',
        slug: 'bang-gia-xi-mang-thang-12-2024',
        excerpt: 'Tổng hợp giá xi măng PCB40, PC50 của các thương hiệu Hà Tiên, INSEE, Vicem, Nghi Sơn tại khu vực miền Nam.',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
        content: `<h2>Bảng giá xi măng tháng 12/2024</h2>
<p>Giá xi măng bao 50kg tại kho TP.HCM (chưa VAT):</p>
<table>
<tr><th>Thương hiệu</th><th>PCB40</th><th>PC50</th></tr>
<tr><td>Hà Tiên 1</td><td>92.000đ</td><td>98.000đ</td></tr>
<tr><td>INSEE</td><td>95.000đ</td><td>102.000đ</td></tr>
<tr><td>Vicem</td><td>90.000đ</td><td>96.000đ</td></tr>
<tr><td>Nghi Sơn</td><td>88.000đ</td><td>94.000đ</td></tr>
</table>
<h2>Lưu ý khi mua xi măng</h2>
<p>Giá trên chưa bao gồm chi phí vận chuyển và có thể thay đổi theo từng đại lý.</p>`,
        tags: ['xi-mang', 'gia-xi-mang', 'gia-vat-lieu'],
        isFeatured: false,
      },
    ],
  },

  // Dự án & Công trình
  {
    categorySlug: 'du-an-cong-trinh',
    posts: [
      {
        title: 'Khởi công tòa nhà văn phòng xanh LEED Platinum đầu tiên tại Đà Nẵng',
        slug: 'khoi-cong-toa-nha-leed-platinum-da-nang',
        excerpt: 'Dự án Green Office Tower Đà Nẵng chính thức khởi công với mục tiêu đạt chứng chỉ LEED Platinum - tiêu chuẩn cao nhất về công trình xanh.',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        content: `<h2>Thông tin dự án</h2>
<p>Green Office Tower Đà Nẵng là tòa nhà văn phòng hạng A với quy mô:</p>
<ul>
<li>Diện tích: 25.000m² sàn</li>
<li>Chiều cao: 35 tầng</li>
<li>Tổng vốn đầu tư: 2.500 tỷ đồng</li>
<li>Thời gian hoàn thành: Q4/2026</li>
</ul>
<h2>Công nghệ xanh áp dụng</h2>
<p>Dự án sử dụng các giải pháp tiết kiệm năng lượng:</p>
<ul>
<li>Kính Low-E giảm 40% nhiệt hấp thụ</li>
<li>Hệ thống điện mặt trời 500kWp</li>
<li>Thu hồi nước mưa và tái sử dụng nước xám</li>
<li>BMS thông minh tối ưu HVAC</li>
</ul>`,
        tags: ['leed', 'cao-oc', 'tiet-kiem-nang-luong', 'kinh-low-e'],
        isFeatured: true,
      },
    ],
  },

  // Doanh nghiệp & Sản phẩm mới
  {
    categorySlug: 'doanh-nghiep-san-pham-moi',
    posts: [
      {
        title: 'Viglacera ra mắt dòng gạch porcelain siêu mỏng 3mm cho facade',
        slug: 'viglacera-ra-mat-gach-porcelain-sieu-mong-3mm',
        excerpt: 'Viglacera chính thức giới thiệu dòng gạch porcelain siêu mỏng 3mm, mở ra xu hướng mới cho facade công trình cao tầng.',
        coverImage: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1200&q=80',
        content: `<h2>Đặc tính sản phẩm</h2>
<p>Gạch porcelain siêu mỏng Viglacera có các đặc điểm nổi bật:</p>
<ul>
<li>Độ dày chỉ 3mm, giảm 70% trọng lượng so với gạch thường</li>
<li>Kích thước lớn: 1200x2400mm</li>
<li>Độ cứng 7 Mohs, chống trầy xước</li>
<li>Hấp thụ nước < 0.1%</li>
</ul>
<h2>Ứng dụng</h2>
<p>Sản phẩm phù hợp cho:</p>
<ul>
<li>Ốp mặt dựng (facade) công trình cao tầng</li>
<li>Cải tạo, nâng cấp tòa nhà cũ</li>
<li>Nội thất cao cấp</li>
</ul>`,
        tags: ['gach', 'nhom-kinh'],
        isFeatured: false,
      },
    ],
  },

  // ========== VẬT LIỆU XÂY DỰNG ==========
  // Kết cấu & Nền móng
  {
    categorySlug: 'ket-cau-nen-mong',
    posts: [
      {
        title: 'Bê tông cường độ cao C80 - Giải pháp cho siêu cao ốc Việt Nam',
        slug: 'be-tong-cuong-do-cao-c80-sieu-cao-oc',
        excerpt: 'Tìm hiểu về bê tông cường độ cao C80 và ứng dụng trong các công trình siêu cao tầng tại Việt Nam.',
        coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
        content: `<h2>Bê tông C80 là gì?</h2>
<p>Bê tông C80 là loại bê tông có cường độ chịu nén đặc trưng 80 MPa sau 28 ngày, thuộc nhóm bê tông cường độ cao (HSC - High Strength Concrete).</p>
<h2>Thành phần cấp phối</h2>
<ul>
<li>Xi măng PC50: 500-550 kg/m³</li>
<li>Silica fume: 50-70 kg/m³</li>
<li>Cốt liệu đá 5-10mm: 1050 kg/m³</li>
<li>Cát mịn: 650 kg/m³</li>
<li>Phụ gia siêu dẻo: 8-12 lít/m³</li>
<li>Tỷ lệ N/X: 0.28-0.32</li>
</ul>
<h2>Ưu điểm</h2>
<ul>
<li>Giảm kích thước cột, dầm → tăng diện tích sử dụng</li>
<li>Rút ngắn thời gian thi công</li>
<li>Độ bền cao, tuổi thọ công trình dài</li>
</ul>`,
        tags: ['be-tong', 'cao-oc', 'nha-thau'],
        isFeatured: true,
      },
      {
        title: 'So sánh thép Việt Nhật và Hòa Phát - Nên chọn loại nào?',
        slug: 'so-sanh-thep-viet-nhat-va-hoa-phat',
        excerpt: 'Phân tích ưu nhược điểm, giá cả và chất lượng giữa thép Việt Nhật và Hòa Phát để giúp bạn lựa chọn phù hợp.',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        content: `<h2>Tổng quan về 2 thương hiệu</h2>
<p>Việt Nhật và Hòa Phát là hai thương hiệu thép xây dựng hàng đầu Việt Nam với công nghệ sản xuất hiện đại.</p>
<h2>So sánh chi tiết</h2>
<table>
<tr><th>Tiêu chí</th><th>Việt Nhật</th><th>Hòa Phát</th></tr>
<tr><td>Công nghệ</td><td>Nhật Bản</td><td>Ý + Nhật</td></tr>
<tr><td>Tiêu chuẩn</td><td>JIS G3112</td><td>TCVN 1651</td></tr>
<tr><td>Giá (D10)</td><td>15.200đ/kg</td><td>14.800đ/kg</td></tr>
<tr><td>Phân phối</td><td>Miền Bắc + Trung</td><td>Toàn quốc</td></tr>
</table>
<h2>Kết luận</h2>
<p>Cả hai thương hiệu đều đạt chất lượng cao. Hòa Phát có lợi thế về giá và mạng lưới phân phối, trong khi Việt Nhật được đánh giá cao về độ đồng đều.</p>`,
        tags: ['thep', 'gia-thep', 'nha-thau', 'xay-nha'],
        isFeatured: false,
      },
    ],
  },

  // Vật liệu hoàn thiện
  {
    categorySlug: 'vat-lieu-hoan-thien',
    posts: [
      {
        title: 'Top 10 loại sơn nội thất tốt nhất 2024 - Đánh giá chi tiết',
        slug: 'top-10-son-noi-that-tot-nhat-2024',
        excerpt: 'Đánh giá và xếp hạng 10 loại sơn nội thất cao cấp được ưa chuộng nhất năm 2024 dựa trên độ phủ, độ bền và khả năng kháng khuẩn.',
        coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&q=80',
        content: `<h2>Tiêu chí đánh giá</h2>
<p>Chúng tôi đánh giá dựa trên: độ phủ, độ bền màu, khả năng lau chùi, kháng khuẩn và giá thành.</p>
<h2>Top 10 sơn nội thất 2024</h2>
<ol>
<li><strong>Dulux Ambiance 5 in 1</strong> - Điểm: 9.5/10</li>
<li><strong>Jotun Majestic True Beauty</strong> - Điểm: 9.3/10</li>
<li><strong>Nippon Matex Super</strong> - Điểm: 9.0/10</li>
<li><strong>TOA NanoShield</strong> - Điểm: 8.8/10</li>
<li><strong>Kova K-871</strong> - Điểm: 8.5/10</li>
<li><strong>Spec Pro Master</strong> - Điểm: 8.3/10</li>
<li><strong>Mykolor Touch</strong> - Điểm: 8.0/10</li>
<li><strong>4 Oranges Premium</strong> - Điểm: 7.8/10</li>
<li><strong>Expo Easy</strong> - Điểm: 7.5/10</li>
<li><strong>Maxilite Total</strong> - Điểm: 7.3/10</li>
</ol>`,
        tags: ['son', 'nha-o', 'xay-nha'],
        isFeatured: true,
      },
    ],
  },

  // Nhôm kính & Facade
  {
    categorySlug: 'nhom-kinh-facade',
    posts: [
      {
        title: 'Kính Low-E là gì? Có nên sử dụng cho nhà ở?',
        slug: 'kinh-low-e-la-gi-co-nen-su-dung-cho-nha-o',
        excerpt: 'Tìm hiểu về kính Low-E (Low Emissivity), nguyên lý hoạt động và lời khuyên khi sử dụng cho nhà ở tại Việt Nam.',
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        content: `<h2>Kính Low-E là gì?</h2>
<p>Kính Low-E (Low Emissivity) là loại kính được phủ lớp oxide kim loại siêu mỏng có khả năng phản xạ tia hồng ngoại và tia UV, giữ nhiệt mùa đông và ngăn nhiệt mùa hè.</p>
<h2>Nguyên lý hoạt động</h2>
<p>Lớp phủ Low-E có độ phát xạ thấp (ε < 0.2) so với kính thường (ε ≈ 0.84), giúp:</p>
<ul>
<li>Giảm 40-70% nhiệt hấp thụ từ ánh nắng</li>
<li>Ngăn 99% tia UV gây hại</li>
<li>Giữ nhiệt trong nhà vào mùa đông</li>
</ul>
<h2>Có nên dùng cho nhà ở?</h2>
<p><strong>Nên dùng khi:</strong></p>
<ul>
<li>Nhà hướng Tây, Đông chịu nắng trực tiếp</li>
<li>Sử dụng điều hòa nhiều</li>
<li>Phòng có diện tích kính lớn</li>
</ul>
<p><strong>Cân nhắc:</strong> Chi phí cao hơn kính thường 40-60%.</p>`,
        tags: ['kinh-low-e', 'nhom-kinh', 'tiet-kiem-nang-luong', 'nha-o'],
        isFeatured: true,
      },
    ],
  },

  // Chống thấm - Cách âm - Cách nhiệt
  {
    categorySlug: 'chong-tham-cach-am-cach-nhiet',
    posts: [
      {
        title: 'Hướng dẫn chống thấm sân thượng bằng màng Bitum tự dính',
        slug: 'huong-dan-chong-tham-san-thuong-mang-bitum',
        excerpt: 'Quy trình thi công chống thấm sân thượng bằng màng bitum tự dính đúng kỹ thuật, đảm bảo hiệu quả lâu dài.',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
        content: `<h2>Chuẩn bị bề mặt</h2>
<ol>
<li>Vệ sinh sạch bụi bẩn, dầu mỡ</li>
<li>Xử lý các vết nứt bằng vữa không co ngót</li>
<li>Tạo độ dốc thoát nước tối thiểu 1%</li>
<li>Đợi bề mặt khô hoàn toàn</li>
</ol>
<h2>Thi công màng bitum</h2>
<ol>
<li>Quét lớp primer (lót) Bitum lỏng, đợi khô 4-6 giờ</li>
<li>Trải màng bitum từ vị trí thấp lên cao</li>
<li>Chồng mép tối thiểu 10cm</li>
<li>Dùng con lăn ép chặt, đuổi bọt khí</li>
<li>Xử lý các góc, chân tường bằng màng gia cường</li>
</ol>
<h2>Lưu ý quan trọng</h2>
<ul>
<li>Không thi công khi trời mưa hoặc bề mặt ẩm</li>
<li>Bảo vệ màng bằng lớp vữa hoặc gạch sau 48h</li>
</ul>`,
        tags: ['chong-tham', 'nha-o', 'xay-nha', 'nha-thau'],
        isFeatured: false,
      },
    ],
  },

  // MEP & Vật tư kỹ thuật
  {
    categorySlug: 'mep-vat-tu-ky-thuat',
    posts: [
      {
        title: 'Hệ thống điều hòa VRV/VRF - Giải pháp cho tòa nhà văn phòng',
        slug: 'he-thong-dieu-hoa-vrv-vrf-toa-nha-van-phong',
        excerpt: 'Tìm hiểu về hệ thống điều hòa VRV/VRF, ưu điểm và chi phí đầu tư cho tòa nhà văn phòng quy mô vừa và lớn.',
        coverImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80',
        content: `<h2>VRV/VRF là gì?</h2>
<p>VRV (Variable Refrigerant Volume) hay VRF (Variable Refrigerant Flow) là hệ thống điều hòa trung tâm sử dụng công nghệ biến tần, cho phép điều chỉnh lưu lượng gas theo nhu cầu thực tế.</p>
<h2>Ưu điểm</h2>
<ul>
<li>Tiết kiệm 30-40% điện năng so với điều hòa truyền thống</li>
<li>Điều khiển độc lập từng phòng</li>
<li>Lắp đặt linh hoạt, không cần phòng máy lớn</li>
<li>Vận hành êm ái</li>
</ul>
<h2>Chi phí đầu tư</h2>
<p>Chi phí trung bình: 8-12 triệu đồng/TR (Ton of Refrigeration)</p>
<p>Ví dụ: Tòa nhà 5.000m² cần khoảng 400TR → Chi phí: 3.2 - 4.8 tỷ đồng.</p>`,
        tags: ['iot', 'smart-building', 'tiet-kiem-nang-luong', 'cao-oc'],
        isFeatured: false,
      },
    ],
  },

  // ========== CÔNG NGHỆ XÂY DỰNG ==========
  // BIM & Digital Construction
  {
    categorySlug: 'bim-digital-construction',
    posts: [
      {
        title: 'BIM Level 2 là gì? Lộ trình áp dụng BIM tại Việt Nam',
        slug: 'bim-level-2-la-gi-lo-trinh-ap-dung-tai-viet-nam',
        excerpt: 'Tìm hiểu về các cấp độ BIM và lộ trình bắt buộc áp dụng BIM cho công trình sử dụng vốn nhà nước tại Việt Nam.',
        coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
        content: `<h2>Các cấp độ BIM</h2>
<ul>
<li><strong>BIM Level 0:</strong> 2D CAD, không có cộng tác</li>
<li><strong>BIM Level 1:</strong> 2D/3D CAD, file-based</li>
<li><strong>BIM Level 2:</strong> Mô hình 3D riêng biệt, trao đổi qua CDE</li>
<li><strong>BIM Level 3:</strong> Mô hình tích hợp duy nhất (Digital Twin)</li>
</ul>
<h2>Lộ trình tại Việt Nam</h2>
<p>Theo Quyết định 258/QĐ-BXD:</p>
<ul>
<li><strong>2023-2025:</strong> Khuyến khích áp dụng BIM Level 2</li>
<li><strong>2026-2030:</strong> Bắt buộc với công trình cấp I, đặc biệt</li>
<li><strong>Sau 2030:</strong> Mở rộng bắt buộc cho công trình cấp II</li>
</ul>`,
        tags: ['bim', 'nha-thau', 'kien-truc-su', 'chu-dau-tu'],
        isFeatured: true,
      },
    ],
  },

  // Thi công thông minh
  {
    categorySlug: 'thi-cong-thong-minh',
    posts: [
      {
        title: 'Công nghệ Prefab - Tương lai của ngành xây dựng Việt Nam',
        slug: 'cong-nghe-prefab-tuong-lai-xay-dung-viet-nam',
        excerpt: 'Tổng quan về công nghệ xây dựng lắp ghép (Prefab) và tiềm năng phát triển tại thị trường Việt Nam.',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
        content: `<h2>Prefab là gì?</h2>
<p>Prefab (Prefabrication) là công nghệ sản xuất các cấu kiện xây dựng trong nhà máy, sau đó vận chuyển đến công trường lắp ghép.</p>
<h2>Ưu điểm</h2>
<ul>
<li>Rút ngắn 30-50% thời gian thi công</li>
<li>Kiểm soát chất lượng tốt hơn</li>
<li>Giảm 20-30% nhân công tại công trường</li>
<li>Giảm chất thải xây dựng 80%</li>
</ul>
<h2>Thách thức</h2>
<ul>
<li>Chi phí đầu tư ban đầu cao</li>
<li>Cần thiết kế chuẩn hóa từ đầu</li>
<li>Logistics vận chuyển cấu kiện lớn</li>
</ul>`,
        tags: ['prefab', 'nha-thau', 'cong-nghiep'],
        isFeatured: false,
      },
    ],
  },

  // IoT & Smart Building
  {
    categorySlug: 'iot-smart-building',
    posts: [
      {
        title: 'Hệ thống BMS là gì? Tổng quan về quản lý tòa nhà thông minh',
        slug: 'he-thong-bms-la-gi-quan-ly-toa-nha-thong-minh',
        excerpt: 'Tìm hiểu về Building Management System (BMS) - hệ thống quản lý tòa nhà thông minh và các chức năng chính.',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        content: `<h2>BMS là gì?</h2>
<p>BMS (Building Management System) là hệ thống điều khiển tự động tích hợp các hệ thống kỹ thuật trong tòa nhà: HVAC, chiếu sáng, an ninh, PCCC, thang máy...</p>
<h2>Các chức năng chính</h2>
<ul>
<li><strong>Giám sát:</strong> Theo dõi trạng thái thiết bị realtime</li>
<li><strong>Điều khiển:</strong> Tự động điều chỉnh theo lịch trình, cảm biến</li>
<li><strong>Cảnh báo:</strong> Phát hiện sự cố, gửi thông báo</li>
<li><strong>Báo cáo:</strong> Phân tích năng lượng, hiệu suất</li>
</ul>
<h2>Lợi ích</h2>
<ul>
<li>Tiết kiệm 15-30% năng lượng</li>
<li>Kéo dài tuổi thọ thiết bị</li>
<li>Giảm chi phí vận hành, bảo trì</li>
</ul>`,
        tags: ['iot', 'smart-building', 'tiet-kiem-nang-luong', 'cao-oc'],
        isFeatured: true,
      },
    ],
  },

  // ========== TIÊU CHUẨN & PHÁP LÝ ==========
  {
    categorySlug: 'tieu-chuan-quy-chuan',
    posts: [
      {
        title: 'TCVN 5574:2018 - Tiêu chuẩn thiết kế kết cấu bê tông cốt thép',
        slug: 'tcvn-5574-2018-tieu-chuan-thiet-ke-be-tong-cot-thep',
        excerpt: 'Tóm tắt những điểm chính và thay đổi quan trọng trong TCVN 5574:2018 về thiết kế kết cấu bê tông cốt thép.',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
        content: `<h2>Phạm vi áp dụng</h2>
<p>TCVN 5574:2018 áp dụng cho thiết kế kết cấu bê tông và bê tông cốt thép của nhà và công trình xây dựng.</p>
<h2>Những thay đổi chính so với TCVN 5574:2012</h2>
<ul>
<li>Cập nhật cấp độ bền bê tông đến B100</li>
<li>Bổ sung yêu cầu về độ bền lâu</li>
<li>Sửa đổi công thức tính toán nứt</li>
<li>Cập nhật hệ số an toàn vật liệu</li>
</ul>
<h2>Bảng tra cứu nhanh</h2>
<table>
<tr><th>Cấp bê tông</th><th>Rb (MPa)</th><th>Rbt (MPa)</th></tr>
<tr><td>B25</td><td>14.5</td><td>1.05</td></tr>
<tr><td>B30</td><td>17.0</td><td>1.15</td></tr>
<tr><td>B40</td><td>22.0</td><td>1.35</td></tr>
</table>`,
        tags: ['tcvn', 'be-tong', 'nha-thau', 'kien-truc-su'],
        isFeatured: false,
      },
    ],
  },

  {
    categorySlug: 'chung-chi-xanh',
    posts: [
      {
        title: 'So sánh chứng chỉ LEED và LOTUS - Nên chọn loại nào?',
        slug: 'so-sanh-chung-chi-leed-va-lotus-nen-chon-loai-nao',
        excerpt: 'Phân tích điểm giống và khác nhau giữa LEED (Mỹ) và LOTUS (Việt Nam) để lựa chọn phù hợp cho dự án.',
        coverImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
        content: `<h2>Tổng quan</h2>
<ul>
<li><strong>LEED:</strong> Chứng chỉ của USGBC (Mỹ), áp dụng toàn cầu</li>
<li><strong>LOTUS:</strong> Chứng chỉ của VGBC (Việt Nam), phù hợp điều kiện địa phương</li>
</ul>
<h2>So sánh chi tiết</h2>
<table>
<tr><th>Tiêu chí</th><th>LEED</th><th>LOTUS</th></tr>
<tr><td>Chi phí đăng ký</td><td>$3,000-5,000</td><td>$1,500-3,000</td></tr>
<tr><td>Ngôn ngữ</td><td>Tiếng Anh</td><td>Tiếng Việt</td></tr>
<tr><td>Độ phổ biến</td><td>Quốc tế</td><td>Việt Nam</td></tr>
<tr><td>Thời gian xét duyệt</td><td>3-6 tháng</td><td>2-4 tháng</td></tr>
</table>
<h2>Khuyến nghị</h2>
<ul>
<li><strong>Chọn LEED:</strong> Dự án có yếu tố quốc tế, thu hút FDI</li>
<li><strong>Chọn LOTUS:</strong> Dự án nội địa, tối ưu chi phí</li>
</ul>`,
        tags: ['leed', 'lotus', 'tiet-kiem-nang-luong', 'chu-dau-tu'],
        isFeatured: true,
      },
    ],
  },

  // ========== HƯỚNG DẪN ==========
  {
    categorySlug: 'so-sanh-lua-chon-vat-lieu',
    posts: [
      {
        title: 'Gạch men vs Gạch granite - Nên chọn loại nào cho nhà ở?',
        slug: 'gach-men-vs-gach-granite-nen-chon-loai-nao',
        excerpt: 'So sánh chi tiết gạch men (ceramic) và gạch granite về độ bền, giá thành, thẩm mỹ để giúp bạn lựa chọn phù hợp.',
        coverImage: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1200&q=80',
        content: `<h2>Gạch men (Ceramic)</h2>
<p><strong>Ưu điểm:</strong></p>
<ul>
<li>Giá thành rẻ (150-300K/m²)</li>
<li>Nhiều mẫu mã, màu sắc</li>
<li>Dễ cắt, thi công</li>
</ul>
<p><strong>Nhược điểm:</strong></p>
<ul>
<li>Độ cứng thấp, dễ trầy xước</li>
<li>Hấp thụ nước cao (3-6%)</li>
</ul>
<h2>Gạch Granite</h2>
<p><strong>Ưu điểm:</strong></p>
<ul>
<li>Độ cứng cao (7-8 Mohs)</li>
<li>Hấp thụ nước thấp (< 0.5%)</li>
<li>Độ bền cao, chống trầy tốt</li>
</ul>
<p><strong>Nhược điểm:</strong></p>
<ul>
<li>Giá cao hơn (350-800K/m²)</li>
<li>Khó cắt, cần máy chuyên dụng</li>
</ul>
<h2>Khuyến nghị</h2>
<ul>
<li><strong>Gạch men:</strong> Phòng ngủ, phòng khách ít di chuyển</li>
<li><strong>Gạch granite:</strong> Sảnh, bếp, nhà vệ sinh, sân thượng</li>
</ul>`,
        tags: ['gach', 'nha-o', 'xay-nha'],
        isFeatured: true,
      },
    ],
  },

  {
    categorySlug: 'quy-trinh-thi-cong-chuan',
    posts: [
      {
        title: 'Checklist nghiệm thu móng băng đúng kỹ thuật',
        slug: 'checklist-nghiem-thu-mong-bang-dung-ky-thuat',
        excerpt: 'Danh sách kiểm tra đầy đủ các hạng mục cần nghiệm thu móng băng trước khi đổ bê tông.',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
        content: `<h2>1. Kiểm tra hố móng</h2>
<ul>
<li>☐ Kích thước hố móng đúng bản vẽ</li>
<li>☐ Cao độ đáy móng chính xác</li>
<li>☐ Đất nền ổn định, không có nước</li>
<li>☐ Lớp bê tông lót đủ độ dày (100mm)</li>
</ul>
<h2>2. Kiểm tra cốt thép</h2>
<ul>
<li>☐ Đường kính thép đúng thiết kế</li>
<li>☐ Số lượng thanh thép chính</li>
<li>☐ Khoảng cách thép đai</li>
<li>☐ Chiều dài neo, nối đúng quy định</li>
<li>☐ Lớp bảo vệ (con kê) đủ 50mm</li>
</ul>
<h2>3. Kiểm tra coppha</h2>
<ul>
<li>☐ Kích thước coppha đúng</li>
<li>☐ Coppha chắc chắn, không phình</li>
<li>☐ Khe hở được bịt kín</li>
</ul>
<h2>4. Hồ sơ cần có</h2>
<ul>
<li>☐ Biên bản nghiệm thu thép</li>
<li>☐ Chứng chỉ vật liệu</li>
<li>☐ Nhật ký thi công</li>
</ul>`,
        tags: ['be-tong', 'nha-thau', 'xay-nha'],
        isFeatured: false,
      },
    ],
  },

  {
    categorySlug: 'du-toan-dinh-muc',
    posts: [
      {
        title: 'Định mức vật liệu xây 1m² tường gạch ống 10x10x20',
        slug: 'dinh-muc-vat-lieu-xay-tuong-gach-ong',
        excerpt: 'Hướng dẫn tính toán định mức vật liệu (gạch, xi măng, cát) để xây 1m² tường gạch ống 10x10x20.',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
        content: `<h2>Định mức xây 1m² tường 100mm</h2>
<table>
<tr><th>Vật liệu</th><th>Đơn vị</th><th>Định mức</th></tr>
<tr><td>Gạch ống 10x10x20</td><td>viên</td><td>52</td></tr>
<tr><td>Xi măng PCB40</td><td>kg</td><td>8</td></tr>
<tr><td>Cát mịn</td><td>m³</td><td>0.025</td></tr>
</table>
<h2>Định mức xây 1m² tường 200mm (gạch đôi)</h2>
<table>
<tr><th>Vật liệu</th><th>Đơn vị</th><th>Định mức</th></tr>
<tr><td>Gạch ống 10x10x20</td><td>viên</td><td>104</td></tr>
<tr><td>Xi măng PCB40</td><td>kg</td><td>16</td></tr>
<tr><td>Cát mịn</td><td>m³</td><td>0.05</td></tr>
</table>
<h2>Lưu ý</h2>
<ul>
<li>Hao hụt gạch: 3-5%</li>
<li>Tỷ lệ vữa: 1 xi măng : 4 cát</li>
<li>Mạch vữa: 10mm</li>
</ul>`,
        tags: ['gach', 'xi-mang', 'nha-thau', 'xay-nha'],
        isFeatured: false,
      },
    ],
  },

  // ========== CASE STUDY ==========
  {
    categorySlug: 'review-san-pham',
    posts: [
      {
        title: 'Review sơn chống thấm Kova CT-11A sau 2 năm sử dụng',
        slug: 'review-son-chong-tham-kova-ct-11a-sau-2-nam',
        excerpt: 'Đánh giá thực tế sơn chống thấm Kova CT-11A sau 2 năm sử dụng cho sân thượng nhà phố.',
        coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&q=80',
        content: `<h2>Thông tin sản phẩm</h2>
<ul>
<li>Tên: Kova CT-11A Plus</li>
<li>Loại: Sơn chống thấm gốc acrylic</li>
<li>Giá: 450.000đ/4kg</li>
<li>Định mức: 0.4-0.5 kg/m²/lớp</li>
</ul>
<h2>Điều kiện test</h2>
<ul>
<li>Vị trí: Sân thượng 50m², hướng Tây</li>
<li>Thời gian sử dụng: 24 tháng</li>
<li>Số lớp sơn: 3 lớp</li>
</ul>
<h2>Kết quả sau 2 năm</h2>
<p><strong>Điểm mạnh:</strong></p>
<ul>
<li>Không thấm nước, không bị bong tróc</li>
<li>Màu sắc còn giữ 80%</li>
<li>Không nứt, không rạn</li>
</ul>
<p><strong>Điểm yếu:</strong></p>
<ul>
<li>Bề mặt có bám rêu ở góc khuất</li>
<li>Màu trắng chuyển vàng nhẹ</li>
</ul>
<h2>Đánh giá: 8.5/10</h2>`,
        tags: ['son', 'chong-tham', 'nha-o', 'xay-nha'],
        isFeatured: true,
      },
    ],
  },

  {
    categorySlug: 'case-study-cong-trinh',
    posts: [
      {
        title: 'Case study: Tiết kiệm 35% năng lượng tại tòa nhà văn phòng ABC Tower',
        slug: 'case-study-tiet-kiem-nang-luong-abc-tower',
        excerpt: 'Phân tích chi tiết các giải pháp đã giúp tòa nhà ABC Tower giảm 35% chi phí năng lượng sau 1 năm vận hành.',
        coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        content: `<h2>Thông tin công trình</h2>
<ul>
<li>Tên: ABC Tower</li>
<li>Diện tích: 25.000m² sàn</li>
<li>Quy mô: 20 tầng văn phòng</li>
<li>Hoàn thành: 2022</li>
</ul>
<h2>Các giải pháp áp dụng</h2>
<h3>1. Vỏ bao che (Facade)</h3>
<ul>
<li>Kính Low-E double: giảm 45% nhiệt hấp thụ</li>
<li>Lam che nắng tự động theo vị trí mặt trời</li>
</ul>
<h3>2. Hệ thống HVAC</h3>
<ul>
<li>Chiller biến tần hiệu suất cao COP 6.5</li>
<li>Hệ thống VAV điều chỉnh gió theo nhu cầu</li>
</ul>
<h3>3. Chiếu sáng</h3>
<ul>
<li>100% đèn LED với cảm biến ánh sáng tự nhiên</li>
<li>Sensor chiếm chỗ (occupancy sensor)</li>
</ul>
<h2>Kết quả</h2>
<table>
<tr><th>Chỉ số</th><th>Trước</th><th>Sau</th></tr>
<tr><td>EUI (kWh/m²/năm)</td><td>180</td><td>117</td></tr>
<tr><td>Chi phí điện/tháng</td><td>850 triệu</td><td>550 triệu</td></tr>
</table>
<p><strong>ROI:</strong> 3.5 năm hoàn vốn đầu tư.</p>`,
        tags: ['tiet-kiem-nang-luong', 'smart-building', 'kinh-low-e', 'cao-oc', 'chu-dau-tu'],
        isFeatured: true,
      },
    ],
  },
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedPosts() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get all categories and tags for reference
    const categories = await Category.find({});
    const tags = await Tag.find({});

    const categoryMap = new Map(categories.map((c) => [c.slug, c._id]));
    const tagMap = new Map(tags.map((t) => [t.slug, t._id]));

    console.log(`Found ${categories.length} categories, ${tags.length} tags`);

    let createdCount = 0;
    let skippedCount = 0;

    console.log('\n--- Seeding Posts ---');

    for (const categoryPosts of postsData) {
      const categoryId = categoryMap.get(categoryPosts.categorySlug);

      if (!categoryId) {
        console.log(`⚠ Category not found: ${categoryPosts.categorySlug}`);
        continue;
      }

      const categoryName =
        categories.find((c) => c.slug === categoryPosts.categorySlug)?.name || categoryPosts.categorySlug;
      console.log(`\n📁 ${categoryName}`);

      for (const postData of categoryPosts.posts) {
        // Check if post exists
        const existingPost = await Post.findOne({ slug: postData.slug });

        if (existingPost) {
          console.log(`  → Exists: ${postData.title.substring(0, 50)}...`);
          skippedCount++;
          continue;
        }

        // Map tag slugs to ObjectIds
        const tagIds = postData.tags
          .map((tagSlug: string) => tagMap.get(tagSlug))
          .filter((id: any) => id !== undefined);

        // Create post
        await Post.create({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          coverImage: postData.coverImage,
          categoryId: categoryId,
          status: 'published',
          publishedAt: new Date(),
          author: 'Admin',
          tags: postData.tags,
          tagsRelation: tagIds,
          isFeatured: postData.isFeatured || false,
          viewCount: Math.floor(Math.random() * 500) + 50,
          metaTitle: postData.title,
          metaDescription: postData.excerpt,
        });

        console.log(`  ✓ Created: ${postData.title.substring(0, 50)}...`);
        createdCount++;
      }
    }

    console.log('\n✅ Seed posts completed!');
    console.log(`\nSummary:`);
    console.log(`- Created: ${createdCount} posts`);
    console.log(`- Skipped: ${skippedCount} posts (already exist)`);

    const totalPosts = await Post.countDocuments();
    console.log(`- Total posts in DB: ${totalPosts}`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
seedPosts();
