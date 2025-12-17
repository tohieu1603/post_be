import { Settings, ISettings, SettingsCategory } from '../models/settings.model';
import { Redirect, IRedirect } from '../models/redirect.model';
import { settingsRepository } from '../repositories/settings.repository';
import { redirectRepository } from '../repositories/redirect.repository';
import {
  CreateRedirectDto,
  UpdateRedirectDto,
} from '../dtos/settings.dto';

export class SettingsService {
  // === Settings Methods ===
  async getAllSettings(): Promise<Record<string, unknown>> {
    return settingsRepository.getAll();
  }

  async getAllGrouped(): Promise<Record<SettingsCategory, Record<string, unknown>>> {
    return settingsRepository.getAllGrouped();
  }

  async getByCategory(category: SettingsCategory): Promise<ISettings[]> {
    return settingsRepository.findByCategory(category);
  }

  async getSetting(key: string): Promise<unknown | null> {
    const setting = await settingsRepository.findByKey(key);
    if (!setting) return null;
    return setting.isSecret ? '********' : setting.value;
  }

  async getSettingRaw(key: string): Promise<unknown | null> {
    const setting = await settingsRepository.findByKey(key);
    return setting?.value || null;
  }

  async updateSetting(
    key: string,
    value: unknown,
    category: SettingsCategory = 'general',
    options?: { label?: string; description?: string; isSecret?: boolean }
  ): Promise<ISettings> {
    return settingsRepository.upsert(key, value, category, options);
  }

  async bulkUpdate(
    settings: { key: string; value: unknown; category?: SettingsCategory }[]
  ): Promise<void> {
    for (const s of settings) {
      await settingsRepository.upsert(s.key, s.value, s.category || 'general');
    }
  }

  // === Redirect Methods ===
  async getAllRedirects(): Promise<IRedirect[]> {
    return redirectRepository.findAll();
  }

  async getActiveRedirects(): Promise<IRedirect[]> {
    return redirectRepository.findActive();
  }

  async getRedirectById(id: string): Promise<IRedirect | null> {
    return redirectRepository.findById(id);
  }

  async createRedirect(dto: CreateRedirectDto): Promise<IRedirect> {
    // Check for duplicate fromPath
    const existing = await redirectRepository.findByFromPath(dto.fromPath);
    if (existing) {
      throw new Error('Redirect with this path already exists');
    }

    return redirectRepository.create({
      fromPath: dto.fromPath,
      toPath: dto.toPath,
      statusCode: dto.statusCode || 301,
      isActive: dto.isActive ?? true,
      note: dto.note || undefined,
    });
  }

  async updateRedirect(id: string, dto: UpdateRedirectDto): Promise<IRedirect> {
    const redirect = await redirectRepository.findById(id);
    if (!redirect) {
      throw new Error('Redirect not found');
    }

    if (dto.fromPath && dto.fromPath !== redirect.fromPath) {
      const existing = await redirectRepository.findByFromPath(dto.fromPath);
      if (existing) {
        throw new Error('Redirect with this path already exists');
      }
    }

    const updated = await redirectRepository.update(id, {
      fromPath: dto.fromPath ?? redirect.fromPath,
      toPath: dto.toPath ?? redirect.toPath,
      statusCode: dto.statusCode ?? redirect.statusCode,
      isActive: dto.isActive ?? redirect.isActive,
      note: dto.note !== undefined ? dto.note : redirect.note,
    });

    if (!updated) {
      throw new Error('Failed to update redirect');
    }

    return updated;
  }

