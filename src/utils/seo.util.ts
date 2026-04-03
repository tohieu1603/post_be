/**
 * SEO Utilities - Meta tags automation and structured data generation
 */

export interface MetaTagsConfig {
  siteName: string;
  siteUrl: string;
  defaultOgImage?: string;
}

export interface AuthorInfo {
  name: string;
  slug?: string;
  jobTitle?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  sameAs?: string[];
}

export interface PostMeta {
  title: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  author?: string | null;
  authorInfo?: AuthorInfo | null;  // E-E-A-T author data
  publishedAt?: string | null;
  updatedAt?: string;
  categoryName?: string;
  categorySlug?: string;
  tags?: string[];
  wordCount?: number | null;
  isNews?: boolean;  // true = NewsArticle, false = Article
  // Override fields (if set, use these instead of auto-generated)
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  // Language (BCP-47)
  language?: string | null;
  // Advanced fields for rich schema
  articleType?: string | null;
  faq?: Array<{ question: string; answer: string }> | null;
  extras?: {
    entities?: Array<{ name: string; type?: string; wikidataId?: string }>;
    claims?: Array<{ claim: string; rating: number; source?: string }>;
    liveblogUpdates?: Array<{ headline: string; body: string; time: string }>;
  } | null;
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
 * Generate Person schema for author (E-E-A-T)
 */
export function generatePersonSchema(
  author: AuthorInfo,
  config: MetaTagsConfig
): object {
  const schema: Record<string, unknown> = {
    '@type': 'Person',
    name: author.name,
  };

  if (author.slug) {
    schema.url = `${config.siteUrl}/tac-gia/${author.slug}`;
  }

  if (author.jobTitle) {
    schema.jobTitle = author.jobTitle;
  }

  if (author.avatarUrl) {
    schema.image = author.avatarUrl;
  }

  if (author.sameAs && author.sameAs.length > 0) {
    schema.sameAs = author.sameAs;
  }

  return schema;
}

/**
 * Generate NewsArticle schema (JSON-LD) for news posts
 * Use this for time-sensitive news content
 */
export function generateNewsArticleSchema(
  post: PostMeta,
  config: MetaTagsConfig & { logo?: string },
  postUrl: string
): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: truncateText(post.title, 110), // Google recommends max 110 chars for NewsArticle
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
      logo: config.logo ? {
        '@type': 'ImageObject',
        url: config.logo,
      } : undefined,
    },
    inLanguage: post.language === 'en' ? 'en-US' : 'vi-VN',
  };

  if (post.coverImage) {
    schema.image = [{
      '@type': 'ImageObject',
      url: post.coverImage,
      width: 1200,
      height: 630,
    }];
  }

  // Author with E-E-A-T support
  if (post.authorInfo) {
    schema.author = generatePersonSchema(post.authorInfo, config);
  } else if (post.author) {
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

  if (post.categoryName) {
    schema.articleSection = post.categoryName;
  }

  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.join(', ');
  }

  // Entity SEO: about + mentions
  if (post.extras?.entities && post.extras.entities.length > 0) {
    const entitySchemas = post.extras.entities.map((e) => {
      const entity: Record<string, unknown> = { '@type': 'Thing', name: e.name };
      if (e.wikidataId) {
        entity.sameAs = `https://www.wikidata.org/wiki/${e.wikidataId}`;
      }
      return entity;
    });
    schema.about = entitySchemas[0];
    if (entitySchemas.length > 1) {
      schema.mentions = entitySchemas.slice(1);
    }
  }

  return schema;
}

/**
 * Generate Article schema (JSON-LD) for blog posts
 * Use this for evergreen content
 */
