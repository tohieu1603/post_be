export interface CreateTagDto {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

export interface MergeTagsDto {
  sourceTagIds: string[];
  targetTagId: string;
}

export interface TagWithPostCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  isActive: boolean;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}
