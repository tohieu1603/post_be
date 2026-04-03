/**
 * Webhook Service
 * Handles CMS-to-website integration: publish, update, unpublish, batch, sync.
 * All DB operations use upsert where applicable to be idempotent.
 */

import { Post, ArticleType } from '../models/post.model';
import { Author } from '../models/author.model';
import { Category } from '../models/category.model';
import { generateUniqueSlug } from '../utils/slug.util';
import { sanitizeHtmlContent } from '../utils/security.util';

const SITE_URL = (process.env.SITE_URL || 'http://localhost:3007').replace(/\/$/, '');

// ============================================================
// Input shape interfaces (matches API-CONTRACT.md)
// ============================================================

export interface WebhookImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface WebhookCategory {
  id: string;   // Used as slug in DB
  name: string;
  name_en?: string;
  description?: string;
  sort_order?: number;
}

export interface WebhookAuthor {
  id: string;   // Used as slug in DB
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
  bio_en?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  expertise?: string[];
  wikidata_id?: string;
}

export interface WebhookSeo {
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  noindex?: boolean;
  canonical_url?: string;
}

export interface WebhookExtras {
  faq?: Array<{ question: string; answer: string }>;
  entities?: Array<{ name: string; type: string; wikidataId?: string }>;
  claims?: Array<{ claim: string; rating: number; source?: string }>;
  liveblog_updates?: Array<{ headline: string; body: string; time: string }>;
}

export interface WebhookTranslation {
  language: string;
  title: string;
  excerpt?: string;
  content: string;
  slug?: string;
  keywords?: string[];
  seo?: WebhookSeo;
}

export interface WebhookArticle {
  external_id: string;
  type: string;
  language: string;
  title: string;
  excerpt?: string;
  content: string;
  image: WebhookImage;
  category: WebhookCategory;
  author: WebhookAuthor;
  published_at?: string;
  modified_at?: string;
  keywords?: string[];
  word_count?: number;
  is_breaking?: boolean;
  sources?: Array<{ name: string; url: string }>;
  seo?: WebhookSeo;
  extras?: WebhookExtras;
  translation?: WebhookTranslation;
  status?: string;
}

// ============================================================
// Response shape (matching types/seo.ts WebhookResponse)
// ============================================================

export interface WebhookSuccessResponse {
  success: true;
  data: {
    id: string;
    external_id: string;
    url: string;
    url_en?: string;
    indexed: { google: string; bing: string };
    sitemap: string;
    rss: string;
  };
}

export interface WebhookValidationError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// ============================================================
// Internal helpers
// ============================================================

/** Build canonical URL for a post */
function buildUrl(categorySlug: string, postSlug: string, language: string): string {
  if (language === 'en') {
    return `${SITE_URL}/en/${categorySlug}/${postSlug}`;
  }
  return `${SITE_URL}/${categorySlug}/${postSlug}`;
}

/** Upsert a category by its CMS id (used as DB slug) */
async function upsertCategory(cat: WebhookCategory) {
  return Category.findOneAndUpdate(
    { slug: cat.id },
    {
      $set: {
        slug: cat.id,
        name: cat.name,
        isActive: true,
        ...(cat.name_en ? { seoTitle: cat.name_en } : {}),
        ...(cat.description !== undefined ? { description: cat.description } : {}),
        ...(cat.sort_order !== undefined ? { sortOrder: cat.sort_order } : {}),
      },
    },
    { upsert: true, new: true }
  );
}

/** Upsert an author by CMS id (used as DB slug) */
async function upsertAuthor(aut: WebhookAuthor) {
  return Author.findOneAndUpdate(
    { slug: aut.id },
    {
      $set: {
        slug: aut.id,
        name: aut.name,
        isActive: true,
        ...(aut.title !== undefined ? { jobTitle: aut.title } : {}),
        ...(aut.avatar !== undefined ? { avatarUrl: aut.avatar } : {}),
        ...(aut.bio !== undefined ? { bio: aut.bio } : {}),
        ...(aut.bio_en !== undefined ? { bioEn: aut.bio_en } : {}),
        ...(aut.social?.twitter !== undefined ? { twitter: aut.social.twitter } : {}),
        ...(aut.social?.linkedin !== undefined ? { linkedin: aut.social.linkedin } : {}),
        ...(aut.social?.facebook !== undefined ? { facebook: aut.social.facebook } : {}),
        ...(aut.expertise ? { expertise: aut.expertise } : {}),
        ...(aut.wikidata_id !== undefined ? { wikidataId: aut.wikidata_id } : {}),
      },
    },
    { upsert: true, new: true }
  );
}

