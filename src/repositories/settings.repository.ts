import { Settings, ISettings, SettingsCategory } from '../models/settings.model';
import { Types } from 'mongoose';

/**
 * Settings Repository - MongoDB/Mongoose implementation
 */
export class SettingsRepository {
  /**
   * Find setting by key
   */
  async findByKey(key: string): Promise<ISettings | null> {
    return Settings.findOne({ key });
  }

  /**
   * Find settings by category
   */
  async findByCategory(category: SettingsCategory): Promise<ISettings[]> {
    return Settings.find({ category }).sort({ key: 1 });
  }

  /**
   * Upsert setting
   */
  async upsert(
    key: string,
    value: unknown,
    category: SettingsCategory = 'general',
    options?: { label?: string; description?: string; isSecret?: boolean }
  ): Promise<ISettings> {
    const updateData: Partial<ISettings> = {
      value,
      category,
    };

    if (options?.label !== undefined) updateData.label = options.label;
    if (options?.description !== undefined) updateData.description = options.description;
    if (options?.isSecret !== undefined) updateData.isSecret = options.isSecret;

    const result = await Settings.findOneAndUpdate(
      { key },
      {
        $set: updateData,
        $setOnInsert: { key },
      },
      { upsert: true, new: true }
    );

    return result!;
  }

  /**
   * Get all settings as key-value map
   */
  async getAll(): Promise<Record<string, unknown>> {
    const settings = await Settings.find();
    const result: Record<string, unknown> = {};
    for (const s of settings) {
      result[s.key] = s.isSecret ? '********' : s.value;
    }
    return result;
  }

  /**
   * Get all settings grouped by category
   */
  async getAllGrouped(): Promise<Record<SettingsCategory, Record<string, unknown>>> {
    const settings = await Settings.find();
    const result: Record<string, Record<string, unknown>> = {
      site: {},
      seo: {},
      email: {},
      api: {},
      general: {},
    };

    for (const s of settings) {
      result[s.category][s.key] = s.isSecret ? '********' : s.value;
    }

    return result as Record<SettingsCategory, Record<string, unknown>>;
  }

  /**
   * Find setting by ID
   */
  async findById(id: string): Promise<ISettings | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Settings.findById(id);
  }

  /**
   * Delete setting
   */
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await Settings.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Delete setting by key
   */
  async deleteByKey(key: string): Promise<boolean> {
    const result = await Settings.findOneAndDelete({ key });
    return result !== null;
  }

  /**
   * Find all settings
   */
  async find(): Promise<ISettings[]> {
    return Settings.find();
  }

  /**
   * Create setting
   */
  async create(data: Partial<ISettings>): Promise<ISettings> {
    const setting = new Settings(data);
    const saved = await setting.save();
    return saved.toObject();
  }

  /**
   * Save setting
   */
  async save(setting: ISettings): Promise<ISettings> {
    const doc = await Settings.findByIdAndUpdate(setting._id, setting, { new: true, upsert: true });
    return doc?.toObject() || setting;
  }
}

// Singleton instance
export const settingsRepository = new SettingsRepository();
