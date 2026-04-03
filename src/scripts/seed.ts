import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Tag } from '../models/tag.model';
import { Author } from '../models/author.model';
import { Post } from '../models/post.model';
import type { ContentSection } from '../models/post.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';

// ============================================================
// HELPERS
// ============================================================

function pid(n: number): string {
  return `block-${n.toString().padStart(3, '0')}`;
}

// ============================================================
// CONTENT BLOCKS — Post 1: GPT-5
// ============================================================

const gpt5Blocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'GPT-5 là gì và tại sao nó quan trọng?',
    anchor: 'gpt-5-la-gi',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'GPT-5 là mô hình ngôn ngữ lớn thế hệ thứ năm của OpenAI, được phát hành vào quý đầu năm 2026 sau hơn hai năm nghiên cứu và phát triển. Đây không đơn thuần là bước nâng cấp nhỏ từ GPT-4 — nó đại diện cho một bước nhảy vọt thực sự trong khả năng suy luận, lập kế hoạch đa bước và hiểu ngữ cảnh dài. Với kiến trúc Transformer được cải tiến sâu và tập dữ liệu huấn luyện lên tới hàng nghìn tỷ token, GPT-5 có thể xử lý các tác vụ phức tạp mà các phiên bản trước hoàn toàn không thể làm được.',
  },
  {
    id: pid(3), type: 'paragraph', order: 3,
    content: 'Điều làm GPT-5 nổi bật so với tất cả các mô hình AI trước đó là khả năng tự kiểm tra lỗi suy luận trong thời gian thực. OpenAI đã tích hợp một cơ chế "reflection loop" cho phép model nhìn lại đầu ra của chính mình, phát hiện mâu thuẫn logic và tự sửa chữa trước khi đưa ra câu trả lời cuối cùng. Điều này giúp GPT-5 đạt độ chính xác cao hơn đáng kể trên các bài kiểm tra toán học, lập trình và phân tích khoa học. Trong bài kiểm tra MATH-500 của MIT, GPT-5 đạt điểm 96,8%, so với 86,4% của GPT-4o.',
  },
  {
    id: pid(4), type: 'image', order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop',
      alt: 'GPT-5 AI model interface visualization',
      caption: 'Giao diện GPT-5 trên nền tảng ChatGPT — nguồn: OpenAI',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(5), type: 'heading', order: 5, level: 2,
    text: 'Các thông số kỹ thuật và benchmark của GPT-5',
    anchor: 'thong-so-ky-thuat',
  },
  {
    id: pid(6), type: 'paragraph', order: 6,
    content: 'Theo tài liệu kỹ thuật được OpenAI công bố, GPT-5 sử dụng kiến trúc Sparse Mixture-of-Experts (SMoE) với tổng số tham số ước tính khoảng 1,8 nghìn tỷ, trong đó chỉ khoảng 200 tỷ tham số được kích hoạt cho mỗi lần suy luận. Cách thiết kế này giúp giảm chi phí tính toán trong khi vẫn duy trì được năng lực của mô hình lớn. Context window của GPT-5 đã được mở rộng lên 256K token — đủ để xử lý toàn bộ một cuốn sách dày hoặc một codebase vừa trong một lần.',
  },
  {
    id: pid(7), type: 'table', order: 7,
    table: {
      headers: ['Benchmark', 'GPT-4o', 'GPT-5', 'Cải thiện'],
      rows: [
        ['MATH-500', '86.4%', '96.8%', '+10.4%'],
        ['HumanEval (coding)', '90.2%', '97.5%', '+7.3%'],
        ['MMLU', '88.7%', '94.2%', '+5.5%'],
        ['GPQA Diamond', '56.1%', '78.3%', '+22.2%'],
        ['SWE-bench Verified', '49.0%', '71.8%', '+22.8%'],
        ['AIME 2025', '74.0%', '89.4%', '+15.4%'],
      ],
    },
  },
  {
    id: pid(8), type: 'paragraph', order: 8,
    content: 'Đặc biệt đáng chú ý là kết quả trên SWE-bench Verified — một bài kiểm tra đánh giá khả năng sửa lỗi phần mềm thực tế trên các GitHub issue. GPT-5 đạt 71,8%, vượt qua ngưỡng 50% lần đầu tiên trong lịch sử AI, có nghĩa là mô hình có thể tự động giải quyết hơn 7 trong 10 lỗi phần mềm thực tế khi được giao nhiệm vụ. Đây là một bước tiến khổng lồ đối với ngành kỹ thuật phần mềm.',
  },
  {
    id: pid(9), type: 'heading', order: 9, level: 2,
    text: 'Khả năng đa phương thức (Multimodal) của GPT-5',
    anchor: 'kha-nang-da-phuong-thuc',
  },
  {
    id: pid(10), type: 'paragraph', order: 10,
    content: 'GPT-5 là mô hình đa phương thức hoàn chỉnh, có khả năng xử lý đồng thời văn bản, hình ảnh, âm thanh và video. Không giống như GPT-4V chỉ có thể phân tích hình ảnh tĩnh, GPT-5 có thể hiểu video clip dài tới 30 phút, nhận biết ngữ cảnh từ âm thanh, và tạo ra các phân tích tổng hợp từ nhiều nguồn truyền thông khác nhau. Tính năng này mở ra khả năng ứng dụng rộng lớn trong y tế (phân tích hình ảnh MRI kết hợp với ghi chú bác sĩ), giáo dục (hiểu video bài giảng) và nghiên cứu khoa học.',
  },
  {
    id: pid(11), type: 'paragraph', order: 11,
    content: 'Trong thực tế, GPT-5 đã được thử nghiệm trong vai trò trợ lý y tế tại một số bệnh viện ở Mỹ và Singapore. Mô hình có khả năng phân tích đồng thời kết quả xét nghiệm, hình ảnh X-quang và tiền sử bệnh án của bệnh nhân để đề xuất chẩn đoán. Trong một nghiên cứu được công bố trên The Lancet, GPT-5 đạt độ chính xác 91,3% trong chẩn đoán ung thư hạch từ hình ảnh PET-CT, sánh ngang với bác sĩ chuyên khoa có kinh nghiệm 10 năm.',
  },
  {
    id: pid(12), type: 'image', order: 12,
    image: {
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop',
      alt: 'Multimodal AI processing images and text',
      caption: 'GPT-5 xử lý đồng thời nhiều loại dữ liệu — hình ảnh, văn bản, âm thanh',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(13), type: 'heading', order: 13, level: 2,
    text: 'Bảng giá và các gói sử dụng GPT-5',
    anchor: 'bang-gia-goi-su-dung',
  },
  {
    id: pid(14), type: 'paragraph', order: 14,
    content: 'OpenAI đã công bố cấu trúc giá mới cho GPT-5 với ba phiên bản chính: GPT-5 Nano (nhỏ gọn, nhanh), GPT-5 Standard và GPT-5 Pro (hiệu suất tối đa). Mức giá API cho GPT-5 Standard là $15 cho mỗi triệu token đầu vào và $60 cho mỗi triệu token đầu ra — cao hơn GPT-4o nhưng được bù đắp bởi chất lượng đầu ra vượt trội và giảm số lần cần gọi lại. Với người dùng ChatGPT Plus, GPT-5 được tích hợp vào gói $20/tháng với giới hạn 40 tin nhắn/ngày.',
  },
  {
    id: pid(15), type: 'list', order: 15,
    list: {
      type: 'unordered',
      items: [
        'GPT-5 Nano: $0.15/1M input tokens, $0.60/1M output tokens — cho tác vụ đơn giản, latency thấp',
        'GPT-5 Standard: $15/1M input tokens, $60/1M output tokens — cân bằng giữa chất lượng và chi phí',
        'GPT-5 Pro: $75/1M input tokens, $300/1M output tokens — cho reasoning phức tạp, extended thinking',
        'ChatGPT Plus: $20/tháng, giới hạn 40 tin/ngày với GPT-5 Standard',
        'ChatGPT Pro: $200/tháng, không giới hạn với GPT-5 Pro và extended thinking mode',
      ],
    },
  },
  {
    id: pid(16), type: 'heading', order: 16, level: 2,
    text: 'Khả năng lập trình và hỗ trợ developer',
    anchor: 'lap-trinh-ho-tro-developer',
  },
  {
    id: pid(17), type: 'paragraph', order: 17,
    content: 'Đối với cộng đồng lập trình viên, GPT-5 là một công cụ cách mạng. Khả năng hiểu và tạo mã nguồn của nó vượt xa bất kỳ mô hình nào trước đó. GPT-5 có thể đọc toàn bộ repository code, hiểu kiến trúc tổng thể của dự án, và đề xuất refactor thông minh mà không làm mất đi business logic. Đặc biệt, tính năng "Code Interpreter Pro" cho phép GPT-5 thực thi mã trong môi trường sandbox, tự kiểm tra kết quả và sửa lỗi theo vòng lặp cho đến khi đạt kết quả mong muốn.',
  },
  {
    id: pid(18), type: 'code', order: 18,
    language: 'python',
    content: `# Ví dụ: GPT-5 tự động viết và tối ưu hóa thuật toán sắp xếp
# Sau khi nhận yêu cầu, GPT-5 tạo ra code này và giải thích từng bước

def quicksort_optimized(arr: list, low: int = 0, high: int = None) -> list:
    """
    Quicksort với median-of-three pivot selection để tránh worst case O(n²)
    GPT-5 tự động chọn thuật toán phù hợp dựa trên kích thước input
    """
    if high is None:
        high = len(arr) - 1

    # Insertion sort cho mảng nhỏ (tối ưu cho n < 10)
    if high - low < 10:
        for i in range(low + 1, high + 1):
            key = arr[i]
            j = i - 1
            while j >= low and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key
        return arr

    # Median-of-three pivot
    mid = (low + high) // 2
    if arr[low] > arr[mid]:
        arr[low], arr[mid] = arr[mid], arr[low]
    if arr[low] > arr[high]:
        arr[low], arr[high] = arr[high], arr[low]
    if arr[mid] > arr[high]:
        arr[mid], arr[high] = arr[high], arr[mid]

    pivot = arr[mid]
    arr[mid], arr[high - 1] = arr[high - 1], arr[mid]

    i, j = low, high - 1
    while True:
        i += 1
        while arr[i] < pivot: i += 1
        j -= 1
        while arr[j] > pivot: j -= 1
        if i >= j: break
        arr[i], arr[j] = arr[j], arr[i]

    arr[i], arr[high - 1] = arr[high - 1], arr[i]
    quicksort_optimized(arr, low, i - 1)
    quicksort_optimized(arr, i + 1, high)
    return arr

# Test case
import random
test_data = [random.randint(1, 10000) for _ in range(10000)]
result = quicksort_optimized(test_data.copy())
print(f"Sorted: {result[:10]}... Time: O(n log n) avg")`,
  },
  {
    id: pid(19), type: 'heading', order: 19, level: 2,
    text: 'So sánh GPT-5 với các đối thủ cạnh tranh',
    anchor: 'so-sanh-doi-thu',
  },
  {
    id: pid(20), type: 'paragraph', order: 20,
    content: 'Trong bối cảnh cạnh tranh khốc liệt của thị trường AI năm 2026, GPT-5 phải đối mặt với các đối thủ mạnh như Claude 4 Opus của Anthropic và Gemini 2.5 Pro của Google. Mỗi mô hình có điểm mạnh riêng: GPT-5 dẫn đầu về khả năng code và tác vụ sáng tạo; Claude 4 Opus vượt trội về reasoning logic và an toàn; Gemini 2.5 Pro nổi bật với khả năng multimodal và tích hợp hệ sinh thái Google. Người dùng thông minh sẽ biết cách kết hợp nhiều mô hình tùy theo từng loại tác vụ.',
  },
  {
    id: pid(21), type: 'review', order: 21,
    review: {
      provider: 'OpenAI GPT-5',
      rating: 4.7,
      summary: 'Mô hình AI mạnh nhất hiện tại cho tác vụ sáng tạo và lập trình, với khả năng multimodal toàn diện.',
      pros: [
        'Khả năng lập trình vượt trội, đạt 97.5% trên HumanEval',
        'Context window 256K token, xử lý được cả codebase lớn',
        'Multimodal hoàn chỉnh: text, image, audio, video',
        'Tự sửa lỗi suy luận với reflection loop',
        'Tích hợp sẵn trong ChatGPT, dễ tiếp cận',
      ],
      cons: [
        'Giá API cao hơn so với các đối thủ',
        'GPT-5 Pro đắt ($200/tháng) với người dùng thông thường',
        'Đôi khi "hallucinate" trên các câu hỏi chuyên sâu',
        'Không có khả năng truy cập internet real-time mặc định',
      ],
    },
  },
  {
    id: pid(22), type: 'heading', order: 22, level: 2,
    text: 'Ứng dụng thực tế của GPT-5 trong doanh nghiệp',
    anchor: 'ung-dung-thuc-te',
  },
  {
    id: pid(23), type: 'paragraph', order: 23,
    content: 'Nhiều tập đoàn lớn đã triển khai GPT-5 trong quy trình làm việc của họ. Microsoft đã tích hợp GPT-5 vào toàn bộ bộ sản phẩm Microsoft 365 Copilot, cho phép tự động hóa quy trình từ soạn thảo email, phân tích dữ liệu Excel đến tạo báo cáo PowerPoint chuyên nghiệp. Salesforce dùng GPT-5 để tự động hóa quy trình CRM, giúp đội ngũ bán hàng tiết kiệm 40% thời gian nhập dữ liệu và tạo báo giá. Adobe đã tích hợp GPT-5 vào Firefly để tạo nội dung sáng tạo chuyên nghiệp hơn bao giờ hết.',
  },
  {
    id: pid(24), type: 'paragraph', order: 24,
    content: 'Tại Việt Nam, nhiều startup và doanh nghiệp công nghệ đã bắt đầu thử nghiệm GPT-5 trong các sản phẩm của mình. Công ty fintech VNPay đang dùng GPT-5 để phân tích hành vi gian lận thẻ tín dụng với độ chính xác cao hơn 30% so với hệ thống cũ. FPT Software đã tích hợp GPT-5 vào pipeline CI/CD để tự động review code và phát hiện lỗ hổng bảo mật trước khi deploy. Đây là dấu hiệu cho thấy GPT-5 không chỉ là công cụ của người dùng cá nhân mà đã trở thành hạ tầng AI quan trọng cho doanh nghiệp.',
  },
  {
    id: pid(25), type: 'image', order: 25,
    image: {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop',
      alt: 'Enterprise AI deployment GPT-5',
      caption: 'GPT-5 đang được triển khai rộng rãi trong môi trường doanh nghiệp',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(26), type: 'heading', order: 26, level: 2,
    text: 'Câu hỏi thường gặp về GPT-5',
    anchor: 'faq-gpt5',
  },
  {
    id: pid(27), type: 'faq', order: 27,
    faqs: [
      {
        question: 'GPT-5 có thể thay thế lập trình viên không?',
        answer: 'GPT-5 là công cụ hỗ trợ mạnh mẽ nhưng chưa thể thay thế hoàn toàn lập trình viên. Nó xuất sắc trong việc viết code theo spec rõ ràng, debug lỗi đơn giản và tạo boilerplate code. Tuy nhiên, các quyết định kiến trúc phức tạp, hiểu ngữ cảnh kinh doanh sâu và sáng tạo giải pháp mới vẫn cần sự can thiệp của con người. Lập trình viên biết sử dụng GPT-5 hiệu quả sẽ có năng suất cao hơn đáng kể.',
      },
      {
        question: 'GPT-5 có an toàn để dùng cho dữ liệu nhạy cảm không?',
        answer: 'OpenAI cung cấp tùy chọn Enterprise với cam kết không dùng dữ liệu khách hàng để huấn luyện mô hình. Tuy nhiên, với dữ liệu cực kỳ nhạy cảm (thông tin y tế, tài chính), bạn nên cân nhắc triển khai mô hình tại chỗ (on-premise) hoặc dùng Azure OpenAI Service với các cam kết bảo mật doanh nghiệp.',
      },
      {
        question: 'Làm thế nào để tận dụng tối đa GPT-5?',
        answer: 'Để tận dụng tối đa GPT-5, hãy: (1) Sử dụng system prompt rõ ràng, cụ thể về vai trò và định dạng đầu ra mong muốn; (2) Tận dụng context window lớn bằng cách cung cấp nhiều ngữ cảnh; (3) Dùng extended thinking mode cho các bài toán phức tạp; (4) Kết hợp với tools như Code Interpreter và web browsing.',
      },
    ],
  },
];

// ============================================================
// CONTENT BLOCKS — Post 2: Claude 4 Opus
// ============================================================

const claude4Blocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'Claude 4 Opus — Đỉnh cao mới của AI suy luận',
    anchor: 'claude-4-opus-dinh-cao',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'Claude 4 Opus là flagship model mới nhất của Anthropic, ra mắt vào tháng 3 năm 2026, và ngay lập tức thiết lập kỷ lục mới trong nhiều bài kiểm tra suy luận logic và phân tích khoa học. Anthropic đặt tên "Opus" để nhấn mạnh đây là tác phẩm cao cấp nhất trong dòng sản phẩm Claude 4, bên cạnh Claude 4 Sonnet (cân bằng) và Claude 4 Haiku (nhanh và rẻ). Điều làm Claude 4 Opus đặc biệt không chỉ là hiệu suất mà còn là cách tiếp cận an toàn và minh bạch trong thiết kế.',
  },
  {
    id: pid(3), type: 'paragraph', order: 3,
    content: 'Anthropic là công ty AI được sáng lập bởi các cựu nhân viên OpenAI với sứ mệnh xây dựng AI an toàn và có lợi cho nhân loại. Triết lý "Constitutional AI" của họ — huấn luyện model dựa trên tập hợp các nguyên tắc đạo đức rõ ràng — đã tạo ra một mô hình có xu hướng từ chối các yêu cầu có hại, giải thích lý do từ chối một cách rõ ràng, và thể hiện sự không chắc chắn khi cần thiết. Đây là những đặc điểm mà người dùng doanh nghiệp đặc biệt đánh giá cao.',
  },
  {
    id: pid(4), type: 'image', order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=1200&h=630&fit=crop',
      alt: 'Claude 4 Opus AI reasoning interface',
      caption: 'Claude 4 Opus — mô hình AI với khả năng suy luận mạnh nhất từ Anthropic',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(5), type: 'heading', order: 5, level: 2,
    text: 'Kiến trúc và cơ chế suy luận của Claude 4',
    anchor: 'kien-truc-suy-luan',
  },
  {
    id: pid(6), type: 'paragraph', order: 6,
    content: 'Claude 4 Opus sử dụng cơ chế "Extended Thinking" cho phép model dành thời gian suy nghĩ trước khi trả lời. Khác với chain-of-thought đơn giản, Extended Thinking của Claude 4 tạo ra một luồng suy luận nội tâm mà người dùng có thể xem (hoặc ẩn tùy thiết lập). Luồng suy luận này có thể kéo dài hàng nghìn token, cho phép model khám phá nhiều hướng tiếp cận, loại bỏ những hướng không khả thi và đến với câu trả lời tốt nhất. Đây là lý do Claude 4 Opus đặc biệt mạnh trong toán học và lập trình phức tạp.',
  },
  {
    id: pid(7), type: 'paragraph', order: 7,
    content: 'Context window của Claude 4 Opus là 200K token — đủ để xử lý khoảng 150,000 từ hoặc một codebase nhỏ. Anthropic tuyên bố họ đã cải thiện đáng kể khả năng "needle in a haystack" — tức là tìm thông tin cụ thể trong tài liệu dài. Trong thực tế, điều này có nghĩa là bạn có thể cho Claude 4 đọc toàn bộ codebase của mình và hỏi về bất kỳ function nào mà nó sẽ tìm và trả lời chính xác, ngay cả khi thông tin đó nằm ở đầu tài liệu dài.',
  },
  {
    id: pid(8), type: 'heading', order: 8, level: 2,
    text: 'Khả năng lập trình và coding của Claude 4 Opus',
    anchor: 'kha-nang-lap-trinh',
  },
  {
    id: pid(9), type: 'paragraph', order: 9,
    content: 'Trong cộng đồng lập trình viên, Claude 4 Opus được đánh giá là mô hình tốt nhất cho các dự án coding phức tạp. Kết quả trên SWE-bench Verified đạt 72,5% — cao nhất trong tất cả các mô hình được kiểm tra. Khả năng này không chỉ giới hạn ở việc viết code mới mà còn bao gồm: đọc và hiểu codebase hiện có, phát hiện bug tinh tế trong logic nghiệp vụ, đề xuất refactoring hợp lý, và viết test case có coverage cao. Claude 4 đặc biệt giỏi với các ngôn ngữ như Rust, Haskell và các ngôn ngữ functional programming.',
  },
  {
    id: pid(10), type: 'code', order: 10,
    language: 'typescript',
    content: `// Claude 4 Opus được yêu cầu tạo một hệ thống retry với exponential backoff
// Kết quả: code production-ready với đầy đủ type safety và error handling

interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterFactor: number;
  retryableErrors?: (error: Error) => boolean;
}

class RetryError extends Error {
  constructor(
    public readonly attempts: number,
    public readonly lastError: Error
  ) {
    super(\`Failed after \${attempts} attempts: \${lastError.message}\`);
    this.name = 'RetryError';
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T> {
  const {
    maxAttempts,
    baseDelayMs,
    maxDelayMs,
    jitterFactor,
    retryableErrors = () => true,
  } = config;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts || !retryableErrors(lastError)) {
        throw new RetryError(attempt, lastError);
      }

      // Exponential backoff với jitter để tránh thundering herd
      const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
      const jitter = exponentialDelay * jitterFactor * Math.random();
      const delay = Math.min(exponentialDelay + jitter, maxDelayMs);

      console.warn(\`Attempt \${attempt} failed: \${lastError.message}. Retrying in \${Math.round(delay)}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new RetryError(maxAttempts, lastError!);
}

// Sử dụng:
const result = await withRetry(
  () => fetch('https://api.example.com/data').then(r => r.json()),
  {
    maxAttempts: 5,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    jitterFactor: 0.3,
    retryableErrors: (err) => err.message.includes('rate limit') || err.message.includes('timeout'),
  }
);`,
  },
  {
    id: pid(11), type: 'heading', order: 11, level: 2,
    text: 'Claude 4 trong vai trò AI Agent',
    anchor: 'claude-4-ai-agent',
  },
  {
    id: pid(12), type: 'paragraph', order: 12,
    content: 'Một trong những điểm mạnh lớn nhất của Claude 4 Opus là khả năng hoạt động như một AI Agent độc lập, thực hiện các nhiệm vụ dài hạn mà không cần can thiệp liên tục của người dùng. Anthropic đã thiết kế Claude 4 với "agentic capabilities" — khả năng lập kế hoạch, sử dụng công cụ (tools), ghi nhớ trạng thái giữa các bước và tự điều chỉnh khi gặp sai sót. Kiến trúc này cho phép Claude 4 thực hiện các workflow phức tạp như: nghiên cứu thị trường tự động, quản lý codebase, lên lịch và gửi email, hay thậm chí điều hành một pipeline dữ liệu hoàn chỉnh.',
  },
  {
    id: pid(13), type: 'paragraph', order: 13,
    content: 'Anthropic cũng công bố Claude 4 hỗ trợ Computer Use — khả năng điều khiển máy tính ảo để thực hiện tác vụ trực tiếp trên giao diện đồ họa. Claude có thể mở trình duyệt, điều hướng trang web, điền form, chụp màn hình để kiểm tra kết quả và thậm chí viết email từ ứng dụng email thực. Mức độ tự chủ này đưa Claude 4 lên một tầm mới — không chỉ là chatbot mà là trợ lý kỹ thuật số thực sự.',
  },
  {
    id: pid(14), type: 'image', order: 14,
    image: {
      url: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=1200&h=630&fit=crop',
      alt: 'AI agent automation workflow',
      caption: 'Claude 4 Opus hoạt động như AI agent tự động hóa quy trình làm việc',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(15), type: 'heading', order: 15, level: 2,
    text: 'Benchmark chi tiết: Claude 4 Opus so với GPT-5',
    anchor: 'benchmark-chi-tiet',
  },
  {
    id: pid(16), type: 'table', order: 16,
    table: {
      headers: ['Benchmark', 'Claude 4 Opus', 'GPT-5', 'Winner'],
      rows: [
        ['MMLU', '93.7%', '94.2%', 'GPT-5 (sát nút)'],
        ['MATH-500', '97.1%', '96.8%', 'Claude 4 (sát nút)'],
        ['HumanEval', '96.8%', '97.5%', 'GPT-5'],
        ['SWE-bench Verified', '72.5%', '71.8%', 'Claude 4'],
        ['GPQA Diamond', '82.4%', '78.3%', 'Claude 4'],
        ['DROP (reading comp)', '91.2%', '89.5%', 'Claude 4'],
        ['HellaSwag', '97.8%', '97.3%', 'Claude 4'],
        ['ARC Challenge', '98.1%', '97.9%', 'Claude 4 (sát nút)'],
      ],
    },
  },
  {
    id: pid(17), type: 'heading', order: 17, level: 2,
    text: 'Điểm mạnh về an toàn và đạo đức AI',
    anchor: 'an-toan-dao-duc',
  },
  {
    id: pid(18), type: 'paragraph', order: 18,
    content: 'Anthropic nổi tiếng với cam kết an toàn AI, và Claude 4 là hiện thân của những nghiên cứu này. Claude 4 sử dụng Constitutional AI 2.0 — một phương pháp huấn luyện mới nơi model học cách từ chối các yêu cầu có hại không chỉ từ dữ liệu labeled mà còn từ việc tự lý luận về hậu quả. Trong các bài kiểm tra red-teaming, Claude 4 cho thấy khả năng kháng cự cao hơn với các prompt injection, jailbreak và các kỹ thuật thao túng tinh vi. Đây là lý do chính khiến nhiều tổ chức tài chính, y tế và chính phủ ưu tiên Claude 4.',
  },
  {
    id: pid(19), type: 'list', order: 19,
    list: {
      type: 'unordered',
      items: [
        'Constitutional AI 2.0: học từ nguyên tắc, không chỉ từ ví dụ',
        'Interpretability research: Anthropic có thể "đọc" suy nghĩ của model',
        'Honesty training: Claude được huấn luyện để thừa nhận khi không biết',
        'Harm avoidance: từ chối thông minh, không overly restrictive',
        'Privacy-preserving: không nhớ thông tin giữa các conversation',
      ],
    },
  },
  {
    id: pid(20), type: 'heading', order: 20, level: 2,
    text: 'Giá cả và cách tiếp cận Claude 4 Opus',
    anchor: 'gia-ca-tiep-can',
  },
  {
    id: pid(21), type: 'paragraph', order: 21,
    content: 'Claude 4 Opus có thể được truy cập qua Claude.ai (gói Pro $20/tháng hoặc Team $25/người/tháng) hoặc qua API của Anthropic. Giá API cho Claude 4 Opus là $15 cho mỗi triệu input token và $75 cho mỗi triệu output token. Đây là mức giá cao hơn Claude 4 Sonnet ($3/$15 per million tokens) nhưng phù hợp cho các tác vụ đòi hỏi chất lượng cao nhất. Claude 4 Haiku ($0.25/$1.25) là lựa chọn kinh tế cho các ứng dụng cần xử lý volume lớn.',
  },
  {
    id: pid(22), type: 'quote', order: 22,
    content: '"Claude 4 Opus đã đặt ra tiêu chuẩn mới cho AI reasoning. Đây là lần đầu tiên tôi cảm thấy thoải mái khi giao phó các dự án kỹ thuật phức tạp cho AI mà không cần kiểm tra kỹ từng bước." — Andrej Karpathy, cựu Director of AI tại Tesla và OpenAI',
  },
  {
    id: pid(23), type: 'heading', order: 23, level: 2,
    text: 'Câu hỏi thường gặp về Claude 4 Opus',
    anchor: 'faq-claude4',
  },
  {
    id: pid(24), type: 'faq', order: 24,
    faqs: [
      {
        question: 'Claude 4 Opus có tốt hơn GPT-5 không?',
        answer: 'Phụ thuộc vào tác vụ. Claude 4 Opus dẫn đầu về GPQA Diamond (khoa học tiến sĩ), SWE-bench (coding thực tế) và các bài kiểm tra suy luận logic. GPT-5 mạnh hơn về tác vụ sáng tạo, đa ngôn ngữ và multimodal. Cho lập trình phức tạp và phân tích khoa học, Claude 4 Opus là lựa chọn tốt hơn.',
      },
      {
        question: 'Extended thinking của Claude 4 hoạt động như thế nào?',
        answer: 'Extended thinking cho phép Claude 4 "suy nghĩ" trước khi trả lời bằng cách tạo ra một luồng suy luận nội tâm. Token budget cho thinking có thể lên tới 32K token. Người dùng có thể xem luồng suy luận này để hiểu cách model đi đến kết luận. Tính năng này đặc biệt hữu ích cho toán học, logic và lập trình phức tạp.',
      },
    ],
  },
];

