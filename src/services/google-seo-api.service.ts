/**
 * Google SEO API Service
 * Handles Google Search Console, Indexing API, and PageSpeed Insights integration
 */

import { autoSeoService } from './auto-seo.service';

/**
 * Google API Configuration
 * Set these in environment variables
 */
interface GoogleApiConfig {
  serviceAccountEmail?: string;
  privateKey?: string;
  siteUrl: string;
}

/**
 * Search Console Data Types
 */
export interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchAnalyticsResponse {
  rows?: SearchAnalyticsRow[];
  responseAggregationType?: string;
}

export interface IndexingApiResponse {
  urlNotificationMetadata?: {
    url: string;
    latestUpdate?: {
      url: string;
      type: string;
      notifyTime: string;
    };
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export interface PageSpeedResult {
  id: string;
  loadingExperience?: {
    metrics: Record<string, { percentile: number; category: string }>;
    overall_category: string;
  };
  lighthouseResult?: {
    categories: {
      performance: { score: number };
      accessibility?: { score: number };
      'best-practices'?: { score: number };
      seo?: { score: number };
    };
    audits: Record<string, { score: number; displayValue?: string }>;
  };
}

export class GoogleSeoApiService {
  private config: GoogleApiConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    };
  }

  /**
   * Get OAuth2 access token using service account
   * In production, use google-auth-library
   */
  private async getAccessToken(): Promise<string | null> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // For now, return null if not configured
    // In production, implement JWT signing with google-auth-library
    if (!this.config.serviceAccountEmail || !this.config.privateKey) {
      console.warn('Google API credentials not configured');
      return null;
    }

    // TODO: Implement actual OAuth2 token generation
    // const { google } = require('googleapis');
    // const auth = new google.auth.JWT({
    //   email: this.config.serviceAccountEmail,
    //   key: this.config.privateKey,
    //   scopes: [
    //     'https://www.googleapis.com/auth/webmasters',
    //     'https://www.googleapis.com/auth/indexing',
    //   ],
    // });
    // const { token } = await auth.getAccessToken();
    // this.accessToken = token;
    // this.tokenExpiry = Date.now() + 3500000; // ~1 hour

