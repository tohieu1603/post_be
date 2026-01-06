/**
 * Author DTOs - Data Transfer Objects
 * Supports E-E-A-T and CV-like dynamic content
 */

import {
  ExperienceItem,
  EducationItem,
  CertificationItem,
  AchievementItem,
  SkillItem,
  PublicationItem,
} from '../models/author.model';

// === Create Author DTO ===
export interface CreateAuthorDto {
  name: string;
  slug?: string; // Auto-generated if not provided
  email?: string;
  avatarUrl?: string;

  // E-E-A-T signals
  bio?: string;
  shortBio?: string;
  jobTitle?: string;
  company?: string;
  location?: string;

  // Dynamic CV-like content
  expertise?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  skills?: SkillItem[];
  publications?: PublicationItem[];

  // Legacy
  credentials?: string;
  yearsExperience?: number;

  // Social
  website?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  github?: string;
  youtube?: string;
  sameAs?: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Status
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;

  // Relation
  userId?: string;
}

// === Update Author DTO ===
export interface UpdateAuthorDto {
  name?: string;
  slug?: string;
  email?: string;
  avatarUrl?: string;

  // E-E-A-T signals
  bio?: string;
  shortBio?: string;
  jobTitle?: string;
  company?: string;
  location?: string;

  // Dynamic CV-like content
  expertise?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  skills?: SkillItem[];
  publications?: PublicationItem[];

  // Legacy
  credentials?: string;
  yearsExperience?: number;

  // Social
  website?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  github?: string;
  youtube?: string;
  sameAs?: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Status
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;

  // Relation
  userId?: string | null;
}

// === Filter Author DTO ===
export interface AuthorFilterDto {
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  expertise?: string; // Filter by expertise tag
  sortBy?: 'name' | 'sortOrder' | 'createdAt' | 'yearsExperience';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

// === Author Response DTO ===
export interface AuthorResponseDto {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  avatarUrl: string | null;

  // E-E-A-T signals
  bio: string | null;
  shortBio: string | null;
  jobTitle: string | null;
  company: string | null;
  location: string | null;

  // Dynamic CV-like content
  expertise: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  skills: SkillItem[];
  publications: PublicationItem[];

  // Legacy
  credentials: string | null;
  yearsExperience: number | null;

  // Social
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  facebook: string | null;
  github: string | null;
  youtube: string | null;
  sameAs: string[];

  // SEO
  metaTitle: string | null;
  metaDescription: string | null;

  // Status
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Relations (populated)
  postsCount?: number;
}

// === Author List Response (for dropdown/simple lists) ===
export interface AuthorSimpleDto {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  jobTitle: string | null;
  company: string | null;
  isActive: boolean;
}

// === Paginated Response ===
export interface PaginatedAuthorsDto {
  data: AuthorResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
