import { Media, IMedia, MediaUsage } from '../models/media.model';
import { MediaQueryParams } from '../dtos/media.dto';
import { Types, FilterQuery, SortOrder } from 'mongoose';
import { escapeRegex } from '../utils/security.util';

/**
 * Media Repository - MongoDB/Mongoose implementation
 */
export class MediaRepository {
  /**
   * Find media with filters
   */
  async findWithFilters(params: MediaQueryParams): Promise<{ data: IMedia[]; total: number }> {
    const {
      search,
      type,
      folder,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = params;

    const query: FilterQuery<IMedia> = {};

    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { originalName: { $regex: safeSearch, $options: 'i' } },
        { altText: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (folder) {
      query.folder = folder;
    }

    const total = await Media.countDocuments(query);

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'ASC' ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const data = await Media.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true }) as unknown as IMedia[];

    return { data, total };
  }

  /**
   * Find media by filename
   */
  async findByFilename(filename: string): Promise<IMedia | null> {
    return Media.findOne({ filename }).lean({ virtuals: true }) as unknown as IMedia | null;
  }

  /**
   * Update usage
   */
  async updateUsage(
    id: string,
    usage: MediaUsage
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;

    const media = await Media.findById(id);
    if (media) {
      const usedIn = media.usedIn || [];
      const exists = usedIn.some(
        (u) =>
          u.entityType === usage.entityType &&
          u.entityId === usage.entityId &&
          u.field === usage.field
      );
      if (!exists) {
        usedIn.push(usage);
        media.usedIn = usedIn;
        await media.save();
      }
    }
  }

  /**
   * Remove usage
   */
  async removeUsage(
    id: string,
    entityType: string,
    entityId: string
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;

    const media = await Media.findById(id);
    if (media && media.usedIn) {
      media.usedIn = media.usedIn.filter(
        (u) => !(u.entityType === entityType && u.entityId === entityId)
      );
      await media.save();
    }
  }

  /**
   * Get folders
   */
  async getFolders(): Promise<string[]> {
    const result = await Media.distinct('folder', { folder: { $ne: null } });
    return result.filter((f): f is string => f !== null).sort();
  }

  /**
   * Find media by ID
   */
  async findById(id: string): Promise<IMedia | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Media.findById(id).lean({ virtuals: true }) as unknown as IMedia | null;
  }

  /**
   * Create new media
   */
  async create(data: Partial<IMedia>): Promise<IMedia> {
    const media = new Media(data);
    const saved = await media.save();
    return saved.toObject();
  }

  /**
   * Update media
   */
  async update(id: string, data: Partial<IMedia>): Promise<IMedia | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Media.findByIdAndUpdate(id, data, { new: true }).lean({ virtuals: true }) as unknown as IMedia | null;
  }

  /**
   * Delete media
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Media.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Find one by query
   */
  async findOne(query: FilterQuery<IMedia>): Promise<IMedia | null> {
    return Media.findOne(query).lean({ virtuals: true }) as unknown as IMedia | null;
  }

  /**
   * Save media
   */
  async save(media: IMedia): Promise<IMedia> {
    const doc = await Media.findByIdAndUpdate(media._id, media, { new: true });
    return doc?.toObject() || media;
  }

  /**
   * Find media by page/section assignment
   */
  async findBySection(pageSlug: string, sectionKey?: string): Promise<IMedia[]> {
    const query: FilterQuery<IMedia> = {
      'assignments.pageSlug': pageSlug,
    };
    if (sectionKey) {
      query['assignments.sectionKey'] = sectionKey;
    }
    return Media.find(query).sort({ createdAt: -1 }).lean({ virtuals: true }) as unknown as IMedia[];
  }
}

// Singleton instance
export const mediaRepository = new MediaRepository();
