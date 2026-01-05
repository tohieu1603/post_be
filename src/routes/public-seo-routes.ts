/**
 * Public SEO Routes - sitemap.xml, robots.txt, and structured data endpoints
 */

import { Router, Request, Response } from 'express';
import { postRepository } from '../repositories/post.repository';
import { categoryRepository } from '../repositories';
import { SettingsService } from '../services/settings.service';
import { ICategory } from '../models/category.model';
import {
  generateSitemapXml,
  generateSitemapIndex,
  splitUrlsForSitemaps,
  formatDateForSitemap,
  generateNewsSitemapXml,
  SitemapUrl,
  NewsArticle,
} from '../utils/sitemap.util';
import {
  generatePageSchemas,
  generatePostMeta,
  MetaTagsConfig,
} from '../utils/seo.util';

const router = Router();
const settingsService = new SettingsService();

// Cache for sitemaps (regenerate every hour or on content change)
let sitemapCache: { xml: string; timestamp: number } | null = null;
let newsSitemapCache: { xml: string; timestamp: number } | null = null;
const CACHE_TTL = 3600000; // 1 hour in ms
const NEWS_CACHE_TTL = 900000; // 15 minutes for news sitemap

/**
 * Helper to get site config from settings
 */
async function getSiteConfig(): Promise<MetaTagsConfig & { logo?: string; description?: string; sameAs?: string[] }> {
  try {
    const siteSettings = await settingsService.getByCategory('site');
    const seoSettings = await settingsService.getByCategory('seo');

    const config: any = {
      siteName: 'ManagePost',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    };

    siteSettings.forEach((s) => {
      if (s.key === 'siteName') config.siteName = s.value as string;
      if (s.key === 'siteUrl') config.siteUrl = s.value as string;
      if (s.key === 'siteLogo') config.logo = s.value as string;
      if (s.key === 'siteDescription') config.description = s.value as string;
    });

    seoSettings.forEach((s) => {
      if (s.key === 'defaultOgImage') config.defaultOgImage = s.value as string;
      if (s.key === 'schemaOrganization') {
        const org = s.value as any;
        if (org?.sameAs) config.sameAs = org.sameAs;
      }
    });

    return config;
  } catch {
    return {
      siteName: 'ManagePost',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    };
  }
}

/**
 * @swagger
 * /sitemap.xml:
 *   get:
 *     summary: Get sitemap XML
 *     tags: [Public SEO]
 *     responses:
 *       200:
 *         description: Sitemap XML content
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 */
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    // Check cache
    if (sitemapCache && Date.now() - sitemapCache.timestamp < CACHE_TTL) {
      res.set('Content-Type', 'application/xml');
      return res.send(sitemapCache.xml);
    }

    const config = await getSiteConfig();
    const urls: SitemapUrl[] = [];

    // Add homepage
    urls.push({
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
    });

    // Add categories
    const categories = await categoryRepository.findAll();
    categories.forEach((cat: ICategory) => {
      if (cat.isActive) {
        urls.push({
          loc: `/${cat.slug}/`,
          lastmod: formatDateForSitemap(cat.updatedAt),
          changefreq: 'weekly',
          priority: 0.8,
        });
      }
    });

    // Add published posts
    const postsResult = await postRepository.findAllWithFilters({ status: 'published', limit: 50000 });
    postsResult.data.forEach((post) => {
      urls.push({
        loc: `/${post.slug}/`,
        lastmod: formatDateForSitemap(post.updatedAt),
        changefreq: 'monthly',
        priority: 0.6,
      });
    });

    // Check if we need to split into multiple sitemaps
    const MAX_URLS = 50000;
    if (urls.length > MAX_URLS) {
      // Generate sitemap index
      const chunks = splitUrlsForSitemaps(urls, MAX_URLS);
      const sitemapUrls = chunks.map((_, i) => ({
        loc: `/sitemap-${i + 1}.xml`,
        lastmod: formatDateForSitemap(new Date()),
      }));

      const xml = generateSitemapIndex(sitemapUrls, config.siteUrl);
      res.set('Content-Type', 'application/xml');
      return res.send(xml);
    }

    // Generate single sitemap
    const xml = generateSitemapXml(urls, {
      siteUrl: config.siteUrl,
      defaultChangefreq: 'weekly',
      defaultPriority: 0.5,
    });

    // Update cache
    sitemapCache = { xml, timestamp: Date.now() };

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