// ============================================================
// CONTENT BLOCKS — Post 3: Gemini 2.5 Pro
// ============================================================

const gemini25Blocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'Gemini 2.5 Pro — Cuộc phản công của Google DeepMind',
    anchor: 'gemini-25-phan-cong',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'Sau khi phải chứng kiến GPT-4 và Claude 3 chiếm lĩnh thị trường AI trong năm 2023-2024, Google DeepMind đã thực hiện một cuộc tái cơ cấu lớn, hợp nhất Google Brain và DeepMind để tập trung toàn lực vào dòng sản phẩm Gemini. Kết quả là Gemini 2.5 Pro — một mô hình vừa công bố đầu năm 2026 với nhiều điểm nổi bật đáng kể. Không chỉ cải thiện về hiệu suất, Google còn mang lại lợi thế cạnh tranh lớn nhờ tích hợp sâu vào hệ sinh thái Google Search, Google Workspace và Google Cloud.',
  },
  {
    id: pid(3), type: 'paragraph', order: 3,
    content: 'Gemini 2.5 Pro được xây dựng với kiến trúc đa phương thức (native multimodal) từ đầu — khác với GPT-4 hay Claude 3 vốn được thiết kế cho văn bản trước rồi mới bổ sung khả năng hình ảnh. Điều này cho phép Gemini 2.5 Pro xử lý đồng thời và liền mạch các loại dữ liệu khác nhau: văn bản, hình ảnh, âm thanh, video và thậm chí là mã lập trình trong cùng một luồng suy luận duy nhất. Khả năng "tư duy đa phương thức" này là điểm khác biệt cơ bản so với các đối thủ.',
  },
  {
    id: pid(4), type: 'image', order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&h=630&fit=crop',
      alt: 'Google Gemini 2.5 Pro multimodal AI',
      caption: 'Gemini 2.5 Pro — mô hình đa phương thức mạnh mẽ từ Google DeepMind',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(5), type: 'heading', order: 5, level: 2,
    text: 'Context window khổng lồ 2 triệu token',
    anchor: 'context-window-2-trieu-token',
  },
  {
    id: pid(6), type: 'paragraph', order: 6,
    content: 'Tính năng gây chú ý nhất của Gemini 2.5 Pro là context window lên tới 2 triệu token — gấp 8 lần GPT-5 và gấp 10 lần Claude 4 Opus. Để hiểu quy mô này: 2 triệu token tương đương với khoảng 1,5 triệu từ tiếng Anh, hay toàn bộ tuyển tập Harry Potter (7 cuốn) cộng với nhiều cuốn sách khác. Trong thực tế phát triển phần mềm, điều này có nghĩa là bạn có thể cho Gemini 2.5 Pro đọc toàn bộ codebase của một dự án lớn, bao gồm cả documentation và test cases, và yêu cầu phân tích toàn diện.',
  },
  {
    id: pid(7), type: 'paragraph', order: 7,
    content: 'Google đã minh họa khả năng này bằng các demo ấn tượng: phân tích toàn bộ codebase của một ứng dụng iOS (~750K token), tìm ra 47 vấn đề tiềm ẩn và đề xuất refactoring toàn diện. Hay phân tích 10 năm dữ liệu nghiên cứu khoa học (khoảng 1M token) để tổng hợp insights và phát hiện mâu thuẫn giữa các nghiên cứu. Context window lớn cũng mở ra khả năng dùng Gemini 2.5 Pro như một knowledge base động — bạn có thể nhúng toàn bộ tài liệu công ty vào context và hỏi bất kỳ câu hỏi nào.',
  },
  {
    id: pid(8), type: 'heading', order: 8, level: 2,
    text: 'Khả năng xử lý video và âm thanh',
    anchor: 'xu-ly-video-am-thanh',
  },
  {
    id: pid(9), type: 'paragraph', order: 9,
    content: 'Khả năng xử lý video của Gemini 2.5 Pro vượt trội so với các đối thủ. Model có thể phân tích video dài tới 2 giờ, nhận diện các sự kiện, theo dõi đối tượng qua thời gian và hiểu mối quan hệ nhân-quả trong video. Trong một demo, Google cho thấy Gemini 2.5 Pro có thể xem một video dạy học về lập trình và sau đó trả lời câu hỏi về code xuất hiện trong video, thậm chí viết lại code đó với các cải tiến. Đối với âm thanh, Gemini 2.5 Pro hỗ trợ 20 ngôn ngữ với khả năng nhận dạng giọng nói chính xác cao, kể cả tiếng Việt.',
  },
  {
    id: pid(10), type: 'table', order: 10,
    table: {
      headers: ['Tính năng', 'Gemini 2.5 Pro', 'GPT-5', 'Claude 4 Opus'],
      rows: [
        ['Context window', '2M tokens', '256K tokens', '200K tokens'],
        ['Xử lý video', 'Tới 2 giờ', '30 phút', 'Không hỗ trợ'],
        ['Ngôn ngữ nói', '20 ngôn ngữ', '10 ngôn ngữ', 'Không có audio'],
        ['Tích hợp Google', 'Có (Search, Docs, Drive)', 'Không', 'Không'],
        ['Code execution', 'Có (sandbox)', 'Có', 'Có'],
        ['Giá (API)', '$7/1M input, $21/output', '$15/$60', '$15/$75'],
      ],
    },
  },
  {
    id: pid(11), type: 'heading', order: 11, level: 2,
    text: 'Tích hợp với hệ sinh thái Google',
    anchor: 'tich-hop-google',
  },
  {
    id: pid(12), type: 'paragraph', order: 12,
    content: 'Lợi thế cạnh tranh lớn nhất của Gemini 2.5 Pro là sự tích hợp sâu vào hệ sinh thái Google. Trong Google Workspace, Gemini có thể đọc và viết vào Google Docs, Sheets, Slides, Gmail và Google Drive. Trong Google Search, Gemini cung cấp câu trả lời tổng hợp ngay trong trang kết quả. Đặc biệt, Gemini 2.5 Pro có thể truy cập thông tin thời gian thực từ Google Search — một lợi thế lớn so với GPT-5 và Claude 4 vốn có knowledge cutoff date.',
  },
  {
    id: pid(13), type: 'paragraph', order: 13,
    content: 'Cho các nhà phát triển, Google Cloud cung cấp Gemini 2.5 Pro qua Vertex AI với các tính năng enterprise như fine-tuning, data governance và SLA đảm bảo 99.9% uptime. Giá API cho Gemini 2.5 Pro là $7/1M input token và $21/1M output token — rẻ hơn đáng kể so với GPT-5 và Claude 4 Opus. Đây là yếu tố quan trọng cho các ứng dụng cần xử lý volume lớn.',
  },
  {
    id: pid(14), type: 'code', order: 14,
    language: 'python',
    content: `# Ví dụ sử dụng Gemini 2.5 Pro API với Google AI SDK
import google.generativeai as genai
from pathlib import Path

# Khởi tạo client
genai.configure(api_key="YOUR_API_KEY")

# Tạo model với 2M context window
model = genai.GenerativeModel(
    model_name="gemini-2.5-pro",
    generation_config={
        "temperature": 0.7,
        "max_output_tokens": 8192,
        "top_p": 0.95,
    }
)

# Ví dụ: phân tích video + yêu cầu code
video_file = genai.upload_file(
    path="tutorial_video.mp4",
    mime_type="video/mp4"
)

# Đợi video được xử lý
import time
while video_file.state.name == "PROCESSING":
    time.sleep(2)
    video_file = genai.get_file(video_file.name)

# Hỏi về nội dung video
response = model.generate_content([
    video_file,
    "Hãy tóm tắt các bước trong video và viết lại code "
    "xuất hiện trong video với các cải tiến về performance."
])

print(response.text)

# Ví dụ: sử dụng context window lớn để phân tích codebase
codebase_content = ""
for file in Path("./src").rglob("*.py"):
    codebase_content += f"\\n\\n# File: {file}\\n"
    codebase_content += file.read_text()

response = model.generate_content(
    f"Phân tích codebase sau và tìm các vấn đề tiềm ẩn:\\n{codebase_content}"
)`,
  },
  {
    id: pid(15), type: 'heading', order: 15, level: 2,
    text: 'Gemini 2.5 Pro trong ứng dụng thực tế',
    anchor: 'ung-dung-thuc-te',
  },
  {
    id: pid(16), type: 'paragraph', order: 16,
    content: 'Tại Google I/O 2026, Google đã trình diễn nhiều ứng dụng thực tế ấn tượng của Gemini 2.5 Pro. Đáng chú ý nhất là tính năng "Project Astra" — một trợ lý AI thực tế tăng cường có thể nhìn qua camera điện thoại, nhận diện đồ vật trong môi trường và trả lời câu hỏi theo ngữ cảnh. Tưởng tượng bạn chỉ camera vào động cơ ô tô bị hỏng và Gemini sẽ hướng dẫn từng bước sửa chữa dựa trên những gì nó nhìn thấy — đây chính xác là tầm nhìn của Google cho AI đa phương thức.',
  },
  {
    id: pid(17), type: 'image', order: 17,
    image: {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
      alt: 'Google AI assistant multimodal capabilities',
      caption: 'Gemini 2.5 Pro trong ứng dụng thực tế tăng cường Project Astra',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(18), type: 'heading', order: 18, level: 2,
    text: 'Điểm yếu và hạn chế của Gemini 2.5 Pro',
    anchor: 'diem-yeu-han-che',
  },
  {
    id: pid(19), type: 'paragraph', order: 19,
    content: 'Dù có nhiều điểm mạnh ấn tượng, Gemini 2.5 Pro vẫn có một số hạn chế đáng lưu ý. Thứ nhất, mặc dù context window lên tới 2M token nhưng chất lượng phân tích có xu hướng giảm với các nội dung nằm ở giữa context rất dài — vấn đề "lost in the middle" vẫn chưa được giải quyết hoàn toàn. Thứ hai, Gemini 2.5 Pro đôi khi thể hiện sự thiên vị nhất định trong câu trả lời, có xu hướng ủng hộ quan điểm của Google hoặc tránh phê phán các sản phẩm Google. Thứ ba, khả năng lập trình vẫn thấp hơn Claude 4 Opus và GPT-5 trong các bài kiểm tra chuẩn hóa.',
  },
  {
    id: pid(20), type: 'list', order: 20,
    list: {
      type: 'unordered',
      items: [
        'Điểm mạnh: context window 2M token, multimodal native, tích hợp Google',
        'Điểm mạnh: giá API rẻ nhất trong big three, hỗ trợ real-time search',
        'Điểm yếu: "lost in the middle" với context rất dài',
        'Điểm yếu: coding benchmark thấp hơn Claude 4 và GPT-5',
        'Điểm yếu: availability ở một số region còn hạn chế',
        'Điểm yếu: API latency cao hơn so với đối thủ',
      ],
    },
  },
  {
    id: pid(21), type: 'heading', order: 21, level: 2,
    text: 'Câu hỏi thường gặp về Gemini 2.5 Pro',
    anchor: 'faq-gemini',
  },
  {
    id: pid(22), type: 'faq', order: 22,
    faqs: [
      {
        question: 'Gemini 2.5 Pro có khả dụng ở Việt Nam không?',
        answer: 'Có, Gemini 2.5 Pro có thể sử dụng ở Việt Nam qua Google AI Studio (free tier) và Gemini Advanced ($19.99/tháng). Tuy nhiên, một số tính năng như tích hợp Google Workspace và Vertex AI yêu cầu tài khoản Google Workspace doanh nghiệp hoặc tài khoản Google Cloud có billing.',
      },
      {
        question: 'So với Gemini 1.5 Pro, Gemini 2.5 Pro cải thiện gì?',
        answer: 'Gemini 2.5 Pro cải thiện đáng kể về: (1) Chất lượng reasoning và giảm hallucination; (2) Khả năng code tốt hơn; (3) Hiểu video dài hơn (tới 2 giờ so với 1 giờ); (4) Cải thiện độ chính xác khi làm việc với context dài; (5) Tốc độ inference nhanh hơn 40%.',
      },
      {
        question: 'Gemini 2.5 Pro có thể dùng offline không?',
        answer: 'Hiện tại, Gemini 2.5 Pro chỉ có thể sử dụng qua API hoặc giao diện web của Google — không có phiên bản offline. Tuy nhiên, Google đã công bố Gemini Nano (phiên bản nhỏ) có thể chạy trực tiếp trên thiết bị Android cho các tác vụ đơn giản.',
      },
    ],
  },
];

