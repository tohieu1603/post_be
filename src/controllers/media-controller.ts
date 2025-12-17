import { Request, Response } from 'express';
import { MediaService } from '../services/media.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const mediaService = new MediaService();

export const getAllMedia = async (req: Request, res: Response) => {
  try {
    const { search, type, folder, page, limit, sortBy, sortOrder } = req.query;
    const result = await mediaService.findAll({
      search: search as string,
      type: type as any,
      folder: folder as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });
    res.json({
      data: result.data,
      pagination: {
        total: result.total,
        totalPages: result.totalPages,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch media';
    errorResponse(res, message, 500);
  }
};

export const getMediaById = async (req: Request, res: Response) => {
  try {
    const media = await mediaService.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch media';
    errorResponse(res, message, 500);
  }
};

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { folder, title, altText, caption, categoryId } = req.body;
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    const type = mediaService.getMediaType(file.mimetype);

    const media = await mediaService.create({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      type,
      size: file.size,
      url: `${baseUrl}/uploads/${filename}`,
      title: title || null,
      altText: altText || null,
      caption: caption || null,
      folder: folder || null,
      categoryId: categoryId || null,
    });

    res.status(201).json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload media';
    errorResponse(res, message, 500);
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  try {
    const media = await mediaService.update(req.params.id, req.body);
    res.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update media';
    errorResponse(res, message, 500);
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    await mediaService.delete(req.params.id);
    successResponse(res, { message: 'Media deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete media';
    errorResponse(res, message, 500);
  }
};

export const getMediaUsage = async (req: Request, res: Response) => {
  try {
    const usage = await mediaService.getUsage(req.params.id);
    res.json(usage);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get media usage';
    errorResponse(res, message, 500);
  }
};

export const getFolders = async (req: Request, res: Response) => {
  try {
    const folders = await mediaService.getFolders();
    res.json(folders);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get folders';
    errorResponse(res, message, 500);
  }
};

// Assign media to page/section
export const assignMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pageSlug, sectionKey, elementId } = req.body;

    if (!pageSlug || !sectionKey) {
      return res.status(400).json({ error: 'pageSlug and sectionKey are required' });
    }

    const media = await mediaService.assignToSection(id, { pageSlug, sectionKey, elementId });
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to assign media';
    errorResponse(res, message, 500);
  }
};

// Unassign media from page/section
export const unassignMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pageSlug, sectionKey } = req.body;

    if (!pageSlug || !sectionKey) {
      return res.status(400).json({ error: 'pageSlug and sectionKey are required' });
    }

    const media = await mediaService.unassignFromSection(id, pageSlug, sectionKey);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to unassign media';
    errorResponse(res, message, 500);
  }
};

// Get media by page/section
export const getMediaBySection = async (req: Request, res: Response) => {
  try {
    const { pageSlug, sectionKey } = req.query;

    if (!pageSlug) {
      return res.status(400).json({ error: 'pageSlug is required' });
    }

    const media = await mediaService.findBySection(
      pageSlug as string,
      sectionKey as string | undefined
    );
    res.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get media by section';
    errorResponse(res, message, 500);
  }
};
