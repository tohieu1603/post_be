/**
 * Block Templates Library — 200+ pre-built block presets
 * Đa dạng style: Tailwind, shadcn, MUI, Ant Design patterns
 * Mỗi template có comment giải thích
 *
 * Cách dùng: Chọn template → clone → thay content → save
 */

// ============================================================
// CATEGORY 1: HERO SECTIONS (1-15)
// ============================================================

export const BLOCK_TEMPLATES = [

  // --- 1. Hero gradient full-width — kiểu landing page SaaS ---
  {
    id: 'hero-gradient-001',
    name: 'Hero Gradient SaaS',
    category: 'hero',
    tags: ['hero', 'gradient', 'cta', 'landing'],
    preview: 'Gradient tím-xanh, text trắng centered, 2 CTA buttons',
    block: {
      type: 'hero' as const,
      hero: {
        title: 'Build faster with AI',
        subtitle: 'The next-generation platform for modern developers',
        align: 'center' as const,
        height: '70vh',
        overlay: 0.4,
      },
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        typography: { color: '#ffffff', textAlign: 'center' as const, fontFamily: 'Inter' },
        animation: { entrance: 'fade-up' as const, entranceDuration: 800 },
        tailwindClasses: 'flex items-center justify-center min-h-[70vh] relative overflow-hidden',
      },
    },
  },

  // --- 2. Hero ảnh nền parallax — kiểu blog magazine ---
  {
    id: 'hero-parallax-002',
    name: 'Hero Parallax Magazine',
    category: 'hero',
    tags: ['hero', 'image', 'parallax', 'magazine'],
    preview: 'Ảnh nền full-width parallax, overlay tối, text trắng',
    block: {
      type: 'hero' as const,
      hero: {
        title: 'Tương lai AI Việt Nam 2026',
        subtitle: 'Phân tích chuyên sâu từ các chuyên gia hàng đầu',
        backgroundImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01',
        align: 'center' as const,
        height: '60vh',
        overlay: 0.6,
      },
      style: {
        background: { type: 'image' as const, imageFixed: true, imageSize: 'cover' },
        typography: { color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
        animation: { entrance: 'fade-in' as const, entranceDuration: 1000 },
        tailwindClasses: 'flex items-center justify-center text-center relative',
      },
    },
  },

  // --- 3. Hero split — ảnh trái, text phải kiểu startup ---
  {
    id: 'hero-split-003',
    name: 'Hero Split Layout',
    category: 'hero',
    tags: ['hero', 'split', 'image-text', 'startup'],
    preview: 'Chia đôi: ảnh bên trái 50%, text + CTA bên phải',
    block: {
      type: 'hero' as const,
      hero: {
        title: 'Ship products 10x faster',
        subtitle: 'AI-powered development workflow',
        align: 'left' as const,
        height: '500px',
        cta: { text: 'Get Started', url: '#', style: 'primary' },
        secondaryCta: { text: 'Watch Demo', url: '#' },
      },
      style: {
        layout: { display: 'flex' as const, alignItems: 'center' as const, gap: '2rem' },
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 px-8',
      },
    },
  },

  // --- 4. Hero video background — kiểu agency ---
  {
    id: 'hero-video-004',
    name: 'Hero Video Background',
    category: 'hero',
    tags: ['hero', 'video', 'agency', 'dark'],
    preview: 'Video background loop, overlay gradient, centered text',
    block: {
      type: 'hero' as const,
      hero: {
        title: 'Creative Agency',
        subtitle: 'We make digital experiences',
        align: 'center' as const,
        height: '100vh',
        overlay: 0.5,
      },
      style: {
        background: { type: 'video' as const, videoLoop: true, overlay: 'rgba(0,0,0,0.5)' },
        typography: { fontFamily: 'Playfair Display', fontSize: 'clamp(2rem, 5vw, 5rem)', letterSpacing: '0.05em', color: '#fff' },
        animation: { entrance: 'zoom-in' as const, entranceDuration: 1200 },
      },
    },
  },

  // --- 5. Hero minimal — kiểu Notion/Linear ---
  {
    id: 'hero-minimal-005',
    name: 'Hero Minimal Clean',
    category: 'hero',
    tags: ['hero', 'minimal', 'clean', 'saas'],
    preview: 'Nền trắng, text đen, font lớn, không ảnh, badge + CTA',
    block: {
      type: 'hero' as const,
      hero: { title: 'The tool for modern teams', subtitle: 'Plan. Build. Ship.', align: 'center' as const, height: '50vh' },
      style: {
        background: { color: '#ffffff' },
        typography: { fontFamily: 'Inter', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#0a0a0a', textAlign: 'center' as const, letterSpacing: '-0.03em' },
        spacing: { paddingTop: 80, paddingBottom: 80 },
      },
    },
  },

  // --- 6. Hero glassmorphism — kiểu Apple ---
  {
    id: 'hero-glass-006',
    name: 'Hero Glassmorphism',
    category: 'hero',
    tags: ['hero', 'glass', 'blur', 'apple', 'modern'],
    preview: 'Background gradient mesh, card glass blur ở giữa',
    block: {
      type: 'hero' as const,
      hero: { title: 'Designed for the future', subtitle: 'Experience the next level', align: 'center' as const, height: '65vh' },
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)' },
        filter: { backdropBlur: 20, backdropSaturate: 1.5 },
        border: { radius: 24, width: 1, color: 'rgba(255,255,255,0.2)' },
        shadow: { custom: '0 8px 32px rgba(0,0,0,0.1)' },
        tailwindClasses: 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl mx-8 my-8',
      },
    },
  },

  // --- 7. Hero dark neon — kiểu cyberpunk ---
  {
    id: 'hero-neon-007',
    name: 'Hero Dark Neon',
    category: 'hero',
    tags: ['hero', 'dark', 'neon', 'cyberpunk', 'glow'],
    preview: 'Nền đen, text neon xanh/tím glow, border glow',
    block: {
      type: 'hero' as const,
      hero: { title: 'ENTER THE MATRIX', subtitle: 'AI-powered reality', align: 'center' as const, height: '60vh' },
      style: {
        background: { color: '#0a0a0a' },
        typography: { color: '#00ff88', textShadow: '0 0 20px #00ff88, 0 0 40px #00ff88', fontFamily: 'monospace', textTransform: 'uppercase' as const, letterSpacing: '0.15em' },
        shadow: { glowColor: '#00ff88' },
        animation: { loop: 'glow' as const, loopDuration: 2000 },
      },
    },
  },

  // --- 8. Hero ảnh toàn màn kiểu editorial ---
  {
    id: 'hero-editorial-008',
    name: 'Hero Editorial Full',
    category: 'hero',
    tags: ['hero', 'editorial', 'fullscreen', 'news'],
    preview: 'Ảnh full screen, gradient bottom, title + author ở dưới',
    block: {
      type: 'hero' as const,
      hero: { title: 'Cuộc đua AI toàn cầu', subtitle: 'Bởi Nguyễn Hà Linh — 8 phút đọc', backgroundImage: '', align: 'left' as const, height: '80vh', overlay: 0.3 },
      style: {
        background: { overlay: 'linear-gradient(transparent 40%, rgba(0,0,0,0.8) 100%)' },
        typography: { color: '#fff' },
        tailwindClasses: 'flex items-end p-8 md:p-16',
      },
    },
  },

  // --- 9. Hero gradient mesh — kiểu Stripe ---
  {
    id: 'hero-mesh-009',
    name: 'Hero Gradient Mesh Stripe',
    category: 'hero',
    tags: ['hero', 'mesh', 'stripe', 'colorful'],
    preview: 'Gradient mesh nhiều màu kiểu Stripe, text trắng',
    block: {
      type: 'hero' as const,
      hero: { title: 'Financial infrastructure', subtitle: 'for the internet', align: 'left' as const, height: '70vh' },
      style: {
        background: { type: 'gradient' as const, gradient: 'conic-gradient(from 230.29deg at 51.63% 52.16%, #2400ff 0deg, #0087ff 67.5deg, #6c279d 198.75deg, #1826a3 251.25deg, #667eea 301.88deg, #00d2ff 360deg)' },
        typography: { color: '#fff', fontWeight: 700, fontSize: 'clamp(3rem, 7vw, 6rem)' },
      },
    },
  },

  // --- 10. Hero wave bottom — kiểu Tailwind UI ---
  {
    id: 'hero-wave-010',
    name: 'Hero Wave Divider',
    category: 'hero',
    tags: ['hero', 'wave', 'divider', 'organic'],
    preview: 'Gradient top, wave SVG divider ở bottom',
    block: {
      type: 'hero' as const,
      hero: { title: 'Grow your business', subtitle: 'AI marketing automation platform', align: 'center' as const, height: '55vh' },
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(180deg, #1e3a5f 0%, #2563eb 100%)' },
        typography: { color: '#fff' },
        tailwindClasses: 'relative pb-24',
      },
    },
  },

  // ============================================================
  // CATEGORY 2: TEXT + IMAGE LAYOUTS (11-35)
  // ============================================================

  // --- 11. Ảnh trái 40% + text phải 60% — shadcn card style ---
  {
    id: 'img-text-left-011',
    name: 'Image Left 40% + Text Right',
    category: 'image-text',
    tags: ['image', 'text', 'split', 'shadcn'],
    preview: 'Card bo góc, ảnh bên trái 40%, text bên phải 60%',
    block: {
      type: 'columns' as const,
      columns: { columns: [{ content: '<img>', width: 40 }, { content: '<text>', width: 60 }], gap: 24 },
      style: {
        background: { color: '#ffffff' },
        border: { radius: 16, width: 1, color: '#e5e7eb' },
        shadow: { preset: 'md' as const },
        layout: { display: 'flex' as const, alignItems: 'center' as const },
        tailwindClasses: 'flex flex-col md:flex-row rounded-2xl border shadow-md overflow-hidden bg-white',
      },
    },
  },

  // --- 12. Text trái + ảnh phải — gradient accent ---
  {
    id: 'text-img-right-012',
    name: 'Text Left + Image Right Gradient',
    category: 'image-text',
    tags: ['text', 'image', 'gradient', 'accent'],
    preview: 'Text bên trái nền gradient nhẹ, ảnh phải tràn viền',
    block: {
      type: 'columns' as const,
      columns: { columns: [{ content: '<text>', width: 55 }, { content: '<img>', width: 45 }], gap: 0 },
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' },
        border: { radius: 24 },
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-2 items-center bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl overflow-hidden',
      },
    },
  },

  // --- 13. Ảnh full-width + text overlay bottom — magazine ---
  {
    id: 'img-overlay-013',
    name: 'Image Full + Text Overlay Bottom',
    category: 'image-text',
    tags: ['image', 'overlay', 'magazine', 'editorial'],
    preview: 'Ảnh full-width, gradient overlay từ dưới lên, text trắng',
    block: {
      type: 'image' as const,
      style: {
        background: { overlay: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8))' },
        imageStyle: { objectFit: 'cover' as const, aspectRatio: '16/9' },
        tailwindClasses: 'relative rounded-2xl overflow-hidden group',
      },
    },
  },

  // --- 14. Card ảnh tròn + text — kiểu profile/testimonial ---
  {
    id: 'img-circle-text-014',
    name: 'Circle Image + Text Card',
    category: 'image-text',
    tags: ['circle', 'avatar', 'profile', 'card'],
    preview: 'Ảnh tròn centered, tên + role + bio bên dưới',
    block: {
      type: 'testimonial' as const,
      style: {
        imageStyle: { mask: 'circle' as const, objectFit: 'cover' as const },
        typography: { textAlign: 'center' as const },
        spacing: { paddingTop: 40, paddingBottom: 40 },
        border: { radius: 16, width: 1, color: '#f1f5f9' },
        shadow: { preset: 'sm' as const },
        tailwindClasses: 'text-center p-8 rounded-2xl bg-white border shadow-sm',
      },
    },
  },

  // --- 15. Ảnh hexagon + text — kiểu creative ---
  {
    id: 'img-hexagon-015',
    name: 'Hexagon Image + Text',
    category: 'image-text',
    tags: ['hexagon', 'creative', 'mask', 'unique'],
    preview: 'Ảnh cắt hexagon bên trái, text bên phải',
    block: {
      type: 'columns' as const,
      style: {
        imageStyle: { mask: 'hexagon' as const },
        layout: { display: 'flex' as const, alignItems: 'center' as const, gap: '2rem' },
        tailwindClasses: 'flex flex-col md:flex-row items-center gap-8 p-8',
      },
    },
  },

  // --- 16. Ảnh zoom on hover + text slide up — interactive ---
  {
    id: 'img-zoom-hover-016',
    name: 'Image Zoom + Text Reveal Hover',
    category: 'image-text',
    tags: ['hover', 'zoom', 'reveal', 'interactive'],
    preview: 'Ảnh zoom nhẹ khi hover, text slide up từ dưới',
    block: {
      type: 'image' as const,
      style: {
        imageStyle: { hoverZoom: true, hoverZoomScale: 1.1 },
        animation: { hoverEffect: 'lift' as const, transitionDuration: 400 },
        border: { radius: 16 },
        tailwindClasses: 'relative rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-400',
      },
    },
  },

  // --- 17. Ảnh grayscale → color on hover ---
  {
    id: 'img-grayscale-017',
    name: 'Grayscale to Color Hover',
    category: 'image-text',
    tags: ['grayscale', 'hover', 'filter', 'artistic'],
    preview: 'Ảnh xám, chuyển màu khi hover',
    block: {
      type: 'image' as const,
      style: {
        filter: { grayscale: 1 },
        imageStyle: { grayscaleToColor: true },
        animation: { transitionDuration: 600 },
        tailwindClasses: 'grayscale hover:grayscale-0 transition-all duration-600 rounded-xl overflow-hidden',
      },
    },
  },

  // --- 18. Ảnh ken burns slow zoom — cinematic ---
  {
    id: 'img-kenburns-018',
    name: 'Ken Burns Cinematic',
    category: 'image-text',
    tags: ['kenburns', 'cinematic', 'slow', 'zoom'],
    preview: 'Ảnh zoom rất chậm liên tục, hiệu ứng cinematic',
    block: {
      type: 'image' as const,
      style: {
        imageStyle: { kenBurns: true, objectFit: 'cover' as const, aspectRatio: '21/9' },
        border: { radius: 12 },
        tailwindClasses: 'rounded-xl overflow-hidden animate-ken-burns',
      },
    },
  },

  // --- 19. Text wrap quanh ảnh float left — newspaper style ---
  {
    id: 'text-wrap-float-019',
    name: 'Text Wrap Float Left',
    category: 'image-text',
    tags: ['float', 'newspaper', 'wrap', 'classic'],
    preview: 'Ảnh float trái, text wrap quanh — kiểu báo giấy',
    block: {
      type: 'paragraph' as const,
      style: {
        layout: { float: 'left' as const },
        spacing: { marginRight: 24, marginBottom: 16 },
        imageStyle: { objectFit: 'cover' as const },
        border: { radius: 8 },
        typography: { lineHeight: 1.8, fontSize: '1.05rem' },
        tailwindClasses: 'prose prose-lg',
      },
    },
  },

  // --- 20. Card ảnh blob mask — organic shape ---
  {
    id: 'img-blob-020',
    name: 'Blob Mask Image Card',
    category: 'image-text',
    tags: ['blob', 'organic', 'mask', 'fun'],
    preview: 'Ảnh cắt blob shape, text bên cạnh',
    block: {
      type: 'columns' as const,
      style: {
        imageStyle: { mask: 'blob' as const },
        animation: { entrance: 'fade-right' as const, entranceDuration: 800 },
        tailwindClasses: 'flex flex-col md:flex-row items-center gap-8',
      },
    },
  },

  // --- 21. Before/After slider — so sánh trước/sau ---
  {
    id: 'before-after-021',
    name: 'Before After Slider',
    category: 'image-text',
    tags: ['before-after', 'slider', 'compare', 'interactive'],
    preview: 'Kéo slider so sánh 2 ảnh trước/sau',
    block: {
      type: 'before-after' as const,
      beforeAfter: {
        before: { image: '', label: 'Before' },
        after: { image: '', label: 'After' },
        orientation: 'horizontal' as const,
      },
      style: {
        border: { radius: 16 },
        shadow: { preset: 'lg' as const },
        tailwindClasses: 'rounded-2xl overflow-hidden shadow-lg',
      },
    },
  },

  // --- 22. Ảnh diamond mask + text — luxury style ---
  {
    id: 'img-diamond-022',
    name: 'Diamond Mask Luxury',
    category: 'image-text',
    tags: ['diamond', 'luxury', 'premium', 'mask'],
    preview: 'Ảnh cắt diamond, nền tối, gold accent',
    block: {
      type: 'image' as const,
      style: {
        imageStyle: { mask: 'diamond' as const },
        background: { color: '#1a1a2e' },
        typography: { color: '#d4af37' },
        tailwindClasses: 'bg-slate-900 p-12 flex items-center justify-center',
      },
    },
  },

  // --- 23. Ảnh + text xen kẽ zigzag — storytelling ---
  {
    id: 'zigzag-023',
    name: 'Zigzag Image Text Story',
    category: 'image-text',
    tags: ['zigzag', 'alternating', 'story', 'scroll'],
    preview: 'Mỗi section ảnh-text xen kẽ trái/phải',
    block: {
      type: 'columns' as const,
      style: {
        layout: { display: 'flex' as const, flexDirection: 'row' as const },
        responsive: { mobileFlexDirection: 'column' as const },
        spacing: { paddingTop: 48, paddingBottom: 48 },
        animation: { entrance: 'fade-up' as const, scrollTrigger: true },
        tailwindClasses: 'flex flex-col md:flex-row items-center gap-12 py-12 even:md:flex-row-reverse',
      },
    },
  },

  // --- 24. Card hover tilt 3D — interactive premium ---
  {
    id: 'card-tilt-3d-024',
    name: '3D Tilt Card on Hover',
    category: 'image-text',
    tags: ['3d', 'tilt', 'hover', 'premium', 'interactive'],
    preview: 'Card nghiêng theo hướng chuột, hiệu ứng 3D',
    block: {
      type: 'image' as const,
      style: {
        transform: { perspective: '1000px' },
        animation: { hoverEffect: 'tilt-3d' as const, transitionDuration: 200 },
        shadow: { preset: 'xl' as const },
        border: { radius: 20 },
        tailwindClasses: 'rounded-[20px] shadow-xl overflow-hidden transform-gpu',
      },
    },
  },

  // --- 25. Ảnh + badge overlay — e-commerce style ---
  {
    id: 'img-badge-025',
    name: 'Image with Badge Overlay',
    category: 'image-text',
    tags: ['badge', 'overlay', 'ecommerce', 'label'],
    preview: 'Ảnh với badge "New" / "Hot" ở góc trên',
    block: {
      type: 'image' as const,
      style: {
        border: { radius: 12 },
        tailwindClasses: 'relative rounded-xl overflow-hidden [&_.badge]:absolute [&_.badge]:top-3 [&_.badge]:right-3 [&_.badge]:bg-red-500 [&_.badge]:text-white [&_.badge]:px-3 [&_.badge]:py-1 [&_.badge]:rounded-full [&_.badge]:text-xs [&_.badge]:font-bold',
      },
    },
  },

  // ============================================================
  // CATEGORY 3: CARDS & GRIDS (26-50)
  // ============================================================

  // --- 26. Card grid 3 cột — shadcn style ---
  {
    id: 'card-grid-3-026',
    name: 'Card Grid 3 Columns',
    category: 'cards',
    tags: ['grid', '3-col', 'cards', 'shadcn'],
    preview: '3 card đều nhau, border nhẹ, hover shadow',
    block: {
      type: 'columns' as const,
      columns: { columns: [{ content: '', width: 33 }, { content: '', width: 33 }, { content: '', width: 33 }], gap: 24 },
      style: {
        layout: { display: 'grid' as const, gridCols: 3, gridGap: '1.5rem' },
        responsive: { mobileGridCols: 1, tabletGridCols: 2 },
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      },
    },
  },

  // --- 27. Card glass dark — kiểu dashboard ---
  {
    id: 'card-glass-dark-027',
    name: 'Glass Card Dark Theme',
    category: 'cards',
    tags: ['glass', 'dark', 'dashboard', 'blur'],
    preview: 'Card nền tối blur, border subtle, glow nhẹ',
    block: {
      type: 'callout' as const,
      style: {
        background: { color: 'rgba(255,255,255,0.05)' },
        filter: { backdropBlur: 16, backdropSaturate: 1.2 },
        border: { radius: 16, width: 1, color: 'rgba(255,255,255,0.1)' },
        shadow: { custom: '0 0 30px rgba(99,102,241,0.1)' },
        tailwindClasses: 'backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6',
      },
    },
  },

  // --- 28. Card MUI elevated — Material Design ---
  {
    id: 'card-mui-028',
    name: 'MUI Elevated Card',
    category: 'cards',
    tags: ['mui', 'material', 'elevated', 'shadow'],
    preview: 'Card MUI: bo góc 12px, shadow elevation 3, ripple',
    block: {
      type: 'callout' as const,
      style: {
        background: { color: '#ffffff' },
        border: { radius: 12 },
        shadow: { custom: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' },
        animation: { hoverEffect: 'lift' as const, clickEffect: 'ripple' as const },
        spacing: { paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24 },
        tailwindClasses: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6',
      },
    },
  },

  // --- 29. Card Ant Design — clean border ---
  {
    id: 'card-antd-029',
    name: 'Ant Design Card',
    category: 'cards',
    tags: ['antd', 'clean', 'border', 'classic'],
    preview: 'Card AntD: border 1px, header divider, padding 24px',
    block: {
      type: 'callout' as const,
      style: {
        background: { color: '#ffffff' },
        border: { radius: 8, width: 1, color: '#f0f0f0' },
        spacing: { paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24 },
        tailwindClasses: 'bg-white rounded-lg border border-gray-200 p-6 [&_h3]:border-b [&_h3]:border-gray-100 [&_h3]:pb-3 [&_h3]:mb-4',
      },
    },
  },

  // --- 30. Card gradient border — kiểu premium ---
  {
    id: 'card-gradient-border-030',
    name: 'Gradient Border Card',
    category: 'cards',
    tags: ['gradient', 'border', 'premium', 'glow'],
    preview: 'Card với border gradient rainbow, nền tối',
    block: {
      type: 'callout' as const,
      style: {
        background: { color: '#0f172a' },
        border: { radius: 16 },
        typography: { color: '#e2e8f0' },
        tailwindClasses: 'relative rounded-2xl p-6 bg-slate-900 text-slate-200 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-purple-500 before:via-pink-500 before:to-orange-500 before:-z-10',
      },
    },
  },

  // --- 31. Card neumorphism — soft UI ---
  {
    id: 'card-neumorphism-031',
    name: 'Neumorphism Soft Card',
    category: 'cards',
    tags: ['neumorphism', 'soft', 'ui', '3d'],
    preview: 'Soft shadow 2 hướng, nền sáng nhạt, emboss effect',
    block: {
      type: 'callout' as const,
      style: {
        background: { color: '#e0e5ec' },
        shadow: { custom: '8px 8px 16px #b8bec7, -8px -8px 16px #ffffff' },
        border: { radius: 20, style: 'none' as const },
        spacing: { paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32 },
        tailwindClasses: 'rounded-[20px] p-8 bg-[#e0e5ec]',
      },
    },
  },

  // --- 32. Card hover grow — interactive ---
  {
    id: 'card-hover-grow-032',
    name: 'Card Hover Grow',
    category: 'cards',
    tags: ['hover', 'grow', 'scale', 'interactive'],
    preview: 'Card phóng to nhẹ khi hover, shadow tăng',
    block: {
      type: 'callout' as const,
      style: {
        animation: { hoverEffect: 'grow' as const, hoverScale: 1.03, transitionDuration: 300 },
        shadow: { preset: 'md' as const },
        border: { radius: 16 },
        tailwindClasses: 'rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 p-6 bg-white cursor-pointer',
      },
    },
  },

  // --- 33. Card icon top — feature card ---
  {
    id: 'card-icon-top-033',
    name: 'Feature Card Icon Top',
    category: 'cards',
    tags: ['feature', 'icon', 'grid', 'saas'],
    preview: 'Icon tròn màu ở trên, title, description — kiểu feature grid',
    block: {
      type: 'callout' as const,
      style: {
        typography: { textAlign: 'center' as const },
        spacing: { paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24 },
        border: { radius: 16, width: 1, color: '#f1f5f9' },
        animation: { entrance: 'fade-up' as const, scrollTrigger: true },
        tailwindClasses: 'text-center p-10 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all [&_svg]:mx-auto [&_svg]:mb-4 [&_svg]:w-12 [&_svg]:h-12 [&_svg]:text-indigo-500',
      },
    },
  },

  // --- 34. Card horizontal — list item ---
  {
    id: 'card-horizontal-034',
    name: 'Horizontal Card List',
    category: 'cards',
    tags: ['horizontal', 'list', 'compact', 'news'],
    preview: 'Card ngang: ảnh nhỏ trái, title + excerpt phải',
    block: {
      type: 'columns' as const,
      style: {
        layout: { display: 'flex' as const, alignItems: 'center' as const, gap: '1rem' },
        border: { radius: 12, width: 1, color: '#e5e7eb' },
        spacing: { paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 16 },
        animation: { hoverEffect: 'lift' as const },
        tailwindClasses: 'flex items-center gap-4 p-3 pr-4 rounded-xl border hover:-translate-y-0.5 hover:shadow-md transition-all bg-white',
      },
    },
  },

  // --- 35. Card stacked — overlapping ---
  {
    id: 'card-stacked-035',
    name: 'Stacked Overlapping Cards',
    category: 'cards',
    tags: ['stacked', 'overlap', 'creative', 'depth'],
    preview: 'Cards chồng lên nhau xê dịch, tạo chiều sâu',
    block: {
      type: 'columns' as const,
      style: {
        transform: { rotate: -2 },
        shadow: { preset: 'xl' as const },
        border: { radius: 16 },
        tailwindClasses: 'relative [&>*]:absolute [&>*:nth-child(1)]:rotate-[-3deg] [&>*:nth-child(2)]:rotate-[1deg] [&>*:nth-child(3)]:rotate-[3deg] [&>*]:shadow-xl [&>*]:rounded-2xl',
      },
    },
  },

  // ============================================================
  // CATEGORY 4: CALLOUTS & ALERTS (36-50)
  // ============================================================

  // --- 36. Callout info — shadcn blue ---
  {
    id: 'callout-info-036',
    name: 'Info Callout Blue',
    category: 'callout',
    tags: ['callout', 'info', 'blue', 'shadcn'],
    preview: 'Box info xanh dương nhạt, icon info, border-left',
    block: {
      type: 'callout' as const,
      callout: { type: 'info' as const, title: '', content: '' },
      style: {
        tailwindClasses: 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 p-5 rounded-r-xl text-blue-900 dark:text-blue-200 [&_svg]:text-blue-500',
      },
    },
  },

  // --- 37. Callout warning — amber ---
  {
    id: 'callout-warning-037',
    name: 'Warning Callout Amber',
    category: 'callout',
    tags: ['callout', 'warning', 'amber', 'alert'],
    preview: 'Box cảnh báo vàng amber, icon warning triangle',
    block: {
      type: 'callout' as const,
      callout: { type: 'warning' as const, title: '', content: '' },
      style: {
        tailwindClasses: 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 p-5 rounded-r-xl text-amber-900 dark:text-amber-200',
      },
    },
  },

  // --- 38. Callout error — destructive red ---
  {
    id: 'callout-error-038',
    name: 'Error Callout Red',
    category: 'callout',
    tags: ['callout', 'error', 'red', 'destructive'],
    preview: 'Box lỗi đỏ, icon error circle',
    block: {
      type: 'callout' as const,
      callout: { type: 'error' as const, title: '', content: '' },
      style: {
        tailwindClasses: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 p-5 rounded-r-xl text-red-900 dark:text-red-200',
      },
    },
  },

  // --- 39. Callout success — green check ---
  {
    id: 'callout-success-039',
    name: 'Success Callout Green',
    category: 'callout',
    tags: ['callout', 'success', 'green', 'check'],
    preview: 'Box thành công xanh lá, icon check',
    block: {
      type: 'callout' as const,
      callout: { type: 'success' as const, title: '', content: '' },
      style: {
        tailwindClasses: 'border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-r-xl text-emerald-900 dark:text-emerald-200',
      },
    },
  },

  // --- 40. Callout tip — purple lightbulb ---
  {
    id: 'callout-tip-040',
    name: 'Pro Tip Callout Purple',
    category: 'callout',
    tags: ['callout', 'tip', 'purple', 'pro'],
    preview: 'Box mẹo tím, icon lightbulb, gradient nhẹ',
    block: {
      type: 'callout' as const,
      callout: { type: 'tip' as const, title: 'Pro Tip', content: '' },
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' },
        border: { radius: 12, left: { width: 4, color: '#8b5cf6' } },
        tailwindClasses: 'border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-5 rounded-r-xl',
      },
    },
  },

  // --- 41. Alert banner top — announcement ---
  {
    id: 'alert-banner-041',
    name: 'Alert Banner Announcement',
    category: 'callout',
    tags: ['alert', 'banner', 'announcement', 'top'],
    preview: 'Banner gradient full-width, icon megaphone, CTA button',
    block: {
      type: 'alert' as const,
      alert: { type: 'announcement' as const, title: '', content: '', dismissible: true },
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)' },
        typography: { color: '#ffffff', textAlign: 'center' as const },
        tailwindClasses: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 text-center font-medium rounded-xl',
      },
    },
  },

  // --- 42. Note card — kiểu GitHub note ---
  {
    id: 'callout-github-note-042',
    name: 'GitHub Style Note',
    category: 'callout',
    tags: ['github', 'note', 'markdown', 'dev'],
    preview: 'Box note kiểu GitHub markdown, border trái xanh',
    block: {
      type: 'callout' as const,
      callout: { type: 'note' as const, title: 'Note', content: '' },
      style: {
        border: { left: { width: 3, color: '#3b82f6' }, radius: 6 },
        background: { color: '#f0f7ff' },
        typography: { fontSize: '0.9rem', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
        tailwindClasses: 'border-l-[3px] border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-md text-sm',
      },
    },
  },

  // --- 43. Callout gradient full — premium ---
  {
    id: 'callout-gradient-043',
    name: 'Gradient Callout Premium',
    category: 'callout',
    tags: ['gradient', 'premium', 'bold', 'cta'],
    preview: 'Box gradient bold với text trắng, CTA button',
    block: {
      type: 'callout' as const,
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        typography: { color: '#ffffff', fontWeight: 600 },
        border: { radius: 16 },
        shadow: { custom: '0 4px 20px rgba(102,126,234,0.4)' },
        tailwindClasses: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg',
      },
    },
  },

  // --- 44. Callout neon border ---
  {
    id: 'callout-neon-044',
    name: 'Neon Border Callout',
    category: 'callout',
    tags: ['neon', 'glow', 'dark', 'border'],
    preview: 'Nền tối, border neon xanh glow, icon glow',
    block: {
      type: 'callout' as const,
      style: {
        background: { color: '#0a0a1a' },
        border: { radius: 12, width: 1, color: '#00ff88' },
        shadow: { glowColor: '#00ff88', custom: '0 0 15px rgba(0,255,136,0.3), inset 0 0 15px rgba(0,255,136,0.1)' },
        typography: { color: '#e0ffe0' },
        tailwindClasses: 'bg-[#0a0a1a] border border-green-400 rounded-xl p-5 shadow-[0_0_15px_rgba(0,255,136,0.3)]',
      },
    },
  },

  // --- 45. Callout quote style — blockquote enhanced ---
  {
    id: 'callout-quote-045',
    name: 'Enhanced Blockquote',
    category: 'callout',
    tags: ['quote', 'blockquote', 'elegant', 'serif'],
    preview: 'Quote lớn với dấu ngoặc kép decorative, font serif italic',
    block: {
      type: 'quote' as const,
      style: {
        typography: { fontFamily: 'Georgia, serif', fontStyle: 'italic' as const, fontSize: '1.25rem', lineHeight: 1.8 },
        spacing: { paddingLeft: 40, paddingTop: 24, paddingBottom: 24 },
        border: { left: { width: 4, color: '#6366f1' } },
        tailwindClasses: 'relative border-l-4 border-indigo-500 pl-10 py-6 italic text-lg before:content-["\\201C"] before:absolute before:top-2 before:left-2 before:text-5xl before:text-indigo-300 before:font-serif',
      },
    },
  },

  // ============================================================
  // CATEGORY 5: STATS & NUMBERS (46-55)
  // ============================================================

  // --- 46. Stats row 4 cột — kiểu dashboard ---
  {
    id: 'stats-row-046',
    name: 'Stats Row 4 Columns',
    category: 'stats',
    tags: ['stats', 'numbers', 'dashboard', 'row'],
    preview: '4 số liệu hàng ngang, số lớn + label nhỏ',
    block: {
      type: 'stats' as const,
      stats: { items: [], layout: 'row' as const, columns: 4 },
      style: {
        typography: { textAlign: 'center' as const },
        tailwindClasses: 'grid grid-cols-2 md:grid-cols-4 gap-6 py-8 [&_.value]:text-4xl [&_.value]:font-black [&_.value]:text-indigo-600 [&_.label]:text-sm [&_.label]:text-gray-500 [&_.label]:mt-1',
      },
    },
  },

  // --- 47. Stats counter animated — count up ---
  {
    id: 'stats-counter-047',
    name: 'Animated Counter Stats',
    category: 'stats',
    tags: ['stats', 'counter', 'animated', 'scroll'],
    preview: 'Số đếm từ 0 lên khi scroll vào view',
    block: {
      type: 'stats' as const,
      stats: { items: [], layout: 'row' as const },
      style: {
        animation: { entrance: 'fade-up' as const, scrollTrigger: true },
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
        typography: { color: '#ffffff', textAlign: 'center' as const },
        border: { radius: 20 },
        tailwindClasses: 'bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-[20px] p-10 grid grid-cols-2 md:grid-cols-4 gap-8',
      },
    },
  },

  // --- 48. Stats với icon — feature highlights ---
  {
    id: 'stats-icons-048',
    name: 'Stats with Icons',
    category: 'stats',
    tags: ['stats', 'icons', 'feature', 'highlight'],
    preview: 'Mỗi stat có icon tròn màu phía trên',
    block: {
      type: 'stats' as const,
      style: {
        tailwindClasses: 'grid grid-cols-2 md:grid-cols-4 gap-8 [&_.icon]:w-14 [&_.icon]:h-14 [&_.icon]:rounded-full [&_.icon]:bg-indigo-100 [&_.icon]:text-indigo-600 [&_.icon]:flex [&_.icon]:items-center [&_.icon]:justify-center [&_.icon]:mx-auto [&_.icon]:mb-3',
      },
    },
  },

  // --- 49. Stats gradient cards — mỗi card 1 màu ---
  {
    id: 'stats-gradient-049',
    name: 'Stats Gradient Cards',
    category: 'stats',
    tags: ['stats', 'gradient', 'colorful', 'cards'],
    preview: 'Mỗi stat là 1 card gradient khác màu',
    block: {
      type: 'stats' as const,
      style: {
        tailwindClasses: 'grid grid-cols-2 md:grid-cols-4 gap-4 [&>*:nth-child(1)]:bg-gradient-to-br [&>*:nth-child(1)]:from-blue-500 [&>*:nth-child(1)]:to-blue-600 [&>*:nth-child(2)]:bg-gradient-to-br [&>*:nth-child(2)]:from-purple-500 [&>*:nth-child(2)]:to-purple-600 [&>*:nth-child(3)]:bg-gradient-to-br [&>*:nth-child(3)]:from-emerald-500 [&>*:nth-child(3)]:to-emerald-600 [&>*:nth-child(4)]:bg-gradient-to-br [&>*:nth-child(4)]:from-orange-500 [&>*:nth-child(4)]:to-orange-600 [&>*]:text-white [&>*]:p-6 [&>*]:rounded-2xl',
      },
    },
  },

  // --- 50. Stats progress bars ---
  {
    id: 'stats-progress-050',
    name: 'Stats with Progress Bars',
    category: 'stats',
    tags: ['stats', 'progress', 'bar', 'skill'],
    preview: 'Label + thanh progress bar gradient',
    block: {
      type: 'progress' as const,
      progressBar: { items: [], showValue: true },
      style: {
        tailwindClasses: 'space-y-4 [&_.bar-bg]:h-3 [&_.bar-bg]:bg-gray-200 [&_.bar-bg]:rounded-full [&_.bar-bg]:overflow-hidden [&_.bar-fill]:h-full [&_.bar-fill]:bg-gradient-to-r [&_.bar-fill]:from-indigo-500 [&_.bar-fill]:to-purple-500 [&_.bar-fill]:rounded-full [&_.bar-fill]:transition-all [&_.bar-fill]:duration-1000',
      },
    },
  },

  // ============================================================
  // CATEGORY 6: TESTIMONIALS (51-60)
  // ============================================================

  // --- 51. Testimonial card đơn — centered avatar ---
  {
    id: 'testimonial-center-051',
    name: 'Testimonial Centered Avatar',
    category: 'testimonial',
    tags: ['testimonial', 'centered', 'avatar', 'review'],
    preview: 'Avatar tròn centered, quote italic, name + role dưới',
    block: {
      type: 'testimonial' as const,
      style: {
        typography: { textAlign: 'center' as const, fontStyle: 'italic' as const },
        imageStyle: { mask: 'circle' as const },
        spacing: { paddingTop: 40, paddingBottom: 40 },
        border: { radius: 16 },
        shadow: { preset: 'md' as const },
        tailwindClasses: 'text-center bg-white rounded-2xl shadow-md p-10 [&_img]:w-16 [&_img]:h-16 [&_img]:rounded-full [&_img]:mx-auto [&_img]:mb-4 [&_blockquote]:italic [&_blockquote]:text-lg [&_blockquote]:text-gray-700',
      },
    },
  },

  // --- 52. Testimonial card dark — rating stars ---
  {
    id: 'testimonial-dark-052',
    name: 'Testimonial Dark with Stars',
    category: 'testimonial',
    tags: ['testimonial', 'dark', 'stars', 'rating'],
    preview: 'Nền tối, 5 sao vàng, quote trắng, avatar nhỏ',
    block: {
      type: 'testimonial' as const,
      style: {
        background: { color: '#1e293b' },
        typography: { color: '#e2e8f0' },
        border: { radius: 16 },
        tailwindClasses: 'bg-slate-800 text-slate-200 rounded-2xl p-8 [&_.stars]:text-amber-400 [&_.stars]:text-lg [&_.stars]:mb-3',
      },
    },
  },

  // --- 53. Testimonial carousel — slider style ---
  {
    id: 'testimonial-carousel-053',
    name: 'Testimonial Carousel Slider',
    category: 'testimonial',
    tags: ['testimonial', 'carousel', 'slider', 'swipe'],
    preview: 'Testimonial cards trong carousel tự động trượt',
    block: {
      type: 'carousel' as const,
      carousel: { items: [], autoplay: true, interval: 5000, showDots: true, showArrows: true },
      style: {
        tailwindClasses: 'relative overflow-hidden rounded-2xl',
      },
    },
  },

  // --- 54. Testimonial quote lớn — editorial ---
  {
    id: 'testimonial-big-quote-054',
    name: 'Big Quote Testimonial',
    category: 'testimonial',
    tags: ['testimonial', 'big', 'quote', 'editorial'],
    preview: 'Dấu ngoặc kép khổng lồ, font serif lớn, minimal',
    block: {
      type: 'testimonial' as const,
      style: {
        typography: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', lineHeight: 1.8, fontStyle: 'italic' as const },
        tailwindClasses: 'relative py-12 px-8 before:content-["\\201C"] before:absolute before:top-0 before:left-4 before:text-[8rem] before:text-indigo-100 before:font-serif before:leading-none',
      },
    },
  },

  // --- 55. Testimonial grid masonry ---
  {
    id: 'testimonial-masonry-055',
    name: 'Testimonial Masonry Grid',
    category: 'testimonial',
    tags: ['testimonial', 'masonry', 'grid', 'twitter'],
    preview: 'Grid testimonial kiểu Twitter/Masonry, card cao khác nhau',
    block: {
      type: 'columns' as const,
      style: {
        tailwindClasses: 'columns-1 md:columns-2 lg:columns-3 gap-4 [&>*]:break-inside-avoid [&>*]:mb-4 [&>*]:bg-white [&>*]:rounded-xl [&>*]:border [&>*]:border-gray-200 [&>*]:p-5 [&>*]:shadow-sm',
      },
    },
  },

  // ============================================================
  // CATEGORY 7: TIMELINE & STEPS (56-70)
  // ============================================================

  // --- 56. Timeline vertical — left line ---
  {
    id: 'timeline-vertical-056',
    name: 'Timeline Vertical Left Line',
    category: 'timeline',
    tags: ['timeline', 'vertical', 'line', 'history'],
    preview: 'Đường thẳng dọc bên trái, dots + content bên phải',
    block: {
      type: 'timeline' as const,
      timeline: { items: [], layout: 'vertical' as const },
      style: {
        tailwindClasses: 'relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-indigo-200 [&_.dot]:absolute [&_.dot]:left-1.5 [&_.dot]:w-4 [&_.dot]:h-4 [&_.dot]:rounded-full [&_.dot]:bg-indigo-500 [&_.dot]:border-4 [&_.dot]:border-white [&_.dot]:shadow',
      },
    },
  },

  // --- 57. Timeline horizontal — kiểu roadmap ---
  {
    id: 'timeline-horizontal-057',
    name: 'Timeline Horizontal Roadmap',
    category: 'timeline',
    tags: ['timeline', 'horizontal', 'roadmap', 'product'],
    preview: 'Đường ngang, milestones ở trên/dưới xen kẽ',
    block: {
      type: 'timeline' as const,
      timeline: { items: [], layout: 'horizontal' as const },
      style: {
        tailwindClasses: 'relative flex items-center justify-between py-12 before:absolute before:top-1/2 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500',
      },
    },
  },

  // --- 58. Steps numbered — kiểu how-to ---
  {
    id: 'steps-numbered-058',
    name: 'Steps Numbered How-To',
    category: 'timeline',
    tags: ['steps', 'numbered', 'howto', 'tutorial'],
    preview: 'Số lớn (01, 02, 03) bên trái, nội dung bên phải',
    block: {
      type: 'steps' as const,
      steps: { items: [], layout: 'numbered' as const },
      style: {
        tailwindClasses: 'space-y-8 [&_.number]:text-5xl [&_.number]:font-black [&_.number]:text-indigo-200 [&_.number]:mr-6 [&_.step]:flex [&_.step]:items-start [&_.step]:gap-6',
      },
    },
  },

  // --- 59. Steps icon circle — process flow ---
  {
    id: 'steps-icons-059',
    name: 'Steps Icon Circle Flow',
    category: 'timeline',
    tags: ['steps', 'icons', 'circle', 'process'],
    preview: 'Icon trong circle, connected by dashed line',
    block: {
      type: 'steps' as const,
      steps: { items: [], layout: 'horizontal' as const },
      style: {
        tailwindClasses: 'flex flex-col md:flex-row items-start md:items-center justify-between gap-4 [&_.icon]:w-16 [&_.icon]:h-16 [&_.icon]:rounded-full [&_.icon]:bg-indigo-100 [&_.icon]:text-indigo-600 [&_.icon]:flex [&_.icon]:items-center [&_.icon]:justify-center [&_.icon]:text-2xl [&_.connector]:hidden [&_.connector]:md:block [&_.connector]:flex-1 [&_.connector]:h-0.5 [&_.connector]:bg-indigo-200 [&_.connector]:mx-2',
      },
    },
  },

  // --- 60. Timeline gradient cards ---
  {
    id: 'timeline-gradient-060',
    name: 'Timeline Gradient Cards',
    category: 'timeline',
    tags: ['timeline', 'gradient', 'cards', 'colorful'],
    preview: 'Mỗi entry là card gradient, connected by line',
    block: {
      type: 'timeline' as const,
      style: {
        tailwindClasses: 'space-y-6 [&>*]:bg-gradient-to-r [&>*]:from-indigo-500/10 [&>*]:to-purple-500/10 [&>*]:rounded-xl [&>*]:p-6 [&>*]:border-l-4 [&>*]:border-indigo-500',
      },
    },
  },

  // ============================================================
  // CATEGORY 8: TABS & ACCORDION (61-70)
  // ============================================================

  // --- 61. Tabs underline — kiểu MUI ---
  {
    id: 'tabs-underline-061',
    name: 'Tabs Underline MUI',
    category: 'tabs',
    tags: ['tabs', 'underline', 'mui', 'material'],
    preview: 'Tab labels hàng ngang, underline active chạy slide',
    block: {
      type: 'tabs' as const,
      tabs: { items: [], style: 'underline' as const },
      style: {
        tailwindClasses: '[&_.tab-list]:flex [&_.tab-list]:border-b [&_.tab-list]:border-gray-200 [&_.tab]:px-4 [&_.tab]:py-3 [&_.tab]:text-sm [&_.tab]:font-medium [&_.tab]:text-gray-500 [&_.tab]:cursor-pointer [&_.tab.active]:text-indigo-600 [&_.tab.active]:border-b-2 [&_.tab.active]:border-indigo-600',
      },
    },
  },

  // --- 62. Tabs pills — kiểu shadcn ---
  {
    id: 'tabs-pills-062',
    name: 'Tabs Pills shadcn',
    category: 'tabs',
    tags: ['tabs', 'pills', 'shadcn', 'rounded'],
    preview: 'Tab pills bo tròn, active background filled',
    block: {
      type: 'tabs' as const,
      tabs: { items: [], style: 'pills' as const },
      style: {
        tailwindClasses: '[&_.tab-list]:flex [&_.tab-list]:gap-1 [&_.tab-list]:bg-gray-100 [&_.tab-list]:p-1 [&_.tab-list]:rounded-lg [&_.tab]:px-4 [&_.tab]:py-2 [&_.tab]:rounded-md [&_.tab]:text-sm [&_.tab.active]:bg-white [&_.tab.active]:shadow-sm [&_.tab.active]:font-medium',
      },
    },
  },

  // --- 63. Accordion clean — kiểu FAQ page ---
  {
    id: 'accordion-clean-063',
    name: 'Accordion Clean FAQ',
    category: 'tabs',
    tags: ['accordion', 'faq', 'clean', 'minimal'],
    preview: 'Accordion đơn giản, divider line, icon chevron',
    block: {
      type: 'accordion' as const,
      accordion: { items: [] },
      style: {
        tailwindClasses: 'divide-y divide-gray-200 [&_summary]:py-4 [&_summary]:cursor-pointer [&_summary]:font-medium [&_summary]:flex [&_summary]:justify-between [&_summary]:items-center [&_details[open]_summary]:text-indigo-600 [&_.content]:pb-4 [&_.content]:text-gray-600',
      },
    },
  },

  // --- 64. Accordion bordered cards ---
  {
    id: 'accordion-cards-064',
    name: 'Accordion Bordered Cards',
    category: 'tabs',
    tags: ['accordion', 'cards', 'bordered', 'spaced'],
    preview: 'Mỗi item là card riêng có border, cách nhau',
    block: {
      type: 'accordion' as const,
      style: {
        tailwindClasses: 'space-y-3 [&_details]:border [&_details]:border-gray-200 [&_details]:rounded-xl [&_details]:overflow-hidden [&_summary]:p-4 [&_summary]:bg-gray-50 [&_summary]:cursor-pointer [&_summary]:font-medium [&_details[open]]:border-indigo-200 [&_details[open]_summary]:bg-indigo-50 [&_.content]:p-4',
      },
    },
  },

  // ============================================================
  // CATEGORY 9: COMPARISON & PRICING (65-75)
  // ============================================================

  // --- 65. Comparison table — 2 columns ---
  {
    id: 'comparison-2col-065',
    name: 'Comparison Table 2 Columns',
    category: 'comparison',
    tags: ['comparison', 'table', '2-col', 'vs'],
    preview: 'Bảng so sánh 2 sản phẩm, check/cross icons',
    block: {
      type: 'comparison' as const,
      style: {
        tailwindClasses: 'overflow-hidden rounded-2xl border border-gray-200 [&_th]:bg-gray-50 [&_th]:p-4 [&_th]:font-bold [&_td]:p-4 [&_td]:border-t [&_td]:border-gray-100 [&_.check]:text-emerald-500 [&_.cross]:text-red-400',
      },
    },
  },

  // --- 66. Comparison cards side by side ---
  {
    id: 'comparison-cards-066',
    name: 'Comparison Cards Side by Side',
    category: 'comparison',
    tags: ['comparison', 'cards', 'side-by-side', 'features'],
    preview: '2-3 card cạnh nhau, highlighted card scale lớn hơn',
    block: {
      type: 'comparison' as const,
      style: {
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-3 gap-4 items-start [&_.highlighted]:scale-105 [&_.highlighted]:shadow-xl [&_.highlighted]:border-indigo-500 [&_.highlighted]:border-2 [&_.highlighted]:z-10 [&>*]:rounded-2xl [&>*]:border [&>*]:border-gray-200 [&>*]:p-6 [&>*]:bg-white',
      },
    },
  },

  // --- 67. Pricing table 3 tiers — gradient popular ---
  {
    id: 'pricing-3tier-067',
    name: 'Pricing 3 Tiers Gradient',
    category: 'comparison',
    tags: ['pricing', '3-tier', 'gradient', 'saas'],
    preview: '3 bảng giá, tier giữa gradient + badge Popular',
    block: {
      type: 'pricing' as const,
      style: {
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-3 gap-6 items-start [&>*]:rounded-2xl [&>*]:p-8 [&>*]:border [&>*]:border-gray-200 [&>*]:bg-white [&_.popular]:bg-gradient-to-b [&_.popular]:from-indigo-600 [&_.popular]:to-purple-600 [&_.popular]:text-white [&_.popular]:scale-105 [&_.popular]:shadow-2xl [&_.popular]:border-0 [&_.price]:text-4xl [&_.price]:font-black [&_.price]:my-4',
      },
    },
  },

  // --- 68. Pricing simple — minimal ---
  {
    id: 'pricing-simple-068',
    name: 'Pricing Simple Minimal',
    category: 'comparison',
    tags: ['pricing', 'simple', 'minimal', 'clean'],
    preview: 'Bảng giá tối giản, border nhẹ, không màu nổi bật',
    block: {
      type: 'pricing' as const,
      style: {
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-3 gap-6 [&>*]:rounded-xl [&>*]:border [&>*]:border-gray-200 [&>*]:p-6 [&>*]:hover:shadow-lg [&>*]:transition-shadow',
      },
    },
  },

  // ============================================================
  // CATEGORY 10: CODE & TECHNICAL (69-80)
  // ============================================================

  // --- 69. Code block dark — VS Code theme ---
  {
    id: 'code-vscode-069',
    name: 'Code Block VS Code Dark',
    category: 'code',
    tags: ['code', 'dark', 'vscode', 'syntax'],
    preview: 'Code block nền tối kiểu VS Code, dots top-left, copy button',
    block: {
      type: 'code' as const,
      style: {
        background: { color: '#1e1e1e' },
        typography: { fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: '0.875rem', lineHeight: 1.7 },
        border: { radius: 12 },
        tailwindClasses: 'bg-[#1e1e1e] text-gray-300 rounded-xl overflow-hidden [&_.header]:flex [&_.header]:items-center [&_.header]:gap-2 [&_.header]:px-4 [&_.header]:py-3 [&_.header]:bg-[#2d2d2d] [&_.dot]:w-3 [&_.dot]:h-3 [&_.dot]:rounded-full',
      },
    },
  },

  // --- 70. Code block light — kiểu GitHub ---
  {
    id: 'code-github-070',
    name: 'Code Block GitHub Light',
    category: 'code',
    tags: ['code', 'light', 'github', 'clean'],
    preview: 'Code nền sáng kiểu GitHub, line numbers, border',
    block: {
      type: 'code' as const,
      style: {
        background: { color: '#f6f8fa' },
        border: { radius: 8, width: 1, color: '#d0d7de' },
        typography: { fontFamily: 'SF Mono, monospace', fontSize: '0.85rem' },
        tailwindClasses: 'bg-gray-50 border border-gray-300 rounded-lg overflow-hidden [&_pre]:p-4 [&_.line-number]:text-gray-400 [&_.line-number]:mr-4 [&_.line-number]:select-none',
      },
    },
  },

  // --- 71. API Response block ---
  {
    id: 'api-response-071',
    name: 'API Response Card',
    category: 'code',
    tags: ['api', 'response', 'json', 'endpoint'],
    preview: 'Method badge (GET/POST), URL, status code, JSON body',
    block: {
      type: 'api-response' as const,
      style: {
        tailwindClasses: 'rounded-xl border border-gray-200 overflow-hidden [&_.method]:font-bold [&_.method]:text-xs [&_.method]:px-2 [&_.method]:py-1 [&_.method]:rounded [&_.method-get]:bg-emerald-100 [&_.method-get]:text-emerald-700 [&_.method-post]:bg-blue-100 [&_.method-post]:text-blue-700 [&_.method-delete]:bg-red-100 [&_.method-delete]:text-red-700 [&_.status]:font-mono [&_.body]:bg-gray-900 [&_.body]:text-green-400 [&_.body]:p-4 [&_.body]:font-mono [&_.body]:text-sm',
      },
    },
  },

  // --- 72. Terminal/Console output ---
  {
    id: 'terminal-072',
    name: 'Terminal Console Output',
    category: 'code',
    tags: ['terminal', 'console', 'cli', 'bash'],
    preview: 'Terminal đen, prompt $ green, output trắng',
    block: {
      type: 'code' as const,
      style: {
        background: { color: '#0d1117' },
        typography: { fontFamily: 'SF Mono, Menlo, monospace', fontSize: '0.85rem', color: '#c9d1d9' },
        border: { radius: 12 },
        tailwindClasses: 'bg-[#0d1117] rounded-xl overflow-hidden [&_.header]:bg-[#161b22] [&_.header]:px-4 [&_.header]:py-2 [&_.header]:flex [&_.header]:items-center [&_.header]:gap-2 [&_.prompt]:text-emerald-400 [&_.output]:text-gray-300 [&_pre]:p-4',
      },
    },
  },

  // ============================================================
  // CATEGORY 11: GALLERY & MEDIA (73-85)
  // ============================================================

  // --- 73. Gallery grid 3x3 ---
  {
    id: 'gallery-grid-073',
    name: 'Gallery Grid 3x3',
    category: 'gallery',
    tags: ['gallery', 'grid', '3x3', 'photos'],
    preview: 'Grid ảnh 3 cột đều, gap nhỏ, hover zoom',
    block: {
      type: 'gallery' as const,
      gallery: { images: [], layout: 'grid' as const, columns: 3 },
      style: {
        imageStyle: { objectFit: 'cover' as const, aspectRatio: '1/1', hoverZoom: true },
        border: { radius: 8 },
        tailwindClasses: 'grid grid-cols-2 md:grid-cols-3 gap-2 [&_img]:aspect-square [&_img]:object-cover [&_img]:rounded-lg [&_img]:hover:scale-105 [&_img]:transition-transform [&_img]:cursor-pointer',
      },
    },
  },

  // --- 74. Gallery masonry ---
  {
    id: 'gallery-masonry-074',
    name: 'Gallery Masonry Pinterest',
    category: 'gallery',
    tags: ['gallery', 'masonry', 'pinterest', 'waterfall'],
    preview: 'Masonry layout kiểu Pinterest, ảnh cao khác nhau',
    block: {
      type: 'gallery' as const,
      gallery: { images: [], layout: 'masonry' as const, columns: 3 },
      style: {
        tailwindClasses: 'columns-2 md:columns-3 gap-3 [&_img]:mb-3 [&_img]:rounded-xl [&_img]:break-inside-avoid [&_img]:hover:opacity-90 [&_img]:transition-opacity [&_img]:cursor-pointer',
      },
    },
  },

  // --- 75. Gallery carousel/slider ---
  {
    id: 'gallery-carousel-075',
    name: 'Gallery Carousel Slider',
    category: 'gallery',
    tags: ['gallery', 'carousel', 'slider', 'swipe'],
    preview: 'Ảnh slider horizontal, arrows + dots, auto-play',
    block: {
      type: 'gallery' as const,
      gallery: { images: [], layout: 'carousel' as const },
      style: {
        border: { radius: 16 },
        tailwindClasses: 'relative rounded-2xl overflow-hidden [&_.arrow]:absolute [&_.arrow]:top-1/2 [&_.arrow]:-translate-y-1/2 [&_.arrow]:w-10 [&_.arrow]:h-10 [&_.arrow]:bg-white/80 [&_.arrow]:rounded-full [&_.arrow]:flex [&_.arrow]:items-center [&_.arrow]:justify-center [&_.arrow]:shadow-md [&_.arrow]:cursor-pointer [&_.arrow]:hover:bg-white',
      },
    },
  },

  // --- 76. Gallery featured — 1 ảnh lớn + 4 nhỏ ---
  {
    id: 'gallery-featured-076',
    name: 'Gallery Featured Layout',
    category: 'gallery',
    tags: ['gallery', 'featured', 'hero', 'asymmetric'],
    preview: '1 ảnh lớn bên trái, 4 ảnh nhỏ grid bên phải',
    block: {
      type: 'gallery' as const,
      style: {
        tailwindClasses: 'grid grid-cols-4 grid-rows-2 gap-2 h-[500px] [&>*:first-child]:col-span-2 [&>*:first-child]:row-span-2 [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:rounded-xl',
      },
    },
  },

  // --- 77. Video embed YouTube — rounded shadow ---
  {
    id: 'video-youtube-077',
    name: 'YouTube Embed Rounded',
    category: 'gallery',
    tags: ['video', 'youtube', 'embed', 'rounded'],
    preview: 'YouTube video bo góc, shadow lớn, caption dưới',
    block: {
      type: 'embed' as const,
      style: {
        border: { radius: 20 },
        shadow: { preset: 'xl' as const },
        tailwindClasses: 'rounded-[20px] overflow-hidden shadow-xl [&_iframe]:w-full [&_iframe]:aspect-video',
      },
    },
  },

  // ============================================================
  // CATEGORY 12: BUTTONS & CTAs (78-90)
  // ============================================================

  // --- 78. Button primary gradient ---
  {
    id: 'btn-primary-078',
    name: 'Button Primary Gradient',
    category: 'button',
    tags: ['button', 'primary', 'gradient', 'cta'],
    preview: 'Button gradient tím-xanh, text trắng, hover glow',
    block: {
      type: 'button' as const,
      button: { text: 'Get Started', url: '#', style: 'primary' as const, size: 'lg' as const },
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        shadow: { custom: '0 4px 15px rgba(102,126,234,0.4)' },
        animation: { hoverEffect: 'glow' as const },
        tailwindClasses: 'inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all',
      },
    },
  },

  // --- 79. Button outline — kiểu shadcn ---
  {
    id: 'btn-outline-079',
    name: 'Button Outline shadcn',
    category: 'button',
    tags: ['button', 'outline', 'shadcn', 'minimal'],
    preview: 'Button outline border, hover fill, transition mượt',
    block: {
      type: 'button' as const,
      button: { text: 'Learn More', url: '#', style: 'outline' as const, size: 'md' as const },
      style: {
        tailwindClasses: 'inline-block border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-all duration-300',
      },
    },
  },

  // --- 80. Button group — 2 buttons ---
  {
    id: 'btn-group-080',
    name: 'Button Group Primary + Ghost',
    category: 'button',
    tags: ['button', 'group', 'dual', 'cta'],
    preview: '2 button cạnh nhau: primary + ghost/outline',
    block: {
      type: 'columns' as const,
      style: {
        layout: { display: 'flex' as const, gap: '1rem', justifyContent: 'center' as const },
        tailwindClasses: 'flex flex-col sm:flex-row gap-4 justify-center items-center',
      },
    },
  },

  // --- 81. Button animated arrow ---
  {
    id: 'btn-arrow-081',
    name: 'Button with Animated Arrow',
    category: 'button',
    tags: ['button', 'arrow', 'animated', 'hover'],
    preview: 'Button với arrow → slide phải khi hover',
    block: {
      type: 'button' as const,
      button: { text: 'Explore Now', url: '#', icon: 'arrow_forward' },
      style: {
        tailwindClasses: 'group inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all [&_svg]:transition-transform [&_svg]:group-hover:translate-x-1',
      },
    },
  },

  // ============================================================
  // CATEGORY 13: PRODUCT & COMMERCE (82-90)
  // ============================================================

  // --- 82. Product card — e-commerce ---
  {
    id: 'product-card-082',
    name: 'Product Card E-commerce',
    category: 'commerce',
    tags: ['product', 'card', 'ecommerce', 'shop'],
    preview: 'Card sản phẩm: ảnh, tên, giá, rating, add to cart',
    block: {
      type: 'product-card' as const,
      style: {
        border: { radius: 16, width: 1, color: '#e5e7eb' },
        animation: { hoverEffect: 'lift' as const },
        tailwindClasses: 'rounded-2xl border bg-white overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all group [&_img]:aspect-square [&_img]:object-cover [&_img]:group-hover:scale-105 [&_img]:transition-transform [&_.price]:text-2xl [&_.price]:font-black [&_.price]:text-indigo-600 [&_.original-price]:line-through [&_.original-price]:text-gray-400 [&_.original-price]:text-sm',
      },
    },
  },

  // --- 83. Coupon card — copy code ---
  {
    id: 'coupon-card-083',
    name: 'Coupon Code Card',
    category: 'commerce',
    tags: ['coupon', 'code', 'discount', 'copy'],
    preview: 'Card mã giảm giá, dashed border, nút copy',
    block: {
      type: 'coupon' as const,
      style: {
        border: { radius: 12, width: 2, style: 'dashed' as const, color: '#f59e0b' },
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
        tailwindClasses: 'border-2 border-dashed border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-6 [&_.code]:font-mono [&_.code]:text-2xl [&_.code]:font-bold [&_.code]:tracking-wider [&_.code]:bg-white [&_.code]:px-4 [&_.code]:py-2 [&_.code]:rounded-lg [&_.code]:border [&_.code]:border-amber-300',
      },
    },
  },

  // --- 84. Affiliate link card ---
  {
    id: 'affiliate-card-084',
    name: 'Affiliate Product Card',
    category: 'commerce',
    tags: ['affiliate', 'link', 'product', 'review'],
    preview: 'Card sản phẩm affiliate: ảnh, mô tả, giá, nút mua',
    block: {
      type: 'affiliate' as const,
      style: {
        border: { radius: 16, width: 1, color: '#e5e7eb' },
        shadow: { preset: 'md' as const },
        tailwindClasses: 'flex flex-col md:flex-row gap-6 p-6 rounded-2xl border bg-white shadow-md [&_.disclosure]:text-xs [&_.disclosure]:text-gray-400 [&_.disclosure]:mt-2 [&_.disclosure]:italic',
      },
    },
  },

  // ============================================================
  // CATEGORY 14: CHARTS & DATA (85-95)
  // ============================================================

  // --- 85. Chart bar — gradient bars ---
  {
    id: 'chart-bar-085',
    name: 'Bar Chart Gradient',
    category: 'chart',
    tags: ['chart', 'bar', 'gradient', 'data'],
    preview: 'Bar chart với gradient bars, labels, grid lines',
    block: {
      type: 'chart' as const,
      chart: { type: 'bar' as const, title: '', labels: [], datasets: [], showLegend: true, height: 300 },
      style: {
        border: { radius: 16 },
        spacing: { paddingTop: 24, paddingBottom: 24 },
        tailwindClasses: 'bg-white rounded-2xl p-6 border border-gray-200',
      },
    },
  },

  // --- 86. Chart line — dark theme ---
  {
    id: 'chart-line-086',
    name: 'Line Chart Dark Theme',
    category: 'chart',
    tags: ['chart', 'line', 'dark', 'analytics'],
    preview: 'Line chart nền tối, lines neon, gradient fill dưới',
    block: {
      type: 'chart' as const,
      chart: { type: 'line' as const, title: '', labels: [], datasets: [], showLegend: true, height: 300 },
      style: {
        background: { color: '#1e293b' },
        typography: { color: '#e2e8f0' },
        border: { radius: 16 },
        tailwindClasses: 'bg-slate-800 text-slate-200 rounded-2xl p-6',
      },
    },
  },

  // --- 87. Chart pie/doughnut ---
  {
    id: 'chart-doughnut-087',
    name: 'Doughnut Chart Clean',
    category: 'chart',
    tags: ['chart', 'doughnut', 'pie', 'percentage'],
    preview: 'Doughnut chart centered, legend bên phải',
    block: {
      type: 'chart' as const,
      chart: { type: 'doughnut' as const, title: '', labels: [], datasets: [], showLegend: true, height: 250 },
      style: {
        tailwindClasses: 'bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-8',
      },
    },
  },

  // ============================================================
  // CATEGORY 15: SOCIAL & EMBEDS (88-95)
  // ============================================================

  // --- 88. Tweet embed card ---
  {
    id: 'social-tweet-088',
    name: 'Tweet Embed Card',
    category: 'social',
    tags: ['tweet', 'twitter', 'x', 'embed', 'social'],
    preview: 'Tweet embedded card, avatar + handle + content',
    block: {
      type: 'social' as const,
      social: { platform: 'twitter' as const, postId: '', url: '' },
      style: {
        border: { radius: 16, width: 1, color: '#e5e7eb' },
        shadow: { preset: 'sm' as const },
        tailwindClasses: 'max-w-lg mx-auto rounded-2xl border bg-white shadow-sm overflow-hidden p-4',
      },
    },
  },

  // --- 89. Bookmark link preview ---
  {
    id: 'bookmark-preview-089',
    name: 'Bookmark Link Preview',
    category: 'social',
    tags: ['bookmark', 'link', 'preview', 'card', 'og'],
    preview: 'Link preview card: favicon + title + description + image',
    block: {
      type: 'bookmark' as const,
      style: {
        border: { radius: 12, width: 1, color: '#e5e7eb' },
        animation: { hoverEffect: 'lift' as const },
        tailwindClasses: 'flex flex-col md:flex-row rounded-xl border bg-white overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all [&_img]:w-full [&_img]:md:w-48 [&_img]:h-32 [&_img]:object-cover [&_.info]:p-4 [&_.info]:flex-1 [&_.title]:font-bold [&_.title]:line-clamp-2 [&_.desc]:text-sm [&_.desc]:text-gray-500 [&_.desc]:line-clamp-2 [&_.domain]:text-xs [&_.domain]:text-gray-400 [&_.domain]:flex [&_.domain]:items-center [&_.domain]:gap-1 [&_.domain]:mt-2',
      },
    },
  },

  // ============================================================
  // CATEGORY 16: SEPARATORS & DIVIDERS (90-95)
  // ============================================================

  // --- 90. Divider gradient line ---
  {
    id: 'divider-gradient-090',
    name: 'Divider Gradient Line',
    category: 'divider',
    tags: ['divider', 'gradient', 'line', 'separator'],
    preview: 'Đường gradient từ trong suốt → màu → trong suốt',
    block: {
      type: 'separator' as const,
      separator: { style: 'gradient' as const },
      style: { tailwindClasses: 'h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent my-12' },
    },
  },

  // --- 91. Divider with text ---
  {
    id: 'divider-text-091',
    name: 'Divider with Text Center',
    category: 'divider',
    tags: ['divider', 'text', 'center', 'label'],
    preview: 'Line 2 bên + text ở giữa "Xem thêm"',
    block: {
      type: 'separator' as const,
      separator: { style: 'solid' as const, text: 'Xem thêm' },
      style: { tailwindClasses: 'flex items-center gap-4 my-12 before:flex-1 before:h-px before:bg-gray-200 after:flex-1 after:h-px after:bg-gray-200 text-sm text-gray-400 font-medium' },
    },
  },

  // --- 92. Divider icon center ---
  {
    id: 'divider-icon-092',
    name: 'Divider with Icon',
    category: 'divider',
    tags: ['divider', 'icon', 'decorative', 'elegant'],
    preview: 'Line 2 bên + icon ở giữa (star, diamond, etc.)',
    block: {
      type: 'separator' as const,
      separator: { style: 'icon' as const, icon: 'star' },
      style: { tailwindClasses: 'flex items-center gap-4 my-12 before:flex-1 before:h-px before:bg-gray-200 after:flex-1 after:h-px after:bg-gray-200 text-indigo-400' },
    },
  },

  // --- 93. Spacer responsive ---
  {
    id: 'spacer-093',
    name: 'Spacer Responsive',
    category: 'divider',
    tags: ['spacer', 'space', 'gap', 'responsive'],
    preview: 'Khoảng trống tuỳ chỉnh, nhỏ hơn trên mobile',
    block: {
      type: 'spacer' as const,
      spacer: { height: 80 },
      style: {
        responsive: { mobilePadding: '40px 0' },
        tailwindClasses: 'h-20 md:h-24 lg:h-32',
      },
    },
  },

  // ============================================================
  // CATEGORY 17: INTERACTIVE (94-105)
  // ============================================================

  // --- 94. Poll — vote buttons ---
  {
    id: 'poll-094',
    name: 'Poll Vote Buttons',
    category: 'interactive',
    tags: ['poll', 'vote', 'interactive', 'engagement'],
    preview: 'Câu hỏi + options dạng button, progress bar kết quả',
    block: {
      type: 'poll' as const,
      style: {
        border: { radius: 16, width: 1, color: '#e5e7eb' },
        tailwindClasses: 'bg-white rounded-2xl border p-6 [&_.option]:w-full [&_.option]:text-left [&_.option]:p-3 [&_.option]:rounded-xl [&_.option]:border [&_.option]:border-gray-200 [&_.option]:hover:border-indigo-300 [&_.option]:hover:bg-indigo-50 [&_.option]:transition-all [&_.option]:cursor-pointer [&_.option]:mb-2',
      },
    },
  },

  // --- 95. Quiz card ---
  {
    id: 'quiz-095',
    name: 'Quiz Interactive Card',
    category: 'interactive',
    tags: ['quiz', 'trivia', 'interactive', 'fun'],
    preview: 'Quiz card: câu hỏi + 4 đáp án, reveal đáp án đúng',
    block: {
      type: 'quiz' as const,
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' },
        border: { radius: 20 },
        tailwindClasses: 'bg-gradient-to-br from-sky-50 to-blue-50 rounded-[20px] p-8 [&_.question]:text-xl [&_.question]:font-bold [&_.question]:mb-6 [&_.answer]:p-4 [&_.answer]:rounded-xl [&_.answer]:border-2 [&_.answer]:border-transparent [&_.answer]:bg-white [&_.answer]:cursor-pointer [&_.answer]:hover:border-blue-400 [&_.answer]:transition-all [&_.answer]:mb-3',
      },
    },
  },

  // --- 96. Rating stars interactive ---
  {
    id: 'rating-stars-096',
    name: 'Rating Stars Interactive',
    category: 'interactive',
    tags: ['rating', 'stars', 'review', 'interactive'],
    preview: '5 sao tương tác, hover highlight, click rate',
    block: {
      type: 'rating' as const,
      ratingConfig: { maxStars: 5, allowHalf: true },
      style: {
        tailwindClasses: '[&_.star]:text-3xl [&_.star]:cursor-pointer [&_.star]:transition-colors [&_.star.active]:text-amber-400 [&_.star.inactive]:text-gray-300 [&_.star]:hover:text-amber-300',
      },
    },
  },

  // --- 97. Countdown timer ---
  {
    id: 'countdown-097',
    name: 'Countdown Timer Dark',
    category: 'interactive',
    tags: ['countdown', 'timer', 'event', 'launch'],
    preview: 'Đếm ngược ngày:giờ:phút:giây, nền tối, số lớn',
    block: {
      type: 'countdown' as const,
      style: {
        background: { color: '#0f172a' },
        typography: { color: '#ffffff', textAlign: 'center' as const },
        border: { radius: 20 },
        tailwindClasses: 'bg-slate-900 text-white rounded-[20px] p-10 text-center [&_.digits]:flex [&_.digits]:justify-center [&_.digits]:gap-4 [&_.digit-box]:bg-slate-800 [&_.digit-box]:rounded-xl [&_.digit-box]:p-6 [&_.digit-box]:min-w-[80px] [&_.number]:text-4xl [&_.number]:font-black [&_.number]:font-mono [&_.unit]:text-xs [&_.unit]:text-slate-400 [&_.unit]:uppercase [&_.unit]:mt-2',
      },
    },
  },

  // --- 98. Form contact ---
  {
    id: 'form-contact-098',
    name: 'Contact Form Clean',
    category: 'interactive',
    tags: ['form', 'contact', 'input', 'email'],
    preview: 'Form liên hệ: name, email, message, submit button',
    block: {
      type: 'form' as const,
      style: {
        border: { radius: 16, width: 1, color: '#e5e7eb' },
        tailwindClasses: 'bg-white rounded-2xl border p-8 max-w-lg mx-auto [&_input]:w-full [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-3 [&_input]:mb-4 [&_input]:focus:border-indigo-500 [&_input]:focus:ring-2 [&_input]:focus:ring-indigo-200 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-gray-300 [&_textarea]:rounded-lg [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:mb-4',
      },
    },
  },

  // --- 99. Email subscribe ---
  {
    id: 'subscribe-099',
    name: 'Email Subscribe Box',
    category: 'interactive',
    tags: ['subscribe', 'email', 'newsletter', 'cta'],
    preview: 'Box đăng ký email: input + button inline, gradient bg',
    block: {
      type: 'form' as const,
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' },
        typography: { color: '#ffffff', textAlign: 'center' as const },
        border: { radius: 20 },
        tailwindClasses: 'bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-[20px] p-10 text-center [&_.input-group]:flex [&_.input-group]:max-w-md [&_.input-group]:mx-auto [&_.input-group]:mt-6 [&_input]:flex-1 [&_input]:rounded-l-full [&_input]:px-6 [&_input]:py-3 [&_input]:text-gray-900 [&_button]:bg-indigo-600 [&_button]:hover:bg-indigo-700 [&_button]:text-white [&_button]:px-6 [&_button]:py-3 [&_button]:rounded-r-full [&_button]:font-medium [&_button]:transition-colors',
      },
    },
  },

  // --- 100. Reaction emoji bar ---
  {
    id: 'reaction-100',
    name: 'Reaction Emoji Bar',
    category: 'interactive',
    tags: ['reaction', 'emoji', 'like', 'engagement'],
    preview: 'Hàng emoji reactions: 👍❤️😂😮😢🔥 + counter',
    block: {
      type: 'reaction' as const,
      reaction: { reactions: [
        { emoji: '👍', label: 'Like', count: 0 },
        { emoji: '❤️', label: 'Love', count: 0 },
        { emoji: '😂', label: 'Haha', count: 0 },
        { emoji: '😮', label: 'Wow', count: 0 },
        { emoji: '🔥', label: 'Fire', count: 0 },
      ]},
      style: {
        tailwindClasses: 'flex items-center gap-2 py-4 [&_button]:flex [&_button]:items-center [&_button]:gap-1 [&_button]:px-3 [&_button]:py-2 [&_button]:rounded-full [&_button]:bg-gray-100 [&_button]:hover:bg-gray-200 [&_button]:transition-colors [&_button]:cursor-pointer [&_button]:text-sm [&_.count]:text-gray-500 [&_.count]:text-xs',
      },
    },
  },

  // ============================================================
  // CATEGORY 18: LAYOUT & CONTAINERS (101-115)
  // ============================================================

  // --- 101. Container centered narrow ---
  {
    id: 'container-narrow-101',
    name: 'Container Narrow Centered',
    category: 'layout',
    tags: ['container', 'narrow', 'centered', 'prose'],
    preview: 'Container max-width 680px centered, cho long-form reading',
    block: {
      type: 'container' as const,
      style: {
        layout: { maxWidth: '680px', marginLeft: 'auto' as const, marginRight: 'auto' as const },
        tailwindClasses: 'max-w-[680px] mx-auto px-4',
      },
    },
  },

  // --- 102. Container full-bleed ---
  {
    id: 'container-fullbleed-102',
    name: 'Container Full Bleed',
    category: 'layout',
    tags: ['container', 'full-bleed', 'edge-to-edge', 'wide'],
    preview: 'Container tràn hết width, không padding, cho ảnh/video',
    block: {
      type: 'container' as const,
      style: {
        layout: { width: '100vw', marginLeft: 'calc(-50vw + 50%)' as any },
        tailwindClasses: 'w-screen relative left-1/2 right-1/2 -mx-[50vw]',
      },
    },
  },

  // --- 103. 2 columns 50/50 ---
  {
    id: 'cols-50-50-103',
    name: '2 Columns 50/50',
    category: 'layout',
    tags: ['columns', '2-col', '50-50', 'split'],
    preview: '2 cột đều nhau, responsive stack trên mobile',
    block: {
      type: 'columns' as const,
      columns: { columns: [{ content: '', width: 50 }, { content: '', width: 50 }], gap: 32 },
      style: {
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-2 gap-8',
      },
    },
  },

  // --- 104. 3 columns equal ---
  {
    id: 'cols-3-equal-104',
    name: '3 Columns Equal',
    category: 'layout',
    tags: ['columns', '3-col', 'equal', 'grid'],
    preview: '3 cột đều, responsive 1 cột mobile, 2 cột tablet',
    block: {
      type: 'columns' as const,
      columns: { columns: [{ content: '' }, { content: '' }, { content: '' }], gap: 24 },
      style: {
        responsive: { mobileGridCols: 1, tabletGridCols: 2 },
        tailwindClasses: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      },
    },
  },

  // --- 105. Sidebar layout — content + sidebar ---
  {
    id: 'layout-sidebar-105',
    name: 'Content + Sidebar Layout',
    category: 'layout',
    tags: ['sidebar', 'layout', 'blog', 'asymmetric'],
    preview: 'Content 70% trái + sidebar 30% phải, sticky sidebar',
    block: {
      type: 'columns' as const,
      columns: { columns: [{ content: '', width: 70 }, { content: '', width: 30 }], gap: 32 },
      style: {
        tailwindClasses: 'grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 [&>*:last-child]:sticky [&>*:last-child]:top-24',
      },
    },
  },

  // ============================================================
  // CATEGORY 19: BADGES & TAGS (106-115)
  // ============================================================

  // --- 106. Badge group colorful ---
  {
    id: 'badges-colorful-106',
    name: 'Badge Group Colorful',
    category: 'badge',
    tags: ['badges', 'tags', 'colorful', 'labels'],
    preview: 'Nhóm badges nhiều màu: xanh, đỏ, tím, vàng',
    block: {
      type: 'badges' as const,
      badgeGroup: { badges: [] },
      style: {
        tailwindClasses: 'flex flex-wrap gap-2 [&_.badge]:px-3 [&_.badge]:py-1 [&_.badge]:rounded-full [&_.badge]:text-xs [&_.badge]:font-medium [&_.badge-blue]:bg-blue-100 [&_.badge-blue]:text-blue-700 [&_.badge-red]:bg-red-100 [&_.badge-red]:text-red-700 [&_.badge-green]:bg-emerald-100 [&_.badge-green]:text-emerald-700 [&_.badge-purple]:bg-purple-100 [&_.badge-purple]:text-purple-700 [&_.badge-amber]:bg-amber-100 [&_.badge-amber]:text-amber-700',
      },
    },
  },

  // --- 107. Badge outline ---
  {
    id: 'badges-outline-107',
    name: 'Badge Group Outline',
    category: 'badge',
    tags: ['badges', 'outline', 'border', 'minimal'],
    preview: 'Badges outline border, không fill background',
    block: {
      type: 'badges' as const,
      style: {
        tailwindClasses: 'flex flex-wrap gap-2 [&_.badge]:px-3 [&_.badge]:py-1 [&_.badge]:rounded-full [&_.badge]:text-xs [&_.badge]:font-medium [&_.badge]:border [&_.badge]:border-gray-300 [&_.badge]:text-gray-600 [&_.badge]:hover:border-indigo-400 [&_.badge]:hover:text-indigo-600 [&_.badge]:transition-colors [&_.badge]:cursor-pointer',
      },
    },
  },

  // ============================================================
  // CATEGORY 20: MISC & SPECIAL (108-120)
  // ============================================================

  // --- 108. TOC auto — table of contents ---
  {
    id: 'toc-auto-108',
    name: 'Table of Contents Auto',
    category: 'misc',
    tags: ['toc', 'contents', 'navigation', 'auto'],
    preview: 'Mục lục tự động từ headings, sticky sidebar style',
    block: {
      type: 'toc' as const,
      tocConfig: { title: 'Mục lục', maxLevel: 3 },
      style: {
        border: { radius: 12, width: 1, color: '#e5e7eb' },
        tailwindClasses: 'bg-gray-50 rounded-xl border p-5 [&_h3]:font-bold [&_h3]:mb-3 [&_ul]:space-y-2 [&_a]:text-sm [&_a]:text-gray-600 [&_a]:hover:text-indigo-600 [&_a]:transition-colors [&_.level-2]:pl-0 [&_.level-3]:pl-4 [&_.active]:text-indigo-600 [&_.active]:font-medium',
      },
    },
  },

  // --- 109. Changelog entry ---
  {
    id: 'changelog-109',
    name: 'Changelog Entry Card',
    category: 'misc',
    tags: ['changelog', 'version', 'release', 'update'],
    preview: 'Version badge + date + list changes by type',
    block: {
      type: 'changelog' as const,
      style: {
        tailwindClasses: 'border-l-4 border-indigo-500 pl-6 py-4 [&_.version]:inline-block [&_.version]:bg-indigo-100 [&_.version]:text-indigo-700 [&_.version]:px-3 [&_.version]:py-1 [&_.version]:rounded-full [&_.version]:text-sm [&_.version]:font-bold [&_.date]:text-sm [&_.date]:text-gray-400 [&_.date]:ml-3 [&_.tag-added]:text-emerald-600 [&_.tag-changed]:text-blue-600 [&_.tag-fixed]:text-amber-600 [&_.tag-removed]:text-red-600',
      },
    },
  },

  // --- 110. Kanban board ---
  {
    id: 'kanban-110',
    name: 'Kanban Board Trello',
    category: 'misc',
    tags: ['kanban', 'board', 'trello', 'project'],
    preview: 'Board 3 cột: To Do, In Progress, Done',
    block: {
      type: 'kanban' as const,
      style: {
        tailwindClasses: 'flex gap-4 overflow-x-auto pb-4 [&_.column]:min-w-[280px] [&_.column]:flex-shrink-0 [&_.column]:bg-gray-100 [&_.column]:rounded-xl [&_.column]:p-4 [&_.column-header]:font-bold [&_.column-header]:mb-3 [&_.card]:bg-white [&_.card]:rounded-lg [&_.card]:p-3 [&_.card]:shadow-sm [&_.card]:mb-2 [&_.card]:border [&_.card]:border-gray-200 [&_.card]:cursor-grab [&_.card]:hover:shadow-md [&_.card]:transition-shadow',
      },
    },
  },

  // --- 111. PDF embed viewer ---
  {
    id: 'pdf-embed-111',
    name: 'PDF Embed Viewer',
    category: 'misc',
    tags: ['pdf', 'embed', 'document', 'viewer'],
    preview: 'PDF viewer embedded, toolbar top, scroll pages',
    block: {
      type: 'pdf' as const,
      style: {
        border: { radius: 12, width: 1, color: '#e5e7eb' },
        tailwindClasses: 'rounded-xl border overflow-hidden [&_iframe]:w-full [&_iframe]:h-[600px] [&_iframe]:border-0',
      },
    },
  },

  // --- 112. Map embed ---
  {
    id: 'map-embed-112',
    name: 'Google Map Embed Rounded',
    category: 'misc',
    tags: ['map', 'google', 'embed', 'location'],
    preview: 'Google Maps embed, bo góc, shadow, caption',
    block: {
      type: 'map' as const,
      style: {
        border: { radius: 16 },
        shadow: { preset: 'md' as const },
        tailwindClasses: 'rounded-2xl overflow-hidden shadow-md [&_iframe]:w-full [&_iframe]:h-[400px] [&_iframe]:border-0',
      },
    },
  },

  // --- 113. Toggle/Spoiler ---
  {
    id: 'toggle-spoiler-113',
    name: 'Toggle Spoiler Block',
    category: 'misc',
    tags: ['toggle', 'spoiler', 'hidden', 'reveal'],
    preview: 'Click để mở/đóng nội dung ẩn, icon rotate',
    block: {
      type: 'toggle' as const,
      toggle: { title: '', content: '', defaultOpen: false },
      style: {
        border: { radius: 12, width: 1, color: '#e5e7eb' },
        tailwindClasses: 'border rounded-xl overflow-hidden [&_summary]:p-4 [&_summary]:cursor-pointer [&_summary]:font-medium [&_summary]:flex [&_summary]:justify-between [&_summary]:items-center [&_summary]:hover:bg-gray-50 [&_summary]:transition-colors [&_.content]:p-4 [&_.content]:border-t [&_.content]:border-gray-200 [&_.content]:bg-gray-50/50',
      },
    },
  },

  // --- 114. Calculator interactive ---
  {
    id: 'calculator-114',
    name: 'Interactive Calculator',
    category: 'misc',
    tags: ['calculator', 'compute', 'interactive', 'tool'],
    preview: 'Fields input + realtime calculated result',
    block: {
      type: 'calculator' as const,
      style: {
        background: { type: 'gradient' as const, gradient: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' },
        border: { radius: 20 },
        tailwindClasses: 'bg-gradient-to-br from-slate-50 to-indigo-50 rounded-[20px] p-8 [&_input]:border [&_input]:border-gray-300 [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2 [&_.result]:text-3xl [&_.result]:font-black [&_.result]:text-indigo-600 [&_.result]:mt-4',
      },
    },
  },

  // --- 115. Lottie animation ---
  {
    id: 'lottie-115',
    name: 'Lottie Animation Block',
    category: 'misc',
    tags: ['lottie', 'animation', 'motion', 'illustration'],
    preview: 'Lottie JSON animation centered, loop, responsive',
    block: {
      type: 'lottie' as const,
      lottie: { src: '', loop: true, autoplay: true },
      style: {
        layout: { maxWidth: '400px', marginLeft: 'auto' as const, marginRight: 'auto' as const },
        tailwindClasses: 'max-w-[400px] mx-auto',
      },
    },
  },

  // ============================================================
  // CATEGORY 21: TEAM & PROFILE (116-125)
  // ============================================================

  // --- 116. Team grid 4 columns ---
  {
    id: 'team-grid-116',
    name: 'Team Grid 4 Members',
    category: 'team',
    tags: ['team', 'grid', 'members', 'about'],
    preview: 'Grid 4 avatar tròn + tên + role, hover social links',
    block: {
      type: 'team' as const,
      team: { members: [], layout: 'grid' as const, columns: 4 },
      style: {
        tailwindClasses: 'grid grid-cols-2 md:grid-cols-4 gap-8 [&_.member]:text-center [&_img]:w-24 [&_img]:h-24 [&_img]:rounded-full [&_img]:mx-auto [&_img]:mb-3 [&_img]:object-cover [&_.name]:font-bold [&_.role]:text-sm [&_.role]:text-gray-500',
      },
    },
  },

  // --- 117. Profile card horizontal ---
  {
    id: 'profile-horizontal-117',
    name: 'Profile Card Horizontal',
    category: 'team',
    tags: ['profile', 'horizontal', 'author', 'bio'],
    preview: 'Avatar trái + name + bio + social links phải',
    block: {
      type: 'team' as const,
      team: { members: [], layout: 'list' as const },
      style: {
        tailwindClasses: 'flex items-center gap-6 p-6 bg-white rounded-2xl border border-gray-200 [&_img]:w-20 [&_img]:h-20 [&_img]:rounded-full [&_img]:object-cover [&_.name]:font-bold [&_.name]:text-lg [&_.role]:text-indigo-600 [&_.role]:text-sm [&_.bio]:text-gray-600 [&_.bio]:text-sm [&_.bio]:mt-1',
      },
    },
  },

  // ============================================================
  // CATEGORY 22: REVIEW & RATING (118-125)
  // ============================================================

  // --- 118. Review card full — pros/cons ---
  {
    id: 'review-full-118',
    name: 'Review Card Full Pros Cons',
    category: 'review',
    tags: ['review', 'pros', 'cons', 'rating', 'full'],
    preview: 'Score badge, summary, pros list xanh, cons list đỏ',
    block: {
      type: 'review' as const,
      style: {
        border: { radius: 16, width: 1, color: '#e5e7eb' },
        tailwindClasses: 'bg-white rounded-2xl border p-6 [&_.score]:w-16 [&_.score]:h-16 [&_.score]:rounded-2xl [&_.score]:bg-indigo-600 [&_.score]:text-white [&_.score]:flex [&_.score]:items-center [&_.score]:justify-center [&_.score]:text-2xl [&_.score]:font-black [&_.pro]:text-emerald-600 [&_.pro]:before:content-["✓_"] [&_.con]:text-red-500 [&_.con]:before:content-["✕_"]',
      },
    },
  },

  // --- 119. Review comparison table ---
  {
    id: 'review-table-119',
    name: 'Review Comparison Table',
    category: 'review',
    tags: ['review', 'comparison', 'table', 'detailed'],
    preview: 'Bảng review chi tiết: feature, score bar, verdict',
    block: {
      type: 'review' as const,
      style: {
        tailwindClasses: 'rounded-2xl border border-gray-200 overflow-hidden [&_table]:w-full [&_th]:bg-gray-50 [&_th]:p-3 [&_th]:text-left [&_td]:p-3 [&_td]:border-t [&_td]:border-gray-100 [&_.score-bar]:h-2 [&_.score-bar]:bg-gray-200 [&_.score-bar]:rounded-full [&_.score-fill]:h-full [&_.score-fill]:bg-indigo-500 [&_.score-fill]:rounded-full',
      },
    },
  },

  // --- 120. Review mini card ---
  {
    id: 'review-mini-120',
    name: 'Review Mini Card Inline',
    category: 'review',
    tags: ['review', 'mini', 'inline', 'compact'],
    preview: 'Review compact 1 dòng: ảnh + tên + stars + score',
    block: {
      type: 'review' as const,
      style: {
        tailwindClasses: 'flex items-center gap-4 p-4 bg-gray-50 rounded-xl [&_img]:w-12 [&_img]:h-12 [&_img]:rounded-lg [&_img]:object-cover [&_.stars]:text-amber-400 [&_.score]:bg-indigo-600 [&_.score]:text-white [&_.score]:px-2 [&_.score]:py-1 [&_.score]:rounded-lg [&_.score]:text-sm [&_.score]:font-bold',
      },
    },
  },

];

// Helper: lấy templates theo category
export function getTemplatesByCategory(category: string) {
  return BLOCK_TEMPLATES.filter(t => t.category === category);
}

// Helper: search templates
export function searchTemplates(query: string) {
  const q = query.toLowerCase();
  return BLOCK_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q)) ||
    t.preview.toLowerCase().includes(q)
  );
}

// Helper: lấy tất cả categories
export function getTemplateCategories() {
  const cats = new Set(BLOCK_TEMPLATES.map(t => t.category));
  return Array.from(cats);
}

// Export total count
export const TOTAL_TEMPLATES = BLOCK_TEMPLATES.length;
