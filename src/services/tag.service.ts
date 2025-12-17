import { Tag, ITag } from '../models/tag.model';
import { tagRepository } from '../repositories/tag.repository';
import { CreateTagDto, UpdateTagDto, TagWithPostCount } from '../dtos/tag.dto';
import { generateSlug } from '../utils/slug.util';
import mongoose from 'mongoose';

export class TagService {
  async findAll(): Promise<TagWithPostCount[]> {
    const tags = await tagRepository.findAllWithPostCount();
    return tags.map(tag => ({
      id: tag._id.toString(),
      name: tag.name,
      slug: tag.slug,
      description: tag.description ?? null,
      color: tag.color ?? null,
      isActive: tag.isActive,
      postCount: tag.postCount,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));
  }

  async findById(id: string): Promise<ITag | null> {
    return tagRepository.findById(id);
  }

  async findBySlug(slug: string): Promise<ITag | null> {
    return tagRepository.findBySlug(slug);
  }

  async search(query: string): Promise<ITag[]> {
    return tagRepository.search(query);
  }

  async create(dto: CreateTagDto): Promise<ITag> {
    const slug = dto.slug || generateSlug(dto.name);

    // Check for duplicate slug
    const existing = await tagRepository.findBySlug(slug);
    if (existing) {
      throw new Error('Tag with this slug already exists');
    }

    // Check for duplicate name
    const existingName = await tagRepository.findByName(dto.name);
    if (existingName) {
      throw new Error('Tag with this name already exists');
    }

    return tagRepository.create({
      name: dto.name,
      slug,
      description: dto.description || undefined,
      color: dto.color || undefined,
      isActive: dto.isActive ?? true,
    });
  }

  async update(id: string, dto: UpdateTagDto): Promise<ITag> {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    if (dto.slug && dto.slug !== tag.slug) {
      const existing = await tagRepository.findBySlug(dto.slug);
      if (existing) {
        throw new Error('Tag with this slug already exists');
      }
    }

    if (dto.name && dto.name !== tag.name) {
      const existingName = await tagRepository.findByName(dto.name);
      if (existingName) {
        throw new Error('Tag with this name already exists');
      }
    }

    const updated = await tagRepository.update(id, {
      name: dto.name ?? tag.name,
      slug: dto.slug ?? tag.slug,
      description: dto.description !== undefined ? dto.description : tag.description,
      color: dto.color !== undefined ? dto.color : tag.color,
      isActive: dto.isActive ?? tag.isActive,
    });

    if (!updated) {
      throw new Error('Failed to update tag');
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    const deleted = await tagRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete tag');
    }
  }

  async mergeTags(sourceTagIds: string[], targetTagId: string): Promise<ITag> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get target tag
      const targetTag = await Tag.findById(targetTagId).session(session);
      if (!targetTag) {
        throw new Error('Target tag not found');
      }

      // Import Post model for updating references
      const { Post } = await import('../models/post.model');

      // Move all posts from source tags to target tag
      for (const sourceTagId of sourceTagIds) {
        if (sourceTagId === targetTagId) continue;

        // Update posts: add target tag and remove source tag
        await Post.updateMany(
          { tags: sourceTagId },
          {
            $addToSet: { tags: targetTagId },
            $pull: { tags: sourceTagId }
          },
          { session }
        );

        // Delete source tag
        await Tag.findByIdAndDelete(sourceTagId).session(session);
      }

      await session.commitTransaction();
      return targetTag.toObject();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async generateSlug(name: string): Promise<string> {
    let slug = generateSlug(name);
    let counter = 1;

    while (await tagRepository.findBySlug(slug)) {
      slug = `${generateSlug(name)}-${counter}`;
      counter++;
    }

    return slug;
  }

  async toggleActive(id: string): Promise<ITag> {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    const updated = await tagRepository.update(id, { isActive: !tag.isActive });
    if (!updated) {
      throw new Error('Failed to toggle tag');
    }

    return updated;
  }
}
