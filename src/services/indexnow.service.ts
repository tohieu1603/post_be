/**
 * IndexNow Service
 * Submits URLs to IndexNow API for fast indexing across Bing, Yandex, and other engines
 */

class IndexNowService {
  private apiKey: string | null;

  constructor() {
    this.apiKey = process.env.INDEXNOW_API_KEY || null;
  }

  /**
   * Submit a single URL to IndexNow
   */
  async submitUrl(url: string): Promise<{ success: boolean; error?: string }> {
    return this.submitUrls([url]);
  }

  /**
   * Submit multiple URLs to IndexNow
   */
  async submitUrls(urls: string[]): Promise<{ success: boolean; error?: string }> {
    if (!this.apiKey) {
      console.warn('IndexNow: INDEXNOW_API_KEY not configured — skipping submission');
      return { success: false, error: 'IndexNow not configured' };
    }

    if (!urls || urls.length === 0) {
      return { success: false, error: 'No URLs provided' };
    }

    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const host = new URL(siteUrl).host;
    const keyLocation = `${siteUrl}/${this.apiKey}.txt`;

    // Normalize URLs to absolute
    const urlList = urls.map((u) => (u.startsWith('http') ? u : `${siteUrl}${u}`));

    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          host,
          key: this.apiKey,
          keyLocation,
          urlList,
        }),
      });

      // IndexNow returns 200 or 202 on success
      if (response.ok || response.status === 202) {
        return { success: true };
      }

      const text = await response.text().catch(() => '');
      return {
        success: false,
        error: `IndexNow API returned ${response.status}: ${text}`,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'IndexNow request failed';
      console.error('IndexNow submission error:', message);
      return { success: false, error: message };
    }
  }
}

export const indexNowService = new IndexNowService();
