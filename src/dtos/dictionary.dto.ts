/**
 * Dictionary Term DTOs
 * Data Transfer Objects for dictionary/glossary operations
 */

/**
 * SEO metadata for dictionary term
 */
export interface DictionarySeoDto {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

/**
 * DTO for creating a new dictionary term
 */
export interface CreateDictionaryTermDto {
  term: string;
  slug?: string;
  definition: string;
  description?: string;
  synonym?: string;
  relatedTerms?: string[];
  examples?: string[];
  categoryId?: string;
  tags?: string[];
  source?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  seo?: DictionarySeoDto;
}

/**
 * DTO for updating an existing dictionary term
 */
export interface UpdateDictionaryTermDto {
  term?: string;
  slug?: string;
  definition?: string;
  description?: string;
  synonym?: string;
  relatedTerms?: string[];
  examples?: string[];
  categoryId?: string;
  tags?: string[];
  source?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  seo?: DictionarySeoDto;
}

/**
 * DTO for filtering/querying dictionary terms
 */
export interface DictionaryFilterDto {
  search?: string;           // Full-text search
  letter?: string;           // Filter by first letter (A-Z)
  categoryId?: string;       // Filter by category
  tags?: string[];           // Filter by tags
  partOfSpeech?: string;     // Filter by part of speech
  isActive?: boolean;        // Filter by active status
  isFeatured?: boolean;      // Filter by featured status
  page?: number;
  limit?: number;
  sortBy?: 'term' | 'viewCount' | 'createdAt' | 'updatedAt' | 'sortOrder';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Response DTO for dictionary term
 */
export interface DictionaryTermResponseDto {
  id: string;
  term: string;
  slug: string;
  definition: string;
  description?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  antonyms?: string[];
  relatedTerms?: Array<{
    id: string;
    term: string;
    slug: string;
  }>;
  examples?: string[];
  etymology?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: string[];
  source?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  sortOrder: number;
  seo?: DictionarySeoDto;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for alphabetical index
 */
export interface AlphabetIndexDto {
  letter: string;
  count: number;
}

/**
 * DTO for dictionary statistics
 */
export interface DictionaryStatsDto {
  total: number;
  active: number;
  featured: number;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  byPartOfSpeech: Array<{
    partOfSpeech: string;
    count: number;
  }>;
  alphabetIndex: AlphabetIndexDto[];
  recentlyAdded: number;
  mostViewed: Array<{
    id: string;
    term: string;
    viewCount: number;
  }>;
}