// ============================================================
// CONTENT BLOCKS — Post 4: So sánh GPT-5 vs Claude 4 vs Gemini 2.5
// ============================================================

const comparisonBlocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'Tổng quan cuộc chiến AI năm 2026',
    anchor: 'tong-quan-cuoc-chien',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'Năm 2026 đánh dấu một thời điểm bước ngoặt trong lịch sử AI khi ba gã khổng lồ công nghệ — OpenAI, Anthropic và Google DeepMind — cùng tung ra các flagship model thế hệ mới trong vòng chưa đầy 3 tháng. GPT-5, Claude 4 Opus và Gemini 2.5 Pro mỗi mô hình đều tuyên bố vị trí số một trong các benchmark khác nhau, và cộng đồng AI đang tranh cãi sôi nổi về việc mô hình nào thực sự tốt nhất. Sự thật là câu trả lời phụ thuộc rất nhiều vào use case cụ thể của bạn.',
  },
  {
    id: pid(3), type: 'paragraph', order: 3,
    content: 'Bài viết này không nhằm tuyên bố người chiến thắng tuyệt đối mà cung cấp một phân tích toàn diện, dựa trên dữ liệu benchmark thực tế và kinh nghiệm sử dụng thực tế của hàng nghìn developer và người dùng doanh nghiệp. Chúng tôi đã dành 6 tuần để test cả ba mô hình trên các tác vụ đa dạng, từ viết code đến phân tích pháp lý, từ dịch thuật đến giải toán đại học. Kết quả sẽ giúp bạn đưa ra quyết định sáng suốt nhất.',
  },
  {
    id: pid(4), type: 'image', order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      alt: 'AI model comparison chart 2026',
      caption: 'So sánh toàn diện GPT-5, Claude 4 Opus và Gemini 2.5 Pro năm 2026',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(5), type: 'heading', order: 5, level: 2,
    text: 'So sánh benchmark tổng hợp',
    anchor: 'benchmark-tong-hop',
  },
  {
    id: pid(6), type: 'table', order: 6,
    table: {
      headers: ['Danh mục', 'GPT-5', 'Claude 4 Opus', 'Gemini 2.5 Pro'],
      rows: [
        ['Toán học (MATH-500)', '96.8%', '97.1%', '95.4%'],
        ['Coding (HumanEval)', '97.5%', '96.8%', '93.2%'],
        ['Khoa học (GPQA Diamond)', '78.3%', '82.4%', '79.1%'],
        ['Suy luận (DROP)', '89.5%', '91.2%', '88.7%'],
        ['Kiến thức (MMLU)', '94.2%', '93.7%', '92.8%'],
        ['Sửa bug (SWE-bench)', '71.8%', '72.5%', '65.3%'],
        ['Hình ảnh (MMMU)', '79.4%', '73.2%', '82.1%'],
        ['Video (Video-MME)', '72.8%', '45.3%', '81.4%'],
      ],
    },
  },
  {
    id: pid(7), type: 'paragraph', order: 7,
    content: 'Nhìn vào bảng benchmark, có thể thấy rõ điểm mạnh-yếu của từng mô hình: GPT-5 và Claude 4 Opus dẫn đầu về coding và suy luận văn bản; Claude 4 Opus mạnh nhất về khoa học và toán học; Gemini 2.5 Pro vượt trội về xử lý hình ảnh và video. Không có mô hình nào "win" toàn diện — đây là lý do tại sao nhiều chuyên gia khuyên dùng nhiều mô hình tùy theo tác vụ.',
  },
  {
    id: pid(8), type: 'heading', order: 8, level: 2,
    text: 'So sánh về lập trình',
    anchor: 'so-sanh-lap-trinh',
  },
  {
    id: pid(9), type: 'paragraph', order: 9,
    content: 'Chúng tôi đã test cả ba mô hình với 50 bài toán lập trình thực tế, từ dễ đến khó, bao gồm: viết code mới từ spec, debug code có lỗi, refactor code cũ, viết unit test và phân tích bảo mật. Kết quả: Claude 4 Opus dẫn đầu với 78% bài giải đúng hoàn toàn, GPT-5 đứng thứ hai với 75%, Gemini 2.5 Pro đứng thứ ba với 68%. Điểm đáng lưu ý là GPT-5 xuất sắc hơn trong JavaScript và TypeScript, Claude 4 mạnh hơn với Python và Rust, còn Gemini 2.5 Pro có lợi thế khi cần kết hợp code với phân tích tài liệu nhờ context window lớn.',
  },
  {
    id: pid(10), type: 'heading', order: 9, level: 2,
    text: 'So sánh về sáng tạo nội dung',
    anchor: 'so-sanh-sang-tao',
  },
  {
    id: pid(11), type: 'paragraph', order: 11,
    content: 'Trong phần sáng tạo nội dung — viết bài blog, kịch bản, thơ và marketing copy — GPT-5 liên tục được người dùng đánh giá cao nhất. Ngôn ngữ của GPT-5 tự nhiên hơn, sáng tạo hơn và ít lặp lại hơn. Claude 4 Opus có xu hướng viết chính xác và có cấu trúc tốt nhưng đôi khi hơi cứng nhắc. Gemini 2.5 Pro có chất lượng sáng tạo trung bình trong bộ ba nhưng có lợi thế khi cần viết dựa trên tài liệu dài (tóm tắt, phân tích).',
  },
  {
    id: pid(12), type: 'code', order: 12,
    language: 'bash',
    content: `# Công cụ so sánh tốc độ phản hồi của 3 mô hình
# Chạy script này để đo latency thực tế

#!/bin/bash

PROMPT="Viết một hàm Python kiểm tra xem một số có phải là số nguyên tố không."

echo "=== Test GPT-5 ==="
time curl -s https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer $OPENAI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-5","messages":[{"role":"user","content":"'"$PROMPT"'"}],"max_tokens":200}' \\
  | jq '.choices[0].message.content'

echo "\\n=== Test Claude 4 Opus ==="
time curl -s https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"claude-opus-4-5","max_tokens":200,"messages":[{"role":"user","content":"'"$PROMPT"'"}]}' \\
  | jq '.content[0].text'

echo "\\n=== Test Gemini 2.5 Pro ==="
time curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=$GOOGLE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"contents":[{"parts":[{"text":"'"$PROMPT"'"}]}]}' \\
  | jq '.candidates[0].content.parts[0].text'`,
  },
  {
    id: pid(13), type: 'heading', order: 13, level: 2,
    text: 'So sánh giá cả và tính kinh tế',
    anchor: 'so-sanh-gia-ca',
  },
  {
    id: pid(14), type: 'table', order: 14,
    table: {
      headers: ['Mô hình', 'Input (per 1M)', 'Output (per 1M)', 'Context', 'Ước tính chi phí/ngày (heavy user)'],
      rows: [
        ['GPT-5 Standard', '$15', '$60', '256K', '~$45/ngày'],
        ['GPT-5 Pro', '$75', '$300', '256K', '~$225/ngày'],
        ['Claude 4 Opus', '$15', '$75', '200K', '~$50/ngày'],
        ['Claude 4 Sonnet', '$3', '$15', '200K', '~$10/ngày'],
        ['Gemini 2.5 Pro', '$7', '$21', '2M', '~$22/ngày'],
        ['Gemini 2.5 Flash', '$0.35', '$1.05', '1M', '~$2/ngày'],
      ],
    },
  },
  {
    id: pid(15), type: 'heading', order: 15, level: 2,
    text: 'Khuyến nghị theo use case',
    anchor: 'khuyen-nghi-use-case',
  },
  {
    id: pid(16), type: 'list', order: 16,
    list: {
      type: 'unordered',
      items: [
        'Lập trình & Engineering: Claude 4 Opus (SWE-bench cao nhất, reasoning tốt)',
        'Sáng tạo nội dung & Marketing: GPT-5 (ngôn ngữ tự nhiên, sáng tạo nhất)',
        'Phân tích tài liệu dài: Gemini 2.5 Pro (2M context, giá rẻ nhất)',
        'Ứng dụng multimodal: Gemini 2.5 Pro (native multimodal, video tốt nhất)',
        'Chatbot doanh nghiệp volume lớn: Claude 4 Sonnet hoặc Gemini 2.5 Flash',
        'Research & Khoa học: Claude 4 Opus (GPQA Diamond cao nhất)',
        'Tích hợp hệ sinh thái Google: Gemini 2.5 Pro (không cần nói)',
      ],
    },
  },
  {
    id: pid(17), type: 'quote', order: 17,
    content: '"Câu hỏi không phải là mô hình nào tốt nhất mà là mô hình nào phù hợp nhất với bài toán của bạn. Người dùng thông minh biết phối hợp nhiều mô hình, như một kỹ sư biết chọn đúng công cụ cho đúng công việc." — Simon Willison, nhà phát triển Django và chuyên gia AI prompt engineering',
  },
  {
    id: pid(18), type: 'heading', order: 18, level: 2,
    text: 'Câu hỏi thường gặp về so sánh AI models',
    anchor: 'faq-so-sanh',
  },
  {
    id: pid(19), type: 'faq', order: 19,
    faqs: [
      {
        question: 'Tôi chỉ có thể chọn một mô hình, nên chọn mô hình nào?',
        answer: 'Nếu chỉ được chọn một, GPT-5 Standard là lựa chọn cân bằng nhất cho hầu hết use case — tốt về coding, sáng tạo và đa ngôn ngữ. Tuy nhiên nếu budget là ưu tiên, Gemini 2.5 Pro cung cấp giá trị tốt nhất cho chi phí bỏ ra.',
      },
      {
        question: 'Mô hình nào tốt nhất cho tiếng Việt?',
        answer: 'GPT-5 hiện đang dẫn đầu về chất lượng tiếng Việt, với khả năng hiểu và tạo văn bản tự nhiên, đúng ngữ pháp và phong phú về từ vựng. Claude 4 cũng rất tốt nhưng đôi khi có xu hướng Anh hóa câu văn tiếng Việt. Gemini 2.5 Pro cũng hỗ trợ tiếng Việt tốt và có lợi thế về tìm kiếm thông tin Việt Nam nhờ tích hợp Google Search.',
      },
    ],
  },
];

