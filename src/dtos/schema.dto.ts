/**
 * Schema DTOs - Types for database schema introspection and query APIs
 */

// Collection/Table info for list API
export interface CollectionInfo {
  name: string;
  description: string;
  row_count: number;
}

// Column/Field info for detail API
export interface ColumnInfo {
  name: string;
  type: string;
  primary_key?: boolean;
  nullable: boolean;
  foreign_key?: string; // Format: "collection.field"
  default?: unknown;
}

// Relationship info
export interface RelationshipInfo {
  field: string;
  references: string;
  type: 'many_to_one' | 'one_to_many' | 'many_to_many';
}

// Collection detail response
export interface CollectionDetail {
  name: string;
  columns: ColumnInfo[];
  relationships: RelationshipInfo[];
  indexes?: { name: string; fields: string[] }[];
}

// Allowed query operations
export type QueryOperation = 'find' | 'find_one' | 'aggregate' | 'count' | 'distinct';

// Query execute request body
export interface QueryExecuteDto {
  collection: string;
  operation?: QueryOperation; // Default: 'find'
  filter?: Record<string, unknown>;
  projection?: Record<string, 0 | 1>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
  timeout?: number; // in seconds, max 30
  keyword?: string; // Auto-builds $regex filter on searchable fields
  pipeline?: Record<string, unknown>[]; // For aggregate operation
  field?: string; // For distinct operation - the field to get distinct values
}

// Query execute response
export interface QueryExecuteResult {
  success: boolean;
  data: unknown[];
  columns?: string[];
  count: number;
  execution_time_ms?: number;
}

// Allowed collections whitelist
export const ALLOWED_COLLECTIONS = [
  'posts',
  'categories',
  'tags',
  'authors',
  'users',
  'media',
  'banners',
  'dictionaries',
  'pagecontents',
  'settings',
  'redirects',
  'seoscores',
  'seologs',
  'indexstatuses',
  'keywords',
  'activitylogs',
  'analytics',
] as const;

export type AllowedCollection = typeof ALLOWED_COLLECTIONS[number];

// Collection metadata mapping
export const COLLECTION_METADATA: Record<string, { description: string; modelName: string }> = {
  posts: { description: 'News articles and blog posts', modelName: 'Post' },
  categories: { description: 'Article categories', modelName: 'Category' },
  tags: { description: 'Article tags', modelName: 'Tag' },
  authors: { description: 'Content authors (E-E-A-T)', modelName: 'Author' },
  users: { description: 'System users', modelName: 'User' },
  media: { description: 'Uploaded media files', modelName: 'Media' },
  banners: { description: 'Banner advertisements', modelName: 'Banner' },
  dictionaries: { description: 'Dictionary terms', modelName: 'Dictionary' },
  pagecontents: { description: 'Static page content', modelName: 'PageContent' },
  settings: { description: 'Application settings', modelName: 'Settings' },
  redirects: { description: 'SEO redirects', modelName: 'Redirect' },
  seoscores: { description: 'SEO scores for posts', modelName: 'SeoScore' },
  seologs: { description: 'SEO operation logs', modelName: 'SeoLog' },
  indexstatuses: { description: 'Google index status', modelName: 'IndexStatus' },
  keywords: { description: 'SEO keywords', modelName: 'Keyword' },
  activitylogs: { description: 'User activity logs', modelName: 'ActivityLog' },
  analytics: { description: 'Page analytics', modelName: 'Analytics' },
};

// Query constraints
export const QUERY_CONSTRAINTS = {
  MAX_TIMEOUT_SECONDS: 30,
  DEFAULT_TIMEOUT_SECONDS: 30,
  MAX_ROWS: 1000,
  DEFAULT_ROWS: 100,
} as const;

// Blocked aggregate pipeline stages (write operations)
export const BLOCKED_PIPELINE_STAGES = ['$merge', '$out'] as const;

// Searchable fields for keyword auto-regex (per collection)
export const SEARCHABLE_FIELDS: Record<string, string[]> = {
  posts: ['title', 'content', 'excerpt', 'slug'],
  categories: ['name', 'slug', 'description'],
  tags: ['name', 'slug'],
  authors: ['name', 'bio', 'slug'],
  users: ['email', 'name'],
  media: ['title', 'alt_text', 'filename'],
  banners: ['title', 'description'],
  dictionaries: ['word', 'definition'],
  pagecontents: ['title', 'content', 'slug'],
  keywords: ['keyword'],
};
