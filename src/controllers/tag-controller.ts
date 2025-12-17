import { Request, Response } from 'express';
import { TagService } from '../services/tag.service';
import { successResponse, errorResponse } from '../utils/response.util';

const tagService = new TagService();

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let tags;
    if (search && typeof search === 'string') {
      tags = await tagService.search(search);
    } else {
      tags = await tagService.findAll();
    }
    res.json(tags);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tags';
    errorResponse(res, message, 500);
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const tag = await tagService.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tag';
    errorResponse(res, message, 500);
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const tag = await tagService.create(req.body);
    res.status(201).json(tag);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create tag';
    errorResponse(res, message, 500);
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const tag = await tagService.update(req.params.id, req.body);
    res.json(tag);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update tag';
    errorResponse(res, message, 500);
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    await tagService.delete(req.params.id);
    successResponse(res, { message: 'Tag deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete tag';
    errorResponse(res, message, 500);
  }
};

export const mergeTags = async (req: Request, res: Response) => {
  try {
    const { sourceTagIds, targetTagId } = req.body;
    if (!sourceTagIds || !Array.isArray(sourceTagIds) || sourceTagIds.length === 0) {
      return res.status(400).json({ error: 'sourceTagIds must be a non-empty array' });
    }
    if (!targetTagId) {
      return res.status(400).json({ error: 'targetTagId is required' });
    }
    const tag = await tagService.mergeTags(sourceTagIds, targetTagId);
    res.json(tag);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to merge tags';
    errorResponse(res, message, 500);
  }
};

export const generateTagSlug = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const slug = await tagService.generateSlug(name);
    res.json({ slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate slug';
    errorResponse(res, message, 500);
  }
};

export const toggleTagActive = async (req: Request, res: Response) => {
  try {
    const tag = await tagService.toggleActive(req.params.id);
    res.json(tag);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle tag status';
    errorResponse(res, message, 500);
  }
};
