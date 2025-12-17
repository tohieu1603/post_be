import { MediaType } from '../models/media.model';

export interface CreateMediaDto {
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaType;
  size: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  title?: string;
  altText?: string;
  caption?: string;
  uploadedBy?: string;
  categoryId?: string;
  folder?: string;
}

export interface UpdateMediaDto {
  title?: string;
  altText?: string;
  caption?: string;
  url?: string;
  categoryId?: string;
  folder?: string;
}

export interface MediaQueryParams {
  search?: string;
  type?: MediaType;
  folder?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
