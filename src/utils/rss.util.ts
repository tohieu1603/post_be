/**
 * RSS 2.0 XML Generator Utility
 */

import { escapeXml } from './sitemap.util';

export interface RssItem {
  title: string;
  link: string;
  description: string;
  author?: string;
  category?: string;
  pubDate: Date;
  guid: string;
}

export interface RssConfig {
  siteUrl: string;
  siteName: string;
  description: string;
  language: string;
}

/**
 * Generate valid RSS 2.0 XML
 */
export function generateRssXml(items: RssItem[], config: RssConfig): string {
  const { siteUrl, siteName, description, language } = config;
  const feedUrl = `${siteUrl}/rss.xml`;
  const now = new Date().toUTCString();

  const itemsXml = items.map((item) => {
    const link = item.link.startsWith('http') ? item.link : `${siteUrl}${item.link}`;
    const guid = item.guid.startsWith('http') ? item.guid : `${siteUrl}${item.guid}`;

    let xml = `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(guid)}</guid>`;

    if (item.author) {
      xml += `\n      <author>${escapeXml(item.author)}</author>`;
    }

    if (item.category) {
      xml += `\n      <category>${escapeXml(item.category)}</category>`;
    }

    xml += '\n    </item>';
    return xml;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
${itemsXml.join('\n')}
  </channel>
</rss>`;
}