/** Map extras payload to DB schema */
function mapExtras(extras?: WebhookExtras) {
  if (!extras) return null;
  return {
    ...(extras.entities ? { entities: extras.entities } : {}),
    ...(extras.claims ? { claims: extras.claims } : {}),
    ...(extras.liveblog_updates ? { liveblogUpdates: extras.liveblog_updates } : {}),
  };
}

/** Validate required fields for publishArticle */
const REQUIRED_TOP_LEVEL = ['external_id', 'type', 'language', 'title', 'content'] as const;

function validatePublishPayload(
  article: Partial<WebhookArticle>
): Array<{ field: string; message: string }> {
  const errors: Array<{ field: string; message: string }> = [];

  for (const field of REQUIRED_TOP_LEVEL) {
    if (!article[field]) {
      errors.push({ field, message: `Trường ${field} là bắt buộc` });
    }
  }
  if (!article.image?.url) errors.push({ field: 'image.url', message: 'Trường image.url là bắt buộc' });
  if (!article.category?.id) errors.push({ field: 'category.id', message: 'Trường category.id là bắt buộc' });
  if (!article.category?.name) errors.push({ field: 'category.name', message: 'Trường category.name là bắt buộc' });
  if (!article.author?.id) errors.push({ field: 'author.id', message: 'Trường author.id là bắt buộc' });
  if (!article.author?.name) errors.push({ field: 'author.name', message: 'Trường author.name là bắt buộc' });

  return errors;
}

// ============================================================
// Service class
// ============================================================

export class WebhookService {
  /**
   * Publish a new article from CMS.
   * Validates fields, checks for duplicates, upserts category/author, creates post.
   * If article.translation provided, creates a second translated post with translationOf ref.
   */
  async publishArticle(article: WebhookArticle): Promise<WebhookSuccessResponse> {
    // Validate
    const validationErrors = validatePublishPayload(article);
    if (validationErrors.length > 0) {
      const err = Object.assign(
        new Error('Thiếu trường bắt buộc'),
        { code: 'VALIDATION_ERROR', details: validationErrors }
      );
      throw err;
    }

    // Duplicate check by externalId
    const existing = await Post.findOne({ externalId: article.external_id }).lean();
    if (existing) {
      throw Object.assign(new Error('Bài viết đã tồn tại'), { code: 'DUPLICATE' });
    }

    // Generate unique slug from title
    const slug = await generateUniqueSlug(
      article.title,
      async (s) => !!(await Post.findOne({ slug: s }).lean())
    );

    // Upsert category and author
    const category = await upsertCategory(article.category);
    const author = await upsertAuthor(article.author);

    const robots = article.seo?.noindex ? 'noindex,follow' : 'index,follow';
    const extras = mapExtras(article.extras);

    // Build post document
    const postDoc: Record<string, any> = {
      externalId: String(article.external_id),
      articleType: (article.type || 'news') as ArticleType,
      language: article.language,
      title: article.title,
      slug,
      excerpt: article.excerpt || null,
      content: sanitizeHtmlContent(article.content, 'permissive'),
      coverImage: article.image.url,
      imageAlt: article.image.alt || null,
      imageWidth: article.image.width || null,
      imageHeight: article.image.height || null,
      imageCaption: article.image.caption || null,
      categoryId: category._id,
      authorId: author._id,
      author: article.author.name,
      publishedAt: article.published_at ? new Date(article.published_at) : new Date(),
      tags: article.keywords || [],
      wordCount: article.word_count || null,
      isBreaking: article.is_breaking || false,
      sources: article.sources || [],
      metaTitle: article.seo?.meta_title || null,
      metaDescription: article.seo?.meta_description || null,
      ogImage: article.seo?.og_image || null,
      robots,
      canonicalUrl: article.seo?.canonical_url || null,
      faq: article.extras?.faq || null,
      extras,
      status: 'published',
    };

    const created = await Post.create(postDoc);

    // Handle translation (creates a second post in another language)
    let translationPost: any = null;
    if (article.translation) {
      const trans = article.translation;
      const transSlug = trans.slug || await generateUniqueSlug(
        trans.title,
        async (s) => !!(await Post.findOne({ slug: s }).lean())
      );
      const transRobots = trans.seo?.noindex ? 'noindex,follow' : 'index,follow';

      translationPost = await Post.create({
        externalId: `${String(article.external_id)}_${trans.language}`,
        articleType: (article.type || 'news') as ArticleType,
        language: trans.language,
        title: trans.title,
        slug: transSlug,
        excerpt: trans.excerpt || null,
        content: sanitizeHtmlContent(trans.content, 'permissive'),
        coverImage: article.image.url,
        imageAlt: article.image.alt || null,
        imageWidth: article.image.width || null,
        imageHeight: article.image.height || null,
        imageCaption: article.image.caption || null,
        categoryId: category._id,
        authorId: author._id,
        author: article.author.name,
        publishedAt: article.published_at ? new Date(article.published_at) : new Date(),
        tags: trans.keywords || article.keywords || [],
        wordCount: article.word_count || null,
        isBreaking: article.is_breaking || false,
        sources: article.sources || [],
        metaTitle: trans.seo?.meta_title || null,
        metaDescription: trans.seo?.meta_description || null,
        ogImage: trans.seo?.og_image || article.seo?.og_image || null,
        robots: transRobots,
        canonicalUrl: trans.seo?.canonical_url || null,
        faq: null, // Translation gets its own FAQ when published separately
        extras,
        translationOf: created._id,
        status: 'published',
      });
    }

    const url = buildUrl(category.slug, slug, article.language);
    const responseData: WebhookSuccessResponse['data'] = {
      id: created._id.toString(),
      external_id: article.external_id,
      url,
      indexed: { google: 'skipped', bing: 'skipped' },
      sitemap: 'updated',
      rss: 'updated',
    };

    // Include EN url if translation was created
    if (translationPost && article.translation) {
      responseData.url_en = buildUrl(category.slug, translationPost.slug, article.translation.language);
    }

    return { success: true, data: responseData };
  }

