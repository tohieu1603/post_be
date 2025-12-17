/**
 * AI SEO Controller
 * Endpoints for DeepSeek AI-powered SEO analysis
 */

import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { deepSeekSeoService } from '../services/deepseek-seo.service';
import { seoSchedulerService } from '../services/seo-scheduler.service';
import { Post, IPost } from '../models/post.model';

/**
 * AI analyze post SEO
 */
export const aiAnalyzePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { focusKeyword } = req.body;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(postId).populate('category').lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const analysis = await deepSeekSeoService.analyzePost(post as any, focusKeyword);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'AI analysis failed',
    });
  }
};

/**
 * Generate title suggestions
 */
export const suggestTitles = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { count = 5 } = req.body;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(postId).populate('category').lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const titles = await deepSeekSeoService.suggestTitles(post as any, count);

    res.json({
      success: true,
      data: titles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate titles',
    });
  }
};

/**
 * Generate meta description
 */
export const generateMetaDescription = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(postId).populate('category').lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const description = await deepSeekSeoService.generateMetaDescription(post as any);

    res.json({
      success: true,
      data: description,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate description',
    });
  }
};

/**
 * Suggest keywords for topic
 */
export const suggestKeywords = async (req: Request, res: Response) => {
  try {
    const { topic, count = 10 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const keywords = await deepSeekSeoService.suggestKeywords(topic, count);

    res.json({
      success: true,
      data: keywords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to suggest keywords',
    });
  }
};

/**
 * Generate content outline
 */
export const generateOutline = async (req: Request, res: Response) => {
  try {
    const { topic, targetKeyword } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const outline = await deepSeekSeoService.generateOutline(topic, targetKeyword);

    res.json({
      success: true,
      data: outline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate outline',
    });
  }
};

/**
 * Improve content for SEO
 */
export const improveContent = async (req: Request, res: Response) => {
  try {
    const { content, focusKeyword } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await deepSeekSeoService.improveContent(content, focusKeyword);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to improve content',
    });
  }
};

/**
 * Smart Meta Generator - Generate meta from title
 */
export const generateSmartMeta = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const meta = await deepSeekSeoService.generateSmartMeta(title, content);

    res.json({
      success: true,
      data: meta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate meta',
    });
  }
};

/**
 * Real-time SEO Score
 */
export const getRealtimeSeoScore = async (req: Request, res: Response) => {
  try {
    const { title, metaDescription, content, focusKeyword } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const score = await deepSeekSeoService.getRealtimeSeoScore({
      title,
      metaDescription,
      content,
      focusKeyword,
    });

    res.json({
      success: true,
      data: score,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get SEO score',
    });
  }
};

/**
 * Suggest internal links
 */
export const suggestInternalLinks = async (req: Request, res: Response) => {
  try {
    const { content, excludePostId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Get available posts for linking
    const posts = await Post.find({ status: 'published' })
      .select('title slug excerpt')
      .limit(50)
      .lean();

    // Exclude current post if editing
    const availablePosts = excludePostId && Types.ObjectId.isValid(excludePostId)
      ? posts.filter(p => p._id.toString() !== excludePostId)
      : posts;

    const suggestions = await deepSeekSeoService.suggestInternalLinks(
      content,
      availablePosts.map(p => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || undefined,
      }))
    );

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to suggest links',
    });
  }
};

/**
 * Check duplicate content
 */
export const checkDuplicateContent = async (req: Request, res: Response) => {
  try {
    const { content, excludePostId } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Get existing posts to compare
    const posts = await Post.find({ status: 'published' })
      .select('title content')
      .limit(20)
      .lean();

    // Exclude current post if editing
    const existingPosts = excludePostId && Types.ObjectId.isValid(excludePostId)
      ? posts.filter(p => p._id.toString() !== excludePostId)
      : posts;

    const result = await deepSeekSeoService.checkDuplicateContent(
      content,
      existingPosts.map(p => ({ id: p._id.toString(), title: p.title, content: p.content || '' }))
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check duplicate',
    });
  }
};

/**
 * Generate schema for post
 */
export const generateSchema = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const siteUrl = req.body.siteUrl || process.env.SITE_URL || 'https://example.com';

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(postId).populate('category').lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const schema = await deepSeekSeoService.generateSchema(post as any, siteUrl);

    res.json({
      success: true,
      data: schema,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate schema',
    });
  }
};

/**
 * Content Optimizer - Analyze and provide specific improvement suggestions
 */
export const optimizeContent = async (req: Request, res: Response) => {
  try {
    const { title, content, focusKeyword, excludePostId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Extract existing headings from content
    const headingMatches = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi) || [];
    const existingHeadings = headingMatches.map((h: string) => h.replace(/<[^>]+>/g, ''));

    // Get related posts for internal link suggestions
    const posts = await Post.find({ status: 'published' })
      .select('title slug')
      .limit(30)
      .lean();

    const relatedPosts = excludePostId && Types.ObjectId.isValid(excludePostId)
      ? posts.filter(p => p._id.toString() !== excludePostId)
      : posts;

    const result = await deepSeekSeoService.optimizeContent({
      title,
      content,
      focusKeyword,
      existingHeadings,
      relatedPosts: relatedPosts.map(p => ({ title: p.title, slug: p.slug })),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Content optimization error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to optimize content',
    });
  }
};

/**
 * Generate alt text for image
 */
export const generateImageAltText = async (req: Request, res: Response) => {
  try {
    const { imageUrl, pageContext } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const altText = await deepSeekSeoService.generateImageAltText(imageUrl, pageContext || '');

    res.json({
      success: true,
      data: { altText },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate alt text',
    });
  }
};

/**
 * Get scheduler status
 */
export const getSchedulerStatus = async (_req: Request, res: Response) => {
  try {
    const status = seoSchedulerService.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get scheduler status',
    });
  }
};

/**
 * Get last generated report
 */
export const getLastReport = async (_req: Request, res: Response) => {
  try {
    const report = seoSchedulerService.getLastReport();
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get report',
    });
  }
};

/**
 * Generate SEO report on demand
 */
export const generateReport = async (req: Request, res: Response) => {
  try {
    const { period = 'daily' } = req.body;
    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period. Use daily, weekly, or monthly.' });
    }

    const report = await seoSchedulerService.generateReport(period as 'daily' | 'weekly' | 'monthly');
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report',
    });
  }
};

/**
 * Manually trigger daily tasks
 */
export const triggerDailyTasks = async (_req: Request, res: Response) => {
  try {
    const results = await seoSchedulerService.triggerDailyTasks();
    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run daily tasks',
    });
  }
};

/**
 * Manually trigger weekly tasks
 */
export const triggerWeeklyTasks = async (_req: Request, res: Response) => {
  try {
    const results = await seoSchedulerService.triggerWeeklyTasks();
    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run weekly tasks',
    });
  }
};

/**
 * Manually trigger monthly tasks
 */
export const triggerMonthlyTasks = async (_req: Request, res: Response) => {
  try {
    const results = await seoSchedulerService.triggerMonthlyTasks();
    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run monthly tasks',
    });
  }
};