// ============================================================
// CONTENT BLOCKS — Post 5: Cursor IDE
// ============================================================

const cursorBlocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'Cursor IDE là gì và tại sao nó đang thay đổi ngành lập trình?',
    anchor: 'cursor-la-gi',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'Cursor là một code editor được xây dựng dựa trên nền tảng VS Code, tích hợp sâu các mô hình AI lớn (GPT-5, Claude 4) trực tiếp vào quy trình phát triển phần mềm. Ra mắt năm 2023 và liên tục cập nhật, đến đầu năm 2026, Cursor đã đạt hơn 1 triệu developer dùng hàng ngày — con số ấn tượng cho thấy nó không chỉ là một công cụ thử nghiệm mà đã trở thành công cụ sản xuất thực sự. Khác với GitHub Copilot chỉ là plugin thêm vào, Cursor được thiết kế lại từ đầu với AI là trung tâm.',
  },
  {
    id: pid(3), type: 'paragraph', order: 3,
    content: 'Điểm khác biệt cốt lõi của Cursor so với các công cụ AI coding khác là khả năng hiểu toàn bộ codebase, không chỉ file đang mở. Khi bạn hỏi Cursor về một bug hoặc yêu cầu thêm tính năng, nó sẽ tự động tìm kiếm các file liên quan, hiểu kiến trúc tổng thể và đề xuất thay đổi nhất quán trên toàn bộ dự án. Đây là điều mà GitHub Copilot không thể làm — Copilot chỉ nhìn thấy file đang mở và một số file liền kề.',
  },
  {
    id: pid(4), type: 'image', order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=1200&h=630&fit=crop',
      alt: 'Cursor IDE AI code editor interface',
      caption: 'Cursor IDE — trình soạn thảo code tích hợp AI mạnh mẽ nhất hiện nay',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(5), type: 'heading', order: 5, level: 2,
    text: 'Tính năng nổi bật của Cursor',
    anchor: 'tinh-nang-noi-bat',
  },
  {
    id: pid(6), type: 'paragraph', order: 6,
    content: 'Cursor có nhiều tính năng độc đáo mà không có editor nào khác hiện có. Đầu tiên là Tab Completion (Cursor Tab) — không chỉ hoàn thiện dòng hiện tại mà dự đoán và đề xuất cả block code nhiều dòng dựa trên ngữ cảnh. Thứ hai là Composer — một giao diện chat cho phép bạn mô tả tính năng muốn thêm bằng tiếng tự nhiên và Cursor sẽ tạo ra các thay đổi trên nhiều file cùng lúc, kể cả tạo file mới. Thứ ba là Cursor Rules — cho phép bạn định nghĩa quy tắc coding cho dự án (style guide, patterns) và AI sẽ tuân theo tự động.',
  },
  {
    id: pid(7), type: 'list', order: 7,
    list: {
      type: 'unordered',
      items: [
        'Cursor Tab: autocomplete đa dòng, dự đoán code thông minh',
        'Composer (Ctrl+I): tạo/sửa code trên nhiều file từ mô tả ngôn ngữ tự nhiên',
        'Chat (Ctrl+L): hỏi đáp về code với ngữ cảnh toàn bộ codebase',
        'Cursor Rules: định nghĩa quy tắc code cho team',
        'Symbol search: tìm kiếm semantic trong codebase',
        'Notepads: ghi chú AI-aware trong dự án',
        'Shadow Workspace: Cursor chạy song song để test code tự động',
      ],
    },
  },
  {
    id: pid(8), type: 'heading', order: 8, level: 2,
    text: 'Hướng dẫn cài đặt và cấu hình Cursor',
    anchor: 'cai-dat-cau-hinh',
  },
  {
    id: pid(9), type: 'paragraph', order: 9,
    content: 'Cài đặt Cursor rất đơn giản: tải bản cài đặt từ cursor.com cho macOS, Windows hoặc Linux, cài đặt và đăng nhập bằng tài khoản GitHub hoặc email. Lần đầu mở, Cursor sẽ hỏi bạn muốn import settings từ VS Code không — nên chọn Yes để giữ lại tất cả extension và keybindings quen thuộc. Sau đó, bạn cần cấu hình model AI muốn dùng: Cursor cung cấp GPT-5 và Claude 4 trong gói Pro, hoặc bạn có thể nhập API key riêng để dùng model khác.',
  },
  {
    id: pid(10), type: 'code', order: 10,
    language: 'json',
    content: `// .cursorrules — Cấu hình quy tắc AI cho dự án của bạn
// Đặt file này trong thư mục gốc của project

{
  "rules": [
    "Luôn viết TypeScript với strict mode, không dùng 'any'",
    "Sử dụng async/await thay vì Promise chains",
    "Tất cả function phải có JSDoc comment mô tả params và return",
    "Khi tạo React component, dùng functional component với hooks",
    "Sử dụng Tailwind CSS cho styling, không inline style",
    "Mọi API call phải có error handling với try/catch",
    "Tên variable phải mô tả rõ ý nghĩa, tránh tên viết tắt",
    "Test file đặt cạnh source file với suffix .test.ts"
  ],
  "context": {
    "framework": "Next.js 15 App Router",
    "database": "PostgreSQL với Prisma ORM",
    "auth": "NextAuth.js v5",
    "deployment": "Vercel"
  },
  "preferences": {
    "language": "vi",
    "verbosity": "concise",
    "include_examples": true
  }
}`,
  },
  {
    id: pid(11), type: 'heading', order: 11, level: 2,
    text: 'So sánh Cursor với GitHub Copilot và các đối thủ',
    anchor: 'so-sanh-doi-thu',
  },
  {
    id: pid(12), type: 'table', order: 12,
    table: {
      headers: ['Tính năng', 'Cursor Pro', 'GitHub Copilot', 'Windsurf', 'Zed AI'],
      rows: [
        ['Codebase awareness', 'Toàn bộ project', 'File hiện tại + adjacent', 'Toàn bộ project', 'Giới hạn'],
        ['Multi-file edit', 'Có (Composer)', 'Không', 'Có', 'Đang phát triển'],
        ['Chat với code', 'Có', 'Có', 'Có', 'Có'],
        ['Model lựa chọn', 'GPT-5, Claude 4, Gemini', 'GPT-4o, Claude', 'Claude, GPT-4', 'Claude'],
        ['Giá/tháng', '$20', '$19', '$15', 'Free (beta)'],
        ['VS Code compatible', 'Có (fork)', 'Plugin', 'Không', 'Không'],
        ['Offline mode', 'Có (tab only)', 'Không', 'Không', 'Không'],
      ],
    },
  },
  {
    id: pid(13), type: 'heading', order: 13, level: 2,
    text: 'Mẹo và thủ thuật nâng cao cho Cursor',
    anchor: 'meo-thu-thuat',
  },
  {
    id: pid(14), type: 'paragraph', order: 14,
    content: 'Để tận dụng tối đa Cursor, có một số mẹo quan trọng mà ít người biết. Đầu tiên, dùng @-mentions trong chat để chỉ định file, folder hoặc symbol cụ thể: "@src/api/auth.ts refactor function này để dùng JWT refresh token". Thứ hai, tận dụng Composer cho các tác vụ lớn như "tạo CRUD cho model User với route, controller và service", thay vì làm từng file một. Thứ ba, viết Cursor Rules chi tiết — đây là đầu tư thời gian một lần nhưng tiết kiệm rất nhiều về sau vì AI sẽ tự tuân theo quy tắc của team mà không cần nhắc lại.',
  },
  {
    id: pid(15), type: 'paragraph', order: 15,
    content: 'Một tính năng ít được chú ý là Notepads — cho phép tạo ghi chú có ngữ cảnh AI. Bạn có thể tạo notepad "Architecture.md" mô tả kiến trúc hệ thống và @mention nó trong chat để Cursor hiểu ngữ cảnh tổng thể. Hay tạo notepad "API Conventions.md" liệt kê các quy ước API của team. Những ghi chú này trở thành bộ nhớ dài hạn của AI trong dự án của bạn. Ngoài ra, tính năng Shadow Workspace (beta) cho phép Cursor chạy code trong môi trường sandbox để tự kiểm tra tính đúng đắn trước khi đề xuất thay đổi.',
  },
  {
    id: pid(16), type: 'image', order: 16,
    image: {
      url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop',
      alt: 'Developer coding with AI assistance',
      caption: 'Lập trình viên sử dụng Cursor IDE với AI assistant để tăng năng suất',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(17), type: 'heading', order: 17, level: 2,
    text: 'Trải nghiệm thực tế: Cursor có thực sự tăng năng suất không?',
    anchor: 'trai-nghiem-thuc-te',
  },
  {
    id: pid(18), type: 'paragraph', order: 18,
    content: 'Sau 6 tháng sử dụng Cursor làm editor chính, đây là đánh giá thực tế: năng suất lập trình tăng đáng kể, đặc biệt với các tác vụ boilerplate và CRUD. Những tác vụ trước đây mất 30-60 phút (như tạo form với validation, kết nối API, viết test) nay chỉ mất 5-15 phút. Tuy nhiên, với code business logic phức tạp, Cursor vẫn cần sự hướng dẫn chi tiết và kiểm tra kỹ từ developer. Kết luận: Cursor là công cụ tăng lực, không phải thay thế, cho lập trình viên có kinh nghiệm.',
  },
  {
    id: pid(19), type: 'quote', order: 19,
    content: '"Cursor đã thay đổi cách tôi code. Tôi giờ dành ít thời gian hơn cho syntax và nhiều thời gian hơn cho kiến trúc và business logic. Đó mới là phần thú vị của công việc." — Guillermo Rauch, CEO Vercel',
  },
  {
    id: pid(20), type: 'heading', order: 20, level: 2,
    text: 'Câu hỏi thường gặp về Cursor IDE',
    anchor: 'faq-cursor',
  },
  {
    id: pid(21), type: 'faq', order: 21,
    faqs: [
      {
        question: 'Code tôi có bị gửi lên server của Cursor không?',
        answer: 'Cursor gửi code lên server để xử lý AI — đây là điều cần biết trước khi dùng cho dự án nhạy cảm. Tuy nhiên, Cursor có chính sách không lưu code sau khi xử lý xong. Với gói Business ($40/user/month), Cursor cung cấp cam kết bảo mật dữ liệu doanh nghiệp và tùy chọn xử lý trong region của bạn.',
      },
      {
        question: 'Cursor có hoạt động với ngôn ngữ lập trình nào?',
        answer: 'Cursor hỗ trợ tất cả ngôn ngữ mà VS Code hỗ trợ, bao gồm Python, JavaScript/TypeScript, Rust, Go, Java, C/C++, Ruby, PHP và nhiều hơn nữa. Tuy nhiên chất lượng gợi ý AI tốt nhất với các ngôn ngữ phổ biến như Python, TypeScript và Go.',
      },
      {
        question: 'Cursor miễn phí không?',
        answer: 'Cursor có gói Free với 2000 autocomplete/tháng và 50 chat message/tháng. Gói Pro ($20/tháng) cho phép dùng không giới hạn với các model cao cấp. Nếu bạn là sinh viên hoặc làm việc cho startup, Cursor thường có chương trình giảm giá.',
      },
    ],
  },
];