/**
 * @swagger
 * /robots.txt:
 *   get:
 *     summary: Get robots.txt
 *     tags: [Public SEO]
 *     responses:
 *       200:
 *         description: robots.txt content
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/robots.txt', async (_req: Request, res: Response) => {
  try {
    const robotsTxt = await settingsService.getRobotsTxt();
    res.set('Content-Type', 'text/plain');
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.send(robotsTxt);
  } catch (error) {
    // Return default robots.txt with comprehensive rules
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const defaultRobots = `# robots.txt for ${siteUrl}
User-agent: *
Allow: /

# Block admin and API paths
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

# Block search and filter pages (thin content)
Disallow: /tim-kiem
Disallow: /search
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*page=

# Block authentication pages
Disallow: /auth/

# Allow specific crawlers for news
User-agent: Googlebot-News
Allow: /

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/news-sitemap.xml`;
    res.set('Content-Type', 'text/plain');
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.send(defaultRobots);
  }
});

/**
 * @swagger
 * /api/seo/meta/{slug}:
 *   get:
 *     summary: Get meta tags for a post by slug
 *     tags: [Public SEO]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Generated meta tags
 */
router.get('/api/seo/meta/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await postRepository.findBySlug(slug);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const config = await getSiteConfig();
    const postUrl = `/${post.slug}/`;

    const meta = generatePostMeta(
      {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.publishedAt?.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        categoryName: post.category?.name,
        categorySlug: post.category?.slug,
        tags: post.tags || [],
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        ogTitle: post.ogTitle,
        ogDescription: post.ogDescription,
        ogImage: post.ogImage,
        canonicalUrl: post.canonicalUrl,
      },
      config,
      postUrl
    );

    res.json(meta);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate meta';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /api/seo/schema/{type}/{slug}:
 *   get:
 *     summary: Get JSON-LD schema for a page
 *     tags: [Public SEO]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [home, category, post, tag]
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON-LD schemas array
 */
router.get('/api/seo/schema/:type/:slug?', async (req: Request, res: Response) => {
  try {
    const { type, slug } = req.params;
    const config = await getSiteConfig();

    let pageData: any = {};

    if (type === 'post' && slug) {
      const post = await postRepository.findBySlug(slug);
      if (post) {
        pageData.post = {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          author: post.author,
          publishedAt: post.publishedAt?.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          tags: post.tags || [],
          metaDescription: post.metaDescription,
        };
        pageData.postUrl = `/${post.slug}/`;

        // Build breadcrumbs
        pageData.breadcrumbs = [
          { name: 'Trang chủ', url: '/' },
        ];
        if (post.category) {
          pageData.breadcrumbs.push({
            name: post.category.name,
            url: `/${post.category.slug}/`,
          });
        }
        pageData.breadcrumbs.push({
          name: post.title,
          url: `/${post.slug}/`,
        });
      }
    } else if (type === 'category' && slug) {
      const category = await categoryRepository.findBySlug(slug);
      if (category) {
        pageData.breadcrumbs = [
          { name: 'Trang chủ', url: '/' },
          { name: category.name, url: `/${category.slug}/` },
        ];
      }
    }

    const schemas = generatePageSchemas(
      type as 'home' | 'category' | 'post' | 'tag',
      { ...config, searchUrlTemplate: '/search?q={search_term_string}' },
      pageData
    );

    res.json(schemas);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate schemas';
    res.status(500).json({ error: message });
  }
});

/**
 * @swagger
 * /news-sitemap.xml:
 *   get:
 *     summary: Get Google News sitemap XML (last 48 hours)
 *     tags: [Public SEO]
 *     responses:
 *       200:
 *         description: News sitemap XML content
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 */
router.get('/news-sitemap.xml', async (_req: Request, res: Response) => {
  try {
    // Check cache
    if (newsSitemapCache && Date.now() - newsSitemapCache.timestamp < NEWS_CACHE_TTL) {
      res.set('Content-Type', 'application/xml');
      res.set('Cache-Control', 'public, max-age=900'); // 15 minutes
      return res.send(newsSitemapCache.xml);
    }

    const config = await getSiteConfig();

    // Get posts from last 48 hours
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const postsResult = await postRepository.findAllWithFilters({
      status: 'published',
      limit: 1000,
    });

    // Filter and map to NewsArticle format
    const articles: NewsArticle[] = postsResult.data
      .filter((post) => post.publishedAt && new Date(post.publishedAt) >= cutoff)
      .map((post) => ({
        loc: `/${post.slug}/`,
        title: post.title,
        publishedAt: post.publishedAt!,
        keywords: post.newsKeywords || post.tags?.join(', ') || undefined,
      }));

    const xml = generateNewsSitemapXml(articles, {
      siteUrl: config.siteUrl,
      siteName: config.siteName,
      language: 'vi',
    });

    // Update cache
    newsSitemapCache = { xml, timestamp: Date.now() };

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=900'); // 15 minutes
    res.send(xml);
  } catch (error) {
    console.error('News sitemap generation error:', error);
    res.status(500).send('Error generating news sitemap');
  }
});

/**
 * Clear sitemap cache (call this when content changes)
 */
export function clearSitemapCache() {
  sitemapCache = null;
  newsSitemapCache = null;
}

export default router;