  /**
   * Partially update an existing article by externalId.
   * Only provided fields are updated; omitted fields remain unchanged.
   */
  async updateArticle(
    article: Partial<WebhookArticle> & { external_id: string }
  ): Promise<WebhookSuccessResponse> {
    const post = await Post.findOne({ externalId: article.external_id });
    if (!post) {
      throw Object.assign(new Error('Bài viết không tồn tại'), { code: 'NOT_FOUND' });
    }

    const update: Record<string, any> = {};

    if (article.type !== undefined) update.articleType = article.type;
    if (article.language !== undefined) update.language = article.language;

    // Regenerate slug only when title changes
    if (article.title !== undefined) {
      update.title = article.title;
      update.slug = await generateUniqueSlug(
        article.title,
        async (s) => {
          const dup = await Post.findOne({ slug: s }).lean();
          return !!(dup && dup._id.toString() !== post._id.toString());
        }
      );
    }

    if (article.excerpt !== undefined) update.excerpt = article.excerpt;
    if (article.content !== undefined) update.content = article.content;

    if (article.image !== undefined) {
      if (article.image.url !== undefined) update.coverImage = article.image.url;
      if (article.image.alt !== undefined) update.imageAlt = article.image.alt;
      if (article.image.width !== undefined) update.imageWidth = article.image.width;
      if (article.image.height !== undefined) update.imageHeight = article.image.height;
      if (article.image.caption !== undefined) update.imageCaption = article.image.caption;
    }

    if (article.category !== undefined) {
      const cat = await upsertCategory(article.category);
      update.categoryId = cat._id;
    }

    if (article.author !== undefined) {
      const aut = await upsertAuthor(article.author);
      update.authorId = aut._id;
      update.author = article.author.name;
    }

    if (article.published_at !== undefined) update.publishedAt = new Date(article.published_at);
    if (article.keywords !== undefined) update.tags = article.keywords;
    if (article.word_count !== undefined) update.wordCount = article.word_count;
    if (article.is_breaking !== undefined) update.isBreaking = article.is_breaking;
    if (article.sources !== undefined) update.sources = article.sources;

    if (article.seo !== undefined) {
      if (article.seo.meta_title !== undefined) update.metaTitle = article.seo.meta_title;
      if (article.seo.meta_description !== undefined) update.metaDescription = article.seo.meta_description;
      if (article.seo.og_image !== undefined) update.ogImage = article.seo.og_image;
      if (article.seo.noindex !== undefined) update.robots = article.seo.noindex ? 'noindex,follow' : 'index,follow';
      if (article.seo.canonical_url !== undefined) update.canonicalUrl = article.seo.canonical_url;
    }

    if (article.extras !== undefined) {
      if (article.extras.faq !== undefined) update.faq = article.extras.faq;
      update.extras = mapExtras(article.extras);
    }

    await Post.findOneAndUpdate({ externalId: article.external_id }, { $set: update }, { new: true });

    // Resolve final slug and category for URL
    const finalSlug = update.slug || post.slug;
    let categorySlug = '';
    if (update.categoryId) {
      const cat = await Category.findById(update.categoryId).lean();
      categorySlug = cat?.slug || '';
    } else {
      const cat = await Category.findById(post.categoryId).lean();
      categorySlug = cat?.slug || '';
    }
    const lang = update.language || post.language;

    return {
      success: true,
      data: {
        id: post._id.toString(),
        external_id: article.external_id,
        url: buildUrl(categorySlug, finalSlug, lang),
        indexed: { google: 'skipped', bing: 'skipped' },
        sitemap: 'updated',
        rss: 'updated',
      },
    };
  }