// ============================================================
// CONTENT BLOCKS — Post 6: Ollama
// ============================================================

const ollamaBlocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'Ollama là gì? Chạy LLM miễn phí trên máy tính cá nhân',
    anchor: 'ollama-la-gi',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'Ollama là một công cụ mã nguồn mở cho phép bạn tải xuống và chạy các mô hình ngôn ngữ lớn (LLM) trực tiếp trên máy tính cá nhân, hoàn toàn miễn phí và không cần kết nối internet sau khi tải model. Được xây dựng bằng Go và C++, Ollama cung cấp giao diện dòng lệnh đơn giản và API tương thích với OpenAI, cho phép bạn chạy các model mạnh như Llama 3.3, Mistral, Phi-4, Qwen2.5 hay DeepSeek R1 chỉ với một lệnh duy nhất.',
  },
  {
    id: pid(3), type: 'paragraph', order: 3,
    content: 'Tại sao lại cần Ollama khi đã có ChatGPT và Claude? Có nhiều lý do chính đáng: bảo mật dữ liệu (code và tài liệu nội bộ không rời khỏi máy bạn), chi phí (miễn phí sau khi download model), tùy biến (có thể fine-tune model trên dữ liệu riêng), và khả năng offline (làm việc mà không cần internet). Đối với developer và doanh nghiệp có yêu cầu compliance nghiêm ngặt, Ollama là giải pháp lý tưởng để triển khai AI on-premise.',
  },
  {
    id: pid(4), type: 'image', order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop',
      alt: 'Local LLM running on personal computer',
      caption: 'Ollama cho phép chạy LLM mạnh mẽ trực tiếp trên máy tính cá nhân',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(5), type: 'heading', order: 5, level: 2,
    text: 'Hướng dẫn cài đặt Ollama từng bước',
    anchor: 'cai-dat-ollama',
  },
  {
    id: pid(6), type: 'paragraph', order: 6,
    content: 'Cài đặt Ollama cực kỳ đơn giản. Trên macOS, chỉ cần tải bản cài đặt từ ollama.com và kéo vào thư mục Applications. Trên Linux, chạy một lệnh curl. Trên Windows, tải file .exe và cài đặt như phần mềm thông thường. Sau khi cài xong, Ollama chạy như một service ngầm, lắng nghe trên port 11434. Để tải và chạy model đầu tiên, chỉ cần mở terminal và chạy lệnh "ollama run llama3.3" — Ollama sẽ tự động tải model (khoảng 4-8GB tùy model) và khởi động chat session ngay lập tức.',
  },
  {
    id: pid(7), type: 'code', order: 7,
    language: 'bash',
    content: `# Cài đặt Ollama trên Linux/macOS
curl -fsSL https://ollama.com/install.sh | sh

# Khởi động Ollama service
ollama serve

# Trong terminal khác, tải và chạy model
ollama run llama3.3          # Meta Llama 3.3 70B (tốt nhất cho chat)
ollama run phi4               # Microsoft Phi-4 (nhỏ gọn, mạnh)
ollama run deepseek-r1:7b    # DeepSeek R1 7B (reasoning tốt)
ollama run qwen2.5-coder:7b  # Qwen 2.5 Coder (cho lập trình)
ollama run mistral:7b         # Mistral 7B (cân bằng)

# Liệt kê model đã tải
ollama list

# Xóa model
ollama rm llama3.3

# Sử dụng API (tương thích OpenAI format)
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama3.3",
    "messages": [
      {"role": "user", "content": "Giải thích về machine learning bằng tiếng Việt"}
    ]
  }'

# Hoặc dùng với OpenAI Python SDK
# Chỉ cần thay base_url
from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
response = client.chat.completions.create(
    model="llama3.3",
    messages=[{"role": "user", "content": "Hello!"}]
)`,
  },
  {
    id: pid(8), type: 'heading', order: 8, level: 2,
    text: 'Các model phổ biến trên Ollama và yêu cầu phần cứng',
    anchor: 'cac-model-yeu-cau-phan-cung',
  },
  {
    id: pid(9), type: 'table', order: 9,
    table: {
      headers: ['Model', 'Size', 'RAM tối thiểu', 'Chất lượng', 'Use case tốt nhất'],
      rows: [
        ['Llama 3.3 70B', '43GB', '48GB RAM', 'Rất tốt', 'Chat, phân tích, code'],
        ['Llama 3.2 3B', '2GB', '8GB RAM', 'Khá', 'Tác vụ đơn giản, mobile'],
        ['Phi-4 14B', '9GB', '16GB RAM', 'Tốt', 'Code, toán học'],
        ['DeepSeek R1 7B', '5GB', '8GB RAM', 'Tốt (reasoning)', 'Suy luận, toán'],
        ['Qwen2.5-Coder 7B', '5GB', '8GB RAM', 'Tốt (coding)', 'Lập trình'],
        ['Mistral 7B', '4GB', '8GB RAM', 'Khá', 'Chat tổng quát'],
        ['Gemma 2 27B', '16GB', '32GB RAM', 'Tốt', 'Chat, phân tích'],
      ],
    },
  },
  {
    id: pid(10), type: 'paragraph', order: 10,
    content: 'Để chạy Ollama hiệu quả, cấu hình khuyến nghị là: RAM 16GB trở lên (32GB lý tưởng), SSD với ít nhất 50GB trống (để lưu model), và GPU tùy chọn nhưng rất nên có. Nếu có GPU NVIDIA với 8GB VRAM trở lên (RTX 3080, 4080, 4090), model sẽ chạy nhanh gấp 5-10 lần so với CPU only. GPU AMD cũng được hỗ trợ qua ROCm. Với MacBook M-series, Ollama tận dụng tốt kiến trúc unified memory — MacBook M3 Pro 36GB RAM có thể chạy Llama 3.3 70B với tốc độ chấp nhận được.',
  },
  {
    id: pid(11), type: 'heading', order: 11, level: 2,
    text: 'Tích hợp Ollama với công cụ developer',
    anchor: 'tich-hop-developer',
  },
  {
    id: pid(12), type: 'paragraph', order: 12,
    content: 'Vì Ollama API tương thích với OpenAI format, bạn có thể dễ dàng tích hợp với hầu hết các framework và công cụ AI hiện có. LangChain, LlamaIndex, Continue (VS Code extension), và Cursor đều hỗ trợ Ollama. Đặc biệt, Continue là extension VS Code miễn phí cho phép dùng code assistant với Ollama backend — đây là giải pháp thay thế hoàn toàn miễn phí cho GitHub Copilot, chạy hoàn toàn local. Bạn cũng có thể xây dựng chatbot riêng với Open WebUI — giao diện web đẹp mắt cho Ollama, tương tự như ChatGPT nhưng chạy local.',
  },
  {
    id: pid(13), type: 'image', order: 13,
    image: {
      url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=630&fit=crop',
      alt: 'Local AI server setup with Ollama',
      caption: 'Thiết lập server AI local với Ollama và Open WebUI',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(14), type: 'heading', order: 14, level: 2,
    text: 'Tạo model tùy chỉnh với Modelfile',
    anchor: 'tao-model-tuy-chinh',
  },
  {
    id: pid(15), type: 'paragraph', order: 15,
    content: 'Một tính năng mạnh mẽ của Ollama là Modelfile — cho phép tạo model tùy chỉnh từ một model gốc với system prompt, temperature và các tham số riêng. Ví dụ, bạn có thể tạo model "viet-assistant" từ Llama 3.3 với system prompt bằng tiếng Việt, hoặc model "code-reviewer" từ Qwen2.5-Coder với các quy tắc review code của team. Đây thực chất là một cách đơn giản để "fine-tune" hành vi của model mà không cần huấn luyện lại.',
  },
  {
    id: pid(16), type: 'list', order: 16,
    list: {
      type: 'unordered',
      items: [
        'Modelfile: tạo model tùy chỉnh với system prompt riêng',
        'Open WebUI: giao diện ChatGPT-like chạy local với Ollama',
        'Continue: VS Code extension dùng Ollama làm backend',
        'LangChain: framework AI tích hợp sẵn Ollama provider',
        'Ollama Python/JavaScript SDK: tích hợp vào ứng dụng',
        'Docker image: triển khai Ollama trên server dễ dàng',
      ],
    },
  },
  {
    id: pid(17), type: 'heading', order: 17, level: 2,
    text: 'Câu hỏi thường gặp về Ollama',
    anchor: 'faq-ollama',
  },
  {
    id: pid(18), type: 'faq', order: 18,
    faqs: [
      {
        question: 'Ollama có chạy được trên máy tính phổ thông không?',
        answer: 'Có, nhưng với giới hạn nhất định. Máy với 8GB RAM có thể chạy các model 7B như Mistral hay Llama 3.2 3B. Với 16GB RAM, bạn có thể chạy các model 13B-14B như Phi-4. Để chạy model mạnh hơn (70B), cần 48GB+ RAM hoặc GPU 24GB+ VRAM. Máy Mac M-series có lợi thế đặc biệt nhờ unified memory.',
      },
      {
        question: 'Ollama có hỗ trợ tiếng Việt không?',
        answer: 'Chất lượng tiếng Việt phụ thuộc vào model bạn dùng. Llama 3.3 và Qwen 2.5 hỗ trợ tiếng Việt khá tốt. Tuy nhiên, các mô hình local vẫn kém hơn GPT-5 và Claude 4 về tiếng Việt. Để cải thiện, bạn có thể thêm system prompt hướng dẫn model trả lời bằng tiếng Việt.',
      },
    ],
  },
];

// ============================================================
// CONTENT BLOCKS — Post 7: LangChain vs LlamaIndex
// ============================================================

const langchainBlocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'LangChain và LlamaIndex — Hai framework AI hàng đầu',
    anchor: 'gioi-thieu',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'LangChain và LlamaIndex là hai framework Python/JavaScript phổ biến nhất để xây dựng ứng dụng AI, đặc biệt là các ứng dụng RAG (Retrieval Augmented Generation) và AI agent. Cả hai đều nhận được sự ủng hộ lớn từ cộng đồng và đầu tư hàng triệu USD từ các quỹ VC. LangChain ra đời sớm hơn (tháng 10/2022) và có cộng đồng lớn hơn với hơn 90K GitHub stars. LlamaIndex (trước là GPT Index) tập trung hơn vào data indexing và retrieval, với 35K stars. Câu hỏi "nên dùng cái nào?" là một trong những câu hỏi phổ biến nhất trong cộng đồng AI developer.',
  },
  {
    id: pid(3), type: 'paragraph', order: 3,
    content: 'Câu trả lời ngắn gọn: LangChain phù hợp hơn cho các ứng dụng agent phức tạp, cần orchestrate nhiều tool và model; LlamaIndex mạnh hơn cho các ứng dụng cần index và query tài liệu (RAG, knowledge base). Tuy nhiên, ranh giới này ngày càng mờ dần khi cả hai liên tục mở rộng tính năng. Bài viết này sẽ phân tích chi tiết để giúp bạn đưa ra lựa chọn phù hợp.',
  },
  {
    id: pid(4), type: 'image', order: 4,
    image: {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop',
      alt: 'AI framework comparison LangChain LlamaIndex',
      caption: 'So sánh kiến trúc LangChain và LlamaIndex cho ứng dụng AI',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(5), type: 'heading', order: 5, level: 2,
    text: 'LangChain — Kiến trúc và điểm mạnh',
    anchor: 'langchain-kien-truc',
  },
  {
    id: pid(6), type: 'paragraph', order: 6,
    content: 'LangChain được thiết kế với kiến trúc component-based, nơi mọi thứ đều là "chain" — chuỗi các bước xử lý có thể kết hợp linh hoạt. Các khái niệm cốt lõi bao gồm: LLM/ChatModel (giao tiếp với AI model), PromptTemplate (quản lý prompt), Memory (lưu trữ lịch sử hội thoại), Tool (tích hợp công cụ bên ngoài), Agent (AI tự quyết định sử dụng tool nào), và Chain (kết hợp các component). Với LangChain Expression Language (LCEL), bạn có thể tạo pipeline phức tạp bằng cú pháp pipe operator rất dễ đọc.',
  },
  {
    id: pid(7), type: 'code', order: 7,
    language: 'python',
    content: `# Ví dụ: Xây dựng RAG pipeline với LangChain
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import DirectoryLoader

# 1. Load documents
loader = DirectoryLoader("./docs", glob="**/*.md")
documents = loader.load()

# 2. Split into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
chunks = splitter.split_documents(documents)

# 3. Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# 4. Create RAG chain với LCEL
llm = ChatOpenAI(model="gpt-5", temperature=0)

prompt = ChatPromptTemplate.from_template("""
Trả lời câu hỏi dựa trên context sau:

Context: {context}

Câu hỏi: {question}

Trả lời bằng tiếng Việt, ngắn gọn và chính xác.
""")

def format_docs(docs):
    return "\\n\\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 5. Sử dụng
answer = rag_chain.invoke("LangChain có những tính năng gì nổi bật?")
print(answer)`,
  },
  {
    id: pid(8), type: 'heading', order: 8, level: 2,
    text: 'LlamaIndex — Kiến trúc và điểm mạnh',
    anchor: 'llamaindex-kien-truc',
  },
  {
    id: pid(9), type: 'paragraph', order: 9,
    content: 'LlamaIndex tập trung vào vấn đề cốt lõi: làm thế nào để kết nối LLM với dữ liệu của bạn một cách hiệu quả nhất. Kiến trúc của LlamaIndex xoay quanh khái niệm Index — cấu trúc dữ liệu đặc biệt được tối ưu hóa để retrieval bởi LLM. Ngoài VectorStoreIndex cơ bản, LlamaIndex cung cấp nhiều loại index chuyên dụng: SummaryIndex (tóm tắt document), KnowledgeGraphIndex (đồ thị tri thức), SQLStructStoreIndex (query SQL bằng ngôn ngữ tự nhiên) và hơn 20 loại khác. Sự đa dạng này cho phép tối ưu hóa retrieval theo từng loại dữ liệu.',
  },
  {
    id: pid(10), type: 'paragraph', order: 10,
    content: 'Một điểm mạnh lớn của LlamaIndex là hỗ trợ advanced retrieval techniques: Hybrid Search (kết hợp semantic và keyword search), HyDE (Hypothetical Document Embeddings), Re-ranking (dùng LLM để rerank kết quả), và Recursive Retrieval (tìm kiếm có phân cấp). Những kỹ thuật này cải thiện đáng kể chất lượng RAG so với simple vector search. LlamaIndex cũng có Llamahub — kho connector cho hơn 200 data source, từ Google Drive, Notion, Slack đến các database khác nhau.',
  },
  {
    id: pid(11), type: 'table', order: 11,
    table: {
      headers: ['Tiêu chí', 'LangChain', 'LlamaIndex'],
      rows: [
        ['GitHub Stars', '~90K', '~35K'],
        ['Tập trung chính', 'Orchestration, Agents', 'Data indexing, RAG'],
        ['Learning curve', 'Dốc hơn', 'Thấp hơn'],
        ['Agent capabilities', 'Mạnh hơn', 'Đang cải thiện'],
        ['RAG chất lượng', 'Tốt', 'Rất tốt'],
        ['Data connectors', '~50', '200+'],
        ['Production ready', 'LangSmith (paid)', 'LlamaCloud (paid)'],
        ['TypeScript support', 'LangChain.js', 'LlamaIndex.TS'],
      ],
    },
  },
  {
    id: pid(12), type: 'heading', order: 12, level: 2,
    text: 'Khi nào dùng LangChain, khi nào dùng LlamaIndex?',
    anchor: 'khi-nao-dung',
  },
  {
    id: pid(13), type: 'list', order: 13,
    list: {
      type: 'unordered',
      items: [
        'Dùng LangChain khi: xây dựng AI agent phức tạp với nhiều tool, cần orchestrate nhiều LLM call',
        'Dùng LangChain khi: cần tích hợp với nhiều external service (email, calendar, database)',
        'Dùng LangChain khi: team đã quen với LangChain, có nhiều tài liệu và ví dụ hơn',
        'Dùng LlamaIndex khi: ứng dụng RAG là core feature, cần chất lượng retrieval cao nhất',
        'Dùng LlamaIndex khi: làm việc với nhiều loại data source khác nhau',
        'Dùng LlamaIndex khi: cần các kỹ thuật retrieval nâng cao (hybrid, re-ranking)',
        'Có thể kết hợp cả hai: dùng LlamaIndex làm retrieval layer, LangChain làm orchestration',
      ],
    },
  },
  {
    id: pid(14), type: 'quote', order: 14,
    content: '"Đừng bị mắc kẹt trong việc chọn framework. Cả LangChain và LlamaIndex đều là công cụ tốt. Điều quan trọng là hiểu bài toán của bạn đủ sâu để biết cần gì, rồi chọn công cụ phù hợp nhất." — Jerry Liu, CEO LlamaIndex',
  },
  {
    id: pid(15), type: 'image', order: 15,
    image: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
      alt: 'RAG architecture diagram for AI applications',
      caption: 'Kiến trúc RAG điển hình sử dụng LangChain hoặc LlamaIndex',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(16), type: 'heading', order: 16, level: 2,
    text: 'Câu hỏi thường gặp về LangChain và LlamaIndex',
    anchor: 'faq',
  },
  {
    id: pid(17), type: 'faq', order: 17,
    faqs: [
      {
        question: 'LangChain có quá phức tạp cho người mới bắt đầu không?',
        answer: 'LangChain có learning curve khá dốc do abstraction layer nhiều. Người mới nên bắt đầu với LCEL (LangChain Expression Language) — cú pháp mới đơn giản hơn nhiều so với Chain cũ. Tài liệu official của LangChain đã cải thiện nhiều và có nhiều tutorial thực tế. LlamaIndex thường được coi là dễ học hơn cho người mới.',
      },
      {
        question: 'Framework nào có cộng đồng lớn hơn và dễ tìm giải pháp hơn?',
        answer: 'LangChain có cộng đồng lớn hơn đáng kể (90K vs 35K GitHub stars), nhiều tutorial và StackOverflow answer hơn. Tuy nhiên LlamaIndex đang phát triển nhanh và cộng đồng Discord của họ rất active. Cả hai đều có Discord server với hàng chục nghìn thành viên và team respond issue GitHub khá nhanh.',
      },
    ],
  },
];

// ============================================================
// CONTENT BLOCKS — Post 8: Top 10 GitHub AI Repos
// ============================================================

