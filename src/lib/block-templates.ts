/**
 * Block Templates Library — 200 pre-built block style presets
 * Mỗi template = 1 block config có sẵn style, dùng Tailwind CSS classes
 * FE render dựa trên tailwindClasses + block data
 *
 * Categories:
 * 1-30:   Image + Text layouts
 * 31-50:  Hero sections
 * 51-70:  Cards & Collections
 * 71-90:  Stats & Numbers
 * 91-110: Testimonials & Quotes
 * 111-130: CTA & Buttons
 * 131-150: Lists & Features
 * 151-170: Media & Gallery
 * 171-190: Commerce & Pricing
 * 191-200: Special & Creative
 */

export interface BlockTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  // Tham chiếu thư viện UI
  uiLib?: 'tailwind' | 'shadcn' | 'mui' | 'antd';
  // Block config
  block: {
    type: string;
    style?: { tailwindClasses?: string; className?: string; cssOverride?: string };
    [key: string]: unknown;
  };
}

export const BLOCK_TEMPLATES: BlockTemplate[] = [

  // ═══════════════════════════════════════════════════════════════
  // 1-30: IMAGE + TEXT LAYOUTS
  // ═══════════════════════════════════════════════════════════════

  {
    // Ảnh bên trái 40%, text bên phải, nền trắng, bo góc
    id: 'img-text-001',
    name: 'Ảnh trái + Text phải (Classic)',
    category: 'image-text',
    description: 'Ảnh chiếm 40% bên trái, text 60% bên phải, padding 24px, bo góc 12px',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 40,
      verticalAlign: 'center',
      style: { tailwindClasses: 'flex gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100' },
    },
  },
  {
    // Ảnh bên phải 50%, text trái, nền gradient
    id: 'img-text-002',
    name: 'Text trái + Ảnh phải (Gradient)',
    category: 'image-text',
    description: 'Text 50% trái, ảnh 50% phải, nền gradient xanh-tím, text trắng',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'right',
      mediaWidth: 50,
      verticalAlign: 'center',
      style: { tailwindClasses: 'flex gap-8 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white' },
    },
  },
  {
    // Ảnh full width trên, text dưới
    id: 'img-text-003',
    name: 'Ảnh trên + Text dưới (Magazine)',
    category: 'image-text',
    description: 'Ảnh full width trên, text bên dưới với padding lớn, kiểu tạp chí',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 100,
      style: { tailwindClasses: 'flex flex-col gap-0 rounded-2xl overflow-hidden shadow-lg', cssOverride: 'img { height: 400px; object-fit: cover; } .text { padding: 32px; }' },
    },
  },
  {
    // Ảnh tròn nhỏ + text, kiểu profile
    id: 'img-text-004',
    name: 'Avatar tròn + Text (Profile)',
    category: 'image-text',
    description: 'Ảnh tròn 80px bên trái, tên + mô tả bên phải, kiểu profile card',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 15,
      verticalAlign: 'center',
      style: { tailwindClasses: 'flex items-center gap-4 p-4 bg-gray-50 rounded-full', cssOverride: 'img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }' },
    },
  },
  {
    // Ảnh full background + text overlay trung tâm
    id: 'img-text-005',
    name: 'Ảnh nền + Text overlay (Cinematic)',
    category: 'image-text',
    description: 'Ảnh full background, text trắng ở giữa với overlay tối, chiều cao 500px',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      height: '500px',
      overlay: 0.5,
      style: { tailwindClasses: 'relative rounded-2xl overflow-hidden flex items-center justify-center text-center text-white' },
    },
  },
  {
    // Ảnh trái bo tròn + text phải, nền pastel
    id: 'img-text-006',
    name: 'Ảnh tròn trái + Text phải (Pastel Pink)',
    category: 'image-text',
    description: 'Ảnh bo tròn bên trái, text phải, nền hồng pastel nhẹ',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 35,
      style: { tailwindClasses: 'flex gap-6 p-6 bg-pink-50 rounded-2xl border border-pink-100', cssOverride: 'img { border-radius: 50%; aspect-ratio: 1; object-fit: cover; }' },
    },
  },
  {
    // Ảnh phải với border neon + text trái dark
    id: 'img-text-007',
    name: 'Dark mode + Ảnh neon border',
    category: 'image-text',
    description: 'Nền đen, text trắng bên trái, ảnh phải có viền neon xanh glow',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'right',
      mediaWidth: 45,
      style: { tailwindClasses: 'flex gap-8 p-8 bg-gray-950 rounded-2xl text-white', cssOverride: 'img { border: 2px solid #00ff88; border-radius: 16px; box-shadow: 0 0 20px rgba(0,255,136,0.3); }' },
    },
  },
  {
    // Ảnh nghiêng + text, kiểu editorial
    id: 'img-text-008',
    name: 'Ảnh nghiêng (Editorial Tilt)',
    category: 'image-text',
    description: 'Ảnh xoay nhẹ -3deg, shadow lớn, text bên phải align top',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 40,
      verticalAlign: 'top',
      style: { tailwindClasses: 'flex gap-8 p-8', cssOverride: 'img { transform: rotate(-3deg); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }' },
    },
  },
  {
    // Ảnh hexagon mask + text
    id: 'img-text-009',
    name: 'Ảnh Hexagon + Text',
    category: 'image-text',
    description: 'Ảnh cắt hình lục giác bên trái, text phải',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 35,
      style: { tailwindClasses: 'flex items-center gap-8 p-6', cssOverride: 'img { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); aspect-ratio: 1; object-fit: cover; }' },
    },
  },
  {
    // Ảnh + text xen kẽ zigzag
    id: 'img-text-010',
    name: 'Zigzag Layout (Odd/Even)',
    category: 'image-text',
    description: 'Dùng cho danh sách: block lẻ ảnh trái, block chẵn ảnh phải',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 45,
      style: { tailwindClasses: 'flex gap-8 p-6 even:flex-row-reverse rounded-xl bg-white shadow-sm' },
    },
  },
  {
    // Ảnh blur background + text sharp phía trước
    id: 'img-text-011',
    name: 'Blur Background + Sharp Text',
    category: 'image-text',
    description: 'Ảnh làm nền blur, text rõ nét phía trước với glassmorphism card',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'relative rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center', cssOverride: '.bg-img { filter: blur(8px); scale: 1.1; } .content { backdrop-filter: blur(16px); background: rgba(255,255,255,0.15); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.2); }' },
    },
  },
  {
    // Ảnh với caption overlay gradient bottom
    id: 'img-text-012',
    name: 'Ảnh + Caption Gradient Bottom',
    category: 'image-text',
    description: 'Ảnh full, caption text trắng ở dưới với gradient đen fade lên',
    uiLib: 'tailwind',
    block: {
      type: 'image',
      style: { tailwindClasses: 'relative rounded-2xl overflow-hidden', cssOverride: 'figcaption { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 24px 24px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; font-size: 18px; font-weight: 600; }' },
    },
  },
  {
    // Ảnh split screen 50/50
    id: 'img-text-013',
    name: 'Split Screen 50/50',
    category: 'image-text',
    description: 'Chia đôi màn hình: ảnh trái chiếm full height, text phải căn giữa',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 50,
      verticalAlign: 'center',
      style: { tailwindClasses: 'flex min-h-[500px]', cssOverride: 'img { height: 100%; object-fit: cover; } .text-side { display: flex; flex-direction: column; justify-content: center; padding: 48px; }' },
    },
  },
  {
    // Ảnh card với hover lift effect — shadcn style
    id: 'img-text-014',
    name: 'Card Hover Lift (shadcn)',
    category: 'image-text',
    description: 'Card shadcn style: ảnh trên, title + desc dưới, hover nâng lên + shadow',
    uiLib: 'shadcn',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 100,
      style: { tailwindClasses: 'flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden' },
    },
  },
  {
    // Ảnh trái với text có highlight box
    id: 'img-text-015',
    name: 'Ảnh + Highlight Box',
    category: 'image-text',
    description: 'Ảnh trái, text phải trong box vàng highlight có border trái dày',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 40,
      style: { tailwindClasses: 'flex gap-6', cssOverride: '.text-side { border-left: 4px solid #f59e0b; background: #fffbeb; padding: 24px; border-radius: 0 12px 12px 0; }' },
    },
  },
  {
    // Ảnh full + text overlay trái, kiểu news breaking
    id: 'img-text-016',
    name: 'Breaking News Overlay',
    category: 'image-text',
    description: 'Ảnh full width, text overlay góc trái dưới với badge đỏ BREAKING',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'left',
      style: { tailwindClasses: 'relative rounded-xl overflow-hidden min-h-[350px]', cssOverride: '.badge { position: absolute; top: 16px; left: 16px; background: #ef4444; color: white; padding: 4px 12px; border-radius: 4px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; } .content { position: absolute; bottom: 0; left: 0; right: 0; padding: 32px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); color: white; }' },
    },
  },
  {
    // Ảnh mosaic 2 ảnh + text
    id: 'img-text-017',
    name: 'Mosaic 2 ảnh + Text',
    category: 'image-text',
    description: '2 ảnh xếp chéo bên trái, text bên phải',
    uiLib: 'tailwind',
    block: {
      type: 'columns',
      style: { tailwindClasses: 'grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-2xl', cssOverride: '.col-1 { display: grid; gap: 8px; } .col-1 img:first-child { border-radius: 16px 16px 4px 4px; } .col-1 img:last-child { border-radius: 4px 4px 16px 16px; }' },
    },
  },
  {
    // Ảnh polaroid style
    id: 'img-text-018',
    name: 'Polaroid Photo',
    category: 'image-text',
    description: 'Ảnh kiểu polaroid: viền trắng dày, shadow, xoay nhẹ, caption handwriting',
    uiLib: 'tailwind',
    block: {
      type: 'image',
      style: { tailwindClasses: 'inline-block', cssOverride: 'figure { background: white; padding: 12px 12px 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); transform: rotate(-2deg); max-width: 400px; margin: 24px auto; } figcaption { font-family: "Caveat", cursive; font-size: 18px; text-align: center; margin-top: 8px; }' },
    },
  },
  {
    // Ảnh bên trái với numbered badge
    id: 'img-text-019',
    name: 'Numbered Card (Steps)',
    category: 'image-text',
    description: 'Ảnh trái, text phải, số thứ tự lớn ở góc trên trái ảnh',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 35,
      style: { tailwindClasses: 'flex gap-6 p-6 bg-white rounded-xl border', cssOverride: '.img-wrapper { position: relative; } .step-number { position: absolute; top: -12px; left: -12px; width: 40px; height: 40px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }' },
    },
  },
  {
    // Ảnh + text overlap card — MUI elevation
    id: 'img-text-020',
    name: 'Overlap Card (MUI style)',
    category: 'image-text',
    description: 'Ảnh ở dưới, card text chồng lên 1 phần ảnh, shadow MUI elevation 8',
    uiLib: 'mui',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 100,
      style: { tailwindClasses: 'relative rounded-2xl overflow-visible', cssOverride: 'img { border-radius: 16px; } .text-card { position: relative; margin: -60px 24px 0; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 8px 40px rgba(0,0,0,0.12); }' },
    },
  },
  {
    // Ảnh viền gradient animated
    id: 'img-text-021',
    name: 'Gradient Border Animated',
    category: 'image-text',
    description: 'Ảnh với viền gradient xoay animation, text bên phải',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 35,
      style: { tailwindClasses: 'flex items-center gap-8 p-6', cssOverride: '.img-wrapper { padding: 3px; background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff6b6b); background-size: 300% 300%; animation: gradient-spin 3s linear infinite; border-radius: 16px; } @keyframes gradient-spin { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } img { border-radius: 13px; }' },
    },
  },
  {
    // Ảnh trái + text phải, kiểu Notion callout
    id: 'img-text-022',
    name: 'Notion-style Callout',
    category: 'image-text',
    description: 'Icon/ảnh nhỏ trái, text phải, nền xám nhạt, kiểu Notion callout',
    uiLib: 'tailwind',
    block: {
      type: 'callout',
      style: { tailwindClasses: 'flex gap-4 p-5 bg-gray-50 rounded-lg border border-gray-200', cssOverride: '.icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }' },
    },
  },
  {
    // Ảnh diamond shape + text
    id: 'img-text-023',
    name: 'Diamond Shape Image',
    category: 'image-text',
    description: 'Ảnh cắt hình thoi (diamond) bên trái, text phải',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 30,
      style: { tailwindClasses: 'flex items-center gap-8 p-8', cssOverride: 'img { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); aspect-ratio: 1; object-fit: cover; width: 200px; }' },
    },
  },
  {
    // Ảnh phải, text trái kiểu Ant Design card
    id: 'img-text-024',
    name: 'Ant Design Horizontal Card',
    category: 'image-text',
    description: 'Card Ant Design style: text trái với title bold, ảnh phải rounded',
    uiLib: 'antd',
    block: {
      type: 'media-text',
      mediaPosition: 'right',
      mediaWidth: 40,
      style: { tailwindClasses: 'flex bg-white rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)] border border-gray-200 overflow-hidden hover:shadow-md transition-shadow' },
    },
  },
  {
    // Ảnh full background + text box glassmorphism
    id: 'img-text-025',
    name: 'Glassmorphism Card on Image',
    category: 'image-text',
    description: 'Ảnh nền full, card kính mờ (glass) ở giữa chứa text',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'relative min-h-[450px] rounded-2xl overflow-hidden flex items-center justify-center', cssOverride: '.glass-card { backdrop-filter: blur(20px); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; padding: 48px; color: white; text-align: center; max-width: 600px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }' },
    },
  },
  {
    // Ảnh trái wave clip + text
    id: 'img-text-026',
    name: 'Wave Clip Image',
    category: 'image-text',
    description: 'Ảnh trái cắt dạng sóng bên phải, text chảy vào khoảng trống',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 45,
      style: { tailwindClasses: 'flex min-h-[400px]', cssOverride: '.img-side { clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%); } img { height: 100%; object-fit: cover; }' },
    },
  },
  {
    // Ảnh circle large centered + text below
    id: 'img-text-027',
    name: 'Large Circle Image + Text Below',
    category: 'image-text',
    description: 'Ảnh tròn lớn 300px centered, text bên dưới căn giữa',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 100,
      style: { tailwindClasses: 'flex flex-col items-center text-center p-8', cssOverride: 'img { width: 300px; height: 300px; border-radius: 50%; object-fit: cover; margin-bottom: 24px; box-shadow: 0 12px 40px rgba(0,0,0,0.15); }' },
    },
  },
  {
    // Text overlay left + ảnh right, kiểu editorial magazine
    id: 'img-text-028',
    name: 'Editorial Magazine Split',
    category: 'image-text',
    description: 'Text lớn serif bên trái 55%, ảnh phải 45%, nền cream',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'right',
      mediaWidth: 45,
      style: { tailwindClasses: 'flex min-h-[500px] bg-[#fdf6e3] rounded-none', cssOverride: '.text-side { padding: 64px 48px; font-family: "Playfair Display", serif; } h2 { font-size: 42px; line-height: 1.2; margin-bottom: 24px; } img { height: 100%; object-fit: cover; }' },
    },
  },
  {
    // Ảnh stack 3D perspective
    id: 'img-text-029',
    name: '3D Perspective Stack',
    category: 'image-text',
    description: '3 ảnh xếp chồng 3D perspective, xoay nhẹ, text bên phải',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 40,
      style: { tailwindClasses: 'flex items-center gap-12 p-8', cssOverride: '.img-stack { perspective: 800px; position: relative; height: 300px; width: 250px; } .img-stack img { position: absolute; width: 220px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); } .img-stack img:nth-child(1) { transform: rotateY(-10deg) translateZ(0); z-index: 3; } .img-stack img:nth-child(2) { transform: rotateY(-10deg) translateX(20px) translateZ(-30px); z-index: 2; opacity: 0.7; } .img-stack img:nth-child(3) { transform: rotateY(-10deg) translateX(40px) translateZ(-60px); z-index: 1; opacity: 0.4; }' },
    },
  },
  {
    // Ảnh duotone filter + text
    id: 'img-text-030',
    name: 'Duotone Purple Image',
    category: 'image-text',
    description: 'Ảnh với filter duotone tím, text phải trên nền tím nhạt',
    uiLib: 'tailwind',
    block: {
      type: 'media-text',
      mediaPosition: 'left',
      mediaWidth: 45,
      style: { tailwindClasses: 'flex gap-0 rounded-2xl overflow-hidden', cssOverride: '.img-side { position: relative; } .img-side::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(219,39,119,0.3)); mix-blend-mode: color; } .text-side { background: #f5f3ff; padding: 40px; }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 31-50: HERO SECTIONS
  // ═══════════════════════════════════════════════════════════════

  {
    // Hero gradient animated background
    id: 'hero-001',
    name: 'Animated Gradient Hero',
    category: 'hero',
    description: 'Gradient xanh-tím animated, text trắng lớn centered, 2 CTA buttons',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      height: '80vh',
      style: { tailwindClasses: 'flex items-center justify-center text-center text-white min-h-[80vh] rounded-2xl', cssOverride: 'background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); background-size: 400% 400%; animation: gradient-flow 15s ease infinite; @keyframes gradient-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }' },
    },
  },
  {
    // Hero với particle background
    id: 'hero-002',
    name: 'Dark Hero + Glow Orbs',
    category: 'hero',
    description: 'Nền đen với orbs gradient blur floating, text trắng',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      height: '70vh',
      style: { tailwindClasses: 'relative bg-gray-950 text-white min-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl', cssOverride: '.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; animation: float 6s ease-in-out infinite; } .orb-1 { width: 400px; height: 400px; background: #7c3aed; top: -100px; left: -100px; } .orb-2 { width: 300px; height: 300px; background: #06b6d4; bottom: -50px; right: -50px; animation-delay: 2s; } @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }' },
    },
  },
  {
    // Hero minimal với line decoration
    id: 'hero-003',
    name: 'Minimal Line Hero',
    category: 'hero',
    description: 'Nền trắng, text đen centered, đường line ngang decorative',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'py-32 px-8 text-center bg-white', cssOverride: 'h1 { font-size: 56px; font-weight: 800; letter-spacing: -0.03em; } .line-deco { width: 80px; height: 4px; background: #000; margin: 24px auto; border-radius: 2px; }' },
    },
  },
  {
    // Hero video background
    id: 'hero-004',
    name: 'Video Background Hero',
    category: 'hero',
    description: 'Video nền loop muted, overlay tối, text trắng + CTA',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      overlay: 0.6,
      style: { tailwindClasses: 'relative min-h-[90vh] flex items-center justify-center text-white text-center overflow-hidden rounded-2xl', cssOverride: 'video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }' },
    },
  },
  {
    // Hero split với stats
    id: 'hero-005',
    name: 'Hero + Stats Row',
    category: 'hero',
    description: 'Hero text trên, row 3-4 stats bên dưới với background khác',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'left',
      style: { tailwindClasses: 'bg-indigo-600 text-white rounded-2xl overflow-hidden', cssOverride: '.hero-content { padding: 64px 48px 32px; } .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); background: rgba(0,0,0,0.2); padding: 24px 48px; } .stat-item { text-align: center; } .stat-value { font-size: 32px; font-weight: 800; } .stat-label { font-size: 14px; opacity: 0.8; }' },
    },
  },
  {
    // Hero gradient mesh
    id: 'hero-006',
    name: 'Mesh Gradient Hero',
    category: 'hero',
    description: 'Background mesh gradient nhiều màu (kiểu Apple), text centered',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'min-h-[70vh] flex items-center justify-center text-center rounded-2xl', cssOverride: 'background: radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%);' },
    },
  },
  {
    // Hero isometric grid
    id: 'hero-007',
    name: 'Isometric Grid Dark Hero',
    category: 'hero',
    description: 'Nền đen với lưới isometric pattern, text trắng neon',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'min-h-[60vh] flex items-center justify-center text-white text-center bg-gray-950 rounded-2xl overflow-hidden', cssOverride: 'background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; h1 { text-shadow: 0 0 40px rgba(59,130,246,0.5); }' },
    },
  },
  {
    // Hero brutalist
    id: 'hero-008',
    name: 'Brutalist Hero',
    category: 'hero',
    description: 'Nền vàng neon, text đen rất lớn, border dày, no rounded',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'left',
      style: { tailwindClasses: 'bg-yellow-300 text-black p-16 border-4 border-black', cssOverride: 'h1 { font-size: 72px; font-weight: 900; line-height: 1; text-transform: uppercase; } .cta { background: black; color: yellow; padding: 16px 32px; font-weight: 800; border: none; font-size: 18px; cursor: pointer; } .cta:hover { background: #333; }' },
    },
  },
  {
    // Hero newspaper style
    id: 'hero-009',
    name: 'Newspaper Front Page',
    category: 'hero',
    description: 'Kiểu trang nhất báo giấy: serif font, đường kẻ, columns',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'bg-[#fdf5e6] text-gray-900 p-12 border-y-4 border-double border-gray-800', cssOverride: 'font-family: "Playfair Display", Georgia, serif; h1 { font-size: 48px; font-weight: 900; border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 16px; } .dateline { text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; color: #666; }' },
    },
  },
  {
    // Hero với floating badges
    id: 'hero-010',
    name: 'Hero + Floating Tech Badges',
    category: 'hero',
    description: 'Hero centered, badges công nghệ floating xung quanh (React, AI, Node...)',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl overflow-hidden', cssOverride: '.badge { position: absolute; padding: 8px 16px; background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; font-size: 14px; animation: float-badge 4s ease-in-out infinite; } @keyframes float-badge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }' },
    },
  },
  {
    // Hero typewriter effect
    id: 'hero-011',
    name: 'Typewriter Effect Hero',
    category: 'hero',
    description: 'Text xuất hiện kiểu đánh máy, cursor nhấp nháy',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'min-h-[50vh] flex items-center justify-center bg-gray-950 text-green-400 font-mono rounded-2xl', cssOverride: '.typewriter { overflow: hidden; border-right: 3px solid #22c55e; white-space: nowrap; animation: typing 3s steps(40) 1s forwards, blink 0.75s step-end infinite; width: 0; font-size: 28px; } @keyframes typing { to { width: 100%; } } @keyframes blink { 50% { border-color: transparent; } }' },
    },
  },
  {
    // Hero với countdown
    id: 'hero-012',
    name: 'Event Countdown Hero',
    category: 'hero',
    description: 'Hero event với countdown timer boxes, CTA register',
    uiLib: 'tailwind',
    block: {
      type: 'hero',
      align: 'center',
      style: { tailwindClasses: 'min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl p-12', cssOverride: '.countdown { display: flex; gap: 16px; margin: 32px 0; } .countdown-box { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px 24px; text-align: center; min-width: 80px; } .countdown-value { font-size: 36px; font-weight: 800; } .countdown-label { font-size: 12px; opacity: 0.8; text-transform: uppercase; }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 51-70: CARDS & COLLECTIONS
  // ═══════════════════════════════════════════════════════════════

  {
    // Grid 3 cards shadcn
    id: 'card-001',
    name: '3-Column Feature Cards (shadcn)',
    category: 'cards',
    description: '3 cards grid: icon trên, title, description. Shadcn border style',
    uiLib: 'shadcn',
    block: {
      type: 'columns',
      style: { tailwindClasses: 'grid grid-cols-1 md:grid-cols-3 gap-6', cssOverride: '.card { border: 1px solid hsl(var(--border)); border-radius: var(--radius); padding: 24px; background: hsl(var(--card)); } .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }' },
    },
  },
  {
    // Horizontal scroll cards
    id: 'card-002',
    name: 'Horizontal Scroll Cards',
    category: 'cards',
    description: 'Cards scroll ngang, snap to card, ẩn scrollbar',
    uiLib: 'tailwind',
    block: {
      type: 'carousel',
      style: { tailwindClasses: 'flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide', cssOverride: '.card { flex: 0 0 300px; snap-align: start; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); } ::-webkit-scrollbar { display: none; }' },
    },
  },
  {
    // Masonry grid cards
    id: 'card-003',
    name: 'Pinterest Masonry Grid',
    category: 'cards',
    description: 'Masonry layout kiểu Pinterest, cards nhiều chiều cao khác nhau',
    uiLib: 'tailwind',
    block: {
      type: 'gallery',
      style: { tailwindClasses: 'columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4', cssOverride: '.card { break-inside: avoid; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }' },
    },
  },
  {
    // Bento grid
    id: 'card-004',
    name: 'Bento Grid (Apple style)',
    category: 'cards',
    description: 'Grid bento không đều: 1 card lớn + 2 nhỏ + 1 wide. Kiểu Apple',
    uiLib: 'tailwind',
    block: {
      type: 'columns',
      style: { tailwindClasses: 'grid grid-cols-4 grid-rows-2 gap-4 min-h-[500px]', cssOverride: '.bento-large { grid-column: span 2; grid-row: span 2; } .bento-wide { grid-column: span 2; } .card { border-radius: 24px; padding: 32px; overflow: hidden; } .card:nth-child(1) { background: linear-gradient(135deg, #667eea, #764ba2); color: white; } .card:nth-child(2) { background: #f1f5f9; } .card:nth-child(3) { background: #0f172a; color: white; } .card:nth-child(4) { background: #ecfdf5; }' },
    },
  },
  {
    // Glass cards grid
    id: 'card-005',
    name: 'Glass Cards Grid',
    category: 'cards',
    description: 'Cards kính mờ trên nền gradient, 3 cột',
    uiLib: 'tailwind',
    block: {
      type: 'columns',
      style: { tailwindClasses: 'grid grid-cols-3 gap-6 p-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', cssOverride: '.card { backdrop-filter: blur(16px); background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 32px; color: white; transition: transform 0.3s; } .card:hover { transform: translateY(-4px); }' },
    },
  },
  {
    // MUI elevated cards
    id: 'card-006',
    name: 'MUI Elevation Cards',
    category: 'cards',
    description: '3 cards Material Design: icon circle, title, text, action link',
    uiLib: 'mui',
    block: {
      type: 'columns',
      style: { tailwindClasses: 'grid grid-cols-3 gap-6', cssOverride: '.card { background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.12); transition: box-shadow 0.3s; } .card:hover { box-shadow: 0 8px 10px -5px rgba(0,0,0,0.2), 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12); } .icon-circle { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }' },
    },
  },
  {
    // Antd list cards
    id: 'card-007',
    name: 'Ant Design List Cards',
    category: 'cards',
    description: 'Vertical list cards Ant Design: avatar, title, desc, actions row',
    uiLib: 'antd',
    block: {
      type: 'columns',
      style: { tailwindClasses: 'flex flex-col gap-0 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white', cssOverride: '.list-item { display: flex; align-items: center; gap: 16px; padding: 16px 24px; } .list-item:hover { background: #fafafa; } .avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; } .actions { margin-left: auto; display: flex; gap: 8px; }' },
    },
  },
  {
    // Pricing cards gradient borders
    id: 'card-008',
    name: 'Pricing Cards Gradient Border',
    category: 'cards',
    description: '3 pricing cards, giữa highlighted với gradient border + scale lớn hơn',
    uiLib: 'tailwind',
    block: {
      type: 'pricing',
      style: { tailwindClasses: 'grid grid-cols-3 gap-6 items-center', cssOverride: '.pricing-card { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 40px; text-align: center; } .pricing-card.highlighted { border: none; padding: 3px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; transform: scale(1.05); box-shadow: 0 20px 60px rgba(102,126,234,0.3); } .pricing-card.highlighted .inner { background: white; border-radius: 17px; padding: 40px; } .price { font-size: 48px; font-weight: 800; }' },
    },
  },
  {
    // Team member cards circle
    id: 'card-009',
    name: 'Team Members Circle',
    category: 'cards',
    description: 'Grid 4 members: ảnh tròn lớn, tên, chức vụ, social icons',
    uiLib: 'tailwind',
    block: {
      type: 'team',
      style: { tailwindClasses: 'grid grid-cols-2 md:grid-cols-4 gap-8 text-center', cssOverride: '.member { display: flex; flex-direction: column; align-items: center; } .member img { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); transition: transform 0.3s; } .member:hover img { transform: scale(1.05); } .member-name { font-size: 18px; font-weight: 700; margin-top: 8px; } .member-role { color: #6b7280; font-size: 14px; }' },
    },
  },
  {
    // Testimonial slider
    id: 'card-010',
    name: 'Testimonial Slider',
    category: 'cards',
    description: 'Slider testimonial: quote lớn, avatar + tên, dots navigation',
    uiLib: 'tailwind',
    block: {
      type: 'carousel',
      style: { tailwindClasses: 'bg-gray-50 rounded-2xl p-12 text-center', cssOverride: '.quote-mark { font-size: 72px; color: #e5e7eb; line-height: 1; font-family: Georgia, serif; } .quote-text { font-size: 20px; line-height: 1.8; max-width: 700px; margin: 0 auto 24px; font-style: italic; color: #374151; } .author-avatar { width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 8px; } .dots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; } .dot { width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; } .dot.active { background: #3b82f6; width: 24px; border-radius: 4px; }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 71-90: STATS & NUMBERS
  // ═══════════════════════════════════════════════════════════════

  {
    // Stats row dark
    id: 'stats-001',
    name: 'Stats Row Dark',
    category: 'stats',
    description: '4 stats ngang: số lớn + label, nền đen, text trắng, divider dọc',
    uiLib: 'tailwind',
    block: {
      type: 'stats',
      style: { tailwindClasses: 'flex justify-around items-center bg-gray-950 text-white rounded-2xl p-10 divide-x divide-gray-800', cssOverride: '.stat { text-align: center; padding: 0 32px; } .stat-value { font-size: 40px; font-weight: 800; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; } .stat-label { font-size: 14px; color: #9ca3af; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }' },
    },
  },
  {
    // Stats cards colorful
    id: 'stats-002',
    name: 'Stats Cards Colorful',
    category: 'stats',
    description: '4 cards mỗi cái 1 màu: xanh, tím, cam, hồng, icon + số + label',
    uiLib: 'tailwind',
    block: {
      type: 'stats',
      style: { tailwindClasses: 'grid grid-cols-2 md:grid-cols-4 gap-4', cssOverride: '.stat-card { padding: 24px; border-radius: 16px; color: white; } .stat-card:nth-child(1) { background: linear-gradient(135deg, #3b82f6, #2563eb); } .stat-card:nth-child(2) { background: linear-gradient(135deg, #8b5cf6, #7c3aed); } .stat-card:nth-child(3) { background: linear-gradient(135deg, #f59e0b, #d97706); } .stat-card:nth-child(4) { background: linear-gradient(135deg, #ec4899, #db2777); } .stat-icon { font-size: 32px; margin-bottom: 12px; opacity: 0.8; } .stat-value { font-size: 32px; font-weight: 800; } .stat-label { font-size: 14px; opacity: 0.9; }' },
    },
  },
  {
    // Stats với progress ring
    id: 'stats-003',
    name: 'Stats Progress Rings',
    category: 'stats',
    description: '3 vòng tròn progress SVG, % ở giữa, label dưới',
    uiLib: 'tailwind',
    block: {
      type: 'stats',
      style: { tailwindClasses: 'flex justify-center gap-16 py-12', cssOverride: '.ring-stat { text-align: center; } .ring-stat svg { width: 120px; height: 120px; } .ring-stat circle { fill: none; stroke-width: 8; stroke-linecap: round; } .ring-bg { stroke: #e5e7eb; } .ring-fill { stroke: #3b82f6; transform: rotate(-90deg); transform-origin: center; transition: stroke-dashoffset 1s ease; } .ring-value { font-size: 28px; font-weight: 800; } .ring-label { margin-top: 8px; color: #6b7280; }' },
    },
  },
  {
    // Counter animated
    id: 'stats-004',
    name: 'Animated Counter Row',
    category: 'stats',
    description: 'Số đếm lên animation khi scroll vào view, nền trắng, accent underline',
    uiLib: 'tailwind',
    block: {
      type: 'stats',
      style: { tailwindClasses: 'grid grid-cols-4 gap-8 py-16 text-center', cssOverride: '.stat-value { font-size: 48px; font-weight: 900; color: #111827; } .stat-underline { width: 40px; height: 3px; background: #3b82f6; margin: 8px auto 12px; border-radius: 2px; } .stat-label { font-size: 16px; color: #6b7280; }' },
    },
  },
  {
    // Stats icon boxes MUI
    id: 'stats-005',
    name: 'MUI Stats Icon Boxes',
    category: 'stats',
    description: 'Cards MUI: icon circle color + số + label + trend arrow',
    uiLib: 'mui',
    block: {
      type: 'stats',
      style: { tailwindClasses: 'grid grid-cols-4 gap-6', cssOverride: '.stat-box { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 16px; } .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; } .stat-trend { font-size: 12px; font-weight: 600; } .stat-trend.up { color: #16a34a; } .stat-trend.down { color: #dc2626; }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 91-110: TESTIMONIALS & QUOTES
  // ═══════════════════════════════════════════════════════════════

  {
    // Quote lớn serif
    id: 'quote-001',
    name: 'Large Serif Quote',
    category: 'quotes',
    description: 'Quote font serif lớn italic, dash + tên tác giả, nền trắng',
    uiLib: 'tailwind',
    block: {
      type: 'quote',
      style: { tailwindClasses: 'py-16 px-12 text-center', cssOverride: 'blockquote { font-family: "Playfair Display", Georgia, serif; font-size: 28px; line-height: 1.6; font-style: italic; color: #1f2937; max-width: 800px; margin: 0 auto; } .author { margin-top: 24px; font-size: 16px; font-style: normal; color: #6b7280; font-family: sans-serif; }' },
    },
  },
  {
    // Quote card với avatar — kiểu Twitter
    id: 'quote-002',
    name: 'Twitter-style Quote Card',
    category: 'quotes',
    description: 'Card giống tweet: avatar + name + handle, text, like/retweet counts',
    uiLib: 'tailwind',
    block: {
      type: 'testimonial',
      style: { tailwindClasses: 'max-w-lg mx-auto bg-white rounded-2xl p-6 border border-gray-200 shadow-sm', cssOverride: '.tweet-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; } .tweet-avatar { width: 48px; height: 48px; border-radius: 50%; } .tweet-name { font-weight: 700; } .tweet-handle { color: #6b7280; font-size: 14px; } .tweet-text { font-size: 16px; line-height: 1.6; margin-bottom: 16px; } .tweet-actions { display: flex; gap: 24px; color: #6b7280; font-size: 14px; }' },
    },
  },
  {
    // Testimonial grid 3 columns
    id: 'quote-003',
    name: 'Testimonial Grid 3x',
    category: 'quotes',
    description: '3 testimonials grid: quote, 5 stars, avatar + name + company',
    uiLib: 'tailwind',
    block: {
      type: 'columns',
      style: { tailwindClasses: 'grid grid-cols-3 gap-6', cssOverride: '.testimonial-card { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; } .stars { color: #f59e0b; font-size: 18px; margin-bottom: 16px; } .quote-text { font-size: 15px; line-height: 1.7; color: #374151; margin-bottom: 20px; } .author-row { display: flex; align-items: center; gap: 12px; border-top: 1px solid #f3f4f6; padding-top: 16px; } .author-avatar { width: 40px; height: 40px; border-radius: 50%; } .author-company { font-size: 13px; color: #9ca3af; }' },
    },
  },
  {
    // Quote với left border accent
    id: 'quote-004',
    name: 'Left Accent Border Quote',
    category: 'quotes',
    description: 'Quote với border trái dày 4px gradient, padding trái lớn',
    uiLib: 'tailwind',
    block: {
      type: 'quote',
      style: { tailwindClasses: 'border-l-4 pl-8 py-4 my-8', cssOverride: 'border-image: linear-gradient(to bottom, #3b82f6, #8b5cf6) 1; blockquote { font-size: 20px; line-height: 1.7; color: #374151; } .author { margin-top: 12px; font-size: 14px; color: #6b7280; font-weight: 600; }' },
    },
  },
  {
    // Quote highlight box
    id: 'quote-005',
    name: 'Highlight Quote Box',
    category: 'quotes',
    description: 'Box vàng nhạt, icon quote lớn mờ background, text đậm',
    uiLib: 'tailwind',
    block: {
      type: 'quote',
      style: { tailwindClasses: 'relative bg-amber-50 border border-amber-200 rounded-xl p-8 my-8 overflow-hidden', cssOverride: '.quote-icon { position: absolute; top: -10px; left: 16px; font-size: 120px; color: rgba(245,158,11,0.1); font-family: Georgia, serif; line-height: 1; } blockquote { position: relative; z-index: 1; font-size: 18px; line-height: 1.7; }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 111-130: CTA & BUTTONS
  // ═══════════════════════════════════════════════════════════════

  {
    // CTA gradient full width
    id: 'cta-001',
    name: 'Full Width Gradient CTA',
    category: 'cta',
    description: 'Banner gradient full width, text + button trắng centered',
    uiLib: 'tailwind',
    block: {
      type: 'alert',
      style: { tailwindClasses: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-16 px-8 rounded-2xl', cssOverride: 'h3 { font-size: 28px; font-weight: 800; margin-bottom: 8px; } p { font-size: 16px; opacity: 0.9; margin-bottom: 24px; } .cta-btn { background: white; color: #4338ca; padding: 14px 32px; border-radius: 9999px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: transform 0.2s; } .cta-btn:hover { transform: scale(1.05); }' },
    },
  },
  {
    // CTA card với icon
    id: 'cta-002',
    name: 'CTA Card + Icon (shadcn)',
    category: 'cta',
    description: 'Card shadcn: icon lớn, title, desc, 2 buttons (primary + outline)',
    uiLib: 'shadcn',
    block: {
      type: 'alert',
      style: { tailwindClasses: 'border rounded-xl p-8 text-center max-w-md mx-auto bg-card', cssOverride: '.icon { font-size: 48px; margin-bottom: 16px; } .btn-primary { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 10px 24px; border-radius: var(--radius); font-weight: 600; } .btn-outline { border: 1px solid hsl(var(--border)); padding: 10px 24px; border-radius: var(--radius); font-weight: 600; }' },
    },
  },
  {
    // Floating CTA sticky bottom
    id: 'cta-003',
    name: 'Sticky Bottom CTA Bar',
    category: 'cta',
    description: 'Bar CTA dính bottom, blur background, text trái + button phải',
    uiLib: 'tailwind',
    block: {
      type: 'banner',
      position: 'sticky',
      style: { tailwindClasses: 'fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-t border-gray-200 px-8 py-4 flex items-center justify-between', cssOverride: '.cta-text { font-weight: 600; } .cta-btn { background: #111827; color: white; padding: 10px 24px; border-radius: 8px; font-weight: 600; }' },
    },
  },
  {
    // Animated shine button
    id: 'cta-004',
    name: 'Shine Effect Button',
    category: 'cta',
    description: 'Button lớn với hiệu ứng ánh sáng chạy qua (shine sweep)',
    uiLib: 'tailwind',
    block: {
      type: 'button',
      style: { tailwindClasses: 'inline-block', cssOverride: '.shine-btn { position: relative; overflow: hidden; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 16px 48px; border-radius: 12px; font-weight: 700; font-size: 18px; border: none; cursor: pointer; } .shine-btn::after { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(transparent, rgba(255,255,255,0.3), transparent); transform: rotate(30deg); animation: shine 3s ease-in-out infinite; } @keyframes shine { 0% { transform: translateX(-100%) rotate(30deg); } 100% { transform: translateX(100%) rotate(30deg); } }' },
    },
  },
  {
    // Neon button
    id: 'cta-005',
    name: 'Neon Glow Button',
    category: 'cta',
    description: 'Button neon glow effect, text sáng, nền đen',
    uiLib: 'tailwind',
    block: {
      type: 'button',
      style: { tailwindClasses: 'text-center py-12 bg-gray-950 rounded-2xl', cssOverride: '.neon-btn { color: #00ff88; border: 2px solid #00ff88; background: transparent; padding: 14px 40px; font-size: 16px; font-weight: 700; border-radius: 8px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 0 10px rgba(0,255,136,0.3), inset 0 0 10px rgba(0,255,136,0.1); transition: all 0.3s; } .neon-btn:hover { background: rgba(0,255,136,0.1); box-shadow: 0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,255,136,0.15); }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 131-150: LISTS & FEATURES
  // ═══════════════════════════════════════════════════════════════

  {
    // Feature list với icon circles
    id: 'list-001',
    name: 'Feature List + Icon Circles',
    category: 'lists',
    description: 'List features: icon circle màu bên trái, title + desc bên phải',
    uiLib: 'tailwind',
    block: {
      type: 'list',
      style: { tailwindClasses: 'space-y-6', cssOverride: '.feature-item { display: flex; gap: 16px; align-items: flex-start; } .feature-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; } .feature-title { font-weight: 700; font-size: 16px; margin-bottom: 4px; } .feature-desc { color: #6b7280; font-size: 14px; line-height: 1.6; }' },
    },
  },
  {
    // Checklist green
    id: 'list-002',
    name: 'Green Checklist',
    category: 'lists',
    description: 'List với checkmark xanh lá, text bên phải, spacing rộng',
    uiLib: 'tailwind',
    block: {
      type: 'list',
      style: { tailwindClasses: 'space-y-4 bg-emerald-50 rounded-xl p-8', cssOverride: 'li { display: flex; align-items: center; gap: 12px; font-size: 16px; } li::before { content: "✓"; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: 700; flex-shrink: 0; }' },
    },
  },
  {
    // Timeline vertical
    id: 'list-003',
    name: 'Timeline Vertical',
    category: 'lists',
    description: 'Timeline dọc: line giữa, dots, ngày trái, nội dung phải',
    uiLib: 'tailwind',
    block: {
      type: 'timeline',
      style: { tailwindClasses: 'relative pl-8', cssOverride: '.timeline-line { position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: #e5e7eb; } .timeline-item { position: relative; padding-bottom: 32px; padding-left: 32px; } .timeline-dot { position: absolute; left: -24px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6; } .timeline-date { font-size: 13px; color: #6b7280; margin-bottom: 4px; } .timeline-title { font-weight: 700; font-size: 16px; } .timeline-content { color: #4b5563; font-size: 14px; margin-top: 4px; }' },
    },
  },
  {
    // Pros/Cons comparison
    id: 'list-004',
    name: 'Pros & Cons Side by Side',
    category: 'lists',
    description: '2 cột: Pros (xanh lá, checkmark) và Cons (đỏ, X mark)',
    uiLib: 'tailwind',
    block: {
      type: 'comparison',
      style: { tailwindClasses: 'grid grid-cols-2 gap-6 my-8', cssOverride: '.pros-col { background: #f0fdf4; border-radius: 16px; padding: 24px; } .cons-col { background: #fef2f2; border-radius: 16px; padding: 24px; } .pros-title { color: #16a34a; font-weight: 800; font-size: 18px; margin-bottom: 16px; } .cons-title { color: #dc2626; font-weight: 800; font-size: 18px; margin-bottom: 16px; } .pros-col li { display: flex; gap: 8px; margin-bottom: 8px; } .pros-col li::before { content: "✓"; color: #16a34a; font-weight: 700; } .cons-col li::before { content: "✗"; color: #dc2626; font-weight: 700; }' },
    },
  },
  {
    // Steps horizontal numbered
    id: 'list-005',
    name: 'Horizontal Numbered Steps',
    category: 'lists',
    description: 'Steps ngang: circles số 1-2-3-4, line nối, title dưới mỗi step',
    uiLib: 'tailwind',
    block: {
      type: 'steps',
      layout: 'horizontal',
      style: { tailwindClasses: 'flex justify-between items-start relative py-8', cssOverride: '.step-line { position: absolute; top: 24px; left: 10%; right: 10%; height: 2px; background: #e5e7eb; z-index: 0; } .step { position: relative; z-index: 1; text-align: center; flex: 1; } .step-number { width: 48px; height: 48px; border-radius: 50%; background: white; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; margin: 0 auto 12px; } .step.active .step-number { background: #3b82f6; color: white; border-color: #3b82f6; } .step-title { font-weight: 600; font-size: 14px; } .step-desc { font-size: 12px; color: #6b7280; margin-top: 4px; }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 151-170: MEDIA & GALLERY
  // ═══════════════════════════════════════════════════════════════

  {
    // Gallery grid 2x2 rounded
    id: 'gallery-001',
    name: 'Gallery 2x2 Rounded',
    category: 'gallery',
    description: '4 ảnh grid 2x2, bo góc lớn, gap nhỏ, hover zoom',
    uiLib: 'tailwind',
    block: {
      type: 'gallery',
      style: { tailwindClasses: 'grid grid-cols-2 gap-3 rounded-2xl overflow-hidden', cssOverride: 'img { aspect-ratio: 4/3; object-fit: cover; transition: transform 0.4s; } img:hover { transform: scale(1.05); }' },
    },
  },
  {
    // Gallery filmstrip horizontal
    id: 'gallery-002',
    name: 'Filmstrip Horizontal',
    category: 'gallery',
    description: 'Ảnh scroll ngang kiểu cuộn phim, aspect ratio 3:2, shadow',
    uiLib: 'tailwind',
    block: {
      type: 'gallery',
      style: { tailwindClasses: 'flex gap-4 overflow-x-auto snap-x pb-4 scrollbar-hide', cssOverride: 'img { flex: 0 0 300px; aspect-ratio: 3/2; object-fit: cover; border-radius: 12px; snap-align: start; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.3s; } img:hover { transform: translateY(-4px); } ::-webkit-scrollbar { display: none; }' },
    },
  },
  {
    // Gallery với lightbox overlay
    id: 'gallery-003',
    name: 'Gallery + Lightbox Overlay',
    category: 'gallery',
    description: 'Grid 3x2, hover hiện zoom icon overlay, click mở lightbox',
    uiLib: 'tailwind',
    block: {
      type: 'gallery',
      style: { tailwindClasses: 'grid grid-cols-3 gap-4', cssOverride: '.gallery-item { position: relative; overflow: hidden; border-radius: 12px; cursor: pointer; } .gallery-item img { aspect-ratio: 1; object-fit: cover; transition: transform 0.4s; } .gallery-item:hover img { transform: scale(1.1); } .gallery-item::after { content: "🔍"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 32px; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s; } .gallery-item:hover::after { opacity: 1; }' },
    },
  },
  {
    // Before/After slider
    id: 'gallery-004',
    name: 'Before/After Slider',
    category: 'gallery',
    description: '2 ảnh chồng nhau, slider kéo để so sánh trước/sau',
    uiLib: 'tailwind',
    block: {
      type: 'before-after',
      style: { tailwindClasses: 'relative rounded-2xl overflow-hidden max-w-2xl mx-auto', cssOverride: '.before-after { position: relative; } .slider-handle { position: absolute; top: 0; bottom: 0; width: 4px; background: white; cursor: ew-resize; z-index: 10; } .slider-handle::after { content: "↔"; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,0.2); } .label { position: absolute; bottom: 16px; padding: 4px 12px; background: rgba(0,0,0,0.6); color: white; border-radius: 4px; font-size: 14px; font-weight: 600; }' },
    },
  },
  {
    // Video player custom skin
    id: 'gallery-005',
    name: 'Custom Video Player',
    category: 'gallery',
    description: 'Video player rounded, thumbnail overlay play button, progress bar xanh',
    uiLib: 'tailwind',
    block: {
      type: 'video',
      style: { tailwindClasses: 'relative rounded-2xl overflow-hidden bg-black max-w-3xl mx-auto shadow-2xl', cssOverride: '.play-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); cursor: pointer; transition: background 0.3s; } .play-overlay:hover { background: rgba(0,0,0,0.1); } .play-btn { width: 80px; height: 80px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; backdrop-filter: blur(8px); }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 171-190: COMMERCE & PRICING
  // ═══════════════════════════════════════════════════════════════

  {
    // Product card ecommerce
    id: 'commerce-001',
    name: 'E-commerce Product Card',
    category: 'commerce',
    description: 'Card sản phẩm: ảnh, badge sale, tên, giá gạch + giá mới, rating stars, add to cart',
    uiLib: 'tailwind',
    block: {
      type: 'product-card',
      style: { tailwindClasses: 'bg-white rounded-xl border overflow-hidden max-w-xs hover:shadow-lg transition-shadow', cssOverride: '.product-img { position: relative; aspect-ratio: 1; } .sale-badge { position: absolute; top: 12px; right: 12px; background: #ef4444; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; } .product-info { padding: 16px; } .product-name { font-weight: 600; margin-bottom: 8px; } .price-row { display: flex; align-items: center; gap: 8px; } .price-old { text-decoration: line-through; color: #9ca3af; font-size: 14px; } .price-new { font-weight: 800; font-size: 20px; color: #ef4444; } .stars { color: #f59e0b; margin: 8px 0; } .add-btn { width: 100%; background: #111827; color: white; padding: 12px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; } .add-btn:hover { background: #1f2937; }' },
    },
  },
  {
    // Coupon card
    id: 'commerce-002',
    name: 'Coupon Dashed Border',
    category: 'commerce',
    description: 'Coupon card: viền đứt nét, code lớn, nút copy, hạn sử dụng',
    uiLib: 'tailwind',
    block: {
      type: 'coupon',
      style: { tailwindClasses: 'max-w-md mx-auto', cssOverride: '.coupon-card { border: 2px dashed #f59e0b; border-radius: 12px; padding: 24px; background: #fffbeb; text-align: center; } .coupon-code { font-size: 28px; font-weight: 900; letter-spacing: 0.1em; color: #d97706; background: white; padding: 12px 24px; border-radius: 8px; border: 1px solid #fde68a; margin: 16px 0; display: inline-block; } .copy-btn { background: #f59e0b; color: white; padding: 8px 20px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; } .expires { font-size: 13px; color: #92400e; margin-top: 12px; }' },
    },
  },
  {
    // Affiliate link card
    id: 'commerce-003',
    name: 'Affiliate Product Card',
    category: 'commerce',
    description: 'Card affiliate: ảnh trái, info phải, badge "Sponsored", CTA button',
    uiLib: 'tailwind',
    block: {
      type: 'affiliate',
      style: { tailwindClasses: 'flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow', cssOverride: '.aff-img { width: 200px; flex-shrink: 0; object-fit: cover; } .aff-info { padding: 20px; flex: 1; } .aff-badge { background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; } .aff-title { font-size: 18px; font-weight: 700; margin: 8px 0; } .aff-price { font-size: 24px; font-weight: 800; color: #16a34a; } .aff-cta { display: inline-block; background: #f97316; color: white; padding: 10px 24px; border-radius: 8px; font-weight: 600; margin-top: 12px; text-decoration: none; } .aff-disclosure { font-size: 11px; color: #9ca3af; margin-top: 8px; }' },
    },
  },
  {
    // Pricing toggle monthly/yearly
    id: 'commerce-004',
    name: 'Pricing + Toggle Monthly/Yearly',
    category: 'commerce',
    description: '3 pricing cards, toggle switch monthly/yearly ở trên, save badge',
    uiLib: 'tailwind',
    block: {
      type: 'pricing',
      style: { tailwindClasses: 'text-center', cssOverride: '.toggle-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px; } .toggle { width: 48px; height: 24px; background: #e5e7eb; border-radius: 12px; position: relative; cursor: pointer; } .toggle.active { background: #3b82f6; } .toggle::after { content: ""; width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.2s; } .toggle.active::after { left: 26px; } .save-badge { background: #10b981; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; } .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }' },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 191-200: SPECIAL & CREATIVE
  // ═══════════════════════════════════════════════════════════════

  {
    // Code snippet với macOS window bar
    id: 'special-001',
    name: 'macOS Code Window',
    category: 'special',
    description: 'Code block kiểu cửa sổ macOS: 3 dots đỏ/vàng/xanh, title bar, dark bg',
    uiLib: 'tailwind',
    block: {
      type: 'code',
      style: { tailwindClasses: 'rounded-xl overflow-hidden shadow-xl max-w-3xl mx-auto my-8', cssOverride: '.window-bar { background: #2d2d2d; padding: 12px 16px; display: flex; align-items: center; gap: 8px; } .dot { width: 12px; height: 12px; border-radius: 50%; } .dot-red { background: #ff5f56; } .dot-yellow { background: #ffbd2e; } .dot-green { background: #27c93f; } .window-title { margin-left: 8px; color: #999; font-size: 13px; } pre { background: #1e1e1e; color: #d4d4d4; padding: 20px; margin: 0; font-size: 14px; line-height: 1.6; overflow-x: auto; }' },
    },
  },
  {
    // Notification toast stack
    id: 'special-002',
    name: 'Toast Notification Stack',
    category: 'special',
    description: 'Stack 3 toast notifications: success/warning/error, icon + text + close',
    uiLib: 'tailwind',
    block: {
      type: 'alert',
      style: { tailwindClasses: 'flex flex-col gap-3 max-w-sm ml-auto', cssOverride: '.toast { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-size: 14px; } .toast-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; } .toast-warning { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; } .toast-error { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; } .toast-icon { font-size: 20px; flex-shrink: 0; } .toast-close { margin-left: auto; opacity: 0.5; cursor: pointer; }' },
    },
  },
  {
    // Terminal/CLI output
    id: 'special-003',
    name: 'Terminal CLI Output',
    category: 'special',
    description: 'Terminal đen: prompt $, output text, cursor nhấp nháy',
    uiLib: 'tailwind',
    block: {
      type: 'code',
      style: { tailwindClasses: 'bg-gray-950 rounded-xl p-6 font-mono text-sm max-w-3xl mx-auto my-8 shadow-xl', cssOverride: '.prompt { color: #22c55e; } .command { color: #e2e8f0; } .output { color: #94a3b8; } .cursor { display: inline-block; width: 8px; height: 16px; background: #22c55e; animation: blink 1s infinite; } @keyframes blink { 50% { opacity: 0; } }' },
    },
  },
  {
    // Changelog entry
    id: 'special-004',
    name: 'Changelog Entry',
    category: 'special',
    description: 'Version badge, ngày, list changes với labels: Added/Changed/Fixed/Removed',
    uiLib: 'tailwind',
    block: {
      type: 'changelog',
      style: { tailwindClasses: 'border-l-4 border-blue-500 pl-6 my-8', cssOverride: '.version { font-size: 24px; font-weight: 800; } .date { color: #6b7280; font-size: 14px; margin-bottom: 16px; } .change-label { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-right: 8px; } .label-added { background: #dcfce7; color: #166534; } .label-changed { background: #dbeafe; color: #1e40af; } .label-fixed { background: #fef3c7; color: #92400e; } .label-removed { background: #fecaca; color: #991b1b; }' },
    },
  },
  {
    // Cookie consent banner
    id: 'special-005',
    name: 'Cookie Consent Banner',
    category: 'special',
    description: 'Banner cookie consent: text + 2 buttons (Accept/Decline), bottom fixed',
    uiLib: 'tailwind',
    block: {
      type: 'banner',
      position: 'sticky',
      closable: true,
      style: { tailwindClasses: 'fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-6 z-50 flex items-center justify-between gap-8', cssOverride: '.cookie-text { font-size: 14px; color: #4b5563; max-width: 600px; } .cookie-actions { display: flex; gap: 12px; flex-shrink: 0; } .btn-accept { background: #111827; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 600; } .btn-decline { background: #f3f4f6; color: #374151; padding: 10px 20px; border-radius: 8px; font-weight: 600; }' },
    },
  },
  {
    // Rating widget
    id: 'special-006',
    name: 'Star Rating Widget',
    category: 'special',
    description: 'Widget đánh giá: 5 sao hover interactive, tổng score, số reviews',
    uiLib: 'tailwind',
    block: {
      type: 'rating',
      style: { tailwindClasses: 'flex items-center gap-4 bg-white rounded-xl p-6 border shadow-sm', cssOverride: '.stars { display: flex; gap: 4px; } .star { font-size: 28px; color: #d1d5db; cursor: pointer; transition: color 0.2s; } .star.active { color: #f59e0b; } .star:hover ~ .star { color: #d1d5db; } .rating-score { font-size: 32px; font-weight: 800; } .rating-count { color: #6b7280; font-size: 14px; }' },
    },
  },
  {
    // Chat bubble conversation
    id: 'special-007',
    name: 'Chat Bubbles',
    category: 'special',
    description: 'Cuộc hội thoại chat: bubbles trái/phải, avatar, timestamp',
    uiLib: 'tailwind',
    block: {
      type: 'html',
      style: { tailwindClasses: 'max-w-lg mx-auto space-y-4 py-8', cssOverride: '.msg { display: flex; gap: 8px; max-width: 80%; } .msg-right { margin-left: auto; flex-direction: row-reverse; } .msg-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; } .msg-bubble { padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.5; } .msg-left .msg-bubble { background: #f3f4f6; border-bottom-left-radius: 4px; } .msg-right .msg-bubble { background: #3b82f6; color: white; border-bottom-right-radius: 4px; } .msg-time { font-size: 11px; color: #9ca3af; margin-top: 4px; }' },
    },
  },
  {
    // Kanban board
    id: 'special-008',
    name: 'Kanban Board',
    category: 'special',
    description: 'Board 3 cột: To Do / In Progress / Done, cards draggable style',
    uiLib: 'tailwind',
    block: {
      type: 'kanban',
      style: { tailwindClasses: 'grid grid-cols-3 gap-4 min-h-[400px]', cssOverride: '.kanban-col { background: #f8fafc; border-radius: 12px; padding: 16px; } .kanban-title { font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; } .kanban-card { background: white; border-radius: 8px; padding: 12px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; cursor: grab; } .kanban-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); } .kanban-tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }' },
    },
  },
  {
    // Announcement ribbon
    id: 'special-009',
    name: 'Top Announcement Ribbon',
    category: 'special',
    description: 'Ribbon thông báo trên cùng: gradient, text centered, close button, link',
    uiLib: 'tailwind',
    block: {
      type: 'banner',
      style: { tailwindClasses: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center py-3 px-6 text-sm font-medium flex items-center justify-center gap-3', cssOverride: 'a { color: white; text-decoration: underline; font-weight: 700; } .close-btn { position: absolute; right: 16px; opacity: 0.7; cursor: pointer; } .close-btn:hover { opacity: 1; }' },
    },
  },
  {
    // Skeleton loading placeholder
    id: 'special-010',
    name: 'Skeleton Loading',
    category: 'special',
    description: 'Placeholder loading kiểu skeleton: animated pulse bars, circles',
    uiLib: 'tailwind',
    block: {
      type: 'html',
      style: { tailwindClasses: 'space-y-4 p-6 bg-white rounded-xl border', cssOverride: '.skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; } @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } } .sk-circle { width: 48px; height: 48px; border-radius: 50%; } .sk-title { height: 24px; width: 60%; } .sk-text { height: 16px; width: 100%; } .sk-text-sm { height: 16px; width: 80%; }' },
    },
  },
];

export function getTemplatesByCategory(category: string): BlockTemplate[] {
  return BLOCK_TEMPLATES.filter(t => t.category === category);
}

export function getTemplateById(id: string): BlockTemplate | undefined {
  return BLOCK_TEMPLATES.find(t => t.id === id);
}

export function getTemplateCategories(): string[] {
  return [...new Set(BLOCK_TEMPLATES.map(t => t.category))];
}

export function searchTemplates(query: string): BlockTemplate[] {
  const q = query.toLowerCase();
  return BLOCK_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.category.includes(q) ||
    (t.uiLib && t.uiLib.includes(q))
  );
}
