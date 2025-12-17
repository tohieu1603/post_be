import { SettingsCategory } from '../models/settings.model';
import { RedirectStatus } from '../models/redirect.model';

export { SettingsCategory, RedirectStatus };

export interface UpdateSettingDto {
  value: unknown;
}

export interface BulkUpdateSettingsDto {
  settings: { key: string; value: unknown }[];
}

export interface CreateRedirectDto {
  fromPath: string;
  toPath: string;
  statusCode?: RedirectStatus;
  isActive?: boolean;
  note?: string;
}

export interface UpdateRedirectDto {
  fromPath?: string;
  toPath?: string;
  statusCode?: RedirectStatus;
  isActive?: boolean;
  note?: string;
}

// Default settings structure
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string | null;
  favicon: string | null;
  language: string;
  timezone: string;
}

export interface SeoSettings {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  titleSeparator: string;
  schemaOrganization: {
    name: string;
    logo: string | null;
    url: string | null;
  };
  robotsTxt: string;
  sitemapEnabled: boolean;
  sitemapExcludePatterns: string[];
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
}

export interface ApiSettings {
  googleAnalyticsId: string | null;
  googleSearchConsoleId: string | null;
  facebookPixelId: string | null;
}
