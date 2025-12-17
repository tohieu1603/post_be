import mongoose, { Schema, Document, Types } from 'mongoose';

// === Content Structure Types ===
export interface TocItem {
  id: string;
  text: string;
  level: number; // 2-6
  anchor: string;
}

export interface ImageBlock {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ReviewBlock {
  provider: string;
  rating: number; // 0-5
  summary?: string;
  pros: string[];
  cons: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TableBlock {
  headers: string[];
  rows: string[][];
}

export interface ListBlock {
  type: 'ordered' | 'unordered';
  items: string[];
}

export interface ContentSection {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'review' | 'faq' | 'table' | 'list' | 'quote' | 'code' | 'html';
  order: number;
  level?: number;
  text?: string;
  anchor?: string;
  content?: string;
  image?: ImageBlock;
  review?: ReviewBlock;
  faqs?: FaqItem[];
  table?: TableBlock;
  list?: ListBlock;
  language?: string;
}

export interface ContentStructure {
  summary?: string;
  toc: TocItem[];
  sections: ContentSection[];
  wordCount?: number;
  estimatedReadTime?: number;
  lastStructureUpdate?: string;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface IPost extends Document {
  _id: Types.ObjectId;
  // Basic Fields
  title: string;
  subtitle: string | null;  // Tiêu đề phụ
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  // Category
  categoryId: Types.ObjectId;
  category?: { _id: Types.ObjectId; name: string; slug: string } | null; // populated virtual
  // Status & Publishing
  status: PostStatus;
  publishedAt: Date | null;
  viewCount: number;
  // Author & Tags
  author: string | null;
  tags: string[] | null;
  tagsRelation: Types.ObjectId[];
  // SEO - Basic Meta
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  // SEO - Open Graph
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  // SEO - Twitter Card
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  // Advanced Options
  isFeatured: boolean;
  allowComments: boolean;
  readingTime: number | null;
  template: string | null;
  customFields: Record<string, any> | null;
  // Content Structure
  contentStructure: ContentStructure | null;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    // Basic Fields
    title: { type: String, required: true, maxlength: 500 },
    subtitle: { type: String, default: null, maxlength: 500 },
    slug: { type: String, required: true, unique: true, maxlength: 500 },
    excerpt: { type: String, default: null },
    content: { type: String, required: true },
    coverImage: { type: String, default: null, maxlength: 1000 },
    // Category
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    // Status & Publishing
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    viewCount: { type: Number, default: 0 },
    // Author & Tags
    author: { type: String, default: null, maxlength: 255 },
    tags: [{ type: String }],
    tagsRelation: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    // SEO - Basic Meta
    metaTitle: { type: String, default: null, maxlength: 255 },
    metaDescription: { type: String, default: null, maxlength: 500 },
    metaKeywords: { type: String, default: null, maxlength: 500 },
    canonicalUrl: { type: String, default: null, maxlength: 1000 },
    // SEO - Open Graph
    ogTitle: { type: String, default: null, maxlength: 255 },
    ogDescription: { type: String, default: null, maxlength: 500 },
    ogImage: { type: String, default: null, maxlength: 1000 },
    // SEO - Twitter Card
    twitterTitle: { type: String, default: null, maxlength: 255 },
    twitterDescription: { type: String, default: null, maxlength: 500 },
    twitterImage: { type: String, default: null, maxlength: 1000 },
    // Advanced Options
    isFeatured: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },
    readingTime: { type: Number, default: null },
    template: { type: String, default: null, maxlength: 100 },
    customFields: { type: Schema.Types.Mixed, default: null },
    // Content Structure
    contentStructure: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for category
postSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Indexes (slug already indexed via unique: true)
postSchema.index({ status: 1 });
postSchema.index({ categoryId: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isFeatured: 1 });
postSchema.index({ title: 'text', content: 'text' });

export const Post = mongoose.model<IPost>('Post', postSchema);
