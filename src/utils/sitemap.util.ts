/**
 * Sitemap XML Generator Utility
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapConfig {
  siteUrl: string;
  maxUrlsPerSitemap?: number; // Default: 50000
  defaultChangefreq?: SitemapUrl['changefreq'];
  defaultPriority?: number;
}

/**
 * Generate sitemap XML content
 */
export function generateSitemapXml(urls: SitemapUrl[], config: SitemapConfig): string {
  const { siteUrl, defaultChangefreq = 'weekly', defaultPriority = 0.5 } = config;

  const urlEntries = urls.map((url) => {
    const loc = url.loc.startsWith('http') ? url.loc : `${siteUrl}${url.loc}`;
    const parts = [`    <url>\n      <loc>${escapeXml(loc)}</loc>`];

    if (url.lastmod) {
      parts.push(`      <lastmod>${url.lastmod}</lastmod>`);
    }

    const changefreq = url.changefreq || defaultChangefreq;
    parts.push(`      <changefreq>${changefreq}</changefreq>`);

    const priority = url.priority ?? defaultPriority;
    parts.push(`      <priority>${priority.toFixed(1)}</priority>`);

    parts.push('    </url>');
    return parts.join('\n');
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;
}

/**
 * Generate sitemap index for multiple sitemaps
 */
export function generateSitemapIndex(
  sitemaps: Array<{ loc: string; lastmod?: string }>,
  siteUrl: string
): string {
  const entries = sitemaps.map((sitemap) => {
    const loc = sitemap.loc.startsWith('http') ? sitemap.loc : `${siteUrl}${sitemap.loc}`;
    let entry = `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>`;
    if (sitemap.lastmod) {
      entry += `\n    <lastmod>${sitemap.lastmod}</lastmod>`;
    }
    entry += '\n  </sitemap>';
    return entry;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;
}

/**
 * Split URLs into multiple sitemaps if exceeding limit
 */
export function splitUrlsForSitemaps(
  urls: SitemapUrl[],
  maxUrlsPerSitemap: number = 50000
): SitemapUrl[][] {
  const result: SitemapUrl[][] = [];

  for (let i = 0; i < urls.length; i += maxUrlsPerSitemap) {
    result.push(urls.slice(i, i + maxUrlsPerSitemap));
  }

  return result;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate default robots.txt content
 */
export function generateDefaultRobotsTxt(siteUrl: string, options: {
  disallowPaths?: string[];
  allowPaths?: string[];
  sitemapUrl?: string;
  crawlDelay?: number;
} = {}): string {
  const lines: string[] = ['User-agent: *'];

  if (options.allowPaths) {
    options.allowPaths.forEach((path) => {
      lines.push(`Allow: ${path}`);
    });
  }

  if (options.disallowPaths) {
    options.disallowPaths.forEach((path) => {
      lines.push(`Disallow: ${path}`);
    });
  } else {
    // Default disallow paths
    lines.push('Disallow: /api/');
    lines.push('Disallow: /admin/');
    lines.push('Disallow: /_next/');
  }

  if (options.crawlDelay) {
    lines.push(`Crawl-delay: ${options.crawlDelay}`);
  }

  lines.push('');

  const sitemapUrl = options.sitemapUrl || `${siteUrl}/sitemap.xml`;
  lines.push(`Sitemap: ${sitemapUrl}`);

  return lines.join('\n');
}

/**
 * Format date to ISO 8601 for sitemap
 */
export function formatDateForSitemap(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Format date to W3C datetime for news sitemap
 */
export function formatDateForNewsSitemap(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString(); // Full ISO 8601: YYYY-MM-DDTHH:MM:SS+00:00
}

// === News Sitemap (Google News) ===

export interface NewsArticle {
  loc: string;
  title: string;
  publishedAt: Date | string;
  keywords?: string;
}

export interface NewsSitemapConfig {
  siteUrl: string;
  siteName: string;
  language?: string; // Default: 'vi'
}

/**
 * Generate Google News Sitemap XML
 * Requirements:
 * - Only articles from last 48 hours
 * - Max 1000 URLs
 * - Must include news-specific tags
 */
export function generateNewsSitemapXml(
  articles: NewsArticle[],
  config: NewsSitemapConfig
): string {
  const { siteUrl, siteName, language = 'vi' } = config;

  // Filter: only last 48 hours and max 1000
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentArticles = articles
    .filter((article) => {
      const pubDate = typeof article.publishedAt === 'string'
        ? new Date(article.publishedAt)
        : article.publishedAt;
      return pubDate >= cutoff;
    })
    .slice(0, 1000);

  const urlEntries = recentArticles.map((article) => {
    const loc = article.loc.startsWith('http') ? article.loc : `${siteUrl}${article.loc}`;
    const pubDate = formatDateForNewsSitemap(article.publishedAt);

    let entry = `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(siteName)}</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>`;

    if (article.keywords) {
      entry += `\n      <news:keywords>${escapeXml(article.keywords)}</news:keywords>`;
    }

    entry += `
    </news:news>
  </url>`;

    return entry;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries.join('\n')}
</urlset>`;
}

// === Image Sitemap ===

export interface ImageInfo {
  url: string;
  title?: string;
  caption?: string;
}

export interface UrlWithImages extends SitemapUrl {
  images?: ImageInfo[];
}

/**
 * Generate sitemap with image extension
 */
export function generateImageSitemapXml(
  urls: UrlWithImages[],
  config: SitemapConfig
): string {
  const { siteUrl, defaultChangefreq = 'weekly', defaultPriority = 0.5 } = config;

  const urlEntries = urls.map((url) => {
    const loc = url.loc.startsWith('http') ? url.loc : `${siteUrl}${url.loc}`;
    let entry = `  <url>
    <loc>${escapeXml(loc)}</loc>`;

    if (url.lastmod) {
      entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }

    entry += `\n    <changefreq>${url.changefreq || defaultChangefreq}</changefreq>`;
    entry += `\n    <priority>${(url.priority ?? defaultPriority).toFixed(1)}</priority>`;

    // Add images
    if (url.images && url.images.length > 0) {
      url.images.forEach((img) => {
        entry += `\n    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>`;

        if (img.title) {
          entry += `\n      <image:title>${escapeXml(img.title)}</image:title>`;
        }
        if (img.caption) {
          entry += `\n      <image:caption>${escapeXml(img.caption)}</image:caption>`;
        }

        entry += `\n    </image:image>`;
      });
    }

    entry += `\n  </url>`;
    return entry;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join('\n')}
</urlset>`;
}
