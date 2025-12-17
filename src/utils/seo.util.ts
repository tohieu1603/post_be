/**
 * SEO Utilities - Meta tags automation and structured data generation
 */

export interface MetaTagsConfig {
  siteName: string;
  siteUrl: string;
  defaultOgImage?: string;
}

export interface PostMeta {
  title: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  updatedAt?: string;
  categoryName?: string;
  categorySlug?: string;
  tags?: string[];
  // Override fields (if set, use these instead of auto-generated)
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
}

export interface GeneratedMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  canonicalUrl: string;
  twitterCard: 'summary' | 'summary_large_image';
}

/**
 * Truncate text to specified length without cutting words
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength - 20) {
    return truncated.substring(0, lastSpace) + '...';
  }
  return truncated + '...';
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate meta tags for a post
 * Auto-generates with override support
 */
export function generatePostMeta(
  post: PostMeta,
  config: MetaTagsConfig,
  postUrl: string
): GeneratedMeta {
  // Title: use override or auto-generate (max 60 chars)
  const autoTitle = truncateText(`${post.title} | ${config.siteName}`, 60);
  const title = post.metaTitle || autoTitle;

  // Description: use override, excerpt, or content (max 155 chars)
  let autoDescription = '';
  if (post.excerpt) {
    autoDescription = stripHtml(post.excerpt);
  } else if (post.content) {
    autoDescription = stripHtml(post.content);
  }
  autoDescription = truncateText(autoDescription, 155);
  const description = post.metaDescription || autoDescription;

  // OG Title
  const ogTitle = post.ogTitle || post.metaTitle || post.title;

  // OG Description
  const ogDescription = post.ogDescription || post.metaDescription || autoDescription;

  // OG Image: use override, coverImage, or default
  const ogImage = post.ogImage || post.coverImage || config.defaultOgImage || null;

  // Canonical URL
  const canonicalUrl = post.canonicalUrl || `${config.siteUrl}${postUrl}`;

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    twitterCard: ogImage ? 'summary_large_image' : 'summary',
  };
}

/**
 * Generate Article schema (JSON-LD) for blog posts
 */
export function generateArticleSchema(
  post: PostMeta,
  config: MetaTagsConfig,
  postUrl: string
): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription || truncateText(stripHtml(post.excerpt || post.content || ''), 155),
    url: `${config.siteUrl}${postUrl}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${config.siteUrl}${postUrl}`,
    },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      url: config.siteUrl,
    },
  };

  if (post.coverImage) {
    schema.image = {
      '@type': 'ImageObject',
      url: post.coverImage,
      width: 1200,
      height: 630,
    };
  }

  if (post.author) {
    schema.author = {
      '@type': 'Person',
      name: post.author,
    };
  }

  if (post.publishedAt) {
    schema.datePublished = post.publishedAt;
  }

  if (post.updatedAt) {
    schema.dateModified = post.updatedAt;
  }

  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.join(', ');
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  config: MetaTagsConfig
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${config.siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(
  config: MetaTagsConfig & {
    logo?: string;
    description?: string;
    sameAs?: string[];
  }
): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
  };

  if (config.logo) {
    schema.logo = {
      '@type': 'ImageObject',
      url: config.logo,
    };
  }

  if (config.description) {
    schema.description = config.description;
  }

  if (config.sameAs && config.sameAs.length > 0) {
    schema.sameAs = config.sameAs;
  }

  return schema;
}

/**
 * Generate WebSite schema with SearchAction for sitelinks search box
 */
export function generateWebSiteSchema(
  config: MetaTagsConfig & {
    searchUrlTemplate?: string; // e.g., "/search?q={search_term_string}"
  }
): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
  };

  if (config.searchUrlTemplate) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.siteUrl}${config.searchUrlTemplate}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

/**
 * Generate all schemas for a page
 */
export function generatePageSchemas(
  pageType: 'home' | 'category' | 'post' | 'tag',
  config: MetaTagsConfig & {
    logo?: string;
    description?: string;
    sameAs?: string[];
    searchUrlTemplate?: string;
  },
  pageData?: {
    post?: PostMeta;
    postUrl?: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  }
): object[] {
  const schemas: object[] = [];

  // Always include Organization schema
  schemas.push(generateOrganizationSchema(config));

  // Always include WebSite schema
  schemas.push(generateWebSiteSchema(config));

  // Add BreadcrumbList if provided
  if (pageData?.breadcrumbs && pageData.breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(pageData.breadcrumbs, config));
  }

  // Add Article schema for post pages
  if (pageType === 'post' && pageData?.post && pageData?.postUrl) {
    schemas.push(generateArticleSchema(pageData.post, config, pageData.postUrl));
  }

  return schemas;
}
