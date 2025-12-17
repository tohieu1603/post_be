/**
 * DeepSeek AI SEO Analysis Service
 * Uses DeepSeek API for intelligent SEO analysis
 */

import { IPost } from '../models/post.model';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface AISeoAnalysis {
  overallScore: number;
  titleAnalysis: {
    score: number;
    suggestions: string[];
    improvedTitle?: string;
  };
  metaDescriptionAnalysis: {
    score: number;
    suggestions: string[];
    improvedDescription?: string;
  };
  contentAnalysis: {
    score: number;
    readability: string;
    suggestions: string[];
  };
  keywordAnalysis: {
    score: number;
    detectedKeywords: string[];
    suggestedKeywords: string[];
    density: string;
  };
  structureAnalysis: {
    score: number;
    headingStructure: string;
    suggestions: string[];
  };
  competitorInsights?: string[];
  summary: string;
}

async function callDeepSeek(messages: DeepSeekMessage[]): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data = await response.json() as DeepSeekResponse;
  return data.choices[0]?.message?.content || '';
}

export class DeepSeekSeoService {
  /**
   * Analyze post SEO with AI
   */
  async analyzePost(post: IPost, focusKeyword?: string): Promise<AISeoAnalysis> {
    const prompt = this.buildAnalysisPrompt(post, focusKeyword);

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia SEO với 10+ năm kinh nghiệm. Phân tích bài viết và trả về JSON với format sau:
{
  "overallScore": number (0-100),
  "titleAnalysis": { "score": number, "suggestions": string[], "improvedTitle": string },
  "metaDescriptionAnalysis": { "score": number, "suggestions": string[], "improvedDescription": string },
  "contentAnalysis": { "score": number, "readability": string, "suggestions": string[] },
  "keywordAnalysis": { "score": number, "detectedKeywords": string[], "suggestedKeywords": string[], "density": string },
  "structureAnalysis": { "score": number, "headingStructure": string, "suggestions": string[] },
  "competitorInsights": string[],
  "summary": string
}
CHỈ trả về JSON, không có text khác.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      return JSON.parse(jsonMatch[0]) as AISeoAnalysis;
    } catch (e) {
      console.error('Failed to parse DeepSeek response:', response);
      throw new Error('Failed to parse AI analysis');
    }
  }

  /**
   * Generate SEO-optimized title suggestions
   */
  async suggestTitles(post: IPost, count: number = 5): Promise<Array<{ title: string; reason: string; keywords: string[] }>> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia SEO. Tạo tiêu đề tối ưu cho SEO (50-60 ký tự, có power words, gây tò mò). Trả về JSON array:
[
  { "title": "tiêu đề 1", "reason": "lý do tại sao tiêu đề này tốt", "keywords": ["keyword1", "keyword2"] },
  { "title": "tiêu đề 2", "reason": "lý do", "keywords": ["keyword"] }
]
CHỈ trả về JSON array, không có text khác.`
      },
      {
        role: 'user',
        content: `Tạo ${count} tiêu đề SEO cho bài viết:
Tiêu đề hiện tại: ${post.title}
Nội dung: ${post.content?.substring(0, 500)}...
Danh mục: ${post.category?.name || 'N/A'}`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];
      return JSON.parse(jsonMatch[0]) as Array<{ title: string; reason: string; keywords: string[] }>;
    } catch {
      return [];
    }
  }

  /**
   * Generate meta description
   */
  async generateMetaDescription(post: IPost): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: 'Bạn là chuyên gia SEO. Viết meta description tối ưu (150-160 ký tự, có CTA, keyword ở đầu). Chỉ trả về meta description, không giải thích.'
      },
      {
        role: 'user',
        content: `Viết meta description cho:
Tiêu đề: ${post.title}
Nội dung: ${post.content?.substring(0, 1000)}...`
      }
    ];

    const response = await callDeepSeek(messages);
    return response.trim().replace(/^["']|["']$/g, '');
  }

  /**
   * Suggest related keywords
   */
  async suggestKeywords(topic: string, count: number = 10): Promise<Array<{
    keyword: string;
    type: 'primary' | 'secondary' | 'long-tail';
    searchIntent: string;
    competition: 'low' | 'medium' | 'high';
  }>> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia SEO. Gợi ý từ khóa liên quan cho topic. Trả về JSON array:
[
  { "keyword": "từ khóa", "type": "primary|secondary|long-tail", "searchIntent": "mục đích tìm kiếm", "competition": "low|medium|high" }
]
CHỈ trả về JSON array, không có text khác.`
      },
      {
        role: 'user',
        content: `Gợi ý ${count} từ khóa SEO cho topic: "${topic}"`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];
      return JSON.parse(jsonMatch[0]);
    } catch {
      return [];
    }
  }

  /**
   * Generate content outline for a topic
   */
  async generateOutline(topic: string, targetKeyword?: string): Promise<{
    title: string;
    introduction: string;
    sections: Array<{
      heading: string;
      subheadings: string[];
      keyPoints: string[];
    }>;
    conclusion: string;
    estimatedWordCount: number;
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia content SEO. Tạo outline bài viết chuẩn SEO. Trả về JSON:
{
  "title": "tiêu đề SEO tối ưu",
  "introduction": "đoạn mở đầu hấp dẫn",
  "sections": [
    {
      "heading": "H2 tiêu đề section",
      "subheadings": ["H3 tiêu đề con 1", "H3 tiêu đề con 2"],
      "keyPoints": ["điểm chính 1", "điểm chính 2"]
    }
  ],
  "conclusion": "đoạn kết luận",
  "estimatedWordCount": 1500
}
CHỈ trả về JSON, không có text khác.`
      },
      {
        role: 'user',
        content: `Tạo outline chi tiết cho topic: "${topic}"${targetKeyword ? ` với từ khóa chính: "${targetKeyword}"` : ''}`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch {
      return {
        title: topic,
        introduction: '',
        sections: [],
        conclusion: '',
        estimatedWordCount: 1500
      };
    }
  }

  /**
   * Improve existing content for SEO
   */
  async improveContent(content: string, focusKeyword?: string): Promise<{
    improvedContent: string;
    changes: string[];
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia SEO content. Cải thiện nội dung cho SEO (thêm keyword tự nhiên, cải thiện readability, thêm heading). Trả về JSON:
{
  "improvedContent": "nội dung đã cải thiện",
  "changes": ["thay đổi 1", "thay đổi 2"]
}`
      },
      {
        role: 'user',
        content: `Cải thiện nội dung sau${focusKeyword ? ` với từ khóa "${focusKeyword}"` : ''}:

${content.substring(0, 3000)}`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { improvedContent: content, changes: [] };
    }
  }

  private buildAnalysisPrompt(post: IPost, focusKeyword?: string): string {
    return `Phân tích SEO cho bài viết:

TIÊU ĐỀ: ${post.title}
META DESCRIPTION: ${post.metaDescription || 'Chưa có'}
TỪ KHÓA CHÍNH: ${focusKeyword || 'Không xác định'}
DANH MỤC: ${post.category?.name || 'N/A'}

NỘI DUNG:
${post.content?.substring(0, 5000) || 'Không có nội dung'}

Hãy phân tích chi tiết và cho điểm từng phần.`;
  }

  /**
   * Smart Meta Generator - Generate meta title & description from title input
   */
  async generateSmartMeta(title: string, content?: string): Promise<{
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords: string[];
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia SEO. Từ tiêu đề bài viết, tạo:
1. Meta title (50-60 ký tự, có power word, keyword ở đầu)
2. Meta description (150-160 ký tự, có CTA, keyword)
3. Focus keyword chính
4. 3-5 secondary keywords

Trả về JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "focusKeyword": "...",
  "secondaryKeywords": ["kw1", "kw2", ...]
}`
      },
      {
        role: 'user',
        content: `Tiêu đề: ${title}${content ? `\nNội dung preview: ${content.substring(0, 500)}` : ''}`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch {
      return {
        metaTitle: title.substring(0, 60),
        metaDescription: '',
        focusKeyword: '',
        secondaryKeywords: []
      };
    }
  }

  /**
   * Real-time SEO Score - Analyze content and return score with suggestions
   */
  async getRealtimeSeoScore(data: {
    title: string;
    metaDescription?: string;
    content: string;
    focusKeyword?: string;
  }): Promise<{
    score: number;
    breakdown: {
      title: { score: number; message: string; status: 'good' | 'warning' | 'error' };
      metaDescription: { score: number; message: string; status: 'good' | 'warning' | 'error' };
      content: { score: number; message: string; status: 'good' | 'warning' | 'error' };
      keyword: { score: number; message: string; status: 'good' | 'warning' | 'error' };
      readability: { score: number; message: string; status: 'good' | 'warning' | 'error' };
      headings: { score: number; message: string; status: 'good' | 'warning' | 'error' };
    };
    suggestions: string[];
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là SEO analyzer. Phân tích realtime và trả về JSON:
{
  "score": number (0-100),
  "breakdown": {
    "title": { "score": 0-100, "message": "...", "status": "good|warning|error" },
    "metaDescription": { "score": 0-100, "message": "...", "status": "good|warning|error" },
    "content": { "score": 0-100, "message": "...", "status": "good|warning|error" },
    "keyword": { "score": 0-100, "message": "...", "status": "good|warning|error" },
    "readability": { "score": 0-100, "message": "...", "status": "good|warning|error" },
    "headings": { "score": 0-100, "message": "...", "status": "good|warning|error" }
  },
  "suggestions": ["gợi ý 1", "gợi ý 2", ...]
}
CHỈ trả về JSON.`
      },
      {
        role: 'user',
        content: `Title: ${data.title}
Meta Description: ${data.metaDescription || 'Chưa có'}
Focus Keyword: ${data.focusKeyword || 'Chưa xác định'}
Content length: ${data.content.length} chars
Content preview: ${data.content.substring(0, 2000)}`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch {
      return {
        score: 0,
        breakdown: {
          title: { score: 0, message: 'Không thể phân tích', status: 'error' },
          metaDescription: { score: 0, message: 'Không thể phân tích', status: 'error' },
          content: { score: 0, message: 'Không thể phân tích', status: 'error' },
          keyword: { score: 0, message: 'Không thể phân tích', status: 'error' },
          readability: { score: 0, message: 'Không thể phân tích', status: 'error' },
          headings: { score: 0, message: 'Không thể phân tích', status: 'error' }
        },
        suggestions: []
      };
    }
  }

  /**
   * Auto Internal Linking - Suggest internal links based on content
   */
  async suggestInternalLinks(content: string, availablePosts: { id: string; title: string; slug: string; excerpt?: string }[]): Promise<{
    suggestions: Array<{
      postId: string;
      postTitle: string;
      postSlug: string;
      anchorText: string;
      context: string;
      relevanceScore: number;
    }>;
  }> {
    const postsInfo = availablePosts.slice(0, 20).map(p =>
      `- ID: ${p.id}, Title: "${p.title}", Slug: ${p.slug}`
    ).join('\n');

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là SEO expert. Phân tích content và gợi ý internal links phù hợp từ danh sách bài viết.
Trả về JSON:
{
  "suggestions": [
    {
      "postId": "id",
      "postTitle": "title",
      "postSlug": "slug",
      "anchorText": "text nên dùng làm anchor",
      "context": "vị trí/đoạn văn nên chèn link",
      "relevanceScore": 0-100
    }
  ]
}
Chỉ gợi ý các bài THỰC SỰ liên quan. Max 5 suggestions.`
      },
      {
        role: 'user',
        content: `Content cần phân tích:
${content.substring(0, 3000)}

Danh sách bài viết có sẵn:
${postsInfo}`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { suggestions: [] };
    }
  }

  /**
   * Duplicate Content Checker - Check similarity with existing content
   */
  async checkDuplicateContent(newContent: string, existingContents: { id: string; title: string; content: string }[]): Promise<{
    isDuplicate: boolean;
    similarityScore: number;
    matches: Array<{
      postId: string;
      postTitle: string;
      similarity: number;
      matchedPhrases: string[];
    }>;
    recommendation: string;
  }> {
    const existingInfo = existingContents.slice(0, 10).map(p =>
      `--- POST ${p.id}: ${p.title} ---\n${p.content.substring(0, 500)}\n`
    ).join('\n');

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là content plagiarism checker. So sánh nội dung mới với các bài có sẵn.
Trả về JSON:
{
  "isDuplicate": boolean (true nếu similarity > 30%),
  "similarityScore": 0-100,
  "matches": [
    {
      "postId": "id",
      "postTitle": "title",
      "similarity": 0-100,
      "matchedPhrases": ["cụm từ trùng 1", "cụm từ trùng 2"]
    }
  ],
  "recommendation": "gợi ý xử lý"
}`
      },
      {
        role: 'user',
        content: `Nội dung mới cần check:
${newContent.substring(0, 2000)}

Các bài viết có sẵn để so sánh:
${existingInfo}`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch {
      return {
        isDuplicate: false,
        similarityScore: 0,
        matches: [],
        recommendation: 'Không thể kiểm tra'
      };
    }
  }

  /**
   * Auto Schema Generator - Generate JSON-LD structured data
   */
  async generateSchema(post: IPost, siteUrl: string): Promise<{
    articleSchema: object;
    breadcrumbSchema: object;
    faqSchema?: object;
  }> {
    // Extract FAQs from content if present
    const faqPattern = /(?:Q:|Hỏi:|Câu hỏi:)\s*(.+?)[\n\r]+(?:A:|Trả lời:|Đáp:)\s*(.+?)(?=(?:Q:|Hỏi:|Câu hỏi:)|$)/gi;
    const faqs: { question: string; answer: string }[] = [];
    let match;
    const content = post.content || '';
    while ((match = faqPattern.exec(content)) !== null) {
      faqs.push({ question: match[1].trim(), answer: match[2].trim() });
    }

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': post.title,
      'description': post.metaDescription || post.excerpt || '',
      'image': post.ogImage || post.coverImage || '',
      'author': {
        '@type': 'Person',
        'name': post.author || 'Admin'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'ManagePost',
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteUrl}/logo.png`
        }
      },
      'datePublished': post.publishedAt || post.createdAt,
      'dateModified': post.updatedAt,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${siteUrl}/p/${post.slug}`
      }
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Trang chủ',
          'item': siteUrl
        },
        ...(post.category ? [{
          '@type': 'ListItem',
          'position': 2,
          'name': post.category.name,
          'item': `${siteUrl}/category/${post.category.slug}`
        }] : []),
        {
          '@type': 'ListItem',
          'position': post.category ? 3 : 2,
          'name': post.title,
          'item': `${siteUrl}/p/${post.slug}`
        }
      ]
    };

    const faqSchema = faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    } : undefined;

    return { articleSchema, breadcrumbSchema, faqSchema };
  }

  /**
   * Content Optimizer - Analyze content and provide specific improvement suggestions
   * This is the main AI content optimization feature
   */
  async optimizeContent(data: {
    title: string;
    content: string;
    focusKeyword?: string;
    existingHeadings?: string[];
    relatedPosts?: { title: string; slug: string }[];
  }): Promise<{
    suggestions: Array<{
      type: 'add_heading' | 'add_keyword' | 'add_internal_link' | 'add_faq' | 'improve_intro' | 'add_section' | 'improve_readability';
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      suggestion: string;
      position?: string;
      relatedKeyword?: string;
    }>;
    headingSuggestions: Array<{
      type: 'h2' | 'h3';
      text: string;
      reason: string;
      afterSection?: string;
    }>;
    keywordSuggestions: Array<{
      keyword: string;
      currentCount: number;
      suggestedCount: number;
      placements: string[];
    }>;
    internalLinkSuggestions: Array<{
      anchorText: string;
      targetPost: string;
      targetSlug: string;
      context: string;
    }>;
    faqSuggestions: Array<{
      question: string;
      suggestedAnswer: string;
    }>;
    summary: {
      totalSuggestions: number;
      highPriority: number;
      mediumPriority: number;
      lowPriority: number;
      estimatedImprovementScore: number;
    };
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `Bạn là chuyên gia Content SEO. Phân tích nội dung bài viết và đưa ra gợi ý CỤ THỂ, HÀNH ĐỘNG ĐƯỢC NGAY để cải thiện.

Trả về JSON với format:
{
  "suggestions": [
    {
      "type": "add_heading|add_keyword|add_internal_link|add_faq|improve_intro|add_section|improve_readability",
      "priority": "high|medium|low",
      "title": "Tiêu đề ngắn gọn",
      "description": "Mô tả vấn đề",
      "suggestion": "Gợi ý cụ thể có thể copy-paste",
      "position": "Vị trí nên chèn (ví dụ: sau đoạn X)",
      "relatedKeyword": "Keyword liên quan nếu có"
    }
  ],
  "headingSuggestions": [
    { "type": "h2|h3", "text": "Tiêu đề gợi ý", "reason": "Lý do", "afterSection": "Sau phần nào" }
  ],
  "keywordSuggestions": [
    { "keyword": "từ khóa", "currentCount": 2, "suggestedCount": 5, "placements": ["đoạn mở đầu", "H2 đầu tiên"] }
  ],
  "internalLinkSuggestions": [
    { "anchorText": "anchor text", "targetPost": "tên bài", "targetSlug": "slug", "context": "đoạn văn nên chèn" }
  ],
  "faqSuggestions": [
    { "question": "Câu hỏi?", "suggestedAnswer": "Gợi ý trả lời" }
  ],
  "summary": {
    "totalSuggestions": 10,
    "highPriority": 3,
    "mediumPriority": 5,
    "lowPriority": 2,
    "estimatedImprovementScore": 25
  }
}

CHỈ trả về JSON, không giải thích.`
      },
      {
        role: 'user',
        content: `Phân tích và tối ưu bài viết:

TIÊU ĐỀ: ${data.title}
TỪ KHÓA CHÍNH: ${data.focusKeyword || 'Chưa xác định - hãy gợi ý'}

NỘI DUNG:
${data.content.substring(0, 4000)}

${data.existingHeadings?.length ? `HEADINGS HIỆN TẠI:\n${data.existingHeadings.join('\n')}` : ''}

${data.relatedPosts?.length ? `BÀI VIẾT LIÊN QUAN CÓ SẴN (để gợi ý internal link):\n${data.relatedPosts.map(p => `- ${p.title} (/p/${p.slug})`).join('\n')}` : ''}

Hãy phân tích và đưa ra:
1. Gợi ý thêm H2 mới (ví dụ: "Nguyên liệu cần chuẩn bị", "Lưu ý quan trọng")
2. Keyword "${data.focusKeyword || ''}" cần xuất hiện thêm ở đâu
3. Internal link nên chèn vào đoạn nào
4. FAQ phổ biến người đọc thường hỏi
5. Các cải thiện khác về cấu trúc, readability`
      }
    ];

    const response = await callDeepSeek(messages);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch {
      return {
        suggestions: [],
        headingSuggestions: [],
        keywordSuggestions: [],
        internalLinkSuggestions: [],
        faqSuggestions: [],
        summary: {
          totalSuggestions: 0,
          highPriority: 0,
          mediumPriority: 0,
          lowPriority: 0,
          estimatedImprovementScore: 0
        }
      };
    }
  }

  /**
   * Generate Alt Text for Image using AI
   */
  async generateImageAltText(imageUrl: string, pageContext: string): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: 'Bạn là SEO expert. Viết alt text mô tả ảnh (tối đa 125 ký tự), có keyword, mô tả chính xác nội dung ảnh phù hợp với ngữ cảnh bài viết. CHỈ trả về alt text, không giải thích.'
      },
      {
        role: 'user',
        content: `Ảnh: ${imageUrl}\nNgữ cảnh bài viết: ${pageContext.substring(0, 500)}`
      }
    ];

    const response = await callDeepSeek(messages);
    return response.trim().replace(/^["']|["']$/g, '').substring(0, 125);
  }
}

export const deepSeekSeoService = new DeepSeekSeoService();