  /**
   * Unpublish (archive) an article by externalId.
   */
  async unpublishArticle(externalId: string): Promise<WebhookSuccessResponse> {
    const post = await Post.findOne({ externalId }).lean();
    if (!post) {
      throw Object.assign(new Error('Bài viết không tồn tại'), { code: 'NOT_FOUND' });
    }

    await Post.findOneAndUpdate({ externalId }, { $set: { status: 'archived' } });

    return {
      success: true,
      data: {
        id: post._id.toString(),
        external_id: externalId,
        url: '',
        indexed: { google: 'skipped', bing: 'skipped' },
        sitemap: 'updated',
        rss: 'updated',
      },
    };
  }

  /**
   * Batch publish up to 50 articles.
   * Per-article errors are collected and returned in results; does not abort on error.
   */
  async batchPublish(articles: WebhookArticle[]): Promise<{
    success: true;
    data: {
      results: Array<{ external_id: string; success: boolean; data?: any; error?: any }>;
      total: number;
      succeeded: number;
      failed: number;
    };
  }> {
    if (!Array.isArray(articles) || articles.length === 0) {
      throw Object.assign(new Error('articles phải là mảng không rỗng'), { code: 'VALIDATION_ERROR' });
    }
    if (articles.length > 50) {
      throw Object.assign(new Error('Batch size vượt quá giới hạn 50'), { code: 'VALIDATION_ERROR' });
    }

    const results: Array<{ external_id: string; success: boolean; data?: any; error?: any }> = [];
    let succeeded = 0;
    let failed = 0;

    for (const article of articles) {
      try {
        const result = await this.publishArticle(article);
        results.push({ external_id: article.external_id, success: true, data: result.data });
        succeeded++;
      } catch (err: any) {
        results.push({
          external_id: article.external_id || '(unknown)',
          success: false,
          error: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message,
            details: err.details,
          },
        });
        failed++;
      }
    }

    return {
      success: true,
      data: { results, total: articles.length, succeeded, failed },
    };
  }

  /**
   * Sync (upsert) a list of categories from CMS.
   */
  async syncCategories(
    categories: WebhookCategory[]
  ): Promise<{ success: true; data: { synced: number } }> {
    if (!Array.isArray(categories)) {
      throw Object.assign(new Error('categories phải là mảng'), { code: 'VALIDATION_ERROR' });
    }

    for (const cat of categories) {
      if (!cat.id || !cat.name) continue; // Skip malformed entries
      await upsertCategory(cat);
    }

    return { success: true, data: { synced: categories.length } };
  }

  /**
   * Sync (upsert) a list of authors from CMS.
   */
  async syncAuthors(
    authors: WebhookAuthor[]
  ): Promise<{ success: true; data: { synced: number } }> {
    if (!Array.isArray(authors)) {
      throw Object.assign(new Error('authors phải là mảng'), { code: 'VALIDATION_ERROR' });
    }

    for (const aut of authors) {
      if (!aut.id || !aut.name) continue; // Skip malformed entries
      await upsertAuthor(aut);
    }

    return { success: true, data: { synced: authors.length } };
  }
}

export const webhookService = new WebhookService();
