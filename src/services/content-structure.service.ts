/**
 * Content Structure Service
 * Parse HTML content to structured data and vice versa
 */

import { v4 as uuidv4 } from 'uuid';
import {
  ContentSection,
  TocItem,
  ImageBlock,
  FaqItem,
  ReviewBlock,
  TableBlock,
  ListBlock,
} from '../models/post.model';

// Local interface for this service (legacy HTML parsing)
interface LegacyContentStructure {
  summary?: string;
  toc: TocItem[];
  sections: ContentSection[];
  wordCount?: number;
  estimatedReadTime?: number;
  lastStructureUpdate?: string;
}

// Simple HTML tag regex patterns
const HEADING_REGEX = /<h([1-6])(?:\s+id="([^"]*)")?[^>]*>([\s\S]*?)<\/h\1>/gi;
const PARAGRAPH_REGEX = /<p[^>]*>([\s\S]*?)<\/p>/gi;
const IMAGE_REGEX = /<img[^>]+src="([^"]*)"[^>]*(?:alt="([^"]*)")?[^>]*(?:width="(\d+)")?[^>]*(?:height="(\d+)")?[^>]*\/?>/gi;
const FIGURE_REGEX = /<figure[^>]*>[\s\S]*?<img[^>]+src="([^"]*)"[^>]*(?:alt="([^"]*)")?[^>]*\/?>\s*(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/gi;
const BLOCKQUOTE_REGEX = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
const UL_REGEX = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
const OL_REGEX = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
const LI_REGEX = /<li[^>]*>([\s\S]*?)<\/li>/gi;
const TABLE_REGEX = /<table[^>]*>([\s\S]*?)<\/table>/gi;
const TR_REGEX = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
const TH_REGEX = /<th[^>]*>([\s\S]*?)<\/th>/gi;
const TD_REGEX = /<td[^>]*>([\s\S]*?)<\/td>/gi;
const PRE_CODE_REGEX = /<pre[^>]*>\s*<code(?:\s+class="language-(\w+)")?[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi;

// FAQ detection patterns
const FAQ_SECTION_REGEX = /<div[^>]*class="[^"]*faq[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
const FAQ_ITEM_REGEX = /<(?:dt|strong|b)[^>]*>([\s\S]*?)<\/(?:dt|strong|b)>\s*<(?:dd|p)[^>]*>([\s\S]*?)<\/(?:dd|p)>/gi;

// Review detection patterns
const REVIEW_REGEX = /<div[^>]*class="[^"]*review[^"]*"[^>]*data-provider="([^"]*)"[^>]*data-rating="([^"]*)"[^>]*>([\s\S]*?)<\/div>/gi;
const PROS_REGEX = /<(?:ul|div)[^>]*class="[^"]*pros[^"]*"[^>]*>([\s\S]*?)<\/(?:ul|div)>/gi;
const CONS_REGEX = /<(?:ul|div)[^>]*class="[^"]*cons[^"]*"[^>]*>([\s\S]*?)<\/(?:ul|div)>/gi;

/**
 * Strip HTML tags from string
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generate anchor from text
 */
function generateAnchor(text: string): string {
  return stripHtml(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  const stripped = stripHtml(text);
  const words = stripped.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * Extract list items from HTML
 */
function extractListItems(listHtml: string): string[] {
  const items: string[] = [];
  let match;
  const regex = new RegExp(LI_REGEX.source, 'gi');
  while ((match = regex.exec(listHtml)) !== null) {
    items.push(stripHtml(match[1]));
  }
  return items;
}

/**
 * Extract table data from HTML
 */
function extractTable(tableHtml: string): TableBlock {
  const headers: string[] = [];
  const rows: string[][] = [];

  let trMatch;
  const trRegex = new RegExp(TR_REGEX.source, 'gi');
  let isFirstRow = true;

  while ((trMatch = trRegex.exec(tableHtml)) !== null) {
    const rowHtml = trMatch[1];
    const cells: string[] = [];

    // Check for headers first
    let thMatch;
    const thRegex = new RegExp(TH_REGEX.source, 'gi');
    while ((thMatch = thRegex.exec(rowHtml)) !== null) {
      headers.push(stripHtml(thMatch[1]));
    }

    // If no headers found, extract td cells
    if (headers.length === 0 || !isFirstRow) {
      let tdMatch;
      const tdRegex = new RegExp(TD_REGEX.source, 'gi');
      while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
        cells.push(stripHtml(tdMatch[1]));
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }

    isFirstRow = false;
  }

  return { headers, rows };
}

/**
 * Parse HTML content to LegacyContentStructure
 */
export function parseHtmlToStructure(html: string): LegacyContentStructure {
  const sections: ContentSection[] = [];
  const toc: TocItem[] = [];
  let order = 0;

  // Track processed positions to avoid duplicates
  const processedRanges: Array<{ start: number; end: number }> = [];

  function isProcessed(start: number, end: number): boolean {
    return processedRanges.some(r =>
      (start >= r.start && start < r.end) || (end > r.start && end <= r.end)
    );
  }

  function markProcessed(start: number, end: number) {
    processedRanges.push({ start, end });
  }

  // 1. Extract code blocks first (to avoid parsing their content)
  let codeMatch;
  const codeRegex = new RegExp(PRE_CODE_REGEX.source, 'gi');
  while ((codeMatch = codeRegex.exec(html)) !== null) {
    if (isProcessed(codeMatch.index, codeMatch.index + codeMatch[0].length)) continue;
    markProcessed(codeMatch.index, codeMatch.index + codeMatch[0].length);

    sections.push({
      id: uuidv4(),
      type: 'code',
      order: order++,
      content: codeMatch[2],
      language: codeMatch[1] || 'text',
    });
  }

  // 2. Extract figures/images
  let figMatch;
  const figRegex = new RegExp(FIGURE_REGEX.source, 'gi');
  while ((figMatch = figRegex.exec(html)) !== null) {
    if (isProcessed(figMatch.index, figMatch.index + figMatch[0].length)) continue;
    markProcessed(figMatch.index, figMatch.index + figMatch[0].length);

    sections.push({
      id: uuidv4(),
      type: 'image',
      order: order++,
      image: {
        url: figMatch[1],
        alt: figMatch[2] || '',
        caption: figMatch[3] ? stripHtml(figMatch[3]) : undefined,
      },
    });
  }

  // 3. Extract standalone images
  let imgMatch;
  const imgRegex = new RegExp(IMAGE_REGEX.source, 'gi');
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    if (isProcessed(imgMatch.index, imgMatch.index + imgMatch[0].length)) continue;
    markProcessed(imgMatch.index, imgMatch.index + imgMatch[0].length);

    sections.push({
      id: uuidv4(),
      type: 'image',
      order: order++,
      image: {
        url: imgMatch[1],
        alt: imgMatch[2] || '',
        width: imgMatch[3] ? parseInt(imgMatch[3]) : undefined,
        height: imgMatch[4] ? parseInt(imgMatch[4]) : undefined,
      },
    });
  }

  // 4. Extract tables
  let tableMatch;
  const tableRegex = new RegExp(TABLE_REGEX.source, 'gi');
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    if (isProcessed(tableMatch.index, tableMatch.index + tableMatch[0].length)) continue;
    markProcessed(tableMatch.index, tableMatch.index + tableMatch[0].length);

    sections.push({
      id: uuidv4(),
      type: 'table',
      order: order++,
      table: extractTable(tableMatch[1]),
    });
  }

  // 5. Extract unordered lists
  let ulMatch;
  const ulRegex = new RegExp(UL_REGEX.source, 'gi');
  while ((ulMatch = ulRegex.exec(html)) !== null) {
    if (isProcessed(ulMatch.index, ulMatch.index + ulMatch[0].length)) continue;
    markProcessed(ulMatch.index, ulMatch.index + ulMatch[0].length);

    sections.push({
      id: uuidv4(),
      type: 'list',
      order: order++,
      list: {
        type: 'unordered',
        items: extractListItems(ulMatch[1]),
      },
    });
  }

  // 6. Extract ordered lists
  let olMatch;
  const olRegex = new RegExp(OL_REGEX.source, 'gi');
  while ((olMatch = olRegex.exec(html)) !== null) {
    if (isProcessed(olMatch.index, olMatch.index + olMatch[0].length)) continue;
    markProcessed(olMatch.index, olMatch.index + olMatch[0].length);

    sections.push({
      id: uuidv4(),
      type: 'list',
      order: order++,
      list: {
        type: 'ordered',
        items: extractListItems(olMatch[1]),
      },
    });
  }

  // 7. Extract blockquotes
  let quoteMatch;
  const quoteRegex = new RegExp(BLOCKQUOTE_REGEX.source, 'gi');
  while ((quoteMatch = quoteRegex.exec(html)) !== null) {
    if (isProcessed(quoteMatch.index, quoteMatch.index + quoteMatch[0].length)) continue;
    markProcessed(quoteMatch.index, quoteMatch.index + quoteMatch[0].length);

    sections.push({
      id: uuidv4(),
      type: 'quote',
      order: order++,
      content: stripHtml(quoteMatch[1]),
    });
  }

  // 8. Extract headings and build TOC
  let headingMatch;
  const headingRegex = new RegExp(HEADING_REGEX.source, 'gi');
  while ((headingMatch = headingRegex.exec(html)) !== null) {
    if (isProcessed(headingMatch.index, headingMatch.index + headingMatch[0].length)) continue;
    markProcessed(headingMatch.index, headingMatch.index + headingMatch[0].length);

    const level = parseInt(headingMatch[1]);
    const text = stripHtml(headingMatch[3]);
    const anchor = headingMatch[2] || generateAnchor(text);
    const id = uuidv4();

    sections.push({
      id,
      type: 'heading',
      order: order++,
      level,
      text,
      anchor,
    });

    // Add to TOC (only H2-H6)
    if (level >= 2 && level <= 6) {
      toc.push({
        id,
        text,
        level,
        anchor,
      });
    }
  }

  // 9. Extract paragraphs
  let pMatch;
  const pRegex = new RegExp(PARAGRAPH_REGEX.source, 'gi');
  while ((pMatch = pRegex.exec(html)) !== null) {
    if (isProcessed(pMatch.index, pMatch.index + pMatch[0].length)) continue;

    const content = pMatch[1].trim();
    if (content && !content.startsWith('<')) {
      markProcessed(pMatch.index, pMatch.index + pMatch[0].length);
      sections.push({
        id: uuidv4(),
        type: 'paragraph',
        order: order++,
        content: stripHtml(content),
      });
    }
  }

  // Sort sections by their original order in HTML (based on their index)
  // We need to re-process to get correct order
  sections.sort((a, b) => a.order - b.order);

  // Recalculate order
  sections.forEach((s, i) => { s.order = i; });

  // Calculate word count
  const wordCount = sections.reduce((total, section) => {
    if (section.content) return total + countWords(section.content);
    if (section.text) return total + countWords(section.text);
    if (section.list) return total + section.list.items.reduce((t, i) => t + countWords(i), 0);
    if (section.faqs) return total + section.faqs.reduce((t, f) => t + countWords(f.question) + countWords(f.answer), 0);
    return total;
  }, 0);

  // Estimate reading time (average 200 words per minute for Vietnamese)
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    toc,
    sections,
    wordCount,
    estimatedReadTime,
    lastStructureUpdate: new Date().toISOString(),
  };
}

/**
 * Convert LegacyContentStructure back to HTML
 */
export function structureToHtml(structure: LegacyContentStructure): string {
  if (!structure || !structure.sections) return '';

  const sortedSections = [...structure.sections].sort((a, b) => a.order - b.order);

  return sortedSections.map(section => {
    switch (section.type) {
      case 'heading':
        const anchor = section.anchor ? ` id="${section.anchor}"` : '';
        return `<h${section.level}${anchor}>${section.text}</h${section.level}>`;

      case 'paragraph':
        return `<p>${section.content}</p>`;

      case 'image':
        if (!section.image) return '';
        const { url, alt, caption, width, height } = section.image;
        const imgAttrs = [
          `src="${url}"`,
          `alt="${alt || ''}"`,
          width ? `width="${width}"` : '',
          height ? `height="${height}"` : '',
        ].filter(Boolean).join(' ');

        if (caption) {
          return `<figure><img ${imgAttrs} /><figcaption>${caption}</figcaption></figure>`;
        }
        return `<img ${imgAttrs} />`;

      case 'quote':
        return `<blockquote>${section.content}</blockquote>`;

      case 'code':
        const langClass = section.language ? ` class="language-${section.language}"` : '';
        return `<pre><code${langClass}>${section.content}</code></pre>`;

      case 'list':
        if (!section.list) return '';
        const tag = section.list.type === 'ordered' ? 'ol' : 'ul';
        const items = section.list.items.map(i => `<li>${i}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;

      case 'table':
        if (!section.table) return '';
        const { headers, rows } = section.table;
        let tableHtml = '<table>';
        if (headers.length > 0) {
          tableHtml += '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
        }
        tableHtml += '<tbody>' + rows.map(row => '<tr>' + row.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody>';
        tableHtml += '</table>';
        return tableHtml;

      case 'faq':
        if (!section.faqs || section.faqs.length === 0) return '';
        return `<div class="faq-section">${section.faqs.map(faq =>
          `<div class="faq-item"><dt>${faq.question}</dt><dd>${faq.answer}</dd></div>`
        ).join('')}</div>`;

      case 'review':
        if (!section.review) return '';
        const { provider, rating, summary, pros, cons } = section.review;
        return `<div class="review-block" data-provider="${provider}" data-rating="${rating}">
          <h4>${provider} - ${rating}/5</h4>
          ${summary ? `<p>${summary}</p>` : ''}
          ${pros.length > 0 ? `<div class="pros"><strong>Ưu điểm:</strong><ul>${pros.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
          ${cons.length > 0 ? `<div class="cons"><strong>Nhược điểm:</strong><ul>${cons.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
        </div>`;

      case 'html':
        return section.content || '';

      default:
        return '';
    }
  }).join('\n\n');
}

/**
 * Generate Table of Contents HTML
 */
export function generateTocHtml(toc: TocItem[]): string {
  if (!toc || toc.length === 0) return '';

  return `<nav class="table-of-contents">
    <h2>Mục lục</h2>
    <ul>
      ${toc.map(item => `<li class="toc-level-${item.level}"><a href="#${item.anchor}">${item.text}</a></li>`).join('')}
    </ul>
  </nav>`;
}

/**
 * Add or update a section in the structure
 */
export function addSection(
  structure: LegacyContentStructure,
  section: Omit<ContentSection, 'id' | 'order'>,
  afterSectionId?: string
): LegacyContentStructure {
  const newSection: ContentSection = {
    ...section,
    id: uuidv4(),
    order: structure.sections.length,
  };

  let sections = [...structure.sections];

  if (afterSectionId) {
    const index = sections.findIndex(s => s.id === afterSectionId);
    if (index !== -1) {
      sections.splice(index + 1, 0, newSection);
    } else {
      sections.push(newSection);
    }
  } else {
    sections.push(newSection);
  }

  // Recalculate orders
  sections.forEach((s, i) => { s.order = i; });

  // Rebuild TOC
  const toc = buildTocFromSections(sections);

  return {
    ...structure,
    sections,
    toc,
    lastStructureUpdate: new Date().toISOString(),
  };
}

/**
 * Remove a section from the structure
 */
export function removeSection(structure: LegacyContentStructure, sectionId: string): LegacyContentStructure {
  const sections = structure.sections.filter(s => s.id !== sectionId);
  sections.forEach((s, i) => { s.order = i; });

  const toc = buildTocFromSections(sections);

  return {
    ...structure,
    sections,
    toc,
    lastStructureUpdate: new Date().toISOString(),
  };
}

/**
 * Update a section in the structure
 */
export function updateSection(
  structure: LegacyContentStructure,
  sectionId: string,
  updates: Partial<ContentSection>
): LegacyContentStructure {
  const sections = structure.sections.map(s =>
    s.id === sectionId ? { ...s, ...updates } : s
  );

  const toc = buildTocFromSections(sections);

  return {
    ...structure,
    sections,
    toc,
    lastStructureUpdate: new Date().toISOString(),
  };
}

/**
 * Reorder sections
 */
export function reorderSections(structure: LegacyContentStructure, sectionIds: string[]): LegacyContentStructure {
  const sectionMap = new Map(structure.sections.map(s => [s.id, s]));
  const sections = sectionIds
    .map(id => sectionMap.get(id))
    .filter((s): s is ContentSection => s !== undefined);

  sections.forEach((s, i) => { s.order = i; });

  const toc = buildTocFromSections(sections);

  return {
    ...structure,
    sections,
    toc,
    lastStructureUpdate: new Date().toISOString(),
  };
}

/**
 * Build TOC from sections
 */
function buildTocFromSections(sections: ContentSection[]): TocItem[] {
  return sections
    .filter(s => s.type === 'heading' && s.level && s.level >= 2 && s.level <= 6)
    .map(s => ({
      id: s.id,
      text: s.text || '',
      level: s.level!,
      anchor: s.anchor || generateAnchor(s.text || ''),
    }));
}

/**
 * Create empty structure
 */
export function createEmptyStructure(): LegacyContentStructure {
  return {
    toc: [],
    sections: [],
    wordCount: 0,
    estimatedReadTime: 0,
    lastStructureUpdate: new Date().toISOString(),
  };
}

export const contentStructureService = {
  parseHtmlToStructure,
  structureToHtml,
  generateTocHtml,
  addSection,
  removeSection,
  updateSection,
  reorderSections,
  createEmptyStructure,
};