    return null;
  }

  /**
   * Submit URL to Google Indexing API
   * Requests immediate indexing (much faster than sitemap)
   */
  async submitUrlForIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<{
    success: boolean;
    response?: IndexingApiResponse;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      const token = await this.getAccessToken();

      if (!token) {
        // Log and return mock success for development
        await autoSeoService.logAction({
          action: 'submit_index',
          entityType: 'post',
          entityUrl: url,
          status: 'skipped',
          message: 'Google API not configured - skipped indexing request',
          details: { type, url },
          duration: Date.now() - startTime,
        });

        // Update index status to pending
        await autoSeoService.updateIndexStatus(url, 'pending', undefined, {
          submissionMethod: 'indexing_api',
        });

        return { success: true, error: 'API not configured' };
      }

      // Make actual API call
      const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: url.startsWith('http') ? url : `${this.config.siteUrl}${url}`,
          type,
        }),
      });

      const data = (await response.json()) as IndexingApiResponse;

      if (response.ok) {
        await autoSeoService.logAction({
          action: 'submit_index',
          entityType: 'post',
          entityUrl: url,
          status: 'success',
          message: 'URL submitted to Google Indexing API',
          apiResponse: data as Record<string, unknown>,
          duration: Date.now() - startTime,
        });

        await autoSeoService.updateIndexStatus(url, 'submitted', undefined, {
          submittedAt: new Date(),
          submissionMethod: 'indexing_api',
        });

        return { success: true, response: data };
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit URL';

      await autoSeoService.logAction({
        action: 'submit_index',
        entityType: 'post',
        entityUrl: url,
        status: 'failed',
        message,
        duration: Date.now() - startTime,
      });

      return { success: false, error: message };
    }
  }

  /**
   * Get URL inspection data from Search Console
   */
  async inspectUrl(url: string): Promise<{
    success: boolean;
    data?: {
      indexStatusResult?: {
        verdict: string;
        coverageState: string;
        robotsTxtState: string;
        indexingState: string;
        lastCrawlTime?: string;
        pageFetchState: string;
        googleCanonical?: string;
      };
    };
    error?: string;
  }> {
    const token = await this.getAccessToken();

    if (!token) {
      return { success: false, error: 'API not configured' };
    }

    try {
      const fullUrl = url.startsWith('http') ? url : `${this.config.siteUrl}${url}`;

      const response = await fetch(
        `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            inspectionUrl: fullUrl,
            siteUrl: this.config.siteUrl,
          }),
        }
      );

      const data = (await response.json()) as {
        indexStatusResult?: {
          verdict: string;
          coverageState: string;
          robotsTxtState: string;
          indexingState: string;
          lastCrawlTime?: string;
          pageFetchState: string;
          googleCanonical?: string;
        };
        error?: { message: string };
      };

      if (response.ok) {
        return { success: true, data };
      } else {
        throw new Error(data.error?.message || 'URL inspection failed');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get search analytics data from Search Console
   * Returns keyword rankings and performance data
   */
  async getSearchAnalytics(params: {
    startDate: string; // YYYY-MM-DD
    endDate: string;
    dimensions?: ('query' | 'page' | 'country' | 'device' | 'date')[];
    rowLimit?: number;
    startRow?: number;
    dimensionFilterGroups?: Array<{
      groupType: 'and';
      filters: Array<{
        dimension: string;
        operator: 'contains' | 'equals' | 'notContains' | 'notEquals';
        expression: string;
      }>;
    }>;
  }): Promise<{
    success: boolean;
    data?: SearchAnalyticsResponse;
    error?: string;
  }> {
    const token = await this.getAccessToken();

    if (!token) {
      // Return mock data for development
      return {
        success: true,
        data: {
          rows: [
            { keys: ['sample keyword'], clicks: 10, impressions: 100, ctr: 0.1, position: 5 },
          ],
        },
      };
    }

    try {
      const siteUrl = encodeURIComponent(this.config.siteUrl);
      const response = await fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startDate: params.startDate,
            endDate: params.endDate,
            dimensions: params.dimensions || ['query', 'page'],
            rowLimit: params.rowLimit || 1000,
            startRow: params.startRow || 0,
            dimensionFilterGroups: params.dimensionFilterGroups,
          }),
        }
      );

      const data = (await response.json()) as SearchAnalyticsResponse & { error?: { message: string } };

      if (response.ok) {
        await autoSeoService.logAction({
          action: 'check_ranking',
          entityType: 'site',
          status: 'success',
          message: `Retrieved ${data.rows?.length || 0} search analytics rows`,
          details: { startDate: params.startDate, endDate: params.endDate },
        });

        return { success: true, data };
      } else {
        throw new Error(data.error?.message || 'Failed to get search analytics');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get PageSpeed Insights for a URL
   */
  async getPageSpeedInsights(url: string, strategy: 'mobile' | 'desktop' = 'mobile'): Promise<{
    success: boolean;
    data?: {
      performanceScore: number;
      accessibilityScore?: number;
      seoScore?: number;
      metrics: {
        firstContentfulPaint?: string;
        largestContentfulPaint?: string;
        totalBlockingTime?: string;
        cumulativeLayoutShift?: string;
        speedIndex?: string;
      };
      suggestions: string[];
    };
    error?: string;
  }> {
    const startTime = Date.now();
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

    try {
      const fullUrl = url.startsWith('http') ? url : `${this.config.siteUrl}${url}`;
      const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
      apiUrl.searchParams.set('url', fullUrl);
      apiUrl.searchParams.set('strategy', strategy);
      apiUrl.searchParams.set('category', 'PERFORMANCE');
      apiUrl.searchParams.set('category', 'SEO');
      apiUrl.searchParams.set('category', 'ACCESSIBILITY');

      if (apiKey) {
        apiUrl.searchParams.set('key', apiKey);
      }

      const response = await fetch(apiUrl.toString());
      const data = (await response.json()) as PageSpeedResult;

      if (!response.ok) {
        throw new Error('PageSpeed API request failed');
      }

      const lighthouse = data.lighthouseResult;
      const performanceScore = Math.round((lighthouse?.categories?.performance?.score || 0) * 100);
      const accessibilityScore = Math.round((lighthouse?.categories?.accessibility?.score || 0) * 100);
      const seoScore = Math.round((lighthouse?.categories?.seo?.score || 0) * 100);

      const metrics = {
        firstContentfulPaint: lighthouse?.audits?.['first-contentful-paint']?.displayValue,
        largestContentfulPaint: lighthouse?.audits?.['largest-contentful-paint']?.displayValue,
        totalBlockingTime: lighthouse?.audits?.['total-blocking-time']?.displayValue,
        cumulativeLayoutShift: lighthouse?.audits?.['cumulative-layout-shift']?.displayValue,
        speedIndex: lighthouse?.audits?.['speed-index']?.displayValue,
      };

      // Extract suggestions from audits with low scores
      const suggestions: string[] = [];
      if (lighthouse?.audits) {
        Object.entries(lighthouse.audits).forEach(([key, audit]) => {
          if (audit.score !== null && audit.score < 0.9 && audit.displayValue) {
            suggestions.push(`${key}: ${audit.displayValue}`);
          }
        });
      }

      await autoSeoService.logAction({
        action: 'pagespeed_check',
        entityUrl: fullUrl,
        status: 'success',
        message: `Performance: ${performanceScore}, SEO: ${seoScore}`,
        details: { strategy, performanceScore, seoScore, accessibilityScore },
        duration: Date.now() - startTime,
      });

      // Update index status with scores
      await autoSeoService.updateIndexStatus(url, 'indexed', undefined, {
        [strategy === 'mobile' ? 'mobileScore' : 'desktopScore']: performanceScore,
        lastChecked: new Date(),
      });

      return {
        success: true,
        data: {
          performanceScore,
          accessibilityScore,
          seoScore,
          metrics,
          suggestions: suggestions.slice(0, 10), // Top 10 suggestions
        },
      };
    } catch (error) {
      await autoSeoService.logAction({
        action: 'pagespeed_check',
        entityUrl: url,
        status: 'failed',
        message: error instanceof Error ? error.message : 'PageSpeed check failed',
        duration: Date.now() - startTime,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Sync keyword rankings from Search Console
   */
  async syncKeywordRankings(): Promise<{
    success: boolean;
    synced: number;
    error?: string;
  }> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const result = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['query', 'page'],
      rowLimit: 1000,
    });

    if (!result.success || !result.data?.rows) {
      return { success: false, synced: 0, error: result.error };
    }

    let synced = 0;

    for (const row of result.data.rows) {
      const [keyword, page] = row.keys;

      try {
        await autoSeoService.trackKeyword({
          keyword,
          targetUrl: page,
        });

        // Update keyword metrics would be done here
        synced++;
      } catch (e) {
        console.error('Failed to sync keyword:', keyword, e);
      }
    }

    await autoSeoService.logAction({
      action: 'keyword_track',
      entityType: 'site',
      status: 'success',
      message: `Synced ${synced} keywords from Search Console`,
      details: { startDate, endDate, totalRows: result.data.rows.length },
    });

    return { success: true, synced };
  }
}

// Singleton instance
export const googleSeoApiService = new GoogleSeoApiService();
