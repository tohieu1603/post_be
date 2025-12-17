/**
 * Category DTOs - Data Transfer Objects
 */

export interface CreateCategoryDto {
  name: string;
  slug?: string; // Optional - auto-generated if not provided
  description?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CategoryFilterDto {
  search?: string;
  parentId?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'sortOrder' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: CategoryResponseDto | null;
  children?: CategoryResponseDto[];
}
