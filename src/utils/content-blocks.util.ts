/**
 * Content Blocks Utility - Block-based JSON content (Notion-style)
 * Converts markdown to structured blocks and vice versa
 */

// Block types
export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'list'
  | 'code'
  | 'quote'
  | 'divider'
  | 'table'
  | 'faq'
  | 'media-text';

// Base block interface
export interface BaseBlock {
  id: string;
  type: BlockType;
}

// Heading block (h1-h6)
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 2 | 3 | 4 | 5 | 6;
  text: string;
  anchor: string;
}

// Paragraph block
export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
}

// Image block
export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

// List block
export interface ListBlock extends BaseBlock {
  type: 'list';
  style: 'ordered' | 'unordered';
  items: string[];
}

// Code block
export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  code: string;
}

// Quote block
export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
}

// Divider block
export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

// Table block
export interface TableBlock extends BaseBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

// FAQ block
export interface FaqBlock extends BaseBlock {
  type: 'faq';
  question: string;
  answer: string;
}

// Media-Text block (image + text side by side)
export interface MediaTextBlock extends BaseBlock {
  type: 'media-text';
  // Image settings
  imageUrl: string;
  imageAlt?: string;
  imageCaption?: string;
  imageLink?: string;
  // Text content
  title?: string;
  text: string;
  // Layout settings
  mediaPosition: 'left' | 'right'; // Image on left or right
  mediaWidth?: number; // Percentage: 30, 40, 50 (default 50)
  verticalAlign?: 'top' | 'center' | 'bottom'; // Vertical alignment
  // Style options
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}

// Union type for all blocks
export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ListBlock
  | CodeBlock
  | QuoteBlock
  | DividerBlock
  | TableBlock
  | FaqBlock
  | MediaTextBlock;

// Generate unique ID for blocks
function generateBlockId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Generate anchor from text (slugify)
function generateAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert markdown content to content blocks
 */
export function markdownToBlocks(markdown: string): ContentBlock[] {
  if (!markdown || !markdown.trim()) return [];

  const blocks: ContentBlock[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      i++;
      continue;
    }

    // Heading (## to ######)
    const headingMatch = trimmedLine.match(/^(#{2,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 2 | 3 | 4 | 5 | 6;
      const text = headingMatch[2].trim();
      blocks.push({
        id: generateBlockId(),
        type: 'heading',
        level,
        text,
        anchor: generateAnchor(text),
      });
      i++;
      continue;
    }

    // Code block (```)
    if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        id: generateBlockId(),
        type: 'code',
        language,
        code: codeLines.join('\n'),
      });
      i++; // Skip closing ```
      continue;
    }

    // Image ![alt](url)
    const imageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\s*(.*))?$/);
    if (imageMatch) {
      blocks.push({
        id: generateBlockId(),
        type: 'image',
        alt: imageMatch[1] || '',
        url: imageMatch[2],
        caption: imageMatch[3] || undefined,
      });
      i++;
      continue;
    }

    // Divider (---, ***, ___)
    if (/^[-*_]{3,}$/.test(trimmedLine)) {
      blocks.push({
        id: generateBlockId(),
        type: 'divider',
      });
      i++;
      continue;
    }

    // Quote (>)
    if (trimmedLine.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      blocks.push({
        id: generateBlockId(),
        type: 'quote',
        text: quoteLines.join('\n'),
      });
      continue;
    }

    // Unordered list (- or *)
    if (/^[-*]\s+/.test(trimmedLine)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({
        id: generateBlockId(),
        type: 'list',
        style: 'unordered',
        items,
      });
      continue;
    }

    // Ordered list (1. 2. etc)
    if (/^\d+\.\s+/.test(trimmedLine)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({
        id: generateBlockId(),
        type: 'list',
        style: 'ordered',
        items,
      });
      continue;
    }

    // Table (|...|)
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (row: string) =>
          row.split('|').slice(1, -1).map(cell => cell.trim());

        const headers = parseRow(tableLines[0]);
        const rows = tableLines.slice(2).map(parseRow); // Skip separator row

        blocks.push({
          id: generateBlockId(),
          type: 'table',
          headers,
          rows,
        });
      }
      continue;
    }

    // Default: Paragraph
    const paragraphLines: string[] = [trimmedLine];
    i++;
    // Collect consecutive non-empty, non-special lines
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*_]{3,}$/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^!\[/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    blocks.push({
      id: generateBlockId(),
      type: 'paragraph',
      text: paragraphLines.join(' '),
    });
  }

  return blocks;
}

/**
 * Convert content blocks back to markdown
 */
export function blocksToMarkdown(blocks: ContentBlock[]): string {
  if (!blocks || blocks.length === 0) return '';

  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return `${'#'.repeat(block.level)} ${block.text}`;

      case 'paragraph':
        return block.text;

      case 'image':
        return `![${block.alt}](${block.url})${block.caption ? ` ${block.caption}` : ''}`;

      case 'list':
        return block.items.map((item, idx) =>
          block.style === 'ordered' ? `${idx + 1}. ${item}` : `- ${item}`
        ).join('\n');

      case 'code':
        return `\`\`\`${block.language}\n${block.code}\n\`\`\``;

      case 'quote':
        return block.text.split('\n').map(line => `> ${line}`).join('\n');

      case 'divider':
        return '---';

      case 'table':
        const headerRow = `| ${block.headers.join(' | ')} |`;
        const separator = `| ${block.headers.map(() => '---').join(' | ')} |`;
        const dataRows = block.rows.map(row => `| ${row.join(' | ')} |`).join('\n');
        return `${headerRow}\n${separator}\n${dataRows}`;

      case 'faq':
        return `**Q: ${block.question}**\n\nA: ${block.answer}`;

      default:
        return '';
    }
  }).join('\n\n');
}

/**
 * Extract TOC from content blocks
 */
export function extractTocFromBlocks(blocks: ContentBlock[]): { id: string; text: string; level: number; anchor: string }[] {
  return blocks
    .filter((block): block is HeadingBlock => block.type === 'heading')
    .map(block => ({
      id: `h${block.level}-${block.anchor}`,
      text: block.text,
      level: block.level,
      anchor: block.anchor,
    }));
}

/**
 * Count words in content blocks
 */
export function countWordsInBlocks(blocks: ContentBlock[]): number {
  let wordCount = 0;

  for (const block of blocks) {
    switch (block.type) {
      case 'heading':
      case 'paragraph':
      case 'quote':
        wordCount += block.text.split(/\s+/).filter(Boolean).length;
        break;
      case 'list':
        wordCount += block.items.join(' ').split(/\s+/).filter(Boolean).length;
        break;
      case 'faq':
        wordCount += (block.question + ' ' + block.answer).split(/\s+/).filter(Boolean).length;
        break;
      case 'table':
        wordCount += block.headers.join(' ').split(/\s+/).filter(Boolean).length;
        wordCount += block.rows.flat().join(' ').split(/\s+/).filter(Boolean).length;
        break;
    }
  }

  return wordCount;
}

/**
 * Estimate reading time from content blocks (200 words/min)
 */
export function estimateReadingTimeFromBlocks(blocks: ContentBlock[]): number {
  const wordCount = countWordsInBlocks(blocks);
  return Math.max(1, Math.ceil(wordCount / 200));
}
