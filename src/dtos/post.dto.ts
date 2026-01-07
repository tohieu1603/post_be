/**
 * Post DTOs - Data Transfer Objects
 */

import { ContentStructure, PostStatus } from '../models/post.model';

export { PostStatus };

export interface CreatePostDto {
  // Basic
  title: string;
  slug?: string; // Optional - auto-generated if not provided
  content: string;
  excerpt?: string;
  coverImage?: string;
  categoryId: string;
  status?: PostStatus;

  // Author & Tags
  author?: string;
  tags?: string[];

  // SEO - Basic
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;

  // SEO - Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;

  // SEO - Twitter
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  // Advanced
  isFeatured?: boolean;
  allowComments?: boolean;
  readingTime?: number;
  template?: string;
  customFields?: Record<string, any>;

  // Trending & Social
  isTrending?: boolean;
}

export interface UpdatePostDto {
  // Basic
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  coverImage?: string | null;
  categoryId?: string;
  status?: PostStatus;

  // Author & Tags
  author?: string | null;
  tags?: string[] | null;

  // SEO - Basic
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;

  // SEO - Open Graph
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;

  // SEO - Twitter
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;

  // Advanced
  isFeatured?: boolean;
  allowComments?: boolean;
  readingTime?: number | null;
  template?: string | null;
  customFields?: Record<string, any> | null;

  // Trending & Social
  isTrending?: boolean;
  trendingRank?: number | null;

  // Content Structure
  contentStructure?: ContentStructure | null;
}

export interface PostFilterDto {
  search?: string;
  categoryId?: string;
  status?: PostStatus;
  author?: string;
  tags?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'viewCount' | 'publishedAt' | 'shareCount' | 'trendingRank';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PostResponseDto {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  categoryId: string;
  status: PostStatus;
  publishedAt: Date | null;
  viewCount: number;
  author: string | null;
  tags: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  isFeatured: boolean;
  allowComments: boolean;
  readingTime: number | null;
  template: string | null;
  customFields: Record<string, any> | null;
  // Trending & Social
  isTrending: boolean;
  trendingRank: number | null;
  trendingAt: Date | null;
  shareCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface UpdatePostStatusDto {
  status: PostStatus;
}
