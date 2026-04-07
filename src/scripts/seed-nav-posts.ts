import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

import { Category } from '../models/category.model';
import { Post } from '../models/post.model';
import { Author } from '../models/author.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';

let blockId = 0;
function pid() { return `nav-blk-${(++blockId).toString().padStart(4, '0')}`; }

function makeBlocks(sections: { heading: string; anchor: string; paragraphs: string[] }[]) {
  const blocks: any[] = [];
  let order = 0;
  for (const s of sections) {
    blocks.push({ id: pid(), type: 'heading', order: ++order, level: 2, text: s.heading, anchor: s.anchor });
    for (const p of s.paragraphs) {
      blocks.push({ id: pid(), type: 'paragraph', order: ++order, content: p });
    }
  }
  return blocks;
}

// ── Post data per category ────────────────────────────────────────
const POSTS: Record<string, { title: string; excerpt: string; cover: string; tags: string[]; sections: { heading: string; anchor: string; paragraphs: string[] }[] }[]> = {
  'ai-models': [
    {
      title: 'Claude 4.5 Opus: Mô hình AI mạnh nhất 2026 với khả năng suy luận vượt trội',
      excerpt: 'Anthropic ra mắt Claude 4.5 Opus với benchmark vượt GPT-5 trên nhiều tác vụ suy luận phức tạp, coding và phân tích dữ liệu.',
      cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
      tags: ['Claude', 'Anthropic', 'LLM', 'AI Models'],
      sections: [
        { heading: 'Điểm nổi bật của Claude 4.5 Opus', anchor: 'diem-noi-bat', paragraphs: [
          'Claude 4.5 Opus đánh dấu bước tiến lớn trong lĩnh vực AI với khả năng xử lý context lên đến 1 triệu token, cho phép phân tích toàn bộ codebase hoặc tài liệu dài mà không mất ngữ cảnh. Mô hình này đạt điểm 97.2% trên MATH-500 và 94.8% trên HumanEval, vượt qua tất cả các đối thủ hiện tại.',
          'Đặc biệt, Claude 4.5 Opus có khả năng "extended thinking" — cho phép mô hình suy nghĩ sâu hơn trước khi trả lời, tăng đáng kể độ chính xác trên các bài toán phức tạp. Tính năng này hoạt động tương tự như cách con người cần thời gian để suy ngẫm trước khi đưa ra quyết định quan trọng.',
        ]},
        { heading: 'So sánh với GPT-5 và Gemini 2.5', anchor: 'so-sanh', paragraphs: [
          'Trong các benchmark chuẩn, Claude 4.5 Opus vượt GPT-5 trên tác vụ coding (+3.2%), suy luận logic (+4.1%) và phân tích văn bản dài (+8.7%). Tuy nhiên, GPT-5 vẫn dẫn đầu ở tác vụ multimodal và xử lý hình ảnh.',
          'Gemini 2.5 Pro của Google cũng là đối thủ đáng gờm với khả năng xử lý video và audio vượt trội. Cuộc đua AI 2026 đang nóng hơn bao giờ hết với ba "ông lớn" liên tục cải tiến mô hình.',
        ]},
      ],
    },
    {
      title: 'Llama 4 Scout: Meta mở mã nguồn mô hình AI 109 tỷ tham số',
      excerpt: 'Meta phát hành Llama 4 Scout với kiến trúc Mixture-of-Experts, miễn phí cho nghiên cứu và thương mại.',
      cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
      tags: ['Llama', 'Meta', 'Open Source', 'MoE'],
      sections: [
        { heading: 'Kiến trúc Mixture-of-Experts', anchor: 'kien-truc-moe', paragraphs: [
          'Llama 4 Scout sử dụng kiến trúc MoE với 16 expert modules, chỉ kích hoạt 2-3 experts cho mỗi token. Điều này giúp mô hình có 109 tỷ tham số tổng nhưng chỉ sử dụng ~17 tỷ tham số hoạt động, tiết kiệm đáng kể chi phí inference.',
          'Meta đã huấn luyện Llama 4 Scout trên tập dữ liệu 15 nghìn tỷ token đa ngôn ngữ, bao gồm cả tiếng Việt với chất lượng cao hơn các phiên bản trước. Kết quả là mô hình có khả năng hiểu và sinh văn bản tiếng Việt tốt hơn đáng kể.',
        ]},
        { heading: 'Ứng dụng thực tế tại Việt Nam', anchor: 'ung-dung-viet-nam', paragraphs: [
          'Nhiều startup Việt Nam đã bắt đầu fine-tune Llama 4 Scout cho các tác vụ đặc thù như chatbot CSKH, phân tích văn bản pháp luật, và tự động hóa báo cáo tài chính. Chi phí inference giảm 60% so với việc dùng API của OpenAI hay Anthropic.',
        ]},
      ],
    },
    {
      title: 'Gemini 2.5 Pro: Google đẩy mạnh AI đa phương tiện với context 2 triệu token',
      excerpt: 'Google DeepMind ra mắt Gemini 2.5 Pro — mô hình AI có thể xử lý video, audio, code trong cùng một conversation.',
      cover: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&h=630&fit=crop',
      tags: ['Gemini', 'Google', 'Multimodal', 'AI Models'],
      sections: [
        { heading: 'Context window 2 triệu token', anchor: 'context-2m', paragraphs: [
          'Gemini 2.5 Pro hỗ trợ context window lên đến 2 triệu token — tương đương 2,000 trang tài liệu hoặc 2 giờ video. Đây là bước đột phá cho phép AI phân tích toàn bộ repository code lớn, xem xét video dài, hoặc xử lý dataset phức tạp trong một lần gọi.',
        ]},
        { heading: 'Tích hợp với Google Workspace', anchor: 'google-workspace', paragraphs: [
          'Google tích hợp Gemini 2.5 Pro sâu vào Gmail, Docs, Sheets và Meet. Người dùng có thể yêu cầu AI tóm tắt email cả tuần, tạo báo cáo từ dữ liệu Sheets, hoặc ghi chú tự động cuộc họp Meet với độ chính xác trên 95%.',
          'Tại Việt Nam, Google đã hợp tác với FPT và Viettel để cung cấp Gemini API với giá ưu đãi cho các doanh nghiệp Việt, thúc đẩy chuyển đổi số AI.',
        ]},
      ],
    },
  ],
  'ai-tools': [
    {
      title: 'Top 10 công cụ AI hỗ trợ lập trình viên hiệu quả nhất 2026',
      excerpt: 'Tổng hợp và đánh giá chi tiết 10 AI coding tools đang được developer Việt Nam sử dụng nhiều nhất.',
      cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop',
      tags: ['AI Tools', 'Coding', 'Productivity', 'Developer'],
      sections: [
        { heading: 'Claude Code — IDE AI tích hợp terminal', anchor: 'claude-code', paragraphs: [
          'Claude Code của Anthropic đã trở thành công cụ coding AI được yêu thích nhất với khả năng chạy trực tiếp trong terminal, đọc hiểu toàn bộ codebase và thực hiện multi-file edits. Với context 1M token, Claude Code có thể hiểu project lớn mà không cần chia nhỏ.',
          'Điểm mạnh: tích hợp VS Code, JetBrains, hỗ trợ slash commands (/fix, /plan, /cook), agent SDK cho automation.',
        ]},
        { heading: 'Cursor và Windsurf — AI-first IDE', anchor: 'cursor-windsurf', paragraphs: [
          'Cursor tiếp tục dẫn đầu thị trường AI IDE với tính năng Composer cho phép tạo toàn bộ feature từ mô tả tự nhiên. Windsurf (Codeium) cạnh tranh mạnh với giá rẻ hơn 50% và tích hợp Cascade AI agent.',
        ]},
      ],
    },
    {
      title: 'Perplexity AI: Công cụ tìm kiếm AI thay thế Google Search',
      excerpt: 'Review chi tiết Perplexity AI — search engine AI với câu trả lời có nguồn trích dẫn, so sánh với Google SGE.',
      cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop',
      tags: ['Perplexity', 'AI Search', 'Google Alternative'],
      sections: [
        { heading: 'Perplexity vs Google SGE', anchor: 'perplexity-vs-google', paragraphs: [
          'Perplexity AI đã thu hút 100 triệu người dùng hàng tháng nhờ khả năng trả lời câu hỏi phức tạp với nguồn trích dẫn rõ ràng. Khác với Google SGE, Perplexity tập trung vào chất lượng câu trả lời thay vì hiển thị quảng cáo.',
          'Tính năng Perplexity Spaces cho phép tạo knowledge base riêng cho team, rất hữu ích cho nghiên cứu và phân tích thị trường.',
        ]},
      ],
    },
    {
      title: 'Notion AI 2.0: Trợ lý AI cho quản lý dự án và ghi chú thông minh',
      excerpt: 'Notion nâng cấp AI với khả năng tự động hóa workflow, tạo database từ mô tả, và tóm tắt meeting notes.',
      cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop',
      tags: ['Notion', 'AI Productivity', 'Project Management'],
      sections: [
        { heading: 'Tính năng AI mới trong Notion 2.0', anchor: 'tinh-nang-moi', paragraphs: [
          'Notion AI 2.0 giới thiệu Q&A thông minh — có thể trả lời câu hỏi dựa trên toàn bộ workspace của team. Ví dụ: "Deadline dự án X là khi nào?" hoặc "Ai chịu trách nhiệm task Y?" — AI sẽ tìm và trả lời chính xác từ dữ liệu trong Notion.',
          'Tính năng Automations cho phép tạo workflow tự động: khi task chuyển sang "Done", AI tự tạo báo cáo tóm tắt và gửi notification cho stakeholders.',
        ]},
      ],
    },
  ],
  'ai-agents': [
    {
      title: 'AI Agent là gì? Tổng quan về thế hệ AI tự hành 2026',
      excerpt: 'Giải thích chi tiết AI Agent — từ khái niệm, kiến trúc ReAct, đến ứng dụng thực tế trong doanh nghiệp Việt Nam.',
      cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=630&fit=crop',
      tags: ['AI Agent', 'Automation', 'Enterprise AI'],
      sections: [
        { heading: 'AI Agent khác chatbot như thế nào?', anchor: 'agent-vs-chatbot', paragraphs: [
          'Chatbot truyền thống chỉ phản hồi input của người dùng trong một lượt hội thoại. AI Agent đi xa hơn — nó có khả năng lập kế hoạch, sử dụng tools, thực thi nhiều bước tự động, và tự điều chỉnh khi gặp lỗi. Ví dụ: một AI Agent có thể nhận yêu cầu "đặt vé máy bay Hà Nội - HCM ngày mai, giá rẻ nhất", sau đó tự tìm kiếm, so sánh giá, và hoàn tất booking.',
        ]},
        { heading: 'Kiến trúc ReAct và Tool Use', anchor: 'react-tool-use', paragraphs: [
          'Hầu hết AI Agent hiện đại sử dụng kiến trúc ReAct (Reasoning + Acting): mô hình suy nghĩ về bước tiếp theo, chọn tool phù hợp, thực thi, quan sát kết quả, rồi lặp lại cho đến khi hoàn thành task. Framework phổ biến: LangChain, CrewAI, Claude Agent SDK.',
        ]},
      ],
    },
    {
      title: 'Claude Agent SDK: Xây dựng AI Agent với TypeScript trong 30 phút',
      excerpt: 'Hướng dẫn nhanh tạo AI Agent đầu tiên với Claude Agent SDK — từ cài đặt đến deploy production.',
      cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop',
      tags: ['Claude', 'Agent SDK', 'TypeScript', 'Tutorial'],
      sections: [
        { heading: 'Cài đặt và cấu hình', anchor: 'cai-dat', paragraphs: [
          'Claude Agent SDK cho phép tạo AI Agent với TypeScript chỉ với vài dòng code. SDK hỗ trợ tool use, multi-turn conversation, streaming, và tích hợp MCP (Model Context Protocol) để agent có thể sử dụng hàng nghìn tools từ ecosystem.',
          'npm install @anthropic-ai/sdk — bắt đầu với API key từ console.anthropic.com, tạo agent đầu tiên với 3 tools: web search, file read/write, và shell command execution.',
        ]},
      ],
    },
    {
      title: 'CrewAI vs LangGraph: So sánh 2 framework multi-agent hàng đầu',
      excerpt: 'Phân tích ưu nhược điểm của CrewAI và LangGraph cho xây dựng hệ thống multi-agent AI phức tạp.',
      cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
      tags: ['CrewAI', 'LangGraph', 'Multi-Agent', 'Framework'],
      sections: [
        { heading: 'CrewAI — đơn giản, nhanh chóng', anchor: 'crewai', paragraphs: [
          'CrewAI nổi bật với API đơn giản: định nghĩa agents, tasks, và crew trong vài dòng Python. Mỗi agent có role, goal, backstory riêng, tạo cảm giác như đang quản lý một team thực sự. Phù hợp cho prototype nhanh và dự án vừa.',
        ]},
        { heading: 'LangGraph — linh hoạt, mạnh mẽ', anchor: 'langgraph', paragraphs: [
          'LangGraph của LangChain cho phép xây dựng workflow phức tạp dạng graph với state management. Phù hợp cho production system cần kiểm soát chặt luồng thực thi, retry logic, và human-in-the-loop. Learning curve cao hơn nhưng linh hoạt hơn nhiều.',
        ]},
      ],
    },
  ],
  'ai-code': [
    {
      title: 'GitHub Copilot Workspace: AI viết code từ issue đến PR tự động',
      excerpt: 'GitHub ra mắt Copilot Workspace — AI agent tự đọc issue, plan giải pháp, viết code, chạy test và tạo PR.',
      cover: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=630&fit=crop',
      tags: ['GitHub', 'Copilot', 'AI Coding', 'DevTools'],
      sections: [
        { heading: 'Từ Issue đến Pull Request', anchor: 'issue-to-pr', paragraphs: [
          'Copilot Workspace nhận một GitHub issue, phân tích codebase liên quan, đề xuất kế hoạch sửa đổi, implement code changes trên nhiều files, chạy test suite, và tạo PR với description chi tiết. Developer chỉ cần review và approve.',
          'Trong thử nghiệm nội bộ tại GitHub, Copilot Workspace giải quyết thành công 67% issues đơn giản (bug fixes, small features) mà không cần con người can thiệp vào code.',
        ]},
      ],
    },
    {
      title: 'Devin AI: "Lập trình viên AI" đầu tiên có thể làm việc độc lập',
      excerpt: 'Cognition Labs ra mắt Devin — AI software engineer có thể tự plan, code, debug và deploy ứng dụng hoàn chỉnh.',
      cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=630&fit=crop',
      tags: ['Devin', 'AI Engineer', 'Autonomous Coding'],
      sections: [
        { heading: 'Devin có thể làm gì?', anchor: 'devin-capabilities', paragraphs: [
          'Devin có sandbox riêng với terminal, browser, và code editor. Nó có thể: clone repo, đọc documentation, viết code, chạy tests, debug lỗi, và deploy lên cloud. Trong SWE-bench benchmark, Devin giải quyết 13.86% issues — con số khiêm tốn nhưng vượt xa tất cả AI khác tại thời điểm ra mắt.',
        ]},
      ],
    },
    {
      title: 'So sánh AI Code Assistants 2026: Claude Code vs Cursor vs Copilot',
      excerpt: 'Benchmark chi tiết 3 AI coding tools phổ biến nhất — test trên 5 ngôn ngữ, 10 tác vụ thực tế.',
      cover: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop',
      tags: ['AI Coding', 'Comparison', 'Claude Code', 'Cursor', 'Copilot'],
      sections: [
        { heading: 'Methodology benchmark', anchor: 'methodology', paragraphs: [
          'Chúng tôi test 3 tools trên 10 tác vụ thực tế: tạo REST API, fix bug, refactor code, viết tests, tạo UI component, database migration, code review, documentation, CI/CD setup, và performance optimization. Mỗi tác vụ test trên Python, TypeScript, Go, Rust, và Java.',
        ]},
        { heading: 'Kết quả tổng hợp', anchor: 'ket-qua', paragraphs: [
          'Claude Code dẫn đầu ở multi-file editing và complex refactoring (điểm 9.2/10). Cursor mạnh nhất ở inline completion và UI generation (8.8/10). GitHub Copilot ổn định nhất ở single-file tasks và có ecosystem integration tốt nhất (8.5/10). Lựa chọn phụ thuộc vào workflow cá nhân.',
        ]},
      ],
    },
  ],
  'ai-creative': [
    {
      title: 'Sora 2.0: OpenAI nâng cấp AI tạo video lên 4K, 2 phút',
      excerpt: 'OpenAI ra mắt Sora 2.0 — tạo video 4K dài 2 phút với chất lượng gần như thực từ prompt text.',
      cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=630&fit=crop',
      tags: ['Sora', 'OpenAI', 'AI Video', 'Creative AI'],
      sections: [
        { heading: 'Bước nhảy vọt từ Sora 1.0', anchor: 'buoc-nhay', paragraphs: [
          'Sora 2.0 tạo video 4K resolution, dài tối đa 2 phút, với chuyển động nhân vật tự nhiên và physics simulation chính xác. So với Sora 1.0 (720p, 60 giây), đây là bước tiến khổng lồ. OpenAI cũng thêm tính năng video-to-video editing — upload video có sẵn và yêu cầu AI chỉnh sửa.',
        ]},
      ],
    },
    {
      title: 'Midjourney V7 vs DALL-E 4: Cuộc chiến AI tạo hình ảnh 2026',
      excerpt: 'So sánh chi tiết 2 AI image generators hàng đầu — chất lượng, tốc độ, giá cả, và use cases phù hợp.',
      cover: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=630&fit=crop',
      tags: ['Midjourney', 'DALL-E', 'AI Art', 'Image Generation'],
      sections: [
        { heading: 'Chất lượng hình ảnh', anchor: 'chat-luong', paragraphs: [
          'Midjourney V7 vẫn dẫn đầu về aesthetic quality — hình ảnh có chiều sâu nghệ thuật, ánh sáng tự nhiên và composition đẹp. DALL-E 4 mạnh hơn ở text rendering (chữ trong ảnh chính xác), instruction following (làm đúng yêu cầu phức tạp), và photorealism.',
        ]},
      ],
    },
    {
      title: 'Suno AI V4: Tạo nhạc AI chất lượng studio trong 30 giây',
      excerpt: 'Suno AI V4 tạo bài hát hoàn chỉnh (vocal, nhạc cụ, mixing) từ prompt text — review chi tiết.',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=630&fit=crop',
      tags: ['Suno', 'AI Music', 'Creative AI'],
      sections: [
        { heading: 'Chất lượng âm thanh', anchor: 'chat-luong-am-thanh', paragraphs: [
          'Suno V4 tạo nhạc với chất lượng 48kHz stereo, vocal rõ ràng, nhạc cụ đa dạng từ piano đến guitar electric. Hỗ trợ 50+ thể loại nhạc và 10+ ngôn ngữ vocal. Bài hát dài tối đa 4 phút với cấu trúc verse-chorus-bridge hoàn chỉnh.',
          'Tại Việt Nam, nhiều creator đã dùng Suno để tạo nhạc nền cho video YouTube, podcast, và quảng cáo với chi phí gần như bằng 0.',
        ]},
      ],
    },
  ],
  'ai-business': [
    {
      title: 'AI Startup Việt Nam gọi vốn kỷ lục 200 triệu USD trong Q1/2026',
      excerpt: 'Tổng hợp các thương vụ gọi vốn AI lớn nhất Việt Nam — VinAI, FPT AI, và loạt startup mới nổi.',
      cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
      tags: ['Startup', 'Funding', 'Vietnam AI', 'Investment'],
      sections: [
        { heading: 'Các thương vụ nổi bật', anchor: 'thuong-vu', paragraphs: [
          'Q1/2026 chứng kiến làn sóng đầu tư AI mạnh mẽ tại Việt Nam. VinAI dẫn đầu với vòng Series C trị giá 100 triệu USD từ SoftBank Vision Fund. FPT AI Center nhận 50 triệu USD từ Google Ventures để phát triển LLM tiếng Việt. Hai startup mới — AIBridge (NLP) và VietML (computer vision) — mỗi cái gọi được 25 triệu USD Series A.',
        ]},
      ],
    },
    {
      title: 'Chiến lược AI cho doanh nghiệp vừa và nhỏ Việt Nam',
      excerpt: 'Hướng dẫn thực tế triển khai AI cho SME — từ chatbot CSKH đến tự động hóa quy trình với chi phí thấp.',
      cover: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop',
      tags: ['AI Strategy', 'SME', 'Business AI', 'Vietnam'],
      sections: [
        { heading: 'Bắt đầu từ đâu?', anchor: 'bat-dau', paragraphs: [
          'SME Việt Nam nên bắt đầu AI từ 3 điểm có ROI cao nhất: (1) Chatbot CSKH tự động — giảm 70% ticket support với chi phí 2-5 triệu/tháng, (2) Tự động hóa data entry và báo cáo — tiết kiệm 20+ giờ nhân sự/tuần, (3) AI marketing — tạo content, phân tích đối thủ, tối ưu quảng cáo.',
          'Không cần thuê team AI riêng — sử dụng các SaaS tools có sẵn: ChatGPT Team cho nội bộ, Botpress cho chatbot, Zapier AI cho automation.',
        ]},
      ],
    },
    {
      title: 'AI và việc làm tại Việt Nam: Cơ hội hay thách thức?',
      excerpt: 'Phân tích tác động của AI đến thị trường lao động Việt Nam 2026 — ngành nào hưởng lợi, ngành nào bị ảnh hưởng.',
      cover: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=630&fit=crop',
      tags: ['AI Jobs', 'Vietnam', 'Future of Work'],
      sections: [
        { heading: 'Ngành nghề bị ảnh hưởng', anchor: 'anh-huong', paragraphs: [
          'Theo báo cáo của McKinsey Vietnam 2026, 35% công việc văn phòng tại Việt Nam sẽ bị tự động hóa một phần trong 3 năm tới. Ngành bị ảnh hưởng lớn nhất: nhập liệu, kế toán cơ bản, dịch thuật, và thiết kế đồ họa đơn giản.',
          'Tuy nhiên, nhu cầu tuyển dụng AI engineer, prompt engineer, và AI product manager tăng 300% so với 2024. Lương trung bình AI engineer tại Việt Nam đạt 40-80 triệu/tháng.',
        ]},
      ],
    },
  ],
  'research': [
    {
      title: 'Transformer tiến hóa: Từ Attention Is All You Need đến kiến trúc 2026',
      excerpt: 'Tổng hợp các cải tiến kiến trúc Transformer quan trọng nhất — Mamba, RWKV, Ring Attention, và hơn thế.',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop',
      tags: ['Transformer', 'Research', 'Architecture', 'Deep Learning'],
      sections: [
        { heading: 'Vượt qua giới hạn Attention', anchor: 'vuot-qua', paragraphs: [
          'Self-attention trong Transformer gốc có complexity O(n²), giới hạn context length. Các nghiên cứu 2025-2026 đã đề xuất nhiều giải pháp: Ring Attention (Google) chia sequence thành vòng tròn xử lý tuần tự, Mamba (CMU) dùng State Space Model thay attention hoàn toàn, và RWKV kết hợp RNN + Transformer.',
          'Đặc biệt, kiến trúc Mixture-of-Experts (MoE) cho phép scale model lên hàng nghìn tỷ tham số mà không tăng chi phí inference tuyến tính. GPT-5, Llama 4, và Gemini 2.5 đều sử dụng MoE.',
        ]},
      ],
    },
    {
      title: 'RLHF và DPO: Hai phương pháp alignment AI đang thống trị 2026',
      excerpt: 'Phân tích kỹ thuật RLHF và Direct Preference Optimization — cách các lab AI "dạy" model hành xử đúng.',
      cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=630&fit=crop',
      tags: ['RLHF', 'DPO', 'Alignment', 'AI Safety'],
      sections: [
        { heading: 'RLHF — phương pháp kinh điển', anchor: 'rlhf', paragraphs: [
          'Reinforcement Learning from Human Feedback (RLHF) gồm 3 bước: (1) thu thập dữ liệu preference từ con người, (2) train reward model từ preferences, (3) fine-tune LLM bằng PPO để maximize reward. OpenAI và Anthropic đều dùng RLHF cho GPT-5 và Claude.',
        ]},
      ],
    },
    {
      title: 'Scaling Laws 2026: Khi nào AI đạt đến giới hạn?',
      excerpt: 'Phân tích xu hướng scaling — liệu "bigger is better" còn đúng? Bài học từ Chinchilla đến GPT-5.',
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
      tags: ['Scaling Laws', 'Research', 'AI Limits'],
      sections: [
        { heading: 'Diminishing returns?', anchor: 'diminishing', paragraphs: [
          'Nghiên cứu của Epoch AI (2026) cho thấy improvement từ scaling model size đang chậm lại. GPT-5 có 10x parameters so với GPT-4 nhưng chỉ cải thiện 15-20% trên benchmark. Các lab đang chuyển hướng sang "test-time compute" — cho model suy nghĩ lâu hơn thay vì làm model lớn hơn.',
          'Anthropic và Google đi đầu xu hướng này với "extended thinking" (Claude) và "deep research mode" (Gemini). Kết quả: model nhỏ hơn + inference lâu hơn = hiệu quả tương đương model lớn.',
        ]},
      ],
    },
  ],
  'tutorials': [
    {
      title: 'Xây dựng chatbot AI tiếng Việt với LangChain và Claude API',
      excerpt: 'Tutorial step-by-step tạo chatbot hỗ trợ khách hàng bằng tiếng Việt — từ zero đến production.',
      cover: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=630&fit=crop',
      tags: ['Tutorial', 'LangChain', 'Claude API', 'Chatbot'],
      sections: [
        { heading: 'Chuẩn bị môi trường', anchor: 'chuan-bi', paragraphs: [
          'Cài đặt Python 3.11+, tạo virtualenv, install các package: langchain, anthropic, chromadb (vector store), fastapi (API server). Lấy API key từ console.anthropic.com — Claude Haiku 4.5 là lựa chọn tốt nhất cho chatbot vì nhanh và rẻ.',
          'Chuẩn bị knowledge base: thu thập FAQ, tài liệu sản phẩm, chính sách bảo hành — convert sang text và chunk thành đoạn 500 token.',
        ]},
      ],
    },
    {
      title: 'Fine-tuning Llama 4 cho tiếng Việt với LoRA trên Google Colab',
      excerpt: 'Hướng dẫn fine-tune model Llama 4 Scout cho tác vụ tiếng Việt — chỉ cần GPU miễn phí từ Colab.',
      cover: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=630&fit=crop',
      tags: ['Fine-tuning', 'LoRA', 'Llama', 'Vietnamese NLP'],
      sections: [
        { heading: 'LoRA là gì?', anchor: 'lora-la-gi', paragraphs: [
          'LoRA (Low-Rank Adaptation) cho phép fine-tune model lớn với chỉ 0.1% tham số — tiết kiệm 10x GPU memory. Thay vì update toàn bộ weights, LoRA thêm các adapter nhỏ vào mỗi layer. Kết quả gần tương đương full fine-tuning nhưng chạy được trên GPU 16GB miễn phí từ Colab.',
        ]},
      ],
    },
    {
      title: 'Tạo RAG Pipeline với Pinecone và Next.js trong 1 giờ',
      excerpt: 'Hướng dẫn tạo ứng dụng Q&A từ tài liệu riêng — sử dụng RAG, vector database, và streaming response.',
      cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop',
      tags: ['RAG', 'Pinecone', 'Next.js', 'Tutorial'],
      sections: [
        { heading: 'Kiến trúc RAG Pipeline', anchor: 'kien-truc', paragraphs: [
          'RAG (Retrieval-Augmented Generation) kết hợp search + AI generation: (1) Upload tài liệu → chunk → embed thành vectors → lưu Pinecone, (2) User hỏi → embed câu hỏi → tìm chunks liên quan từ Pinecone, (3) Ghép chunks + câu hỏi → gửi LLM → streaming response.',
          'Stack: Next.js 16 (frontend + API routes), Pinecone (vector DB, free tier 100K vectors), Claude Haiku 4.5 (LLM, $0.25/1M tokens), Vercel (hosting miễn phí).',
        ]},
      ],
    },
  ],
  'ai-vietnam': [
    {
      title: 'FPT ra mắt FPT AI Mentor — nền tảng gia sư AI đầu tiên tại Việt Nam',
      excerpt: 'FPT Education triển khai AI Mentor cho 100,000 học sinh — cá nhân hóa lộ trình học tập bằng AI.',
      cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=630&fit=crop',
      tags: ['FPT', 'AI Education', 'Vietnam', 'EdTech'],
      sections: [
        { heading: 'FPT AI Mentor hoạt động thế nào?', anchor: 'hoat-dong', paragraphs: [
          'FPT AI Mentor phân tích kết quả học tập, phong cách học, và điểm yếu của từng học sinh để tạo lộ trình cá nhân hóa. Hệ thống dùng Claude API cho phần giải thích bài tập và Gemini cho phân tích video bài giảng. Sau 3 tháng thử nghiệm, điểm trung bình học sinh tăng 1.5 điểm.',
        ]},
      ],
    },
    {
      title: 'Viettel AI Lab công bố mô hình ngôn ngữ tiếng Việt 13B tham số',
      excerpt: 'Viettel phát triển VietLM-13B — mô hình ngôn ngữ lớn đầu tiên được train hoàn toàn trên dữ liệu tiếng Việt.',
      cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
      tags: ['Viettel', 'Vietnamese LLM', 'NLP', 'Vietnam'],
      sections: [
        { heading: 'VietLM-13B vs các LLM quốc tế', anchor: 'so-sanh', paragraphs: [
          'VietLM-13B được train trên 500 tỷ token tiếng Việt từ báo chí, sách, Wikipedia, và dữ liệu web. Trên benchmark ViMMRC (đọc hiểu tiếng Việt), VietLM-13B đạt 89.3% — vượt GPT-4 (85.1%) và Claude 3.5 (86.7%). Tuy nhiên, trên tác vụ đa ngôn ngữ, các model quốc tế vẫn vượt trội.',
          'Viettel mở mã nguồn VietLM-13B trên HuggingFace, cho phép cộng đồng fine-tune cho các tác vụ đặc thù.',
        ]},
      ],
    },
    {
      title: 'Hà Nội khởi động "AI City" — khu đô thị thông minh AI đầu tiên Đông Nam Á',
      excerpt: 'Hà Nội hợp tác Samsung và VinGroup xây dựng khu đô thị AI tích hợp tại Đông Anh.',
      cover: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=630&fit=crop',
      tags: ['Smart City', 'Hanoi', 'AI Vietnam', 'Infrastructure'],
      sections: [
        { heading: 'Quy mô dự án', anchor: 'quy-mo', paragraphs: [
          'AI City rộng 500 hecta tại Đông Anh, Hà Nội — tích hợp AI vào giao thông (xe tự lái, đèn giao thông thông minh), an ninh (camera AI phát hiện bất thường), năng lượng (lưới điện AI tối ưu), và y tế (phòng khám AI sàng lọc bệnh). Tổng vốn đầu tư 2 tỷ USD, dự kiến hoàn thành 2030.',
        ]},
      ],
    },
  ],
  'prompt-lab': [
    {
      title: '20 Prompt Patterns hiệu quả nhất cho ChatGPT và Claude',
      excerpt: 'Tổng hợp 20 kỹ thuật prompting đã được kiểm chứng — từ Chain-of-Thought đến Tree-of-Thought.',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop',
      tags: ['Prompting', 'ChatGPT', 'Claude', 'Tips'],
      sections: [
        { heading: 'Chain-of-Thought (CoT)', anchor: 'cot', paragraphs: [
          'Thêm "Hãy suy nghĩ từng bước" vào prompt tăng accuracy 20-40% trên tác vụ logic và toán học. Biến thể: "Hãy suy nghĩ từng bước, sau đó kiểm tra lại câu trả lời" — thêm bước self-verification tăng thêm 10% accuracy.',
          'Ví dụ: thay vì "15% của 240 là bao nhiêu?", dùng "Tính 15% của 240. Hãy suy nghĩ từng bước: đầu tiên 10% là..., sau đó 5% là..., tổng là..."',
        ]},
        { heading: 'Few-Shot Prompting', anchor: 'few-shot', paragraphs: [
          'Cho AI 2-3 ví dụ input/output mẫu trước khi đưa task thực tế. Đặc biệt hiệu quả cho: phân loại văn bản, format dữ liệu, dịch thuật chuyên ngành. Mẹo: chọn ví dụ đa dạng, bao gồm cả edge cases.',
        ]},
      ],
    },
    {
      title: 'System Prompt: Bí quyết tạo AI assistant chuyên nghiệp',
      excerpt: 'Hướng dẫn viết system prompt hiệu quả — cách định nghĩa persona, rules, output format cho AI.',
      cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
      tags: ['System Prompt', 'AI Assistant', 'Prompt Engineering'],
      sections: [
        { heading: 'Cấu trúc system prompt chuẩn', anchor: 'cau-truc', paragraphs: [
          'System prompt hiệu quả gồm 5 phần: (1) Role — AI là ai, chuyên môn gì, (2) Context — bối cảnh sử dụng, (3) Rules — quy tắc bắt buộc (ngôn ngữ, tone, giới hạn), (4) Output format — cấu trúc output mong muốn, (5) Examples — 1-2 ví dụ input/output.',
          'Mẹo quan trọng: đặt rules quan trọng nhất ở đầu và cuối system prompt — LLM có xu hướng "nhớ" tốt hơn ở 2 vị trí này (primacy-recency effect).',
        ]},
      ],
    },
    {
      title: 'Prompt tiếng Việt vs tiếng Anh: Khi nào nên dùng ngôn ngữ nào?',
      excerpt: 'Thí nghiệm so sánh chất lượng output khi prompt bằng tiếng Việt và tiếng Anh trên GPT-5, Claude, Gemini.',
      cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop',
      tags: ['Vietnamese', 'Prompting', 'Language', 'Tips'],
      sections: [
        { heading: 'Kết quả thí nghiệm', anchor: 'ket-qua', paragraphs: [
          'Trên 100 tác vụ test: prompt tiếng Anh cho kết quả tốt hơn 15-25% ở tác vụ logic, coding, và phân tích kỹ thuật. Prompt tiếng Việt tốt hơn ở tác vụ viết content tiếng Việt, dịch thuật, và CSKH.',
          'Mẹo thực tế: dùng tiếng Anh cho system prompt + instructions, tiếng Việt cho context và output format. Ví dụ: "You are a Vietnamese customer service agent. Rules: [English]. Reply in Vietnamese."',
        ]},
      ],
    },
  ],
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Get first author for all posts
  const author = await Author.findOne();
  if (!author) { console.error('No author found. Run main seed first.'); process.exit(1); }

  let created = 0;
  for (const [catSlug, posts] of Object.entries(POSTS)) {
    const category = await Category.findOne({ slug: catSlug });
    if (!category) { console.log(`  ✗ Category "${catSlug}" not found — skipped`); continue; }

    console.log(`\n── ${category.name} (${catSlug}) ──`);
    for (const p of posts) {
      const existing = await Post.findOne({ title: p.title });
      if (existing) { console.log(`  ✓ "${p.title.slice(0,50)}..." exists — skipped`); continue; }

      const blocks = makeBlocks(p.sections);
      const wordCount = blocks.filter((b: any) => b.type === 'paragraph').reduce((sum: number, b: any) => sum + (b.content?.split(/\s+/).length || 0), 0);

      await Post.create({
        title: p.title,
        slug: p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        excerpt: p.excerpt,
        coverImage: p.cover,
        categoryId: category._id,
        authorId: author._id,
        tags: p.tags,
        contentBlocks: blocks,
        contentStructure: {
          toc: p.sections.map((s, i) => ({ id: `toc-${i}`, text: s.heading, anchor: s.anchor, level: 2 })),
          wordCount,
          readingTime: Math.ceil(wordCount / 200),
        },
        status: 'published', content: p.excerpt,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        viewCount: Math.floor(Math.random() * 5000) + 500,
        isFeatured: Math.random() > 0.7,
      });
      console.log(`  + "${p.title.slice(0,60)}..."`);
      created++;
    }
  }

  console.log(`\nDone. Created ${created} posts.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
