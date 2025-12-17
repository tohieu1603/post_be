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
  SitemapUrl,
} from '../utils/sitemap.util';
import {
  generatePageSchemas,
  generatePostMeta,
  MetaTagsConfig,
} from '../utils/seo.util';

const router = Router();
const settingsService = new SettingsService();

// Cache for sitemap (regenerate every hour or on content change)
let sitemapCache: { xml: string; timestamp: number } | null = null;
const CACHE_TTL = 3600000; // 1 hour in ms

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
router.get('/robots.txt', async (req: Request, res: Response) => {
  try {
    const robotsTxt = await settingsService.getRobotsTxt();
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    // Return default robots.txt
    const defaultRobots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${process.env.SITE_URL || 'http://localhost:3000'}/sitemap.xml`;
    res.set('Content-Type', 'text/plain');
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
 * Clear sitemap cache (call this when content changes)
 */
export function clearSitemapCache() {
  sitemapCache = null;
}

export default router;
