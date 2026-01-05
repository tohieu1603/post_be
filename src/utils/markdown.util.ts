import { TocItem } from '../models/post.model';

/**
 * Extract headings from markdown content and generate TOC
 * Supports ## H2, ### H3, #### H4, etc.
 */
export function extractTocFromMarkdown(markdown: string, maxLevel: number = 4): TocItem[] {
  if (!markdown) return [];

  // Remove code blocks to avoid parsing headings inside them
  const contentWithoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, '');

  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const level = match[1].length;
    if (level > maxLevel) continue;

    const text = match[2].trim();
    // Create anchor from text (slugify)
    const anchor = text
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF]/g, '') // Keep letters, numbers, spaces, Vietnamese chars
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const id = `h${level}-${anchor}`;

    headings.push({ id, text, level, anchor });
  }

  return headings;
}

/**
 * Count words in markdown content (excluding code blocks and markdown syntax)
 */
export function countWords(markdown: string): number {
  if (!markdown) return 0;

  // Remove code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`[^`]+`/g, '');
  // Remove markdown links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove images
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
  // Remove markdown syntax
  text = text.replace(/[#*_~>`]/g, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Split by whitespace and filter empty
  const words = text.split(/\s+/).filter(word => word.length > 0);

  return words.length;
}

/**
 * Estimate reading time in minutes (200 words per minute)
 */
export function estimateReadingTime(markdown: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(markdown);
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Parse content and return toc, wordCount, readingTime
 */
export function parseContentMetadata(content: string): {
  toc: TocItem[];
  wordCount: number;
  readingTime: number;
} {
  return {
    toc: extractTocFromMarkdown(content),
    wordCount: countWords(content),
    readingTime: estimateReadingTime(content),
  };
}