export function generateArticleSchema(
  post: PostMeta,
  config: MetaTagsConfig & { logo?: string },
  postUrl: string
): object {
  // If it's news content, use NewsArticle schema
  if (post.isNews !== false) {
    return generateNewsArticleSchema(post, config, postUrl);
  }

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
      logo: config.logo ? {
        '@type': 'ImageObject',
        url: config.logo,
      } : undefined,
    },
    inLanguage: post.language === 'en' ? 'en-US' : 'vi-VN',
  };

  if (post.coverImage) {
    schema.image = {
      '@type': 'ImageObject',
      url: post.coverImage,
      width: 1200,
      height: 630,
    };
  }

  // Author with E-E-A-T support
  if (post.authorInfo) {
    schema.author = generatePersonSchema(post.authorInfo, config);
  } else if (post.author) {
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

  if (post.categoryName) {
    schema.articleSection = post.categoryName;
  }

  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.join(', ');
  }

  // Entity SEO: about + mentions
  if (post.extras?.entities && post.extras.entities.length > 0) {
    const entitySchemas = post.extras.entities.map((e) => {
      const entity: Record<string, unknown> = { '@type': 'Thing', name: e.name };
      if (e.wikidataId) {
        entity.sameAs = `https://www.wikidata.org/wiki/${e.wikidataId}`;
      }
      return entity;
    });
    schema.about = entitySchemas[0];
    if (entitySchemas.length > 1) {
      schema.mentions = entitySchemas.slice(1);
    }
  }

  return schema;
}

/**
 * Generate FAQPage schema
 */
export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate ClaimReview schema for factcheck articles
 * Uses extras.claims array
 */
export function generateClaimReviewSchema(
  post: PostMeta,
  config: MetaTagsConfig & { logo?: string },
  postUrl: string
): object[] {
  const claims = post.extras?.claims;
  if (!claims || claims.length === 0) return [];

  const url = `${config.siteUrl}${postUrl}`;
  const authorInfo = post.authorInfo
    ? generatePersonSchema(post.authorInfo, config)
    : { '@type': 'Organization', name: config.siteName, url: config.siteUrl };

  return claims.map((c) => ({
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    url,
    claimReviewed: c.claim,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: c.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: authorInfo,
  }));
}

/**
 * Generate LiveBlogPosting schema for liveblog articles
 * Uses extras.liveblogUpdates array
 */
export function generateLiveBlogSchema(
  post: PostMeta,
  config: MetaTagsConfig & { logo?: string },
  postUrl: string
): object {
  const updates = post.extras?.liveblogUpdates || [];
  const url = `${config.siteUrl}${postUrl}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LiveBlogPosting',
    headline: post.title,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      url: config.siteUrl,
      ...(config.logo ? { logo: { '@type': 'ImageObject', url: config.logo } } : {}),
    },
  };

  if (post.publishedAt) schema.datePublished = post.publishedAt;
  if (post.updatedAt) schema.dateModified = post.updatedAt;

  if (updates.length > 0) {
    schema.liveBlogUpdate = updates.map((u) => ({
      '@type': 'BlogPosting',
      headline: u.headline,
      articleBody: u.body,
      datePublished: u.time,
    }));
  }

  return schema;
}

/**
 * Generate SpeakableSpecification schema for Google Assistant
 */
export function generateSpeakableSchema(
  url: string,
  selectors: string[] = ['.article-title', '.article-excerpt']
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: selectors,
    },
  };
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
 * Generate entity annotations (about/mentions) for article schema
 * Returns Thing entities with optional Wikidata sameAs links
 */
export function generateEntityAnnotations(
  entities: Array<{ name: string; type?: string; wikidataId?: string }>
): object[] {
  return entities.map((e) => {
    const entity: Record<string, unknown> = {
      '@type': 'Thing',
      name: e.name,
    };
    if (e.wikidataId) {
      entity.sameAs = `https://www.wikidata.org/wiki/${e.wikidataId}`;
    }
    return entity;
  });
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

    const { post, postUrl } = pageData;

    // FAQ schema
    if (post.faq && post.faq.length > 0) {
      schemas.push(generateFaqSchema(post.faq));
    }

    // ClaimReview schema for factcheck articles
    if (post.articleType === 'factcheck' && post.extras?.claims?.length) {
      const claimSchemas = generateClaimReviewSchema(post, config, postUrl);
      schemas.push(...claimSchemas);
    }

    // LiveBlog schema for liveblog articles
    if (post.articleType === 'liveblog' && post.extras?.liveblogUpdates?.length) {
      schemas.push(generateLiveBlogSchema(post, config, postUrl));
    }

    // Speakable schema for all post pages
    const fullUrl = post.canonicalUrl || `${config.siteUrl}${postUrl}`;
    schemas.push(generateSpeakableSchema(fullUrl));
  }

  return schemas;
}