  async deleteRedirect(id: string): Promise<void> {
    const redirect = await redirectRepository.findById(id);
    if (!redirect) {
      throw new Error('Redirect not found');
    }

    const deleted = await redirectRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete redirect');
    }
  }

  async matchRedirect(path: string): Promise<IRedirect | null> {
    const redirect = await redirectRepository.findByFromPath(path);
    if (redirect && redirect.isActive) {
      await redirectRepository.incrementHitCount(redirect._id?.toString() || '');
      return redirect;
    }
    return null;
  }

  // === SEO Specific Methods ===
  async getRobotsTxt(): Promise<string> {
    const setting = await settingsRepository.findByKey('robotsTxt');
    return (setting?.value as string) || `User-agent: *\nAllow: /`;
  }

  async updateRobotsTxt(content: string): Promise<void> {
    await settingsRepository.upsert('robotsTxt', content, 'seo', {
      label: 'Robots.txt',
      description: 'Content of robots.txt file',
    });
  }

  async getSitemapConfig(): Promise<{ enabled: boolean; excludePatterns: string[] }> {
    const enabled = await settingsRepository.findByKey('sitemapEnabled');
    const patterns = await settingsRepository.findByKey('sitemapExcludePatterns');

    return {
      enabled: (enabled?.value as boolean) ?? true,
      excludePatterns: (patterns?.value as string[]) ?? [],
    };
  }

  async updateSitemapConfig(config: {
    enabled?: boolean;
    excludePatterns?: string[];
  }): Promise<void> {
    if (config.enabled !== undefined) {
      await settingsRepository.upsert('sitemapEnabled', config.enabled, 'seo');
    }
    if (config.excludePatterns !== undefined) {
      await settingsRepository.upsert('sitemapExcludePatterns', config.excludePatterns, 'seo');
    }
  }

  // Initialize default settings
  async initializeDefaults(): Promise<void> {
    const defaults: { key: string; value: unknown; category: SettingsCategory; label: string; isSecret?: boolean }[] = [
      // Site settings
      { key: 'siteName', value: 'ManagePost', category: 'site', label: 'Site Name' },
      { key: 'siteDescription', value: 'Content Management System', category: 'site', label: 'Site Description' },
      { key: 'siteLogo', value: null, category: 'site', label: 'Site Logo' },
      { key: 'siteFavicon', value: null, category: 'site', label: 'Site Favicon' },
      { key: 'siteLanguage', value: 'vi', category: 'site', label: 'Site Language' },
      { key: 'siteTimezone', value: 'Asia/Ho_Chi_Minh', category: 'site', label: 'Site Timezone' },

      // SEO settings
      { key: 'defaultMetaTitle', value: '', category: 'seo', label: 'Default Meta Title' },
      { key: 'defaultMetaDescription', value: '', category: 'seo', label: 'Default Meta Description' },
      { key: 'titleSeparator', value: ' | ', category: 'seo', label: 'Title Separator' },
      { key: 'robotsTxt', value: 'User-agent: *\nAllow: /', category: 'seo', label: 'Robots.txt' },
      { key: 'sitemapEnabled', value: true, category: 'seo', label: 'Sitemap Enabled' },
      { key: 'sitemapExcludePatterns', value: [], category: 'seo', label: 'Sitemap Exclude Patterns' },

      // API settings
      { key: 'googleAnalyticsId', value: null, category: 'api', label: 'Google Analytics ID', isSecret: true },
      { key: 'googleSearchConsoleId', value: null, category: 'api', label: 'Google Search Console ID', isSecret: true },
      { key: 'facebookPixelId', value: null, category: 'api', label: 'Facebook Pixel ID', isSecret: true },

      // Email settings
      { key: 'smtpHost', value: '', category: 'email', label: 'SMTP Host' },
      { key: 'smtpPort', value: 587, category: 'email', label: 'SMTP Port' },
      { key: 'smtpUser', value: '', category: 'email', label: 'SMTP User' },
      { key: 'smtpPassword', value: '', category: 'email', label: 'SMTP Password', isSecret: true },
      { key: 'smtpSecure', value: false, category: 'email', label: 'SMTP Secure' },
      { key: 'emailFromAddress', value: '', category: 'email', label: 'From Email Address' },
      { key: 'emailFromName', value: '', category: 'email', label: 'From Name' },
    ];

    for (const d of defaults) {
      const existing = await settingsRepository.findByKey(d.key);
      if (!existing) {
        await settingsRepository.upsert(d.key, d.value, d.category, {
          label: d.label,
          isSecret: d.isSecret,
        });
      }
    }
  }
}
