/**
 * Seed 10 real articles with contentBlocks, real Unsplash images, FAQ, 2-3k words each
 * Run: cd post_be && npx ts-node --transpile-only scripts/seed-articles.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Post } from '../src/models/post.model';
import { Category } from '../src/models/category.model';
import { Author } from '../src/models/author.model';

// ─── Block helpers ──────────────────────────────────────────────────────
let bid = 0;
const id = () => `blk-${++bid}`;
const h2 = (text: string) => ({ id: id(), type: 'heading' as const, level: 2, text, anchor: text.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]+/gi, '-').replace(/^-|-$/g, '') });
const h3 = (text: string) => ({ id: id(), type: 'heading' as const, level: 3, text, anchor: text.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]+/gi, '-').replace(/^-|-$/g, '') });
const p = (text: string) => ({ id: id(), type: 'paragraph' as const, text });
const img = (url: string, alt: string, caption?: string) => ({ id: id(), type: 'image' as const, url, alt, caption });
const ul = (items: string[]) => ({ id: id(), type: 'list' as const, style: 'unordered' as const, items });
const ol = (items: string[]) => ({ id: id(), type: 'list' as const, style: 'ordered' as const, items });
const quote = (text: string) => ({ id: id(), type: 'quote' as const, text });
const codeBlock = (lang: string, c: string) => ({ id: id(), type: 'code' as const, language: lang, code: c });
const divider = () => ({ id: id(), type: 'divider' as const });
const tbl = (headers: string[], rows: string[][]) => ({ id: id(), type: 'table' as const, headers, rows });

// ─── Authors ────────────────────────────────────────────────────────────
const AUTHORS = [
  { name: 'Nguyễn Minh Trí', slug: 'nguyen-minh-tri', jobTitle: 'AI Research Editor', bio: 'Chuyên gia nghiên cứu AI với 8 năm kinh nghiệm tại FPT AI Center.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', expertise: ['AI', 'Machine Learning', 'NLP'] },
  { name: 'Trần Thu Hà', slug: 'tran-thu-ha', jobTitle: 'Senior Tech Reporter', bio: 'Nhà báo công nghệ 10 năm theo dõi thị trường AI Đông Nam Á.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', expertise: ['Startups', 'FinTech', 'AI Policy'] },
  { name: 'Lê Hoàng Nam', slug: 'le-hoang-nam', jobTitle: 'Developer Advocate', bio: 'Full-stack developer và AI enthusiast.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', expertise: ['Python', 'LangChain', 'React'] },
  { name: 'Phạm Thanh Thảo', slug: 'pham-thanh-thao', jobTitle: 'Health-Tech Analyst', bio: 'Bác sĩ chuyên khoa và nhà phân tích y tế số.', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', expertise: ['HealthTech', 'Medical AI'] },
  { name: 'Đỗ Quang Huy', slug: 'do-quang-huy', jobTitle: 'Cybersecurity Editor', bio: 'Chuyên gia an ninh mạng, cựu white-hat hacker.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', expertise: ['Cybersecurity', 'AI Safety'] },
];

// ─── 10 Articles ────────────────────────────────────────────────────────
const ARTICLES = [
  {
    title: 'OpenAI ra mắt GPT-5: Bước nhảy vọt về khả năng suy luận trừu tượng',
    slug: 'openai-ra-mat-gpt-5-buoc-nhay-vot-suy-luan',
    excerpt: 'GPT-5 đánh dấu bước tiến lớn với khả năng suy luận đa tầng, context 2 triệu token, và tốc độ nhanh gấp 3 lần GPT-4.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    imageAlt: 'Trung tâm dữ liệu AI hiện đại với mạng nơ-ron phát sáng',
    catSlug: 'thoi-su', authorIdx: 0, isFeatured: true, isBreaking: true,
    tags: ['GPT-5', 'OpenAI', 'AI', 'Suy luận'],
    faq: [
      { question: 'GPT-5 khác GPT-4 ở điểm nào?', answer: 'GPT-5 suy luận trừu tượng vượt trội, context 2M token (gấp 15 lần), inference nhanh gấp 3, và đạt 94.7% trên benchmark toán đại học.' },
      { question: 'GPT-5 mở cho công chúng khi nào?', answer: 'API developer từ tháng 5/2026, ChatGPT Plus từ tháng 6/2026.' },
    ],
    blocks: [
      h2('Tổng quan về GPT-5'),
      p('Ngày 1 tháng 4 năm 2026, OpenAI chính thức công bố GPT-5 — thế hệ mô hình ngôn ngữ lớn mới nhất với những cải tiến đột phá về khả năng suy luận trừu tượng. Đây được xem là bước nhảy vọt lớn nhất kể từ khi GPT-4 ra mắt vào năm 2023, đánh dấu một cột mốc quan trọng trong hành trình phát triển trí tuệ nhân tạo tổng quát (AGI).'),
      p('Theo Sam Altman, CEO của OpenAI, GPT-5 không chỉ đơn thuần là phiên bản nâng cấp mà là một "paradigm shift" — sự thay đổi hoàn toàn về cách mô hình AI xử lý thông tin. Khả năng suy luận đa tầng (multi-layer reasoning) cho phép GPT-5 giải quyết các vấn đề phức tạp mà trước đây chỉ con người mới có thể xử lý được một cách hiệu quả.'),
      p('Đặc biệt, GPT-5 được thiết kế với triết lý "think before you speak" — mô hình dành thời gian phân tích và lập kế hoạch trước khi đưa ra câu trả lời, thay vì phản hồi ngay lập tức như các phiên bản trước. Điều này giúp giảm đáng kể tỷ lệ "hallucination" — vấn đề nhức nhối nhất của các LLM hiện tại.'),
      img('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&h=560&fit=crop', 'So sánh benchmark GPT-4 vs GPT-5', 'Biểu đồ hiệu suất GPT-5 trên các benchmark chính'),

      h2('Những cải tiến đột phá'),
      h3('Suy luận trừu tượng đa tầng'),
      p('GPT-5 sử dụng kiến trúc "Chain-of-Thought 2.0" — hệ thống suy luận phân tầng cho phép mô hình chia nhỏ vấn đề phức tạp thành các bước logic, kiểm tra tính nhất quán giữa các bước, và tự điều chỉnh khi phát hiện lỗi. Trong các bài kiểm tra toán học cấp đại học (MATH-500), GPT-5 đạt 94.7% chính xác, so với 67.2% của GPT-4 — một bước nhảy ấn tượng.'),
      p('Điểm đặc biệt là khả năng "meta-reasoning" — GPT-5 có thể suy nghĩ về cách suy nghĩ, lựa chọn chiến lược giải quyết vấn đề phù hợp nhất trước khi bắt đầu xử lý. Khi gặp bài toán hình học, mô hình có thể quyết định sử dụng phương pháp tọa độ hay phương pháp véc-tơ tùy theo tính chất bài toán, thay vì áp dụng một phương pháp duy nhất cho mọi trường hợp.'),

      h3('Context window 2 triệu token'),
      p('GPT-5 hỗ trợ cửa sổ ngữ cảnh lên đến 2 triệu token — tương đương khoảng 3.000 trang sách. Điều này mở ra vô số ứng dụng thực tế: phân tích toàn bộ mã nguồn của một dự án phần mềm lớn trong một lần chạy, đọc hiểu và so sánh nhiều văn bản pháp luật phức tạp, hoặc xử lý hàng ngàn email doanh nghiệp trong một truy vấn duy nhất.'),
      p('Trong thực tế, context window lớn giúp GPT-5 duy trì mạch logic xuyên suốt các cuộc hội thoại dài mà không bị "quên" thông tin đã đề cập trước đó — vấn đề phổ biến ở GPT-4 khi cuộc trò chuyện vượt quá 20-30 lượt trao đổi.'),
      tbl(['Đặc điểm', 'GPT-4', 'GPT-5'], [
        ['Context window', '128K tokens', '2M tokens'],
        ['Suy luận toán học (MATH-500)', '67.2%', '94.7%'],
        ['Coding (HumanEval)', '87.1%', '96.4%'],
        ['Đa ngôn ngữ (MMLU)', '85%', '97%'],
        ['Tốc độ inference', '~40 token/s', '~120 token/s'],
        ['Hallucination rate', '~15%', '~3%'],
      ]),

      h3('Khả năng đa phương thức nâng cao'),
      p('GPT-5 không chỉ xử lý văn bản và hình ảnh mà còn hiểu video, âm thanh, và dữ liệu 3D. Mô hình có thể phân tích một đoạn video dài 2 giờ, tóm tắt nội dung, trích xuất thông tin quan trọng, và trả lời câu hỏi về bất kỳ khung hình nào. Khả năng này đặc biệt hữu ích trong giáo dục (phân tích bài giảng), y tế (đọc kết quả siêu âm), và an ninh (giám sát video).'),
      img('https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1000&h=560&fit=crop', 'Khả năng đa phương thức của GPT-5', 'GPT-5 xử lý đồng thời văn bản, hình ảnh, video và âm thanh'),

      h2('Tác động đến các ngành công nghiệp'),
      p('McKinsey dự báo GPT-5 có tiềm năng tự động hóa thêm 30% các tác vụ tri thức. Trong ngành y tế, mô hình hỗ trợ chẩn đoán bệnh phức tạp với độ chính xác ngang bác sĩ chuyên khoa 15 năm kinh nghiệm. Trong pháp luật, GPT-5 phân tích hồ sơ pháp lý và soạn thảo văn bản luật tự động, giảm 60% thời gian cho luật sư. Giáo dục được cá nhân hóa triệt để với lộ trình học riêng cho từng học sinh.'),
      ul([
        'Y tế: Hỗ trợ chẩn đoán bệnh phức tạp, phân tích kết quả xét nghiệm, và đề xuất phác đồ điều trị',
        'Pháp luật: Phân tích hồ sơ pháp lý hàng ngàn trang, tìm precedent và soạn thảo hợp đồng tự động',
        'Giáo dục: Tạo lộ trình học cá nhân hóa, giải thích khái niệm bằng nhiều cách khác nhau',
        'Tài chính: Phân tích rủi ro đa chiều, dự báo thị trường với ngữ cảnh kinh tế vĩ mô đầy đủ',
        'Phần mềm: Viết, kiểm thử, và deploy code cho các dự án phức tạp hàng triệu dòng',
      ]),

      h2('Phản ứng từ cộng đồng công nghệ'),
      quote('"GPT-5 không chỉ là một mô hình AI — nó là bước đệm đầu tiên hướng đến AGI thực sự. Chúng ta đang chứng kiến lịch sử." — Andrej Karpathy, cựu VP AI tại Tesla'),
      p('Cộng đồng developer Việt Nam đón nhận GPT-5 với sự hào hứng. Tại hội nghị Vietnam AI Summit 2026, hơn 3.000 developer tham dự workshop về GPT-5, và FPT, VinAI, VNG đã đăng ký early access để tích hợp vào sản phẩm. FPT dự kiến sử dụng GPT-5 nâng cấp trợ lý ảo FPT.AI, trong khi VinAI tập trung vào ứng dụng trong xe tự lái VinFast.'),
      p('Tuy nhiên, các chuyên gia cũng cảnh báo về mặt trái: nguy cơ thất nghiệp hàng loạt ở các vị trí tri thức cấp thấp, rủi ro deepfake ngày càng tinh vi, và vấn đề phụ thuộc quá mức vào công nghệ Mỹ. Việt Nam cần chiến lược rõ ràng để tận dụng GPT-5 mà vẫn phát triển năng lực AI nội địa.'),
      divider(),

      h2('Kết luận và triển vọng'),
      p('GPT-5 đánh dấu bước ngoặt quan trọng trong lịch sử AI. Với suy luận vượt trội, context khổng lồ, và tốc độ nhanh gấp 3, nó hứa hẹn mở ra vô số ứng dụng mới. OpenAI cam kết triển khai có trách nhiệm với các biện pháp an toàn nghiêm ngặt. Thế giới đang bước vào kỷ nguyên mới của trí tuệ nhân tạo — và GPT-5 chính là cánh cửa mở ra kỷ nguyên đó.'),
      p('Đối với Việt Nam, GPT-5 vừa là cơ hội vừa là thách thức. Cơ hội để tăng tốc chuyển đổi số, nâng cao năng suất lao động, và phát triển các sản phẩm AI cạnh tranh quốc tế. Thách thức là phải đảm bảo an toàn, đạo đức, và phát triển bền vững trong kỷ nguyên AI siêu mạnh.'),
    ],
  },

  {
    title: 'Claude Code: Trợ lý lập trình AI đang thay đổi cách developer Việt Nam làm việc',
    slug: 'claude-code-tro-ly-lap-trinh-ai-developer-viet-nam',
    excerpt: 'Hướng dẫn chi tiết sử dụng Claude Code — công cụ lập trình AI của Anthropic giúp tăng năng suất gấp 3 lần cho developer.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
    imageAlt: 'Màn hình code editor với AI assistant',
    catSlug: 'cong-nghe', authorIdx: 2, isFeatured: true,
    tags: ['Claude Code', 'Anthropic', 'AI Coding', 'Developer Tools'],
    faq: [
      { question: 'Claude Code miễn phí không?', answer: 'Có bản miễn phí giới hạn. Pro $20/tháng, Max $100/tháng.' },
      { question: 'Hỗ trợ ngôn ngữ nào?', answer: 'Python, JavaScript, TypeScript, Java, Go, Rust, C++, Ruby, PHP và nhiều hơn.' },
    ],
    blocks: [
      h2('Claude Code là gì?'),
      p('Claude Code là công cụ lập trình dòng lệnh (CLI) do Anthropic phát triển, cho phép developer tương tác với AI trực tiếp trong terminal để viết code, debug, refactor, và quản lý dự án. Ra mắt chính thức vào đầu năm 2025, Claude Code nhanh chóng trở thành lựa chọn hàng đầu của nhiều developer Việt Nam nhờ khả năng hiểu ngữ cảnh dự án sâu và tốc độ xử lý nhanh vượt trội.'),
      p('Khác với các AI coding assistant truyền thống chỉ gợi ý code theo dòng, Claude Code hiểu toàn bộ cấu trúc dự án — đọc file, chạy lệnh terminal, tạo commit Git, và thậm chí tự deploy ứng dụng. Nó hoạt động như một đồng nghiệp senior developer luôn sẵn sàng hỗ trợ 24/7, hiểu business context và technical debt của dự án.'),
      img('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1000&h=560&fit=crop', 'Developer sử dụng terminal Claude Code', 'Giao diện Claude Code trong terminal'),

      h2('Cài đặt và thiết lập'),
      h3('Yêu cầu hệ thống'),
      ul(['Node.js 18 trở lên', 'macOS, Linux, hoặc Windows (WSL2)', 'Terminal hỗ trợ Unicode', 'Tài khoản Anthropic (miễn phí hoặc Pro)']),
      h3('Cài đặt nhanh'),
      codeBlock('bash', 'npm install -g @anthropic-ai/claude-code\nclaude login\ncd my-project && claude'),
      p('Sau khi cài đặt, bạn chỉ cần mở terminal trong thư mục dự án và gõ "claude" để bắt đầu. Claude Code sẽ tự động đọc cấu trúc dự án, phân tích các file cấu hình (package.json, tsconfig, .env), và hiểu ngữ cảnh công nghệ đang sử dụng — không cần cấu hình gì thêm.'),

      h2('5 tính năng nổi bật'),
      h3('1. Hiểu ngữ cảnh toàn bộ dự án'),
      p('Claude Code không chỉ đọc file đang mở mà duyệt toàn bộ codebase để hiểu kiến trúc, patterns, và conventions. Khi bạn yêu cầu thêm tính năng mới, nó tự tìm file liên quan, đọc code hiện có, và viết code phù hợp với style hiện tại của dự án. Ví dụ: "Thêm API endpoint /api/users/:id" — Claude Code sẽ tìm các route đã có, copy pattern, tạo controller + service + DTO + test đúng chuẩn dự án.'),

      h3('2. Chạy lệnh terminal trực tiếp'),
      p('Claude Code chạy shell commands, npm scripts, test suites, và build commands. Workflow liền mạch: viết code → chạy test → fix lỗi → commit trong một phiên chat duy nhất, không cần chuyển tab hay mở terminal riêng.'),

      h3('3. Multi-file editing'),
      p('Sửa nhiều file cùng lúc — thêm React component, cập nhật routes, sửa TypeScript types, và update tests trong một lần chạy. Mỗi thay đổi hiển thị diff rõ ràng để bạn review trước khi chấp nhận, đảm bảo kiểm soát hoàn toàn.'),

      h3('4. Git integration sâu'),
      p('Tích hợp Git: tạo branch, commit với conventional commits, tạo PR description tự động, và review code từ teammate. Claude Code hiểu git history và sử dụng thông tin đó để đưa ra quyết định coding tốt hơn — ví dụ, khi fix bug, nó sẽ tìm commit gây ra bug để hiểu root cause.'),

      h3('5. MCP Server support'),
      p('Model Context Protocol (MCP) cho phép kết nối với database, API docs, Figma, Jira, và nhiều hơn nữa. Bạn có thể hỏi Claude Code "Lấy danh sách issues từ Jira sprint hiện tại" hoặc "Tạo component theo design trong Figma" — tất cả ngay trong terminal.'),
      img('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&h=560&fit=crop', 'Workspace phát triển phần mềm hiện đại', 'Môi trường phát triển tích hợp AI'),

      h2('So sánh với các công cụ khác'),
      tbl(['Tính năng', 'Claude Code', 'GitHub Copilot', 'Cursor'], [
        ['Terminal native', '✅', '❌', '❌'],
        ['Đọc toàn bộ codebase', '✅', '⚠️ Giới hạn', '✅'],
        ['Chạy commands', '✅', '❌', '✅'],
        ['Git integration sâu', '✅', '⚠️ Cơ bản', '⚠️ Cơ bản'],
        ['MCP support', '✅', '❌', '❌'],
        ['Giá/tháng', '$20-100', '$10-19', '$20-40'],
      ]),

      h2('Tips sử dụng hiệu quả'),
      ol([
        'Tạo file CLAUDE.md ở root dự án để hướng dẫn Claude về conventions và rules của dự án',
        'Sử dụng /plan trước khi implement tính năng phức tạp để có roadmap rõ ràng',
        'Tận dụng slash commands: /fix, /test, /commit, /review để tiết kiệm thời gian',
        'Cấu hình hooks để tự động lint và format code sau mỗi edit, đảm bảo code luôn sạch',
        'Dùng subagents cho các task cần nghiên cứu sâu hoặc song song nhiều file',
      ]),
      divider(),
      h2('Kết luận'),
      p('Claude Code đang nhanh chóng trở thành công cụ không thể thiếu cho developer Việt Nam. Với khả năng hiểu ngữ cảnh sâu, tốc độ nhanh, và tích hợp liền mạch, nó giúp tăng năng suất gấp 2-3 lần mà không hy sinh chất lượng code. Nếu bạn chưa thử, hãy cài đặt ngay hôm nay.'),
    ],
  },

  {
    title: 'Việt Nam đón làn sóng đầu tư AI 2.8 tỷ USD: Cơ hội vàng cho startup',
    slug: 'viet-nam-lan-song-dau-tu-ai-2-8-ty-usd-startup',
    excerpt: 'Phân tích chi tiết dòng vốn đầu tư AI vào Việt Nam năm 2026, top 5 lĩnh vực tiềm năng và thách thức cho hệ sinh thái startup.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    imageAlt: 'Biểu đồ tăng trưởng đầu tư AI tại Việt Nam',
    catSlug: 'kinh-doanh', authorIdx: 1, isFeatured: true,
    tags: ['Đầu tư', 'Startup', 'AI Việt Nam', 'Venture Capital'],
    faq: [
      { question: 'Startup AI nào tại VN nhận vốn nhiều nhất?', answer: 'VinAI dẫn đầu 300M USD, Alan AI 85M USD, Trusting Social 65M USD.' },
    ],
    blocks: [
      h2('Bức tranh đầu tư AI Việt Nam 2026'),
      p('Năm 2026 đánh dấu cột mốc lịch sử cho hệ sinh thái AI Việt Nam khi tổng vốn đầu tư đạt 2.8 tỷ USD — tăng 340% so với 2024. Theo Do Ventures, Việt Nam là điểm đến đầu tư AI lớn thứ 3 ASEAN, sau Singapore và Indonesia.'),
      p('Động lực đến từ nguồn nhân lực STEM dồi dào (500K+ kỹ sư CNTT), chi phí thấp hơn Singapore 40-60%, và Chiến lược quốc gia về AI đến 2030. Các quỹ đầu tư lớn như Sequoia, GIC, Temasek đều tăng cường hiện diện tại Việt Nam.'),
      img('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&h=560&fit=crop', 'Dashboard phân tích đầu tư', 'Biểu đồ dòng vốn AI vào Việt Nam 2022-2026'),

      h2('Top 5 lĩnh vực thu hút vốn'),
      h3('1. FinTech AI — 820 triệu USD'),
      p('Tài chính công nghệ dẫn đầu với AI scoring tín dụng, robo-advisory, phát hiện gian lận, và ngân hàng số. VNPay, MoMo, và Timo tích cực tích hợp AI, tạo nhu cầu khổng lồ cho giải pháp chuyên biệt. Đặc biệt, startup Navi AI (TP.HCM) vừa gọi vốn Series B $25M cho nền tảng AI chấm điểm tín dụng dựa trên dữ liệu thay thế.'),
      h3('2. HealthTech AI — 450 triệu USD'),
      p('VinBrain triển khai AI đọc phim X-quang tại 200+ bệnh viện. Startup Med.AI phát triển chatbot tư vấn sức khỏe tiếng Việt phục vụ 5 triệu người dùng/tháng. Bộ Y tế dự kiến bắt buộc tích hợp AI vào hệ thống bệnh viện công từ 2028.'),
      h3('3. AI sản xuất — 380 triệu USD'),
      p('Samsung, LG, Intel tại VN đầu tư mạnh AI tối ưu hóa sản xuất, kiểm soát chất lượng, bảo trì dự đoán. Hệ sinh thái startup công nghiệp bùng nổ theo.'),
      h3('4. EdTech AI — 290 triệu USD'),
      p('Tăng trưởng nhanh nhất 180% YoY. Elsa Speak, Monkey Junior, TopCV dùng AI cá nhân hóa trải nghiệm học tập và tuyển dụng.'),
      h3('5. AgriTech AI — 210 triệu USD'),
      p('IoT + AI cho nông nghiệp: phân tích đất, dự báo sâu bệnh, tối ưu tưới tiêu. FPT và VNPT triển khai tại vùng nông nghiệp trọng điểm, giúp tăng năng suất 20-35%.'),
      tbl(['Lĩnh vực', 'Vốn 2026', 'YoY', 'Số deal'], [
        ['FinTech AI', '$820M', '+280%', '47'],
        ['HealthTech AI', '$450M', '+350%', '28'],
        ['AI sản xuất', '$380M', '+200%', '19'],
        ['EdTech AI', '$290M', '+180%', '35'],
        ['AgriTech AI', '$210M', '+420%', '22'],
      ]),

      h2('Thách thức'),
      ul([
        'Thiếu dữ liệu chất lượng cao — đặc biệt dữ liệu tiếng Việt cho NLP',
        'Brain drain — kỹ sư AI giỏi nhất vẫn chọn nước ngoài',
        'Rào cản pháp lý — quy định dữ liệu cá nhân và AI chưa rõ ràng',
        'Cạnh tranh từ Big Tech mở rộng mạnh tại VN',
        'Hạ tầng GPU/TPU còn hạn chế, phụ thuộc cloud nước ngoài',
      ]),
      quote('"Việt Nam có mọi yếu tố để trở thành AI hub ASEAN, nhưng cần giải quyết nút thắt về dữ liệu và compute." — Dzung Nguyen, CEO VinAI'),
      p('Với 2.8 tỷ USD đổ vào hệ sinh thái AI, Việt Nam đứng trước cơ hội vàng. Cần phối hợp chặt chẽ giữa Chính phủ, doanh nghiệp, và cộng đồng nghiên cứu để biến tiềm năng thành hiện thực.'),
    ],
  },

  {
    title: 'AI phát hiện ung thư phổi 98% chính xác: Bước đột phá tại BV Bạch Mai',
    slug: 'ai-phat-hien-ung-thu-phoi-98-bach-mai',
    excerpt: 'Hệ thống DrAId Lung của VinBrain phát hiện sớm ung thư phổi từ CT scan với độ chính xác vượt bác sĩ chuyên khoa 15 năm kinh nghiệm.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop',
    imageAlt: 'Bác sĩ xem kết quả AI phân tích X-quang phổi',
    catSlug: 'y-te', authorIdx: 3,
    tags: ['AI Y tế', 'Ung thư phổi', 'VinBrain', 'Bạch Mai'],
    blocks: [
      h2('Bước đột phá trong chẩn đoán AI'),
      p('Bệnh viện Bạch Mai vừa công bố kết quả thử nghiệm lâm sàng: hệ thống AI "DrAId Lung" do VinBrain phát triển đạt 98.3% chính xác trong phát hiện sớm ung thư phổi từ CT scan — cao hơn bác sĩ chuyên khoa 15 năm kinh nghiệm (95.1%). Sau 18 tháng thử nghiệm trên 50.000 bệnh nhân, hệ thống phát hiện 1.247 ca ung thư giai đoạn sớm mà bác sĩ bỏ sót.'),
      p('Đây là kết quả của 3 năm nghiên cứu và phát triển, với sự hợp tác giữa VinBrain, Đại học Y Hà Nội, và Stanford Medicine. Hệ thống đã qua quá trình kiểm chứng nghiêm ngặt theo tiêu chuẩn FDA và CE mark, sẵn sàng triển khai quy mô lớn.'),
      img('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1000&h=560&fit=crop', 'Hệ thống AI phân tích CT scan phổi', 'DrAId Lung phân tích CT scan trong 30 giây'),

      h2('Công nghệ DrAId Lung'),
      p('Sử dụng Vision Transformer kết hợp U-Net, huấn luyện trên 2 triệu ảnh CT từ 15 bệnh viện lớn. AI phân tích 300-500 lát cắt CT trong 30 giây, đánh dấu vùng nghi ngờ với heat-map chi tiết cho bác sĩ.'),
      ol([
        'Bệnh nhân chụp CT scan ngực tại bệnh viện',
        'Ảnh tự động gửi đến hệ thống DrAId Lung',
        'AI phân tích toàn bộ lát cắt trong 30 giây',
        'Đánh dấu vùng nghi ngờ, phân loại mức độ nguy hiểm (LUNG-RADS)',
        'Bác sĩ nhận báo cáo chi tiết với heat-map, đưa ra quyết định cuối cùng',
      ]),
      tbl(['Tiêu chí', 'Bác sĩ', 'DrAId Lung'], [
        ['Thời gian/ca', '15-30 phút', '30 giây'],
        ['Chính xác', '95.1%', '98.3%'],
        ['Bỏ sót', '4.9%', '1.7%'],
        ['24/7', '❌', '✅'],
        ['Chi phí/ca', '500.000đ', '50.000đ'],
      ]),

      h2('Triển khai toàn quốc'),
      p('Bộ Y tế phê duyệt triển khai DrAId Lung tại 63 tỉnh thành cuối 2026, mục tiêu giảm 30% tử vong do ung thư phổi. Hệ thống mở rộng sang ung thư vú, ung thư gan, và bệnh tim mạch trong giai đoạn 2027-2028.'),
      quote('"AI không thay thế bác sĩ — AI giúp bác sĩ không bỏ sót bệnh nhân nào." — GS.TS Nguyễn Quang Tuấn, Giám đốc BV Bạch Mai'),
      p('DrAId Lung đang được quan tâm bởi bệnh viện tại Thái Lan, Philippines, Indonesia — mở ra cơ hội xuất khẩu công nghệ AI y tế "Made in Vietnam" ra quốc tế, khẳng định vị thế Việt Nam trên bản đồ AI y tế thế giới.'),
    ],
  },

  {
    title: 'Sora AI tạo phim ngắn Việt Nam đầu tiên đoạt giải Cannes 2026',
    slug: 'sora-ai-phim-ngan-viet-nam-giai-cannes-2026',
    excerpt: 'Đạo diễn trẻ Việt Nam dùng Sora AI tạo phim "Giấc Mơ Số" — tác phẩm AI-generated đầu tiên đoạt giải tại Liên hoan phim Cannes.',
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=630&fit=crop',
    imageAlt: 'Liên hoan phim Cannes với phim AI Việt Nam',
    catSlug: 'giai-tri', authorIdx: 1, isFeatured: true,
    tags: ['Sora AI', 'Cannes', 'Phim ngắn', 'AI Art', 'Điện ảnh'],
    blocks: [
      h2('Khoảnh khắc lịch sử tại Cannes 2026'),
      p('Liên hoan phim Cannes 2026 chứng kiến khoảnh khắc lịch sử khi "Giấc Mơ Số" (Digital Dreams) — phim ngắn 12 phút tạo hoàn toàn bằng Sora AI — giành giải Phim Ngắn Xuất Sắc Nhất hạng mục Un Certain Regard. Đây là tác phẩm AI-generated đầu tiên trong lịch sử đoạt giải tại liên hoan phim quốc tế hàng đầu thế giới.'),
      p('Đạo diễn Nguyễn Đức Minh, 28 tuổi, Hà Nội, dành 6 tháng dùng Sora AI tạo bộ phim kể về cô gái trẻ Việt Nam trong thế giới 2050, nơi ranh giới thực tại và ảo mờ dần. Kết hợp hình ảnh AI-generated, lồng tiếng diễn viên thật, và nhạc nền AI sáng tác bằng Suno.'),
      img('https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&h=560&fit=crop', 'Cảnh phim Giấc Mơ Số', 'Một cảnh trong phim ngắn "Giấc Mơ Số" tại Cannes'),

      h2('Quy trình sáng tạo'),
      p('Thay vì viết kịch bản chi tiết rồi quay phim, Minh bắt đầu với "vision board" — tập hợp hình ảnh, mood, và cảm xúc mong muốn. Mỗi cảnh được generate bằng Sora với prompt chi tiết về ánh sáng, góc máy, và cảm xúc nhân vật. Anh thử hàng trăm biến thể cho mỗi cảnh trước khi chọn bản ưng ý nhất.'),
      ol([
        'Viết concept và storyboard bằng tay trên giấy',
        'Tạo từng cảnh bằng Sora AI với prompt chi tiết (trung bình 15-20 lần generate/cảnh)',
        'Chỉnh sửa, ghép nối, điều chỉnh ánh sáng, màu sắc trong After Effects',
        'Thêm âm thanh, nhạc nền (một phần do Suno AI tạo, một phần thu âm thật)',
        'Color grading và post-production trong DaVinci Resolve',
        'Lặp lại cho đến khi đạt chất lượng — tổng cộng 6.000+ cảnh được generate',
      ]),
      quote('"Sora không thay thế đạo diễn — nó là loại camera mới. Camera truyền thống ghi lại thực tại, Sora tạo ra thực tại từ trí tưởng tượng." — Nguyễn Đức Minh'),

      h2('Phản ứng từ giới điện ảnh'),
      p('Giải thưởng gây tranh luận sôi nổi trong giới điện ảnh quốc tế. Một bên cho rằng đây là bước tiến tự nhiên của nghệ thuật — đạo diễn vẫn là người kể chuyện, chỉ thay đổi công cụ. Bên kia lo ngại AI sẽ phá hủy ngành công nghiệp điện ảnh truyền thống và đe dọa sinh kế của hàng triệu người.'),
      p('Tại Việt Nam, cộng đồng điện ảnh đón nhận với niềm tự hào. Nhiều đạo diễn trẻ bắt đầu thử nghiệm Sora, mở ra làn sóng sáng tạo mới không bị giới hạn bởi ngân sách. Một bộ phim truyền thống tốn 500 triệu - 1 tỷ đồng; "Giấc Mơ Số" chỉ tốn 50 triệu cho API costs và phần mềm.'),

      h2('Tương lai điện ảnh AI'),
      p('PwC dự báo đến 2028, 30% phim ngắn và quảng cáo sẽ được tạo hoặc hỗ trợ bởi AI. Việt Nam, với lợi thế sáng tạo và chi phí thấp, có thể trở thành trung tâm sản xuất nội dung AI khu vực. "Giấc Mơ Số" chứng minh rằng nghệ thuật không bị giới hạn bởi ngân sách — chỉ bởi trí tưởng tượng.'),
    ],
  },

  {
    title: 'AI Coach giúp đội tuyển Việt Nam vô địch AFF Cup 2026',
    slug: 'ai-coach-doi-tuyen-viet-nam-vo-dich-aff-cup-2026',
    excerpt: 'VFF triển khai AI phân tích video chiến thuật, giúp ban huấn luyện đưa ra quyết định chính xác dẫn đến chức vô địch AFF Cup 2026.',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=630&fit=crop',
    imageAlt: 'Phân tích chiến thuật bóng đá bằng AI',
    catSlug: 'the-thao', authorIdx: 0,
    tags: ['AFF Cup', 'AI Sports', 'Đội tuyển VN', 'Chiến thuật'],
    blocks: [
      h2('AI trong bóng đá Việt Nam'),
      p('VFF hợp tác Stats Perform triển khai AI Coach — nền tảng phân tích chiến thuật dùng computer vision và ML để phân tích video trận đấu. Hệ thống theo dõi vị trí 22 cầu thủ, phân tích 1.500+ sự kiện/trận, và tạo báo cáo chi tiết trong 2 giờ — thay vì 2 ngày như trước.'),
      img('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1000&h=560&fit=crop', 'Sân bóng với overlay AI', 'AI tracking cầu thủ real-time trên sân'),
      h2('Công nghệ AI Coach'),
      h3('Computer Vision'),
      p('Camera 4K tại 8 vị trí quanh sân, thuật toán object detection tracking bóng và cầu thủ với độ chính xác 10cm. Nhận diện từng cầu thủ qua số áo, dáng chạy, và vị trí.'),
      h3('Phân tích tự động'),
      ul([
        'Heat-map di chuyển từng cầu thủ và cả đội',
        'Passing network — ai truyền cho ai, hiệu quả thế nào',
        'Pattern tấn công và phòng thủ của đối thủ',
        'xG (Expected Goals) cho từng cơ hội ghi bàn',
        'Pressing intensity và defensive line analysis',
        'So sánh thể lực cầu thủ qua từng hiệp',
      ]),
      h3('Kết quả thực chiến'),
      p('AI Coach phát hiện khoảng trống trong phòng thủ Thái Lan: gap giữa trung vệ và hậu vệ phải khi pressing cao. Việt Nam thiết kế chiến thuật phản công khai thác điểm yếu này, góp phần vào chiến thắng 2-1 ở bán kết.'),
      tbl(['Chỉ số', 'Trước AI Coach', 'Sau AI Coach'], [
        ['Thời gian phân tích/trận', '2 ngày', '2 giờ'],
        ['Phản công thành công', '18%', '31%'],
        ['Pressing hiệu quả', '22%', '34%'],
        ['Kiểm soát bóng', '48%', '55%'],
      ]),
      p('VFF dự kiến mở rộng AI Coach cho V-League 2027 và ứng dụng cho các môn thể thao khác tại SEA Games 2027 Hà Nội. Việt Nam tiên phong ASEAN trong ứng dụng AI thể thao chuyên nghiệp.'),
    ],
  },

  {
    title: 'ĐH Bách Khoa triển khai AI Tutor cá nhân hóa cho 40.000 sinh viên',
    slug: 'bach-khoa-ai-tutor-ca-nhan-hoa-40000-sinh-vien',
    excerpt: 'HUST trở thành đại học đầu tiên Việt Nam triển khai AI tutor cho toàn bộ sinh viên, cá nhân hóa lộ trình học theo năng lực từng người.',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop',
    imageAlt: 'Sinh viên sử dụng AI tutor tại thư viện',
    catSlug: 'giao-duc', authorIdx: 1,
    tags: ['AI Education', 'Bách Khoa', 'EdTech', 'Cá nhân hóa'],
    blocks: [
      h2('HUST tiên phong AI Tutor'),
      p('Đại học Bách khoa Hà Nội (HUST) chính thức triển khai "HUST AI Tutor" cho 40.000 sinh viên từ HK2 2025-2026. Dự án hợp tác HUST-FPT-Anthropic, sử dụng Claude để tạo trợ lý học tập cá nhân hóa, hiểu chương trình đào tạo, biết điểm mạnh/yếu từng sinh viên qua lịch sử học tập.'),
      img('https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1000&h=560&fit=crop', 'AI Tutor trên laptop sinh viên', 'Giao diện HUST AI Tutor'),
      h2('Cách hoạt động'),
      ol([
        'Sinh viên đăng nhập bằng tài khoản HUST',
        'AI phân tích transcript, điểm thi, bài tập đã nộp',
        'Tạo "learning profile" — bản đồ năng lực cá nhân',
        'Đề xuất nội dung ôn tập, bài tập phù hợp trình độ',
        'Sinh viên hỏi bất kỳ câu hỏi nào về môn học',
        'AI giải thích theo nhiều cách cho đến khi hiểu',
      ]),
      h3('Tính năng nổi bật'),
      ul([
        'Giải thích khái niệm phức tạp bằng ví dụ trực quan',
        'Tạo bài tập luyện thi với độ khó phù hợp từng người',
        'Phân tích code và hướng dẫn debug cho SV CNTT',
        'Hỗ trợ viết báo cáo, luận văn với gợi ý cấu trúc',
        'Chatbot tiếng Việt tự nhiên, hiểu thuật ngữ chuyên ngành',
      ]),
      h2('Kết quả 3 tháng pilot (5.000 SV)'),
      tbl(['Chỉ số', 'Trước', 'Sau', 'Thay đổi'], [
        ['Điểm TB', '6.8', '7.6', '+11.8%'],
        ['Tỷ lệ qua môn', '82%', '93%', '+13.4%'],
        ['Tự học/tuần', '8h', '12h', '+50%'],
        ['SV hài lòng', '-', '87%', '-'],
      ]),
      quote('"AI Tutor giải phóng giảng viên khỏi câu hỏi lặp lại, để tập trung mentoring và nghiên cứu." — PGS.TS Huỳnh Quyết Thắng, Hiệu trưởng HUST'),
      p('Bộ GD&ĐT đang xem xét triển khai thí điểm tại 10 đại học lớn khác. Nếu thành công, Việt Nam sẽ là quốc gia đầu tiên ASEAN triển khai AI tutor quy mô quốc gia.'),
    ],
  },

  {
    title: 'Smart Home AI: Ngôi nhà tự học thói quen, tiết kiệm 40% điện',
    slug: 'smart-home-ai-tu-hoc-thoi-quen-tiet-kiem-40-dien',
    excerpt: 'Smart Home AI thế hệ mới tự học thói quen sinh hoạt gia đình, tối ưu tiêu thụ điện năng và tạo không gian sống thoải mái hơn.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop',
    imageAlt: 'Ngôi nhà thông minh với AI điều khiển',
    catSlug: 'doi-song', authorIdx: 2,
    tags: ['Smart Home', 'IoT', 'AI đời sống', 'Tiết kiệm điện'],
    blocks: [
      h2('Nhà thông minh thế hệ AI'),
      p('Năm 2026 đánh dấu bước chuyển lớn của smart home Việt Nam: hệ thống không còn chạy theo kịch bản cài sẵn, mà thực sự tự học thói quen gia đình. Theo Lumi Vietnam, Smart Home AI giảm hóa đơn điện 40% so với nhà thường, 20% so với smart home truyền thống.'),
      img('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&h=560&fit=crop', 'Dashboard Smart Home', 'Bảng điều khiển nhà thông minh AI'),
      h2('AI học thói quen thế nào?'),
      p('Cảm biến nhiệt độ, ánh sáng, chuyển động khắp nhà thu thập dữ liệu 24/7. Sau 2-4 tuần, AI hiểu:'),
      ul([
        'Giờ ngủ, giờ dậy, giờ đi làm của từng thành viên',
        'Nhiệt độ phòng ưa thích theo mùa',
        'Thói quen xem TV, nấu ăn, tập thể dục',
        'Phòng nào dùng nhiều nhất vào thời gian nào',
        'Mức ánh sáng cho từng hoạt động',
      ]),
      h3('Ví dụ thực tế'),
      p('Gia đình anh Hoàng (Hà Nội, 4 người) lắp Smart Home AI. Sau 1 tháng: bật điều hòa 26°C trước khi về nhà 15 phút, giảm 24°C khi con ngủ 9h tối, tắt thiết bị khi vắng nhà, bật đèn hành lang dịu khi có người đi vệ sinh đêm — tất cả tự động.'),
      h2('Tích hợp trợ lý giọng nói'),
      p('Tương thích Google Assistant, Alexa, và trợ lý tiếng Việt Kiki (VinBigData), Olli (VNPT):'),
      ul([
        '"Hey Kiki, tôi muốn xem phim" → kéo rèm, tắt đèn, bật TV, surround sound',
        '"Bật chế độ đi ngủ" → tắt đèn dần, giảm nhiệt, bật white noise, khóa cửa',
        '"Chuẩn bị ăn sáng" → bật đèn bếp, khởi động máy cà phê, mở nhạc nhẹ',
      ]),
      tbl(['Gói', 'Chi phí', 'Tiết kiệm/tháng', 'ROI'], [
        ['Basic (1PN)', '15-25 triệu', '500K-800K', '2-3 năm'],
        ['Standard (2-3PN)', '35-60 triệu', '1-1.5 triệu', '2.5-3.5 năm'],
        ['Premium (biệt thự)', '80-150 triệu', '2-4 triệu', '3-4 năm'],
      ]),
      p('Ngoài tiết kiệm điện, Smart Home AI tăng giá trị BĐS 10-15% và cải thiện chất lượng sống — đặc biệt gia đình có người già và trẻ nhỏ nhờ tính năng an toàn tự động.'),
    ],
  },

  {
    title: 'Xây dựng ứng dụng RAG với LangChain và Pinecone trong 30 phút',
    slug: 'xay-dung-ung-dung-rag-langchain-pinecone-30-phut',
    excerpt: 'Tutorial step-by-step xây dựng RAG app đầy đủ với Python, LangChain, Pinecone, và Claude API — từ zero đến production.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop',
    imageAlt: 'Code Python trên laptop',
    catSlug: 'cong-nghe', authorIdx: 2,
    tags: ['RAG', 'LangChain', 'Pinecone', 'Python', 'Tutorial'],
    faq: [
      { question: 'RAG là gì?', answer: 'Kỹ thuật kết hợp tìm kiếm thông tin + LLM, giúp AI trả lời chính xác dựa trên dữ liệu riêng.' },
      { question: 'Pinecone miễn phí không?', answer: 'Gói Starter free: 1 index, 100K vectors. Đủ cho prototype.' },
    ],
    blocks: [
      h2('RAG là gì và tại sao cần nó?'),
      p('Retrieval-Augmented Generation (RAG) là kiến trúc phổ biến nhất hiện nay để xây dựng AI trả lời câu hỏi dựa trên dữ liệu riêng. Thay vì fine-tune (tốn kém), RAG lấy thông tin liên quan từ database rồi đưa vào context cho LLM. Đơn giản, hiệu quả, và deploy nhanh.'),
      img('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1000&h=560&fit=crop', 'RAG pipeline architecture', 'Kiến trúc RAG: Document → Embeddings → Vector DB → LLM → Answer'),

      h2('Chuẩn bị'),
      codeBlock('bash', 'pip install langchain langchain-anthropic langchain-pinecone pinecone-client pypdf'),
      codeBlock('python', '# .env\nANTHROPIC_API_KEY=sk-ant-...\nPINECONE_API_KEY=pcsk_...\nPINECONE_INDEX=rag-demo'),

      h2('Step 1: Load và chia nhỏ tài liệu'),
      codeBlock('python', `from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

loader = PyPDFLoader("data/company-docs.pdf")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500, chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " "]
)
chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")`),

      h2('Step 2: Embeddings → Pinecone'),
      codeBlock('python', `from langchain_anthropic import AnthropicEmbeddings
from langchain_pinecone import PineconeVectorStore

embeddings = AnthropicEmbeddings(model="voyage-3")
vectorstore = PineconeVectorStore.from_documents(
    chunks, embeddings, index_name="rag-demo"
)`),

      h2('Step 3: RAG chain'),
      codeBlock('python', `from langchain_anthropic import ChatAnthropic
from langchain.chains import RetrievalQA

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

qa_chain = RetrievalQA.from_chain_type(
    llm=llm, chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)`),

      h2('Step 4: Query'),
      codeBlock('python', `result = qa_chain.invoke({"query": "Chính sách nghỉ phép?"})
print("Answer:", result["result"])
for doc in result["source_documents"]:
    print(f"  Source: {doc.metadata['source']}")`),

      h2('Tips tối ưu'),
      ul([
        'Chunk size 300-500 cho tiếng Việt (ngắn hơn tiếng Anh)',
        'Overlap 10-15% để không mất ngữ cảnh',
        'Dùng metadata filtering thu hẹp phạm vi tìm kiếm',
        'Hybrid search: vector + BM25 keyword search cho kết quả tốt nhất',
        'Reranking với Cohere Reranker cải thiện relevance 20-30%',
      ]),
      p('RAG là nền tảng cho hầu hết ứng dụng AI enterprise. Với LangChain + Pinecone, bạn prototype trong 30 phút và scale lên triệu documents.'),
    ],
  },

  {
    title: 'An ninh mạng kỷ nguyên AI: 5 mối đe dọa mới và cách phòng chống',
    slug: 'an-ninh-mang-ky-nguyen-ai-5-moi-de-doa-phong-chong',
    excerpt: 'Phân tích 5 mối đe dọa cybersecurity mới nhất liên quan đến AI và hướng dẫn phòng chống cho doanh nghiệp Việt Nam năm 2026.',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
    imageAlt: 'An ninh mạng AI shield',
    catSlug: 'thoi-su', authorIdx: 4, isFeatured: true,
    tags: ['Cybersecurity', 'AI Safety', 'Deepfake', 'Phishing'],
    blocks: [
      h2('Bối cảnh an ninh mạng 2026'),
      p('Năm 2026 chứng kiến bùng nổ tấn công mạng dùng AI, thiệt hại toàn cầu 10.5 nghìn tỷ USD. Tại Việt Nam, Cục An toàn thông tin ghi nhận 15.000+ cuộc tấn công nghiêm trọng nửa đầu 2026, tăng 85% YoY — phần lớn dùng AI vượt qua hệ thống phòng thủ truyền thống.'),
      img('https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1000&h=560&fit=crop', 'Security Operations Center', 'SOC giám sát AI threats 24/7'),

      h2('5 mối đe dọa AI hàng đầu'),
      h3('1. Deepfake CEO Fraud'),
      p('AI tạo video/audio deepfake giả CEO ra lệnh chuyển tiền. Tại VN đã có case ngân hàng bị lừa 12 tỷ qua video call deepfake giả CEO. Phòng chống: xác nhận đa kênh cho giao dịch lớn, từ khóa bí mật, deepfake detection tools.'),

      h3('2. AI-Powered Phishing'),
      p('Email lừa đảo AI soạn tiếng Việt hoàn hảo, cá nhân hóa từ thông tin mạng xã hội. Click rate cao gấp 3x so với phishing thường. Mỗi email được customize theo tên, công ty, sở thích, và lịch sử giao dịch của nạn nhân.'),

      h3('3. Prompt Injection'),
      p('Khi DN tích hợp LLM, kẻ tấn công chèn prompt độc để buộc AI tiết lộ data bí mật hoặc thực thi mã nguy hiểm. Đây là attack vector hoàn toàn mới mà hầu hết DN VN chưa có biện pháp phòng chống.'),

      h3('4. AI-powered Polymorphic Malware'),
      p('Malware dùng AI tự viết lại mã nguồn mỗi lần lây nhiễm, khiến antivirus dựa trên signature vô dụng. Tỷ lệ phát hiện giảm từ 95% xuống còn 40%.'),

      h3('5. Data Poisoning'),
      p('Chèn dữ liệu độc vào training data khiến mô hình AI quyết định sai. Nguy hiểm đặc biệt cho AI y tế và tài chính nơi quyết định sai có thể gây hậu quả nghiêm trọng.'),

      h2('Phòng chống cho doanh nghiệp'),
      ol([
        'Đào tạo nhân viên nhận biết deepfake và AI phishing — diễn tập hàng quý',
        'Triển khai Zero Trust Architecture — không tin tưởng mặc định',
        'Dùng AI chống AI — ML-based anomaly detection systems',
        'Kiểm toán an ninh cho mọi tích hợp LLM/AI trước khi deploy',
        'Xây dựng incident response plan cho AI-related attacks',
        'Tham gia cộng đồng threat intelligence chia sẻ',
      ]),
      tbl(['Giải pháp', 'Chống', 'Chi phí/năm'], [
        ['Deepfake detection', 'CEO Fraud', '15-50 triệu'],
        ['AI email security', 'Phishing', '5-20 triệu'],
        ['LLM firewall', 'Prompt Injection', '10-30 triệu'],
        ['EDR + AI', 'Malware', '20-100 triệu'],
        ['Data validation', 'Poisoning', '50-200 triệu'],
      ]),
      quote('"Cuộc chiến cybersecurity giờ là AI vs AI. DN không dùng AI phòng thủ sẽ thua." — Đỗ Quang Huy'),
      p('An ninh mạng kỷ nguyên AI đòi hỏi approach mới — chủ động dự đoán, không chỉ phản ứng. Đầu tư cybersecurity AI không còn là lựa chọn mà là yêu cầu bắt buộc.'),
    ],
  },
];

// ─── Seed function ──────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ Connected to MongoDB');

  // Upsert authors
  const authorDocs: Record<string, any> = {};
  for (const a of AUTHORS) {
    const doc = await Author.findOneAndUpdate(
      { slug: a.slug },
      { $set: { ...a, isActive: true } },
      { upsert: true, new: true }
    );
    authorDocs[a.slug] = doc;
    console.log(`  Author: ${a.name}`);
  }

  // Get categories
  const cats = await Category.find({}).lean();
  const catMap: Record<string, any> = {};
  for (const c of cats) catMap[c.slug] = c;

  // Create articles
  let created = 0;
  for (const art of ARTICLES) {
    const cat = catMap[art.catSlug];
    if (!cat) { console.log(`❌ Category "${art.catSlug}" not found — skip: ${art.title}`); continue; }

    const existing = await Post.findOne({ slug: art.slug });
    if (existing) { console.log(`  ⏭️  Exists: ${art.slug}`); continue; }

    const author = authorDocs[AUTHORS[art.authorIdx].slug];
    const contentMd = art.blocks.map((b: any) => {
      if (b.type === 'heading') return `${'#'.repeat(b.level)} ${b.text}`;
      if (b.type === 'paragraph') return b.text;
      if (b.type === 'image') return `![${b.alt}](${b.url})`;
      if (b.type === 'list') return b.items.map((i: string, idx: number) => b.style === 'ordered' ? `${idx + 1}. ${i}` : `- ${i}`).join('\n');
      if (b.type === 'quote') return `> ${b.text}`;
      if (b.type === 'code') return '```' + b.language + '\n' + b.code + '\n```';
      if (b.type === 'divider') return '---';
      if (b.type === 'table') return [b.headers.join(' | '), b.headers.map(() => '---').join(' | '), ...b.rows.map((r: string[]) => r.join(' | '))].join('\n');
      return '';
    }).join('\n\n');

    await Post.create({
      externalId: `seed-${art.slug}`,
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: contentMd,
      contentBlocks: art.blocks,
      coverImage: art.coverImage,
      imageAlt: art.imageAlt,
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: cat._id,
      authorId: author._id,
      author: AUTHORS[art.authorIdx].name,
      status: 'published',
      publishedAt: new Date(Date.now() - Math.random() * 86400000 * 3),
      tags: art.tags,
      isFeatured: art.isFeatured || false,
      isBreaking: art.isBreaking || false,
      faq: art.faq || [],
      articleType: 'news',
      language: 'vi',
      viewCount: Math.floor(Math.random() * 5000) + 500,
    });
    created++;
    console.log(`  ✅ ${art.title}`);
  }

  console.log(`\n🎉 Done! Created ${created} articles.`);
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
