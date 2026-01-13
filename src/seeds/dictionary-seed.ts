/**
 * Seed sample dictionary terms for Construction Materials News Site
 * Technical terms and glossary for construction industry
 */

import mongoose from 'mongoose';
import { DictionaryTerm } from '../models/dictionary.model';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// SAMPLE DICTIONARY DATA
// ============================================
const dictionaryData = [
  {
    term: 'Bê tông',
    slug: 'be-tong',
    definition: 'Vật liệu xây dựng hỗn hợp gồm xi măng, cốt liệu (cát, đá), nước và phụ gia.',
    description: `<p>Bê tông là vật liệu xây dựng được sử dụng phổ biến nhất trên thế giới. Thành phần chính bao gồm:</p>
<ul>
<li><strong>Xi măng</strong>: Chất kết dính chính</li>
<li><strong>Cốt liệu</strong>: Cát (cốt liệu nhỏ) và đá (cốt liệu lớn)</li>
<li><strong>Nước</strong>: Kích hoạt phản ứng thủy hóa</li>
<li><strong>Phụ gia</strong>: Cải thiện tính năng (tùy chọn)</li>
</ul>
<p>Bê tông có cường độ chịu nén cao nhưng chịu kéo kém, vì vậy thường được kết hợp với cốt thép để tạo thành bê tông cốt thép.</p>`,
    pronunciation: '/bê tông/',
    partOfSpeech: 'noun',
    synonyms: ['concrete', 'beton'],
    examples: [
      'Móng nhà được đổ bằng bê tông mác 300.',
      'Bê tông cần được bảo dưỡng đúng cách để đạt cường độ thiết kế.',
    ],
    etymology: 'Từ tiếng Pháp "béton", có nguồn gốc từ tiếng Latin "bitumen".',
    tags: ['vật liệu kết cấu', 'xi măng', 'xây dựng'],
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    seo: {
      metaTitle: 'Bê tông là gì? Thành phần, phân loại và ứng dụng',
      metaDescription: 'Tìm hiểu về bê tông - vật liệu xây dựng phổ biến nhất. Thành phần, cách pha trộn, các loại bê tông và ứng dụng trong xây dựng.',
    },
  },
  {
    term: 'Xi măng Portland',
    slug: 'xi-mang-portland',
    definition: 'Loại xi măng phổ biến nhất, được sản xuất bằng cách nung hỗn hợp đá vôi và đất sét ở nhiệt độ cao.',
    description: `<p>Xi măng Portland là chất kết dính thủy lực, khi trộn với nước sẽ tạo thành hồ xi măng có khả năng đông cứng và phát triển cường độ.</p>
<h3>Phân loại xi măng Portland</h3>
<ul>
<li><strong>PCB30</strong>: Xi măng hỗn hợp, cường độ 30 MPa</li>
<li><strong>PCB40</strong>: Xi măng hỗn hợp, cường độ 40 MPa</li>
<li><strong>PC40</strong>: Xi măng Portland, cường độ 40 MPa</li>
<li><strong>PC50</strong>: Xi măng Portland, cường độ 50 MPa</li>
</ul>`,
    pronunciation: '/xi măng poóc-lăng/',
    partOfSpeech: 'noun',
    synonyms: ['cement', 'portland cement'],
    examples: [
      'Xi măng Portland PC40 thường dùng cho các công trình dân dụng.',
      'Cần bảo quản xi măng nơi khô ráo, tránh ẩm.',
    ],
    tags: ['xi măng', 'chất kết dính', 'vật liệu xây dựng'],
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    seo: {
      metaTitle: 'Xi măng Portland là gì? Phân loại PC30, PC40, PC50',
      metaDescription: 'Tìm hiểu xi măng Portland - chất kết dính phổ biến trong xây dựng. Các loại PCB30, PCB40, PC40, PC50 và cách sử dụng.',
    },
  },
  {
    term: 'Cốt thép',
    slug: 'cot-thep',
    definition: 'Thanh thép được đặt trong bê tông để tăng khả năng chịu kéo cho kết cấu.',
    description: `<p>Cốt thép (hay thép xây dựng) là thành phần quan trọng trong bê tông cốt thép. Cốt thép chịu lực kéo, bê tông chịu lực nén, tạo nên kết cấu có khả năng chịu lực tốt.</p>
<h3>Phân loại cốt thép</h3>
<ul>
<li><strong>Thép trơn (CB240-T)</strong>: Bề mặt trơn, dùng cho thép đai</li>
<li><strong>Thép vằn (CB300-V, CB400-V)</strong>: Có gân xoắn, bám dính tốt với bê tông</li>
<li><strong>Thép cường độ cao</strong>: CB500-V, dùng cho kết cấu đặc biệt</li>
</ul>`,
    pronunciation: '/cốt thép/',
    partOfSpeech: 'noun',
    synonyms: ['reinforcement', 'rebar', 'thép xây dựng'],
    examples: [
      'Cốt thép D16 được sử dụng cho dầm chính.',
      'Khoảng cách cốt thép đai là 150mm.',
    ],
    tags: ['thép', 'kết cấu', 'bê tông cốt thép'],
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    seo: {
      metaTitle: 'Cốt thép là gì? Phân loại CB240, CB300, CB400',
      metaDescription: 'Tìm hiểu về cốt thép trong xây dựng. Các loại thép trơn, thép vằn và cách bố trí cốt thép trong bê tông.',
    },
  },
  {
    term: 'Gạch ceramic',
    slug: 'gach-ceramic',
    definition: 'Loại gạch ốp lát được sản xuất từ đất sét nung ở nhiệt độ cao, có bề mặt men phủ.',
    description: `<p>Gạch ceramic là vật liệu hoàn thiện phổ biến cho sàn và tường. Gạch được nung ở nhiệt độ 1000-1200°C.</p>
<h3>Đặc điểm</h3>
<ul>
<li>Độ hút nước: 3-10%</li>
<li>Độ cứng bề mặt: 5-6 Mohs</li>
<li>Đa dạng màu sắc, hoa văn</li>
<li>Giá thành hợp lý</li>
</ul>
<h3>Ứng dụng</h3>
<p>Thích hợp cho không gian nội thất: phòng khách, phòng ngủ, nhà vệ sinh.</p>`,
    pronunciation: '/gạch xê-ra-mic/',
    partOfSpeech: 'noun',
    synonyms: ['ceramic tile', 'gạch men'],
    examples: [
      'Gạch ceramic 60x60 được lát cho phòng khách.',
      'Gạch ceramic có nhiều mẫu mã vân đá, vân gỗ.',
    ],
    tags: ['gạch', 'vật liệu hoàn thiện', 'ốp lát'],
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    seo: {
      metaTitle: 'Gạch ceramic là gì? So sánh với gạch porcelain',
      metaDescription: 'Tìm hiểu gạch ceramic - vật liệu ốp lát phổ biến. Đặc điểm, ưu nhược điểm và cách phân biệt với gạch porcelain.',
    },
  },
  {
    term: 'Gạch porcelain',
    slug: 'gach-porcelain',
    definition: 'Loại gạch cao cấp được nung ở nhiệt độ rất cao (>1200°C), có độ cứng và độ bền cao.',
    description: `<p>Gạch porcelain (gạch granite nhân tạo) là loại gạch cao cấp với nhiều ưu điểm vượt trội.</p>
<h3>Đặc điểm</h3>
<ul>
<li>Độ hút nước: <0.5% (gần như không thấm nước)</li>
<li>Độ cứng bề mặt: 7-8 Mohs</li>
<li>Chịu mài mòn, va đập tốt</li>
<li>Chịu hóa chất, dễ vệ sinh</li>
</ul>
<h3>Ứng dụng</h3>
<p>Thích hợp cho cả nội thất và ngoại thất: sảnh, hành lang, sân vườn, mặt tiền.</p>`,
    pronunciation: '/gạch pó-xơ-lin/',
    partOfSpeech: 'noun',
    synonyms: ['porcelain tile', 'gạch granite'],
    examples: [
      'Gạch porcelain 80x80 lát sảnh tòa nhà văn phòng.',
      'Gạch porcelain full body có màu xuyên suốt.',
    ],
    tags: ['gạch', 'vật liệu hoàn thiện', 'cao cấp'],
    isActive: true,
    isFeatured: false,
    sortOrder: 5,
    seo: {
      metaTitle: 'Gạch porcelain là gì? Ưu điểm và ứng dụng',
      metaDescription: 'Tìm hiểu gạch porcelain cao cấp. Đặc tính vượt trội, so sánh với ceramic và hướng dẫn chọn gạch phù hợp.',
    },
  },
  {
    term: 'Chống thấm',
    slug: 'chong-tham',
    definition: 'Biện pháp kỹ thuật ngăn nước xâm nhập vào kết cấu công trình.',
    description: `<p>Chống thấm là công tác quan trọng để bảo vệ công trình khỏi tác động của nước, đảm bảo độ bền và tuổi thọ kết cấu.</p>
<h3>Các phương pháp chống thấm</h3>
<ul>
<li><strong>Màng bitum</strong>: Dán nóng hoặc tự dính</li>
<li><strong>Sơn chống thấm</strong>: Polymer, polyurethane, epoxy</li>
<li><strong>Vữa chống thấm</strong>: Xi măng polymer, thẩm thấu kết tinh</li>
<li><strong>Màng PVC/HDPE</strong>: Cho tầng hầm, hồ nước</li>
</ul>`,
    pronunciation: '/chống thấm/',
    partOfSpeech: 'noun',
    synonyms: ['waterproofing', 'damp proofing'],
    examples: [
      'Sân thượng cần được chống thấm kỹ trước khi lát gạch.',
      'Tầng hầm sử dụng màng chống thấm HDPE.',
    ],
    tags: ['chống thấm', 'bảo vệ công trình', 'thi công'],
    isActive: true,
    isFeatured: true,
    sortOrder: 6,
    seo: {
      metaTitle: 'Chống thấm là gì? Các phương pháp chống thấm hiệu quả',
      metaDescription: 'Tìm hiểu các giải pháp chống thấm cho công trình. Màng bitum, sơn chống thấm, vữa xi măng polymer và hướng dẫn thi công.',
    },
  },
  {
    term: 'TCVN',
    slug: 'tcvn',
    definition: 'Tiêu chuẩn Việt Nam - hệ thống tiêu chuẩn kỹ thuật do Bộ KH&CN ban hành.',
    description: `<p>TCVN (Tiêu chuẩn Việt Nam) là hệ thống tiêu chuẩn kỹ thuật quốc gia, quy định các yêu cầu về chất lượng, quy cách, phương pháp thử nghiệm.</p>
<h3>Một số TCVN quan trọng trong xây dựng</h3>
<ul>
<li><strong>TCVN 5574:2018</strong>: Kết cấu bê tông và bê tông cốt thép</li>
<li><strong>TCVN 6260:2009</strong>: Xi măng Portland hỗn hợp</li>
<li><strong>TCVN 7570:2006</strong>: Cốt liệu cho bê tông và vữa</li>
<li><strong>TCVN 1651:2018</strong>: Thép thanh vằn</li>
</ul>`,
    pronunciation: '/tê xê vê en/',
    partOfSpeech: 'abbreviation',
    synonyms: ['tiêu chuẩn Việt Nam', 'Vietnam standard'],
    examples: [
      'Bê tông phải đạt cường độ theo TCVN 5574.',
      'Xi măng PCB40 tuân thủ TCVN 6260.',
    ],
    tags: ['tiêu chuẩn', 'quy chuẩn', 'chất lượng'],
    isActive: true,
    isFeatured: false,
    sortOrder: 7,
    seo: {
      metaTitle: 'TCVN là gì? Các tiêu chuẩn xây dựng quan trọng',
      metaDescription: 'Tìm hiểu TCVN - Tiêu chuẩn Việt Nam trong xây dựng. Các TCVN về bê tông, xi măng, thép và vật liệu xây dựng.',
    },
  },
  {
    term: 'BIM',
    slug: 'bim',
    definition: 'Building Information Modeling - Mô hình thông tin công trình, phương pháp quản lý dự án dựa trên mô hình 3D.',
    description: `<p>BIM là quy trình thông minh dựa trên mô hình 3D, giúp các chuyên gia kiến trúc, kỹ thuật và xây dựng lập kế hoạch, thiết kế, xây dựng và quản lý công trình hiệu quả hơn.</p>
<h3>Các cấp độ BIM</h3>
<ul>
<li><strong>BIM Level 0</strong>: 2D CAD</li>
<li><strong>BIM Level 1</strong>: 2D + 3D riêng lẻ</li>
<li><strong>BIM Level 2</strong>: 3D phối hợp giữa các bộ môn</li>
<li><strong>BIM Level 3</strong>: Tích hợp hoàn toàn (iBIM)</li>
</ul>
<h3>Phần mềm BIM phổ biến</h3>
<p>Revit, ArchiCAD, Tekla, Navisworks, Synchro...</p>`,
    pronunciation: '/bim/',
    partOfSpeech: 'acronym',
    synonyms: ['Building Information Modeling', 'mô hình hóa thông tin công trình'],
    examples: [
      'Dự án được triển khai theo BIM Level 2.',
      'File BIM được chia sẻ qua CDE (Common Data Environment).',
    ],
    tags: ['BIM', 'công nghệ', 'quản lý dự án'],
    isActive: true,
    isFeatured: true,
    sortOrder: 8,
    seo: {
      metaTitle: 'BIM là gì? Lợi ích và ứng dụng trong xây dựng',
      metaDescription: 'Tìm hiểu BIM - Building Information Modeling. Các cấp độ BIM, phần mềm phổ biến và xu hướng ứng dụng tại Việt Nam.',
    },
  },
  {
    term: 'LEED',
    slug: 'leed',
    definition: 'Leadership in Energy and Environmental Design - Hệ thống chứng nhận công trình xanh của Hoa Kỳ.',
    description: `<p>LEED là hệ thống đánh giá và chứng nhận công trình xanh được công nhận toàn cầu, do U.S. Green Building Council (USGBC) phát triển.</p>
<h3>Các cấp chứng nhận LEED</h3>
<ul>
<li><strong>Certified</strong>: 40-49 điểm</li>
<li><strong>Silver</strong>: 50-59 điểm</li>
<li><strong>Gold</strong>: 60-79 điểm</li>
<li><strong>Platinum</strong>: 80+ điểm</li>
</ul>
<h3>Các hạng mục đánh giá</h3>
<p>Location & Transportation, Sustainable Sites, Water Efficiency, Energy & Atmosphere, Materials & Resources, Indoor Environmental Quality...</p>`,
    pronunciation: '/líd/',
    partOfSpeech: 'acronym',
    synonyms: ['green building certification', 'chứng nhận công trình xanh'],
    examples: [
      'Tòa nhà đạt chứng nhận LEED Gold.',
      'Dự án hướng đến LEED Platinum với thiết kế tiết kiệm năng lượng.',
    ],
    tags: ['công trình xanh', 'chứng nhận', 'bền vững'],
    isActive: true,
    isFeatured: false,
    sortOrder: 9,
    seo: {
      metaTitle: 'LEED là gì? Các cấp chứng nhận công trình xanh',
      metaDescription: 'Tìm hiểu LEED - hệ thống chứng nhận công trình xanh quốc tế. Các cấp Certified, Silver, Gold, Platinum và tiêu chí đánh giá.',
    },
  },
  {
    term: 'Mác bê tông',
    slug: 'mac-be-tong',
    definition: 'Chỉ số cường độ chịu nén của bê tông, đo bằng MPa hoặc kg/cm².',
    description: `<p>Mác bê tông (hoặc cấp độ bền) thể hiện cường độ chịu nén của bê tông sau 28 ngày bảo dưỡng tiêu chuẩn.</p>
<h3>Các mác bê tông phổ biến</h3>
<ul>
<li><strong>M150 (B12.5)</strong>: Bê tông lót, nền</li>
<li><strong>M200 (B15)</strong>: Móng nhà dân dụng</li>
<li><strong>M250 (B20)</strong>: Sàn, dầm nhà dân dụng</li>
<li><strong>M300 (B22.5)</strong>: Kết cấu chịu lực</li>
<li><strong>M350 (B25)</strong>: Công trình cao tầng</li>
<li><strong>M400+ (B30+)</strong>: Công trình đặc biệt</li>
</ul>`,
    pronunciation: '/mác bê tông/',
    partOfSpeech: 'noun',
    synonyms: ['concrete grade', 'cấp độ bền bê tông'],
    examples: [
      'Dầm sàn sử dụng bê tông mác 300.',
      'Bê tông B25 tương đương M350.',
    ],
    tags: ['bê tông', 'cường độ', 'thiết kế'],
    isActive: true,
    isFeatured: false,
    sortOrder: 10,
    seo: {
      metaTitle: 'Mác bê tông là gì? Cách chọn mác bê tông phù hợp',
      metaDescription: 'Tìm hiểu mác bê tông M150, M200, M250, M300, M350. Cách quy đổi giữa mác (M) và cấp độ bền (B).',
    },
  },
  {
    term: 'Cốp pha',
    slug: 'cop-pha',
    definition: 'Khuôn đúc bê tông, giữ bê tông theo hình dạng thiết kế cho đến khi đông cứng.',
    description: `<p>Cốp pha (ván khuôn) là hệ thống khuôn tạo hình cho bê tông. Cốp pha phải đảm bảo đủ cứng, kín và dễ tháo lắp.</p>
<h3>Các loại cốp pha</h3>
<ul>
<li><strong>Cốp pha gỗ</strong>: Truyền thống, linh hoạt, giá rẻ</li>
<li><strong>Cốp pha thép</strong>: Bền, tái sử dụng nhiều lần</li>
<li><strong>Cốp pha nhôm</strong>: Nhẹ, chính xác, cho nhà cao tầng</li>
<li><strong>Cốp pha nhựa</strong>: Nhẹ, chống thấm tốt</li>
</ul>`,
    pronunciation: '/cốp pha/',
    partOfSpeech: 'noun',
    synonyms: ['formwork', 'ván khuôn', 'khuôn đúc'],
    examples: [
      'Cốp pha cột được lắp dựng trước khi đổ bê tông.',
      'Tháo cốp pha dầm sau 7 ngày.',
    ],
    tags: ['thi công', 'bê tông', 'khuôn đúc'],
    isActive: true,
    isFeatured: false,
    sortOrder: 11,
    seo: {
      metaTitle: 'Cốp pha là gì? Các loại cốp pha trong xây dựng',
      metaDescription: 'Tìm hiểu cốp pha - khuôn đúc bê tông. Các loại cốp pha gỗ, thép, nhôm, nhựa và kỹ thuật lắp dựng.',
    },
  },
  {
    term: 'Vữa xây dựng',
    slug: 'vua-xay-dung',
    definition: 'Hỗn hợp xi măng, cát và nước dùng để xây, trát, ốp lát.',
    description: `<p>Vữa xây dựng là vật liệu kết dính được sử dụng rộng rãi trong các công tác hoàn thiện.</p>
<h3>Các loại vữa</h3>
<ul>
<li><strong>Vữa xây</strong>: Mác 50-75, liên kết gạch</li>
<li><strong>Vữa trát</strong>: Mác 75-100, hoàn thiện bề mặt</li>
<li><strong>Vữa ốp lát</strong>: Có phụ gia, bám dính gạch</li>
<li><strong>Vữa tự san phẳng</strong>: Láng nền, tạo độ phẳng cao</li>
</ul>
<h3>Tỷ lệ pha trộn</h3>
<p>Vữa M75: Xi măng/Cát = 1:4 (theo thể tích)</p>`,
    pronunciation: '/vữa xây dựng/',
    partOfSpeech: 'noun',
    synonyms: ['mortar', 'hồ xây'],
    examples: [
      'Vữa trát tường dày 15mm.',
      'Sử dụng vữa M75 để xây tường gạch.',
    ],
    tags: ['vữa', 'xi măng', 'hoàn thiện'],
    isActive: true,
    isFeatured: false,
    sortOrder: 12,
    seo: {
      metaTitle: 'Vữa xây dựng là gì? Các loại vữa và tỷ lệ pha',
      metaDescription: 'Tìm hiểu vữa xây dựng - vữa xây, vữa trát, vữa ốp lát. Tỷ lệ pha trộn xi măng cát và cách sử dụng.',
    },
  },
  {
    term: 'HVAC',
    slug: 'hvac',
    definition: 'Heating, Ventilation and Air Conditioning - Hệ thống sưởi, thông gió và điều hòa không khí.',
    description: `<p>HVAC là hệ thống cơ điện quan trọng trong tòa nhà, đảm bảo môi trường không khí trong lành và nhiệt độ thoải mái.</p>
<h3>Thành phần chính</h3>
<ul>
<li><strong>Heating</strong>: Hệ thống sưởi (boiler, heat pump)</li>
<li><strong>Ventilation</strong>: Thông gió, cấp khí tươi (AHU, FCU)</li>
<li><strong>Air Conditioning</strong>: Điều hòa nhiệt độ (chiller, VRV)</li>
</ul>
<h3>Các hệ thống HVAC phổ biến</h3>
<p>Chiller - AHU/FCU, VRV/VRF, Split, Packaged...</p>`,
    pronunciation: '/éch-vắc/',
    partOfSpeech: 'acronym',
    synonyms: ['air conditioning', 'điều hòa không khí', 'cơ điện lạnh'],
    examples: [
      'Hệ thống HVAC tòa nhà sử dụng chiller giải nhiệt nước.',
      'Chi phí vận hành HVAC chiếm 40% tổng chi phí năng lượng.',
    ],
    tags: ['MEP', 'điều hòa', 'cơ điện'],
    isActive: true,
    isFeatured: false,
    sortOrder: 13,
    seo: {
      metaTitle: 'HVAC là gì? Hệ thống điều hòa không khí tòa nhà',
      metaDescription: 'Tìm hiểu HVAC - hệ thống sưởi, thông gió và điều hòa. Các loại hệ thống Chiller, VRV, Split và nguyên lý hoạt động.',
    },
  },
  {
    term: 'Thép hình',
    slug: 'thep-hinh',
    definition: 'Thép được cán theo hình dạng cố định như chữ I, H, C, U, L dùng trong kết cấu.',
    description: `<p>Thép hình là sản phẩm thép cán nóng có tiết diện theo hình dạng nhất định, dùng làm kết cấu thép cho nhà xưởng, cầu, tòa nhà.</p>
<h3>Các loại thép hình phổ biến</h3>
<ul>
<li><strong>Thép chữ I</strong>: Dầm, xà gồ</li>
<li><strong>Thép chữ H</strong>: Cột, dầm chịu lực lớn</li>
<li><strong>Thép chữ C</strong>: Xà gồ mái, khung nhẹ</li>
<li><strong>Thép chữ U</strong>: Ray, kết cấu phụ</li>
<li><strong>Thép góc L</strong>: Giằng, liên kết</li>
</ul>`,
    pronunciation: '/thép hình/',
    partOfSpeech: 'noun',
    synonyms: ['structural steel', 'steel section', 'thép cán nóng'],
    examples: [
      'Cột nhà xưởng sử dụng thép hình H300x300.',
      'Xà gồ mái bằng thép C200.',
    ],
    tags: ['thép', 'kết cấu thép', 'vật liệu'],
    isActive: true,
    isFeatured: false,
    sortOrder: 14,
    seo: {
      metaTitle: 'Thép hình là gì? Các loại thép I, H, C, U, L',
      metaDescription: 'Tìm hiểu thép hình trong xây dựng. Đặc điểm thép chữ I, H, C, U, L và ứng dụng trong kết cấu thép.',
    },
  },
  {
    term: 'Phụ gia bê tông',
    slug: 'phu-gia-be-tong',
    definition: 'Chất được thêm vào bê tông với lượng nhỏ để cải thiện tính năng.',
    description: `<p>Phụ gia bê tông là các chất hóa học hoặc khoáng vật được thêm vào trong quá trình trộn bê tông để cải thiện các tính chất.</p>
<h3>Các loại phụ gia phổ biến</h3>
<ul>
<li><strong>Phụ gia giảm nước</strong>: Tăng độ sụt, giảm nước</li>
<li><strong>Phụ gia siêu dẻo</strong>: Cho bê tông tự đầm</li>
<li><strong>Phụ gia đông cứng nhanh</strong>: Rút ngắn thời gian</li>
<li><strong>Phụ gia chậm đông</strong>: Kéo dài thời gian thi công</li>
<li><strong>Phụ gia chống thấm</strong>: Giảm độ thấm nước</li>
</ul>`,
    pronunciation: '/phụ gia bê tông/',
    partOfSpeech: 'noun',
    synonyms: ['concrete admixture', 'additive'],
    examples: [
      'Bê tông trộn phụ gia siêu dẻo để bơm lên cao.',
      'Phụ gia giảm nước giúp tăng cường độ bê tông.',
    ],
    tags: ['bê tông', 'phụ gia', 'hóa chất'],
    isActive: true,
    isFeatured: false,
    sortOrder: 15,
    seo: {
      metaTitle: 'Phụ gia bê tông là gì? Các loại và công dụng',
      metaDescription: 'Tìm hiểu phụ gia bê tông - chất cải thiện tính năng bê tông. Phụ gia giảm nước, siêu dẻo, chống thấm và cách sử dụng.',
    },
  },
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedDictionary() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let createdCount = 0;
    let skippedCount = 0;

    console.log('\n--- Seeding Dictionary Terms ---\n');

    for (const termData of dictionaryData) {
      // Check if term exists
      const existingTerm = await DictionaryTerm.findOne({ slug: termData.slug });

      if (existingTerm) {
        console.log(`→ Exists: ${termData.term}`);
        skippedCount++;
        continue;
      }

      // Create term
      await DictionaryTerm.create(termData);
      console.log(`✓ Created: ${termData.term}`);
      createdCount++;
    }

    console.log('\n✅ Seed dictionary completed!');
    console.log(`\nSummary:`);
    console.log(`- Created: ${createdCount} terms`);
    console.log(`- Skipped: ${skippedCount} terms (already exist)`);

    const totalTerms = await DictionaryTerm.countDocuments();
    console.log(`- Total terms in DB: ${totalTerms}`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
seedDictionary();
