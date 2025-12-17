/**
 * Auto SEO Service - Main service for automated SEO tasks
 * Handles content analysis, scoring, Google API integration, and AI suggestions
 */

import { Types } from 'mongoose';
import { Post, IPost } from '../models/post.model';
import { SeoScore, ISeoScore } from '../models/seo-score.model';
import { IndexStatus, IIndexStatus } from '../models/index-status.model';
import { SeoLog, ISeoLog, SeoLogAction, SeoLogEntityType, SeoLogStatus } from '../models/seo-log.model';
import { Keyword, IKeyword } from '../models/keyword.model';
import { stripHtml, truncateText } from '../utils/seo.util';

/**
 * SEO Analysis Result Interface
 */
export interface SeoAnalysisResult {
  overallScore: number;
  scores: {
    title: number;
    metaDescription: number;
    content: number;
    heading: number;
    keyword: number;
    readability: number;
    internalLink: number;
    image: number;
    technical: number;
  };
  analysis: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordsPerSentence: number;
    headings: { h1: number; h2: number; h3: number; h4: number };
    images: { total: number; withAlt: number; withoutAlt: number };
    links: { internal: number; external: number };
    keywordDensity: number;
    focusKeyword?: string;
    focusKeywordCount?: number;
  };
  suggestions: Array<{
    type: 'error' | 'warning' | 'success' | 'info';
    category: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export class AutoSeoService {
  /**
   * Analyze post content and generate SEO score
   */
  async analyzePost(postId: string, focusKeyword?: string): Promise<{
    success: boolean;
    data?: SeoAnalysisResult;
    error?: string;
  }> {
    try {
      const result = await this._analyzePost(postId, focusKeyword);

      // Save score to database
      await this.saveSeoScore(postId, result);

      // Log the action
      await this.logAction({
        action: 'seo_analyze',
        entityType: 'post',
        entityId: postId,
        status: 'success',
        message: `SEO analysis completed with score ${result.overallScore}`,
        details: { overallScore: result.overallScore, focusKeyword },
      });

      return { success: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Analysis failed';

      await this.logAction({
        action: 'seo_analyze',
        entityType: 'post',
        entityId: postId,
        status: 'failed',
        message,
      });

      return { success: false, error: message };
    }
  }

  /**
   * Internal analyze post method
   */
  private async _analyzePost(postId: string, focusKeyword?: string): Promise<SeoAnalysisResult> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new Error('Invalid post ID');
    }

    const post = await Post.findById(postId).populate('category');

    if (!post) {
      throw new Error('Post not found');
    }

    const plainContent = stripHtml(post.content || '');
    const suggestions: SeoAnalysisResult['suggestions'] = [];

    // Analyze content
    const analysis = this.analyzeContent(post.content || '', plainContent, focusKeyword);

    // Calculate scores
    const scores = {
      title: this.scoreTtitle(post.title, post.metaTitle, focusKeyword),
      metaDescription: this.scoreMetaDescription(post.metaDescription, post.excerpt, focusKeyword),
      content: this.scoreContent(plainContent, focusKeyword),
      heading: this.scoreHeadings(post.content || '', analysis.headings),
      keyword: this.scoreKeyword(plainContent, focusKeyword),
      readability: this.scoreReadability(analysis),
      internalLink: this.scoreInternalLinks(post.content || '', analysis.links.internal),
      image: this.scoreImages(post.coverImage, analysis.images),
      technical: this.scoreTechnical(post),
    };

    // Generate suggestions
    this.generateSuggestions(post, analysis, scores, focusKeyword, suggestions);

    // Calculate overall score (weighted average)
    const weights = {
      title: 0.15,
      metaDescription: 0.10,
      content: 0.20,
      heading: 0.10,
      keyword: 0.15,
      readability: 0.10,
      internalLink: 0.08,
      image: 0.07,
      technical: 0.05,
    };

    const overallScore = Math.round(
      Object.entries(scores).reduce((sum, [key, value]) => {
        return sum + value * (weights[key as keyof typeof weights] || 0);
      }, 0)
    );

    return {
      overallScore,
      scores,
      analysis,
      suggestions,
    };
  }

  /**
   * Analyze content structure
   */
  private analyzeContent(
    htmlContent: string,
    plainContent: string,
    focusKeyword?: string
  ): SeoAnalysisResult['analysis'] {
    // Word count
    const words = plainContent.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;

    // Sentence count
    const sentences = plainContent.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Paragraph count
    const paragraphs = plainContent.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const paragraphCount = Math.max(paragraphs.length, 1);

    // Average words per sentence
    const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

    // Headings
    const h1Matches = htmlContent.match(/<h1[^>]*>/gi) || [];
    const h2Matches = htmlContent.match(/<h2[^>]*>/gi) || [];
    const h3Matches = htmlContent.match(/<h3[^>]*>/gi) || [];
    const h4Matches = htmlContent.match(/<h4[^>]*>/gi) || [];

    // Images
    const imgMatches = htmlContent.match(/<img[^>]*>/gi) || [];
    const imgWithAlt = htmlContent.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi) || [];

    // Links
    const internalLinks = htmlContent.match(/<a[^>]*href=["']\/[^"']*["'][^>]*>/gi) || [];
    const allLinks = htmlContent.match(/<a[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
    const externalLinks = allLinks.length - internalLinks.length;

    // Keyword density
    let keywordDensity = 0;
    let focusKeywordCount = 0;
    if (focusKeyword && wordCount > 0) {
      const keywordLower = focusKeyword.toLowerCase();
      const contentLower = plainContent.toLowerCase();
      const regex = new RegExp(keywordLower, 'gi');
      const matches = contentLower.match(regex) || [];
      focusKeywordCount = matches.length;
      keywordDensity = (focusKeywordCount / wordCount) * 100;
    }

    return {
      wordCount,
      sentenceCount,
      paragraphCount,
      avgWordsPerSentence,
      headings: {
        h1: h1Matches.length,
        h2: h2Matches.length,
        h3: h3Matches.length,
        h4: h4Matches.length,
      },
      images: {
        total: imgMatches.length,
        withAlt: imgWithAlt.length,
        withoutAlt: imgMatches.length - imgWithAlt.length,
      },
      links: {
        internal: internalLinks.length,
        external: Math.max(0, externalLinks),
      },
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      focusKeyword,
      focusKeywordCount,
    };
  }

  /**
   * Score title
   */
  private scoreTtitle(title: string, metaTitle?: string | null, focusKeyword?: string): number {
    let score = 0;
    const titleToCheck = metaTitle || title;

    if (!titleToCheck) return 0;

    // Length check (optimal: 50-60 chars)
    const len = titleToCheck.length;
    if (len >= 50 && len <= 60) score += 40;
    else if (len >= 40 && len <= 70) score += 30;
    else if (len > 0) score += 15;

    // Has keyword
    if (focusKeyword && titleToCheck.toLowerCase().includes(focusKeyword.toLowerCase())) {
      score += 30;
      // Keyword at beginning
      if (titleToCheck.toLowerCase().startsWith(focusKeyword.toLowerCase())) {
        score += 10;
      }
    } else if (!focusKeyword) {
      score += 20; // No keyword set, give partial score
    }

    // Not too short
    if (len >= 30) score += 10;

    // Has numbers (often good for CTR)
    if (/\d/.test(titleToCheck)) score += 5;

    // Has power words
    const powerWords = ['hướng dẫn', 'cách', 'bí quyết', 'top', 'best', 'review', 'so sánh', 'mới nhất'];
    if (powerWords.some((w) => titleToCheck.toLowerCase().includes(w))) {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Score meta description
   */
  private scoreMetaDescription(
    metaDescription?: string | null,
    excerpt?: string | null,
    focusKeyword?: string
  ): number {
    const desc = metaDescription || excerpt || '';
    if (!desc) return 0;

    let score = 0;
    const len = desc.length;

    // Length check (optimal: 150-160 chars)
    if (len >= 150 && len <= 160) score += 40;
    else if (len >= 120 && len <= 180) score += 30;
    else if (len > 50) score += 15;

    // Has keyword
    if (focusKeyword && desc.toLowerCase().includes(focusKeyword.toLowerCase())) {
      score += 30;
    } else if (!focusKeyword) {
      score += 15;
    }

    // Has CTA words
    const ctaWords = ['xem ngay', 'tìm hiểu', 'khám phá', 'click', 'đọc thêm', 'chi tiết'];
    if (ctaWords.some((w) => desc.toLowerCase().includes(w))) {
      score += 15;
    }

    // Doesn't end with incomplete sentence
    if (desc.endsWith('.') || desc.endsWith('!') || desc.endsWith('?')) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Score content
   */
  private scoreContent(plainContent: string, focusKeyword?: string): number {
    const wordCount = plainContent.split(/\s+/).filter((w) => w.length > 0).length;
    let score = 0;

    // Word count (optimal: 1000-2500 words)
    if (wordCount >= 1500 && wordCount <= 2500) score += 40;
    else if (wordCount >= 1000) score += 35;
    else if (wordCount >= 500) score += 25;
    else if (wordCount >= 300) score += 15;

    // Keyword presence
    if (focusKeyword) {
      const keywordLower = focusKeyword.toLowerCase();
      const contentLower = plainContent.toLowerCase();
      const regex = new RegExp(keywordLower, 'gi');
      const matches = contentLower.match(regex) || [];
      const density = (matches.length / wordCount) * 100;

      // Optimal density: 1-2%
      if (density >= 0.5 && density <= 2.5) score += 30;
      else if (density > 0) score += 15;

      // Keyword in first 100 words
      const first100 = plainContent.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
      if (first100.includes(keywordLower)) score += 15;
    } else {
      score += 30; // No keyword, give partial score
    }

    // Content variety (has multiple paragraphs)
    const paragraphs = plainContent.split(/\n\n+/).filter((p) => p.trim().length > 0);
    if (paragraphs.length >= 5) score += 15;
    else if (paragraphs.length >= 3) score += 10;

    return Math.min(100, score);
  }

  /**
   * Score headings
   */
  private scoreHeadings(
    htmlContent: string,
    headings: { h1: number; h2: number; h3: number; h4: number }
  ): number {
    let score = 0;

    // Should have exactly 1 H1 (in content, not counting title)
    if (headings.h1 === 1) score += 20;
    else if (headings.h1 === 0) score += 15; // H1 might be in template

    // Should have H2 subheadings
    if (headings.h2 >= 2 && headings.h2 <= 8) score += 40;
    else if (headings.h2 > 0) score += 25;

    // H3 for deeper structure
    if (headings.h3 > 0) score += 20;

    // Good hierarchy
    if (headings.h2 > 0 && headings.h3 <= headings.h2 * 3) score += 20;
    else if (headings.h2 > 0) score += 10;

    return Math.min(100, score);
  }

  /**
   * Score keyword usage
   */
  private scoreKeyword(plainContent: string, focusKeyword?: string): number {
    if (!focusKeyword) return 50; // No keyword set

    const wordCount = plainContent.split(/\s+/).filter((w) => w.length > 0).length;
    const keywordLower = focusKeyword.toLowerCase();
    const contentLower = plainContent.toLowerCase();
    const regex = new RegExp(keywordLower, 'gi');
    const matches = contentLower.match(regex) || [];
    const count = matches.length;
    const density = wordCount > 0 ? (count / wordCount) * 100 : 0;

    let score = 0;

    // Keyword appears
    if (count > 0) score += 20;

    // Density in optimal range (1-2.5%)
    if (density >= 1 && density <= 2.5) score += 40;
    else if (density >= 0.5 && density <= 3) score += 30;
    else if (density > 0) score += 15;

    // Multiple occurrences
    if (count >= 3 && count <= 10) score += 20;
    else if (count > 0) score += 10;

    // Keyword variations (partial match)
    const words = focusKeyword.split(/\s+/);
    if (words.length > 1) {
      const partialMatches = words.filter((w) => contentLower.includes(w.toLowerCase()));
      if (partialMatches.length === words.length) score += 20;
      else if (partialMatches.length > 0) score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Score readability
   */
  private scoreReadability(analysis: SeoAnalysisResult['analysis']): number {
    let score = 0;

    // Sentence length (optimal: 15-20 words)
    if (analysis.avgWordsPerSentence >= 12 && analysis.avgWordsPerSentence <= 20) {
      score += 50;
    } else if (analysis.avgWordsPerSentence >= 10 && analysis.avgWordsPerSentence <= 25) {
      score += 35;
    } else if (analysis.avgWordsPerSentence > 0) {
      score += 20;
    }

    // Paragraph breaks
    if (analysis.paragraphCount >= 5) score += 25;
    else if (analysis.paragraphCount >= 3) score += 15;

    // Content length supports readability
    if (analysis.wordCount >= 500) score += 25;
    else if (analysis.wordCount >= 300) score += 15;

    return Math.min(100, score);
  }

  /**
   * Score internal links
   */
  private scoreInternalLinks(htmlContent: string, internalLinkCount: number): number {
    let score = 0;

    // Has internal links
    if (internalLinkCount >= 3) score += 50;
    else if (internalLinkCount >= 1) score += 30;

    // Not too many
    if (internalLinkCount >= 2 && internalLinkCount <= 10) score += 30;
    else if (internalLinkCount > 0 && internalLinkCount < 20) score += 20;

    // Anchor text variety (check if not all same)
    const anchors = htmlContent.match(/<a[^>]*>([^<]+)<\/a>/gi) || [];
    const uniqueAnchors = new Set(anchors.map((a) => a.toLowerCase()));
    if (uniqueAnchors.size >= Math.min(internalLinkCount, 3)) score += 20;

    return Math.min(100, score);
  }

  /**
   * Score images
   */
  private scoreImages(
    coverImage: string | null | undefined,
    imageAnalysis: { total: number; withAlt: number; withoutAlt: number }
  ): number {
    let score = 0;

    // Has featured image
    if (coverImage) score += 30;

    // Has content images
    if (imageAnalysis.total >= 1) score += 20;
    if (imageAnalysis.total >= 3) score += 10;

    // All images have alt text
    if (imageAnalysis.total > 0 && imageAnalysis.withoutAlt === 0) {
      score += 40;
    } else if (imageAnalysis.withAlt > imageAnalysis.withoutAlt) {
      score += 20;
    }

    return Math.min(100, score);
  }

  /**
   * Score technical SEO
   */
  private scoreTechnical(post: IPost): number {
    let score = 0;

    // Has slug
    if (post.slug && post.slug.length > 0) score += 25;

    // Slug length (optimal: 3-5 words)
    const slugWords = post.slug?.split('-') || [];
    if (slugWords.length >= 2 && slugWords.length <= 6) score += 25;

    // Has canonical URL set or will use default
    if (post.canonicalUrl) score += 25;
    else score += 15; // Will use default

    // Has category (helps with site structure)
    if (post.category) score += 25;

    return Math.min(100, score);
  }

  /**
   * Generate suggestions based on analysis
   */
  private generateSuggestions(
    post: IPost,
    analysis: SeoAnalysisResult['analysis'],
    scores: SeoAnalysisResult['scores'],
    focusKeyword: string | undefined,
    suggestions: SeoAnalysisResult['suggestions']
  ): void {
    // Title suggestions
    const titleLen = (post.metaTitle || post.title).length;
    if (titleLen < 30) {
      suggestions.push({
        type: 'error',
        category: 'title',
        message: 'Tiêu đề quá ngắn. Nên có từ 50-60 ký tự.',
        priority: 'high',
      });
    } else if (titleLen > 70) {
      suggestions.push({
        type: 'warning',
        category: 'title',
        message: 'Tiêu đề có thể bị cắt trong SERP. Nên giữ dưới 60 ký tự.',
        priority: 'medium',
      });
    } else {
      suggestions.push({
        type: 'success',
        category: 'title',
        message: 'Độ dài tiêu đề tốt.',
        priority: 'low',
      });
    }

    // Keyword in title
    if (focusKeyword && !(post.metaTitle || post.title).toLowerCase().includes(focusKeyword.toLowerCase())) {
      suggestions.push({
        type: 'error',
        category: 'title',
        message: `Từ khóa "${focusKeyword}" chưa có trong tiêu đề.`,
        priority: 'high',
      });
    }

    // Meta description
    const descLen = (post.metaDescription || post.excerpt || '').length;
    if (descLen < 50) {
      suggestions.push({
        type: 'error',
        category: 'meta',
        message: 'Meta description quá ngắn hoặc chưa có. Nên viết 150-160 ký tự.',
        priority: 'high',
      });
    } else if (descLen > 160) {
      suggestions.push({
        type: 'warning',
        category: 'meta',
        message: 'Meta description có thể bị cắt. Nên giữ dưới 160 ký tự.',
        priority: 'medium',
      });
    }

    // Content length
    if (analysis.wordCount < 300) {
      suggestions.push({
        type: 'error',
        category: 'content',
        message: `Nội dung quá ngắn (${analysis.wordCount} từ). Nên viết ít nhất 1000 từ.`,
        priority: 'high',
      });
    } else if (analysis.wordCount < 1000) {
      suggestions.push({
        type: 'warning',
        category: 'content',
        message: `Nội dung khá ngắn (${analysis.wordCount} từ). Cân nhắc bổ sung thêm.`,
        priority: 'medium',
      });
    } else {
      suggestions.push({
        type: 'success',
        category: 'content',
        message: `Độ dài nội dung tốt (${analysis.wordCount} từ).`,
        priority: 'low',
      });
    }

    // Headings
    if (analysis.headings.h2 === 0) {
      suggestions.push({
        type: 'warning',
        category: 'heading',
        message: 'Thiếu tiêu đề H2. Nên chia nội dung thành các phần với H2.',
        priority: 'medium',
      });
    }

    // Images
    if (!post.coverImage) {
      suggestions.push({
        type: 'error',
        category: 'image',
        message: 'Chưa có ảnh đại diện (featured image).',
        priority: 'high',
      });
    }

    if (analysis.images.withoutAlt > 0) {
      suggestions.push({
        type: 'warning',
        category: 'image',
        message: `Có ${analysis.images.withoutAlt} ảnh thiếu alt text.`,
        priority: 'medium',
      });
    }

    // Internal links
    if (analysis.links.internal === 0) {
      suggestions.push({
        type: 'warning',
        category: 'links',
        message: 'Chưa có internal link. Nên thêm 2-3 link đến bài viết liên quan.',
        priority: 'medium',
      });
    }

    // Keyword density
    if (focusKeyword) {
      if (analysis.keywordDensity === 0) {
        suggestions.push({
          type: 'error',
          category: 'keyword',
          message: `Từ khóa "${focusKeyword}" chưa xuất hiện trong nội dung.`,
          priority: 'high',
        });
      } else if (analysis.keywordDensity > 3) {
        suggestions.push({
          type: 'warning',
          category: 'keyword',
          message: `Mật độ từ khóa cao (${analysis.keywordDensity}%). Có thể bị xem là keyword stuffing.`,
          priority: 'medium',
        });
      } else if (analysis.keywordDensity < 0.5) {
        suggestions.push({
          type: 'info',
          category: 'keyword',
          message: `Mật độ từ khóa thấp (${analysis.keywordDensity}%). Cân nhắc sử dụng nhiều hơn.`,
          priority: 'low',
        });
      }
    }

    // Readability
    if (analysis.avgWordsPerSentence > 25) {
      suggestions.push({
        type: 'warning',
        category: 'readability',
        message: 'Câu quá dài. Nên chia nhỏ để dễ đọc hơn.',
        priority: 'low',
      });
    }
  }

  /**
   * Save SEO score to database
   */
  async saveSeoScore(postId: string, result: SeoAnalysisResult): Promise<ISeoScore> {
    // Check if exists
    let seoScore = await SeoScore.findOne({ postId: new Types.ObjectId(postId) });

    const scoreData = {
      postId: new Types.ObjectId(postId),
      overallScore: result.overallScore,
      titleScore: result.scores.title,
      metaDescriptionScore: result.scores.metaDescription,
      contentScore: result.scores.content,
      headingScore: result.scores.heading,
      keywordScore: result.scores.keyword,
      readabilityScore: result.scores.readability,
      internalLinkScore: result.scores.internalLink,
      imageScore: result.scores.image,
      technicalScore: result.scores.technical,
      analysis: result.analysis,
      suggestions: result.suggestions,
    };

    if (seoScore) {
      // Update existing
      Object.assign(seoScore, scoreData);
      await seoScore.save();
    } else {
      // Create new
      seoScore = new SeoScore(scoreData);
      await seoScore.save();
    }

    return seoScore.toObject();
  }

  /**
   * Get SEO score for a post
   */
  async getSeoScore(postId: string): Promise<ISeoScore | null> {
    if (!Types.ObjectId.isValid(postId)) return null;
    return SeoScore.findOne({ postId: new Types.ObjectId(postId) });
  }

  /**
   * Log SEO action
   */
  async logAction(params: {
    action: SeoLogAction;
    entityType?: SeoLogEntityType | null;
    entityId?: string;
    entityUrl?: string;
    status: SeoLogStatus;
    message?: string;
    details?: Record<string, unknown>;
    apiResponse?: Record<string, unknown>;
    duration?: number;
    userId?: string;
    isScheduled?: boolean;
  }): Promise<ISeoLog> {
    const log = new SeoLog({
      ...params,
      entityType: params.entityType ?? null,
      entityId: params.entityId && Types.ObjectId.isValid(params.entityId)
        ? new Types.ObjectId(params.entityId)
        : null,
      userId: params.userId && Types.ObjectId.isValid(params.userId)
        ? new Types.ObjectId(params.userId)
        : null,
    });
    await log.save();
    return log.toObject();
  }

  /**
   * Get recent SEO logs with optional filters
   */
  async getRecentLogs(limit: number = 50, action?: string, status?: string): Promise<ISeoLog[]> {
    const query: Record<string, unknown> = {};
    if (action) query.action = action;
    if (status) query.status = status;

    return SeoLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Create or update index status
   */
  async updateIndexStatus(
    url: string,
    status: IIndexStatus['status'],
    postId?: string,
    details?: Partial<IIndexStatus>
  ): Promise<IIndexStatus> {
    let indexStatus = await IndexStatus.findOne({ url });

    if (indexStatus) {
      indexStatus.status = status;
      if (details) {
        Object.assign(indexStatus, details);
      }
      await indexStatus.save();
    } else {
      indexStatus = new IndexStatus({
        url,
        status,
        postId: postId && Types.ObjectId.isValid(postId) ? new Types.ObjectId(postId) : undefined,
        ...details,
      });
      await indexStatus.save();
    }

    return indexStatus.toObject();
  }

  /**
   * Get index status for a URL
   */
  async getIndexStatus(url: string): Promise<IIndexStatus | null> {
    return IndexStatus.findOne({ url });
  }

  /**
   * Get all pending index submissions
   */
  async getPendingIndexSubmissions(): Promise<IIndexStatus[]> {
    return IndexStatus.find({ status: 'pending' })
      .sort({ createdAt: 1 });
  }

  /**
   * Get all index statuses with optional filter
   */
  async getAllIndexStatuses(status?: string): Promise<IIndexStatus[]> {
    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    return IndexStatus.find(query)
      .sort({ updatedAt: -1 })
      .limit(100);
  }

  /**
   * Track keyword
   */
  async trackKeyword(params: {
    keyword: string;
    postId?: string;
    targetUrl?: string;
    language?: string;
    country?: string;
    searchVolume?: number;
  }): Promise<IKeyword> {
    // Check if already tracking
    let kw = await Keyword.findOne({
      keyword: params.keyword,
      targetUrl: params.targetUrl,
    });

    if (kw) {
      // Update
      if (params.postId && Types.ObjectId.isValid(params.postId)) {
        kw.postId = new Types.ObjectId(params.postId);
      }
      if (params.targetUrl) kw.targetUrl = params.targetUrl;
      if (params.searchVolume) kw.searchVolume = params.searchVolume;
      await kw.save();
    } else {
      // Create
      kw = new Keyword({
        keyword: params.keyword,
        postId: params.postId && Types.ObjectId.isValid(params.postId)
          ? new Types.ObjectId(params.postId)
          : undefined,
        targetUrl: params.targetUrl,
        searchVolume: params.searchVolume,
        language: params.language || 'vi',
        country: params.country || 'VN',
        isTracking: true,
      });
      await kw.save();
    }

    return kw.toObject();
  }

  /**
   * Get tracked keywords
   */
  async getTrackedKeywords(postId?: string): Promise<IKeyword[]> {
    const query: Record<string, unknown> = { isTracking: true };
    if (postId && Types.ObjectId.isValid(postId)) {
      query.postId = new Types.ObjectId(postId);
    }

    return Keyword.find(query)
      .sort({ searchVolume: -1 })
      .exec();
  }

  /**
   * Delete keyword tracking
   */
  async deleteKeyword(id: string): Promise<void> {
    if (Types.ObjectId.isValid(id)) {
      await Keyword.findByIdAndDelete(id);
    }
  }

  /**
   * Get dashboard stats for SEO overview
   */
  async getDashboardStats(): Promise<{
    totalPosts: number;
    analyzedPosts: number;
    avgScore: number;
    indexedUrls: number;
    pendingUrls: number;
    trackedKeywords: number;
    recentActivity: ISeoLog[];
    scoreDistribution: { range: string; count: number }[];
  }> {
    // Get total published posts
    const totalPosts = await Post.countDocuments({ status: 'published' });

    // Get analyzed posts count
    const analyzedPosts = await SeoScore.countDocuments();

    // Get average score
    const scoreResult = await SeoScore.aggregate([
      { $group: { _id: null, avg: { $avg: '$overallScore' } } }
    ]);
    const avgScore = Math.round(scoreResult[0]?.avg || 0);

    // Index status counts
    const indexedUrls = await IndexStatus.countDocuments({ status: 'indexed' });
    const pendingUrls = await IndexStatus.countDocuments({ status: 'pending' });

    // Tracked keywords
    const trackedKeywords = await Keyword.countDocuments({ isTracking: true });

    // Recent activity
    const recentActivity = await this.getRecentLogs(10);

    // Score distribution
    const scores = await SeoScore.find({}).select('overallScore');
    const distribution: Record<string, number> = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0,
    };

    scores.forEach((s) => {
      const score = s.overallScore;
      if (score <= 20) distribution['0-20']++;
      else if (score <= 40) distribution['21-40']++;
      else if (score <= 60) distribution['41-60']++;
      else if (score <= 80) distribution['61-80']++;
      else distribution['81-100']++;
    });

    const scoreDistribution = Object.entries(distribution).map(([range, count]) => ({
      range,
      count,
    }));

    return {
      totalPosts,
      analyzedPosts,
      avgScore,
      indexedUrls,
      pendingUrls,
      trackedKeywords,
      recentActivity,
      scoreDistribution,
    };
  }
}

// Singleton instance
export const autoSeoService = new AutoSeoService();
