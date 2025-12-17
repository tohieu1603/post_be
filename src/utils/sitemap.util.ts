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