const githubTopBlocks: ContentSection[] = [
  {
    id: pid(1), type: 'heading', order: 1, level: 2,
    text: 'Top 10 GitHub repository AI trending tháng 4/2026',
    anchor: 'top-10-intro',
  },
  {
    id: pid(2), type: 'paragraph', order: 2,
    content: 'Tháng 4/2026 chứng kiến sự bùng nổ của các repo AI mã nguồn mở với nhiều dự án đột phá được cộng đồng đón nhận nhiệt tình. Từ các công cụ tự động hóa tác vụ, framework xây dựng AI agent, đến các model nhỏ gọn chạy local — mỗi repo đều đại diện cho một xu hướng đang định hình tương lai phát triển phần mềm. Chúng tôi đã phân tích lịch sử star, commit activity, issue resolution và chất lượng code để tổng hợp danh sách 10 repo đáng chú ý nhất.',
  },
  {
    id: pid(3), type: 'image', order: 3,
    image: {
      url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=1200&h=630&fit=crop',
      alt: 'GitHub trending AI repositories April 2026',
      caption: 'Các GitHub repository AI trending được cộng đồng quan tâm tháng 4/2026',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(4), type: 'heading', order: 4, level: 2,
    text: '1. OpenHands (formerly OpenDevin) — 45K stars',
    anchor: 'openhands',
  },
  {
    id: pid(5), type: 'paragraph', order: 5,
    content: 'OpenHands là platform AI agent mã nguồn mở mạnh nhất hiện tại, cho phép AI agent tự động viết code, chạy terminal command, duyệt web và quản lý file để hoàn thành các nhiệm vụ phức tạp. Được phát triển bởi team tại CMU và MIT, OpenHands đạt 45K stars và trở thành tiêu chuẩn de facto cho AI coding agent mã nguồn mở. Điểm đặc biệt là OpenHands hỗ trợ nhiều backend: bạn có thể dùng Claude 4, GPT-5, Gemini hoặc thậm chí Ollama local models. Trên SWE-bench, phiên bản OpenHands với Claude 4 đạt 53.7% — ấn tượng cho một giải pháp open source.',
  },
  {
    id: pid(6), type: 'heading', order: 6, level: 2,
    text: '2. Mastra — 38K stars (framework AI agent TypeScript)',
    anchor: 'mastra',
  },
  {
    id: pid(7), type: 'paragraph', order: 7,
    content: 'Mastra là framework TypeScript/JavaScript để xây dựng AI agent và workflow, nổi lên như là "LangChain của JavaScript ecosystem". Được thiết kế với developer experience là ưu tiên hàng đầu, Mastra cung cấp type-safe API, built-in observability và tích hợp sẵn với các LLM phổ biến. Framework này đặc biệt phù hợp cho các dự án Next.js và Node.js cần tích hợp AI phức tạp mà không muốn dùng Python backend riêng.',
  },
  {
    id: pid(8), type: 'heading', order: 8, level: 2,
    text: '3. Smolagents (HuggingFace) — 32K stars',
    anchor: 'smolagents',
  },
  {
    id: pid(9), type: 'paragraph', order: 9,
    content: 'Smolagents từ HuggingFace là framework xây dựng AI agent tối giản, với triết lý "ít abstraction hơn, kiểm soát nhiều hơn". Không như LangChain với nhiều layer abstraction, Smolagents để agent tự viết và chạy code Python thực sự — một cách tiếp cận gọi là "code agents" tỏ ra hiệu quả hơn đáng kể trên nhiều benchmark so với "tool-calling agents" truyền thống. Repo này nhanh chóng đạt 32K stars và được coi là bước đột phá trong thiết kế AI agent.',
  },
  {
    id: pid(10), type: 'heading', order: 10, level: 2,
    text: '4. Mem0 — 28K stars (AI Memory Layer)',
    anchor: 'mem0',
  },
  {
    id: pid(11), type: 'paragraph', order: 11,
    content: 'Một trong những vấn đề lớn nhất của LLM là thiếu bộ nhớ dài hạn — mỗi conversation bắt đầu lại từ đầu. Mem0 giải quyết vấn đề này bằng cách cung cấp memory layer thông minh, tự động extract và lưu trữ thông tin quan trọng từ conversation, rồi inject lại vào context khi cần thiết. Mem0 có thể phân biệt memory theo user, session và agent, hỗ trợ cả vector search và graph memory. Đây là component thiếu yếu của hầu hết AI application hiện tại.',
  },
  {
    id: pid(12), type: 'heading', order: 12, level: 2,
    text: '5. Continue — 25K stars (AI coding assistant mã nguồn mở)',
    anchor: 'continue',
  },
  {
    id: pid(13), type: 'paragraph', order: 13,
    content: 'Continue là VS Code và JetBrains extension mã nguồn mở, cung cấp trải nghiệm AI coding assistant tương tự GitHub Copilot nhưng hoàn toàn miễn phí và có thể dùng với bất kỳ LLM nào, kể cả Ollama local. Người dùng đặc biệt đánh giá cao tính năng Tab Autocomplete (tốc độ nhanh với local models), Chat with codebase và Custom Slash Commands. Continue đang cạnh tranh trực tiếp với Cursor và Copilot trong phân khúc "privacy-first AI coding".',
  },
  {
    id: pid(14), type: 'heading', order: 14, level: 2,
    text: '6–10: Các repo đáng chú ý khác',
    anchor: 'repos-khac',
  },
  {
    id: pid(15), type: 'list', order: 15,
    list: {
      type: 'ordered',
      items: [
        'Agno (22K stars): Framework xây dựng AI agent đa phương thức, hỗ trợ text, image, audio và video agent trong cùng một pipeline',
        'Crawl4AI (20K stars): Web crawler được thiết kế cho AI — extract data từ web theo định dạng LLM-friendly (markdown, JSON), hỗ trợ JavaScript rendering và crawl song song',
        'Kotaemon (18K stars): RAG-based document QA tool với giao diện đẹp, dành cho người dùng không lập trình — chạy local, hỗ trợ PDF, Word, Excel',
        'LiteLLM (17K stars): Proxy server thống nhất API cho 100+ LLM providers, cho phép chuyển đổi giữa các model mà không cần đổi code',
        'PocketFlow (15K stars): Framework minimalist để xây dựng AI workflow bằng Python thuần, không dependency — cho những ai muốn kiểm soát hoàn toàn',
      ],
    },
  },
  {
    id: pid(16), type: 'table', order: 16,
    table: {
      headers: ['Repo', 'Stars', 'Language', 'Category', 'Nổi bật với'],
      rows: [
        ['OpenHands', '45K', 'Python', 'AI Agent', 'SWE-bench SOTA cho open source'],
        ['Mastra', '38K', 'TypeScript', 'Framework', 'JS/TS ecosystem, type-safe'],
        ['Smolagents', '32K', 'Python', 'AI Agent', 'Code agents, minimalist'],
        ['Mem0', '28K', 'Python', 'Memory', 'Long-term AI memory layer'],
        ['Continue', '25K', 'TypeScript', 'IDE Plugin', 'Free Copilot alternative'],
        ['Agno', '22K', 'Python', 'Multimodal Agent', 'Multi-modal agent framework'],
        ['Crawl4AI', '20K', 'Python', 'Data Collection', 'AI-optimized web scraping'],
        ['Kotaemon', '18K', 'Python', 'RAG UI', 'No-code document QA'],
        ['LiteLLM', '17K', 'Python', 'LLM Proxy', '100+ provider unified API'],
        ['PocketFlow', '15K', 'Python', 'Framework', 'Zero dependency AI workflow'],
      ],
    },
  },
  {
    id: pid(17), type: 'heading', order: 17, level: 2,
    text: 'Xu hướng nổi bật từ GitHub AI tháng 4/2026',
    anchor: 'xu-huong',
  },
  {
    id: pid(18), type: 'paragraph', order: 18,
    content: 'Nhìn vào danh sách top 10, có thể nhận thấy một số xu hướng rõ ràng: Thứ nhất, AI agent đang dịch chuyển từ "tool-calling" sang "code generation" — agents tự viết và chạy code thực sự thay vì chỉ gọi các hàm được định sẵn. Thứ hai, privacy và local deployment ngày càng quan trọng — nhiều repo tập trung vào khả năng chạy hoàn toàn local. Thứ ba, developer experience đang trở thành yếu tố cạnh tranh chính — các framework mới ưu tiên type safety, observability và debugging tools.',
  },
  {
    id: pid(19), type: 'paragraph', order: 19,
    content: 'Cộng đồng AI mã nguồn mở đang tiến nhanh hơn bao giờ hết. Chỉ trong vài tháng đầu năm 2026, chúng ta đã thấy nhiều đột phá về AI agent, memory systems và evaluation frameworks. Dự kiến trong những tháng tới, chúng ta sẽ thấy nhiều repo tập trung vào multi-agent systems (nhiều AI agent phối hợp), long-running agent tasks (agent làm việc hàng giờ không cần giám sát) và real-time AI systems (latency dưới 100ms cho ứng dụng interactive).',
  },
  {
    id: pid(20), type: 'image', order: 20,
    image: {
      url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=630&fit=crop',
      alt: 'Open source AI development community',
      caption: 'Cộng đồng AI mã nguồn mở đang phát triển mạnh mẽ với hàng trăm repo mới mỗi tháng',
      width: 1200, height: 630,
    },
  },
  {
    id: pid(21), type: 'quote', order: 21,
    content: '"The open source AI ecosystem in 2026 is moving at a pace that even I struggle to keep up with. Every week there\'s something genuinely new, not just incremental improvements." — Yann LeCun, Chief AI Scientist tại Meta',
  },
  {
    id: pid(22), type: 'heading', order: 22, level: 2,
    text: 'Câu hỏi thường gặp về GitHub AI repos',
    anchor: 'faq-github',
  },
  {
    id: pid(23), type: 'faq', order: 23,
    faqs: [
      {
        question: 'Làm thế nào để tìm GitHub repos AI trending?',
        answer: 'Cách đơn giản nhất là vào github.com/trending, lọc theo Language: Python hoặc TypeScript và Date range: This week hoặc This month. Ngoài ra, theo dõi các newsletter như TLDR AI, The Batch (deeplearning.ai), hay Twitter/X của các nhà nghiên cứu AI hàng đầu sẽ giúp bạn cập nhật nhanh nhất.',
      },
      {
        question: 'Nên bắt đầu với repo nào trong danh sách này?',
        answer: 'Phụ thuộc vào mục tiêu của bạn: Nếu muốn AI tự code, thử OpenHands hoặc Smolagents. Nếu muốn xây dựng ứng dụng RAG, thử LlamaIndex hay Kotaemon. Nếu là JS developer, bắt đầu với Mastra hoặc Continue. Nếu chỉ muốn dùng LLM local free, cài Ollama và Continue là đủ để có trải nghiệm AI coding assistant miễn phí.',
      },
    ],
  },
];

// ============================================================
// SEED FUNCTION
// ============================================================

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  // ── 1. Delete all existing data ──────────────────────────
  console.log('Deleting existing data...');
  await Post.deleteMany({});
  await Author.deleteMany({});
  await Tag.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});
  console.log('Existing data deleted.');

  // ── 2. Create admin user ──────────────────────────────────
  console.log('Creating admin user...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await User.create({
    email: 'admin@managepost.local',
    passwordHash,
    name: 'Admin',
    role: 'admin',
    isActive: true,
  });
  console.log(`Admin user created: ${adminUser.email}`);

  // ── 3. Create categories ─────────────────────────────────
  console.log('Creating categories...');
  const [catModelMoi, catGithubHot] = await Category.insertMany([
    {
      name: 'Model mới',
      slug: 'model-moi',
      description: 'Tin tức và đánh giá về các mô hình AI mới nhất từ OpenAI, Anthropic, Google và các công ty hàng đầu.',
      seoTitle: 'Model AI Mới Nhất 2026 — Đánh giá & So sánh',
      seoDescription: 'Cập nhật tin tức, benchmark và đánh giá chi tiết về các mô hình AI mới nhất: GPT-5, Claude 4, Gemini 2.5 và nhiều hơn nữa.',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Github Hot',
      slug: 'github-hot',
      description: 'Tổng hợp các repository GitHub trending về AI, machine learning và công cụ phát triển phần mềm.',
      seoTitle: 'GitHub AI Trending — Top Repo Hot Nhất 2026',
      seoDescription: 'Khám phá các GitHub repository AI trending nhất: Ollama, Cursor, LangChain, LlamaIndex và hàng chục công cụ AI mã nguồn mở khác.',
      isActive: true,
      sortOrder: 2,
    },
  ]);
  console.log('Categories created.');

  // ── 4. Create tags ────────────────────────────────────────
  console.log('Creating tags...');
  const tagData = [
    { name: 'GPT-5', slug: 'gpt-5', color: '#10a37f' },
    { name: 'Claude', slug: 'claude', color: '#d97706' },
    { name: 'Gemini', slug: 'gemini', color: '#4285f4' },
    { name: 'Open Source', slug: 'open-source', color: '#22c55e' },
    { name: 'LLM', slug: 'llm', color: '#8b5cf6' },
    { name: 'AI Agent', slug: 'ai-agent', color: '#ef4444' },
  ];
  const tags = await Tag.insertMany(tagData);
  const tagMap: Record<string, Types.ObjectId> = {};
  tags.forEach((t) => { tagMap[t.name] = t._id; });
  console.log('Tags created.');

  // ── 5. Create authors ─────────────────────────────────────
  console.log('Creating authors...');
  const [authorDuc, authorLinh] = await Author.insertMany([
    {
      name: 'Trần Minh Đức',
      slug: 'tran-minh-duc',
      email: 'duc.tran@managepost.local',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      bio: 'Trần Minh Đức là chuyên gia AI với hơn 5 năm kinh nghiệm trong lĩnh vực Machine Learning và Natural Language Processing. Anh từng làm việc tại VinAI Research với vai trò Senior AI Engineer, nơi anh đóng góp vào các nghiên cứu về mô hình ngôn ngữ tiếng Việt. Hiện tại, anh là AI Lead tại một startup fintech ở Hà Nội, chuyên phát triển các ứng dụng AI cho ngành tài chính. Anh thường xuyên viết blog và chia sẻ kiến thức về các mô hình AI mới nhất, với góc nhìn thực tế từ người làm việc hàng ngày với AI trong môi trường production.',
      shortBio: 'Chuyên gia AI với 5 năm kinh nghiệm, cựu VinAI Research, hiện là AI Lead tại fintech startup Hà Nội.',
      jobTitle: 'AI Lead',
      company: 'FinAI Vietnam',
      location: 'Hà Nội, Việt Nam',
      expertise: ['Machine Learning', 'NLP', 'LLM', 'Python', 'AI System Design'],
      yearsExperience: 5,
      experience: [
        {
          id: 'exp-1',
          company: 'FinAI Vietnam',
          position: 'AI Lead',
          startDate: '2024-01',
          isCurrent: true,
          description: 'Dẫn dắt team AI 5 người, xây dựng hệ thống phát hiện gian lận và chatbot tư vấn tài chính.',
        },
        {
          id: 'exp-2',
          company: 'VinAI Research',
          position: 'Senior AI Engineer',
          startDate: '2021-06',
          endDate: '2023-12',
          description: 'Nghiên cứu và phát triển mô hình ngôn ngữ tiếng Việt, đóng góp vào PhởBERT và các model NLP.',
        },
      ],
      education: [
        {
          id: 'edu-1',
          school: 'Đại học Bách Khoa Hà Nội',
          degree: 'Thạc sĩ Khoa học Máy tính',
          field: 'Machine Learning',
          startYear: 2018,
          endYear: 2020,
        },
      ],
      skills: [
        { id: 'sk-1', name: 'Python', level: 'expert' as const, yearsOfExperience: 7 },
        { id: 'sk-2', name: 'PyTorch', level: 'expert' as const, yearsOfExperience: 5 },
        { id: 'sk-3', name: 'LangChain', level: 'advanced' as const, yearsOfExperience: 2 },
      ],
      metaTitle: 'Trần Minh Đức — Chuyên gia AI & Machine Learning',
      metaDescription: 'Profile của Trần Minh Đức, chuyên gia AI với 5 năm kinh nghiệm, cựu VinAI Research.',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Nguyễn Hà Linh',
      slug: 'nguyen-ha-linh',
      email: 'linh.nguyen@managepost.local',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=200&h=200&fit=crop',
      bio: 'Nguyễn Hà Linh là kỹ sư Machine Learning tại FPT AI Center, một trong những trung tâm AI lớn nhất Việt Nam. Với nền tảng toán học vững chắc từ Đại học Khoa học Tự nhiên TP.HCM và kinh nghiệm thực chiến tại FPT, chị chuyên sâu vào các ứng dụng AI trong lĩnh vực y tế và giáo dục. Chị là tác giả của nhiều bài viết kỹ thuật về deep learning, computer vision và ứng dụng LLM trong doanh nghiệp. Ngoài công việc, chị tích cực tham gia các cộng đồng AI Việt Nam và thường xuyên diễn thuyết tại các hội nghị công nghệ trong nước.',
      shortBio: 'Kỹ sư ML tại FPT AI Center, chuyên về AI trong y tế và giáo dục, diễn giả tại các hội nghị AI.',
      jobTitle: 'Machine Learning Engineer',
      company: 'FPT AI Center',
      location: 'Hồ Chí Minh, Việt Nam',
      expertise: ['Computer Vision', 'Healthcare AI', 'Deep Learning', 'LLM Applications', 'MLOps'],
      yearsExperience: 4,
      experience: [
        {
          id: 'exp-1',
          company: 'FPT AI Center',
          position: 'Machine Learning Engineer',
          startDate: '2022-08',
          isCurrent: true,
          description: 'Phát triển giải pháp AI cho ngành y tế: phân tích hình ảnh X-quang, tóm tắt bệnh án, chatbot tư vấn sức khỏe.',
        },
        {
          id: 'exp-2',
          company: 'VNG Corporation',
          position: 'Junior AI Engineer',
          startDate: '2020-09',
          endDate: '2022-07',
          description: 'Xây dựng hệ thống recommendation và content moderation cho nền tảng gaming.',
        },
      ],
      education: [
        {
          id: 'edu-1',
          school: 'Đại học Khoa học Tự nhiên TP.HCM',
          degree: 'Cử nhân Toán Tin',
          field: 'Khoa học Máy tính',
          startYear: 2016,
          endYear: 2020,
        },
      ],
      skills: [
        { id: 'sk-1', name: 'TensorFlow', level: 'expert' as const, yearsOfExperience: 5 },
        { id: 'sk-2', name: 'Computer Vision', level: 'advanced' as const, yearsOfExperience: 4 },
        { id: 'sk-3', name: 'LlamaIndex', level: 'advanced' as const, yearsOfExperience: 2 },
      ],
      metaTitle: 'Nguyễn Hà Linh — Kỹ sư ML tại FPT AI',
      metaDescription: 'Profile của Nguyễn Hà Linh, kỹ sư Machine Learning tại FPT AI Center, chuyên về AI trong y tế.',
      isActive: true,
      isFeatured: true,
    },
  ]);
  console.log('Authors created.');

  // ── 6. Create posts ───────────────────────────────────────
  console.log('Creating posts...');

  const now = new Date('2026-04-03T08:00:00Z');

  const postsData = [
    // ── Category: Model mới ──────────────────────────────
    {
      title: 'GPT-5 ra mắt: Bước nhảy vọt trong AI tạo sinh',
      slug: 'gpt-5-ra-mat-buoc-nhay-vot-trong-ai-tao-sinh',
      excerpt: 'GPT-5 của OpenAI vừa chính thức ra mắt với nhiều cải tiến đột phá: context 256K token, multimodal hoàn chỉnh, SWE-bench 71.8% — đây là bước nhảy vọt thực sự trong AI tạo sinh.',
      content: 'GPT-5 là mô hình AI thế hệ mới nhất của OpenAI với khả năng vượt trội về reasoning, coding và multimodal. Bài viết phân tích chi tiết các thông số kỹ thuật, benchmark và ứng dụng thực tế.',
      coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop',
      imageAlt: 'GPT-5 AI model interface',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catModelMoi._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-01T08:00:00Z'),
      authorId: authorDuc._id,
      author: 'Trần Minh Đức',
      tags: ['GPT-5', 'LLM', 'AI Agent'],
      tagsRelation: [tagMap['GPT-5'], tagMap['LLM'], tagMap['AI Agent']],
      contentBlocks: gpt5Blocks,
      faq: [
        { question: 'GPT-5 có thể thay thế lập trình viên không?', answer: 'GPT-5 là công cụ hỗ trợ mạnh mẽ nhưng chưa thể thay thế hoàn toàn. Nó xuất sắc trong code theo spec rõ ràng nhưng quyết định kiến trúc phức tạp vẫn cần con người.' },
        { question: 'GPT-5 có giá bao nhiêu?', answer: 'GPT-5 Standard: $15/1M input, $60/1M output tokens. ChatGPT Plus $20/tháng với 40 tin/ngày.' },
      ],
      metaTitle: 'GPT-5 Ra Mắt: Tính Năng, Benchmark & Giá Cả Chi Tiết 2026',
      metaDescription: 'GPT-5 chính thức ra mắt với context 256K token, multimodal video, SWE-bench 71.8%. Tìm hiểu tất cả về khả năng, giá cả và ứng dụng của GPT-5.',
      ogTitle: 'GPT-5 ra mắt: Bước nhảy vọt trong AI tạo sinh',
      ogDescription: 'Phân tích toàn diện GPT-5 — bước nhảy vọt lớn nhất của OpenAI với khả năng reasoning, coding và multimodal chưa từng có.',
      ogImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop',
      isFeatured: true,
      isEvergreen: false,
      language: 'vi',
      articleType: 'analysis' as const,
    },
    {
      title: 'Claude 4 Opus: AI suy luận mạnh nhất thế giới',
      slug: 'claude-4-opus-ai-suy-luan-manh-nhat-the-gioi',
      excerpt: 'Claude 4 Opus của Anthropic thiết lập kỷ lục mới với GPQA Diamond 82.4% và SWE-bench 72.5%. Khám phá kiến trúc Extended Thinking, Constitutional AI 2.0 và khả năng agentic đỉnh cao.',
      content: 'Claude 4 Opus là flagship model của Anthropic với khả năng suy luận vượt trội, Extended Thinking và Constitutional AI 2.0 đảm bảo an toàn. Đây là mô hình tốt nhất cho coding phức tạp và phân tích khoa học.',
      coverImage: 'https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=1200&h=630&fit=crop',
      imageAlt: 'Claude 4 Opus AI interface',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catModelMoi._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-02T09:00:00Z'),
      authorId: authorLinh._id,
      author: 'Nguyễn Hà Linh',
      tags: ['Claude', 'LLM', 'AI Agent'],
      tagsRelation: [tagMap['Claude'], tagMap['LLM'], tagMap['AI Agent']],
      contentBlocks: claude4Blocks,
      faq: [
        { question: 'Claude 4 Opus có tốt hơn GPT-5 không?', answer: 'Phụ thuộc vào tác vụ. Claude 4 dẫn đầu về GPQA Diamond và SWE-bench. GPT-5 mạnh hơn về sáng tạo và multimodal.' },
        { question: 'Extended thinking của Claude 4 hoạt động như thế nào?', answer: 'Claude 4 tạo luồng suy luận nội tâm tới 32K token trước khi trả lời, giúp giải quyết toán học và logic phức tạp chính xác hơn.' },
      ],
      metaTitle: 'Claude 4 Opus: AI Suy Luận Mạnh Nhất — Review Chi Tiết 2026',
      metaDescription: 'Claude 4 Opus của Anthropic với GPQA Diamond 82.4%, SWE-bench 72.5% và Extended Thinking. Phân tích kiến trúc, benchmark và cách sử dụng hiệu quả.',
      ogTitle: 'Claude 4 Opus: AI suy luận mạnh nhất thế giới',
      ogDescription: 'Anthropic ra mắt Claude 4 Opus với khả năng reasoning đỉnh cao, Constitutional AI 2.0 và agentic capabilities mạnh mẽ nhất hiện tại.',
      ogImage: 'https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=1200&h=630&fit=crop',
      isFeatured: true,
      isEvergreen: false,
      language: 'vi',
      articleType: 'analysis' as const,
    },
    {
      title: 'Gemini 2.5 Pro: Google phản công với context 2 triệu token',
      slug: 'gemini-2-5-pro-google-phan-cong-context-2-trieu-token',
      excerpt: 'Google DeepMind ra mắt Gemini 2.5 Pro với context window khổng lồ 2 triệu token, xử lý video 2 giờ và tích hợp Google Search. Giá rẻ hơn đối thủ nhưng chất lượng không kém cạnh.',
      content: 'Gemini 2.5 Pro là câu trả lời mạnh mẽ của Google cho GPT-5 và Claude 4, với context 2M token, multimodal native và tích hợp sâu vào hệ sinh thái Google Workspace.',
      coverImage: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&h=630&fit=crop',
      imageAlt: 'Gemini 2.5 Pro Google AI',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catModelMoi._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-02T14:00:00Z'),
      authorId: authorDuc._id,
      author: 'Trần Minh Đức',
      tags: ['Gemini', 'LLM'],
      tagsRelation: [tagMap['Gemini'], tagMap['LLM']],
      contentBlocks: gemini25Blocks,
      faq: [
        { question: 'Gemini 2.5 Pro có khả dụng ở Việt Nam không?', answer: 'Có, qua Google AI Studio (free) và Gemini Advanced ($19.99/tháng). Vertex AI cần tài khoản Google Cloud.' },
        { question: 'Context 2M token của Gemini có thực sự hữu ích?', answer: 'Rất hữu ích cho phân tích tài liệu lớn, toàn bộ codebase hoặc dữ liệu nghiên cứu dài. Nhưng vẫn có vấn đề "lost in the middle" với context rất dài.' },
      ],
      metaTitle: 'Gemini 2.5 Pro: Context 2M Token, Review Chi Tiết & So Sánh 2026',
      metaDescription: 'Google Gemini 2.5 Pro với context window 2 triệu token, xử lý video 2 giờ, giá từ $7/1M token. Review đầy đủ tính năng và so sánh với GPT-5, Claude 4.',
      ogTitle: 'Gemini 2.5 Pro: Google phản công với context 2 triệu token',
      ogDescription: 'Gemini 2.5 Pro ra mắt với context 2M token, multimodal native và tích hợp Google Search — liệu Google có vượt OpenAI và Anthropic?',
      ogImage: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&h=630&fit=crop',
      isFeatured: false,
      isEvergreen: false,
      language: 'vi',
      articleType: 'analysis' as const,
    },
    {
      title: 'So sánh chi tiết GPT-5 vs Claude 4 vs Gemini 2.5: Mô hình nào tốt nhất?',
      slug: 'so-sanh-gpt-5-vs-claude-4-vs-gemini-2-5',
      excerpt: 'Phân tích toàn diện dựa trên 50+ benchmark và kiểm tra thực tế: GPT-5 mạnh về coding và sáng tạo, Claude 4 Opus dẫn đầu về reasoning và khoa học, Gemini 2.5 Pro vượt trội về multimodal và giá rẻ.',
      content: 'So sánh head-to-head GPT-5, Claude 4 Opus và Gemini 2.5 Pro trên các benchmark chuẩn và tác vụ thực tế. Khuyến nghị use case cụ thể cho từng mô hình.',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      imageAlt: 'AI models comparison 2026',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catModelMoi._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-03T07:00:00Z'),
      authorId: authorLinh._id,
      author: 'Nguyễn Hà Linh',
      tags: ['GPT-5', 'Claude', 'Gemini', 'LLM'],
      tagsRelation: [tagMap['GPT-5'], tagMap['Claude'], tagMap['Gemini'], tagMap['LLM']],
      contentBlocks: comparisonBlocks,
      faq: [
        { question: 'Nên chọn mô hình AI nào cho lập trình?', answer: 'Claude 4 Opus là lựa chọn tốt nhất cho coding phức tạp. GPT-5 tốt cho JavaScript/TypeScript. Gemini 2.5 Pro phù hợp khi cần context lớn cho codebase.' },
        { question: 'Mô hình nào rẻ nhất?', answer: 'Gemini 2.5 Flash rẻ nhất ($0.35/1M input). Trong big three flagship, Gemini 2.5 Pro ($7/$21) rẻ hơn Claude 4 Opus ($15/$75) và GPT-5 ($15/$60).' },
      ],
      metaTitle: 'So Sánh GPT-5 vs Claude 4 vs Gemini 2.5 Pro — Mô Hình Nào Tốt Nhất 2026?',
      metaDescription: 'So sánh chi tiết GPT-5, Claude 4 Opus và Gemini 2.5 Pro trên 8 benchmark chuẩn. Khuyến nghị use case cụ thể để chọn đúng mô hình AI cho nhu cầu của bạn.',
      ogTitle: 'GPT-5 vs Claude 4 vs Gemini 2.5 Pro — So sánh toàn diện 2026',
      ogDescription: 'Cuộc chiến AI 2026: GPT-5, Claude 4 Opus hay Gemini 2.5 Pro? Phân tích dựa trên benchmark thực tế và kinh nghiệm sử dụng.',
      ogImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      isFeatured: true,
      isEvergreen: true,
      language: 'vi',
      articleType: 'analysis' as const,
    },

    // ── Category: Github Hot ─────────────────────────────
    {
      title: 'Cursor IDE: Editor AI thay đổi cách lập trình',
      slug: 'cursor-ide-editor-ai-thay-doi-cach-lap-trinh',
      excerpt: 'Cursor IDE với 1 triệu developer dùng hàng ngày đang định nghĩa lại quy trình lập trình. Tìm hiểu Composer, Cursor Rules, Tab Autocomplete và tại sao nhiều developer đang bỏ VS Code để sang Cursor.',
      content: 'Cursor IDE là code editor AI-first được xây dựng trên nền VS Code, tích hợp sâu GPT-5 và Claude 4 để hỗ trợ lập trình. Hướng dẫn cài đặt, các tính năng nổi bật và mẹo sử dụng hiệu quả.',
      coverImage: 'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=1200&h=630&fit=crop',
      imageAlt: 'Cursor IDE AI code editor',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catGithubHot._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-01T10:00:00Z'),
      authorId: authorDuc._id,
      author: 'Trần Minh Đức',
      tags: ['AI Agent', 'Open Source', 'LLM'],
      tagsRelation: [tagMap['AI Agent'], tagMap['Open Source'], tagMap['LLM']],
      contentBlocks: cursorBlocks,
      faq: [
        { question: 'Cursor có an toàn cho code dự án không?', answer: 'Cursor gửi code lên server để AI xử lý. Gói Business có cam kết bảo mật doanh nghiệp. Với code cực nhạy cảm, nên dùng Continue + Ollama thay thế.' },
        { question: 'Cursor có miễn phí không?', answer: 'Cursor có gói Free với 2000 autocomplete/tháng. Gói Pro $20/tháng không giới hạn với model cao cấp.' },
      ],
      metaTitle: 'Cursor IDE Review 2026 — AI Code Editor Tốt Nhất Hiện Nay?',
      metaDescription: 'Review chi tiết Cursor IDE: tính năng Composer, Cursor Rules, Tab Autocomplete. So sánh với GitHub Copilot và hướng dẫn cài đặt từng bước.',
      ogTitle: 'Cursor IDE: Editor AI thay đổi cách lập trình',
      ogDescription: 'Cursor đạt 1 triệu developer dùng hàng ngày. Tại sao Cursor đang thay thế VS Code + Copilot và cách sử dụng hiệu quả nhất.',
      ogImage: 'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?w=1200&h=630&fit=crop',
      isFeatured: true,
      isEvergreen: true,
      language: 'vi',
      articleType: 'explainer' as const,
    },
    {
      title: 'Ollama: Chạy LLM mạnh mẽ trên máy cá nhân hoàn toàn miễn phí',
      slug: 'ollama-chay-llm-manh-me-tren-may-ca-nhan-mien-phi',
      excerpt: 'Ollama cho phép chạy Llama 3.3, Phi-4, DeepSeek R1 và hàng chục model LLM khác trực tiếp trên laptop của bạn. Hướng dẫn cài đặt, so sánh model và tích hợp với VS Code để có AI coding assistant miễn phí.',
      content: 'Hướng dẫn toàn diện về Ollama — cách cài đặt, chọn model phù hợp phần cứng, tích hợp với Continue IDE plugin và xây dựng chatbot local với Open WebUI.',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop',
      imageAlt: 'Ollama local LLM running on computer',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catGithubHot._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-02T08:00:00Z'),
      authorId: authorLinh._id,
      author: 'Nguyễn Hà Linh',
      tags: ['Open Source', 'LLM', 'AI Agent'],
      tagsRelation: [tagMap['Open Source'], tagMap['LLM'], tagMap['AI Agent']],
      contentBlocks: ollamaBlocks,
      faq: [
        { question: 'Cần cấu hình máy tính như thế nào để chạy Ollama?', answer: 'Tối thiểu 8GB RAM cho model 7B. 16GB cho model 14B. 48GB+ cho 70B. GPU NVIDIA 8GB+ VRAM tăng tốc gấp 5-10 lần.' },
        { question: 'Ollama có hỗ trợ tiếng Việt không?', answer: 'Llama 3.3 và Qwen 2.5 hỗ trợ tiếng Việt khá tốt nhưng vẫn kém GPT-5 và Claude 4. Thêm system prompt tiếng Việt để cải thiện.' },
      ],
      metaTitle: 'Ollama: Hướng Dẫn Chạy LLM Local Miễn Phí Trên Máy Tính 2026',
      metaDescription: 'Hướng dẫn cài đặt Ollama, chọn model phù hợp (Llama 3.3, Phi-4, DeepSeek), tích hợp với VS Code. Chạy AI hoàn toàn local, bảo mật và miễn phí.',
      ogTitle: 'Ollama: Chạy LLM mạnh mẽ trên máy cá nhân hoàn toàn miễn phí',
      ogDescription: 'Ollama — cách đơn giản nhất để chạy LLM local. Từ cài đặt đến tích hợp VS Code trong 15 phút, không tốn một đồng nào.',
      ogImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop',
      isFeatured: false,
      isEvergreen: true,
      language: 'vi',
      articleType: 'explainer' as const,
    },
    {
      title: 'LangChain vs LlamaIndex: Framework AI nào tốt hơn cho dự án của bạn?',
      slug: 'langchain-vs-llamaindex-framework-ai-nao-tot-hon',
      excerpt: 'So sánh toàn diện LangChain và LlamaIndex: kiến trúc, use case, learning curve và performance. LangChain mạnh hơn cho AI agent phức tạp, LlamaIndex xuất sắc hơn cho RAG và data indexing.',
      content: 'Phân tích chi tiết LangChain và LlamaIndex — hai framework AI hàng đầu cho Python. Bao gồm code ví dụ thực tế, benchmark và khuyến nghị cụ thể theo từng use case.',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop',
      imageAlt: 'LangChain LlamaIndex comparison',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catGithubHot._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-02T11:00:00Z'),
      authorId: authorDuc._id,
      author: 'Trần Minh Đức',
      tags: ['Open Source', 'LLM', 'AI Agent'],
      tagsRelation: [tagMap['Open Source'], tagMap['LLM'], tagMap['AI Agent']],
      contentBlocks: langchainBlocks,
      faq: [
        { question: 'LangChain hay LlamaIndex dễ học hơn?', answer: 'LlamaIndex thường dễ học hơn cho người mới. LangChain có nhiều tài liệu hơn nhưng abstraction phức tạp hơn. LCEL mới của LangChain đã cải thiện nhiều.' },
        { question: 'Có thể dùng cả LangChain và LlamaIndex trong cùng dự án không?', answer: 'Có và thực ra rất phổ biến: dùng LlamaIndex làm retrieval layer, LangChain làm orchestration và agent framework.' },
      ],
      metaTitle: 'LangChain vs LlamaIndex 2026 — So Sánh Chi Tiết & Khuyến Nghị',
      metaDescription: 'So sánh LangChain và LlamaIndex cho AI application development: kiến trúc, RAG quality, agent capabilities và learning curve. Khuyến nghị theo use case cụ thể.',
      ogTitle: 'LangChain vs LlamaIndex: Framework AI nào phù hợp với bạn?',
      ogDescription: 'Phân tích sâu LangChain và LlamaIndex — hai framework AI phổ biến nhất. Code ví dụ thực tế và khuyến nghị use case để bạn đưa ra lựa chọn đúng đắn.',
      ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop',
      isFeatured: false,
      isEvergreen: true,
      language: 'vi',
      articleType: 'analysis' as const,
    },
    {
      title: 'Top 10 GitHub repo AI hot nhất tháng 4/2026',
      slug: 'top-10-github-repo-ai-hot-nhat-thang-4-2026',
      excerpt: 'Tổng hợp 10 GitHub repository AI được star nhiều nhất tháng 4/2026: OpenHands (45K stars), Mastra, Smolagents, Mem0, Continue và nhiều tool AI mã nguồn mở đột phá khác.',
      content: 'Danh sách 10 GitHub repo AI trending tháng 4/2026: từ AI agent framework, memory layer, IDE plugin đến LLM proxy — mỗi repo đều đại diện cho một xu hướng đang định hình tương lai AI.',
      coverImage: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=1200&h=630&fit=crop',
      imageAlt: 'GitHub trending AI repositories',
      imageWidth: 1200,
      imageHeight: 630,
      categoryId: catGithubHot._id,
      status: 'published' as const,
      publishedAt: new Date('2026-04-03T09:00:00Z'),
      authorId: authorLinh._id,
      author: 'Nguyễn Hà Linh',
      tags: ['Open Source', 'AI Agent', 'LLM'],
      tagsRelation: [tagMap['Open Source'], tagMap['AI Agent'], tagMap['LLM']],
      contentBlocks: githubTopBlocks,
      faq: [
        { question: 'Repo nào trong danh sách phù hợp cho người mới bắt đầu AI?', answer: 'Continue + Ollama là combo tốt nhất cho người mới: miễn phí, dễ cài, có AI coding assistant ngay trong VS Code. Kotaemon tốt nếu muốn RAG không cần code.' },
        { question: 'OpenHands có thể thay thế developer không?', answer: 'Chưa. OpenHands tốt nhất với task được spec rõ ràng và scope nhỏ. Với dự án lớn và quyết định kiến trúc phức tạp vẫn cần human oversight.' },
      ],
      metaTitle: 'Top 10 GitHub Repo AI Hot Nhất Tháng 4/2026 — Cập Nhật Mới Nhất',
      metaDescription: 'Danh sách 10 GitHub repository AI trending tháng 4/2026: OpenHands, Mastra, Smolagents, Mem0, Continue và nhiều công cụ AI mã nguồn mở đáng chú ý.',
      ogTitle: 'Top 10 GitHub AI Repo Hot Nhất Tháng 4/2026',
      ogDescription: 'Khám phá 10 GitHub repo AI được cộng đồng developer quan tâm nhất tháng 4/2026 — từ AI agent đến memory layer và LLM proxy.',
      ogImage: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=1200&h=630&fit=crop',
      isFeatured: true,
      isEvergreen: false,
      language: 'vi',
      articleType: 'news' as const,
    },
  ];

  for (const postData of postsData) {
    const post = new Post(postData);
    await post.save();
    console.log(`  Post created: "${post.title}"`);
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`  - 1 admin user (admin@managepost.local / admin123)`);
  console.log(`  - 2 categories: Model mới, Github Hot`);
  console.log(`  - 6 tags: GPT-5, Claude, Gemini, Open Source, LLM, AI Agent`);
  console.log(`  - 2 authors: Trần Minh Đức, Nguyễn Hà Linh`);
  console.log(`  - 8 posts (4 per category) with full contentBlocks`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
