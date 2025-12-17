import { IMedia, MediaType, MediaAssignment } from '../models/media.model';
import { mediaRepository } from '../repositories/media.repository';
import { CreateMediaDto, UpdateMediaDto, MediaQueryParams } from '../dtos/media.dto';
import path from 'path';
import fs from 'fs';
import { Types } from 'mongoose';

export class MediaService {
  async findAll(params: MediaQueryParams): Promise<{ data: IMedia[]; total: number; totalPages: number }> {
    const { data, total } = await mediaRepository.findWithFilters(params);
    const limit = params.limit || 20;
    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<IMedia | null> {
    return mediaRepository.findById(id);
  }

  async create(dto: CreateMediaDto): Promise<IMedia> {
    const { categoryId, uploadedBy, ...rest } = dto;
    return mediaRepository.create({
      ...rest,
      uploadedBy: uploadedBy && Types.ObjectId.isValid(uploadedBy)
        ? new Types.ObjectId(uploadedBy)
        : null,
      categoryId: categoryId && Types.ObjectId.isValid(categoryId)
        ? new Types.ObjectId(categoryId)
        : null,
    });
  }

  async update(id: string, dto: UpdateMediaDto): Promise<IMedia> {
    const media = await mediaRepository.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }

    const updateData: Partial<IMedia> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.altText !== undefined) updateData.altText = dto.altText;
    if (dto.caption !== undefined) updateData.caption = dto.caption;
    if (dto.url !== undefined) updateData.url = dto.url;
    if (dto.folder !== undefined) updateData.folder = dto.folder;
    if (dto.categoryId !== undefined) {
      updateData.categoryId = dto.categoryId && Types.ObjectId.isValid(dto.categoryId)
        ? new Types.ObjectId(dto.categoryId)
        : null;
    }

    const updated = await mediaRepository.update(id, updateData);

    if (!updated) {
      throw new Error('Failed to update media');
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const media = await mediaRepository.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }

    // Delete physical file if exists
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const filePath = path.join(uploadDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete thumbnail if exists
    if (media.thumbnailUrl) {
      const thumbPath = path.join(uploadDir, 'thumbnails', media.filename);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await mediaRepository.delete(id);
  }

  async getUsage(id: string): Promise<{ entityType: string; entityId: string; field: string }[]> {
    const media = await mediaRepository.findById(id);
    if (!media) {
      throw new Error('Media not found');
    }
    return media.usedIn || [];
  }

  async updateUsage(
    id: string,
    usage: { entityType: string; entityId: string; field: string }
  ): Promise<void> {
    await mediaRepository.updateUsage(id, usage);
  }

  async removeUsage(id: string, entityType: string, entityId: string): Promise<void> {
    await mediaRepository.removeUsage(id, entityType, entityId);
  }

  async getFolders(): Promise<string[]> {
    return mediaRepository.getFolders();
  }

  getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('presentation') ||
      mimeType.includes('text/')
    ) {
      return 'document';
    }
    return 'other';
  }

  // Assign media to page/section
  async assignToSection(id: string, assignment: MediaAssignment): Promise<IMedia | null> {
    const media = await mediaRepository.findById(id);
    if (!media) return null;

    // Check if already assigned
    const existing = media.assignments?.find(
      (a) => a.pageSlug === assignment.pageSlug && a.sectionKey === assignment.sectionKey
    );
    if (existing) {
      return media; // Already assigned
    }

    // Add assignment
    const assignments = [...(media.assignments || []), assignment];
    return mediaRepository.update(id, { assignments });
  }

  // Unassign media from page/section
  async unassignFromSection(id: string, pageSlug: string, sectionKey: string): Promise<IMedia | null> {
    const media = await mediaRepository.findById(id);
    if (!media) return null;

    const assignments = (media.assignments || []).filter(
      (a) => !(a.pageSlug === pageSlug && a.sectionKey === sectionKey)
    );
    return mediaRepository.update(id, { assignments });
  }

  // Find media by page/section
  async findBySection(pageSlug: string, sectionKey?: string): Promise<IMedia[]> {
    return mediaRepository.findBySection(pageSlug, sectionKey);
  }
}
