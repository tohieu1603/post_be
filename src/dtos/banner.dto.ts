/**
 * Banner DTOs - Data Transfer Objects
 */

import { BannerPosition, BannerStatus } from '../models/banner.model';

export { BannerPosition, BannerStatus };

export interface CreateBannerDto {
  postId: string;
  title?: string;        // Mặc định lấy từ post.title
  subtitle?: string;
  imageUrl?: string;     // Mặc định lấy từ post.coverImage
  linkUrl?: string;      // Mặc định lấy từ post.slug
  position?: BannerPosition;
  sortOrder?: number;
  status?: BannerStatus;
  isAutoAssigned?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateBannerDto {
  title?: string;
  subtitle?: string | null;
  imageUrl?: string;
  linkUrl?: string;
  position?: BannerPosition;
  sortOrder?: number;
  status?: BannerStatus;
  isAutoAssigned?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface BannerFilterDto {
  position?: BannerPosition;
  status?: BannerStatus;
  isAutoAssigned?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'rank' | 'sortOrder' | 'createdAt' | 'viewCount' | 'clickCount';
  sortOrder?: 'ASC' | 'DESC';
}

export interface BannerResponseDto {
  id: string;
  postId: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string;
  position: BannerPosition;
  rank: number;
  sortOrder: number;
  status: BannerStatus;
  isAutoAssigned: boolean;
  viewCount: number;
  clickCount: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  post?: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    viewCount: number;
  };
}

export interface TrendingConfigDto {
  topCount?: number;       // Số lượng bài trong top MỖI category (default: 10)
  position?: BannerPosition; // Vị trí banner cho trending
  minViewCount?: number;   // Số view tối thiểu để vào top
  categoryId?: string;     // Sync cho category cụ thể (optional)
}
