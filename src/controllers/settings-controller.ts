import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';
import { successResponse, errorResponse } from '../utils/response.util';

const settingsService = new SettingsService();

export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.getAllGrouped();
    res.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch settings';
    errorResponse(res, message, 500);
  }
};

export const getSettingByKey = async (req: Request, res: Response) => {
  try {
    const value = await settingsService.getSetting(req.params.key);
    res.json({ key: req.params.key, value });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch setting';
    errorResponse(res, message, 500);
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { value, category } = req.body;
    const setting = await settingsService.updateSetting(req.params.key, value, category);
    res.json(setting);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update setting';
    errorResponse(res, message, 500);
  }
};

export const bulkUpdateSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;
    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({ error: 'settings must be an array' });
    }
    await settingsService.bulkUpdate(settings);
    successResponse(res, { message: 'Settings updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update settings';
    errorResponse(res, message, 500);
  }
};

export const initializeSettings = async (req: Request, res: Response) => {
  try {
    await settingsService.initializeDefaults();
    successResponse(res, { message: 'Default settings initialized' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to initialize settings';
    errorResponse(res, message, 500);
  }
};
