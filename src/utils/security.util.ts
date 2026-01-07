/**
 * Security Utilities
 * Provides functions for input sanitization, XSS prevention, and NoSQL injection protection
 */

import sanitizeHtml from 'sanitize-html';

/**
 * Escapes special regex characters to prevent ReDoS and NoSQL injection
 * @param text - User input string
 * @returns Escaped string safe for MongoDB $regex
 */
export function escapeRegex(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitize HTML options for different contexts
 */
const SANITIZE_OPTIONS = {
  // Strict - no HTML allowed (for titles, slugs, etc.)
  strict: {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard' as const,
  },
  // Basic - only text formatting (for excerpts, comments)
  basic: {
    allowedTags: ['b', 'i', 'em', 'strong', 'u', 's', 'br'],
    allowedAttributes: {},
    disallowedTagsMode: 'discard' as const,
  },
  // Rich - for blog content with images, tables, code blocks
  rich: {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'sub', 'sup',
      'span', 'div',
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
      'code': ['class'], // For syntax highlighting
      'pre': ['class'],
      'span': ['class'],
      'div': ['class'],
      'table': ['class'],
      'th': ['colspan', 'rowspan'],
      'td': ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    // Prevent javascript: URLs
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard' as const,
    // Transform relative URLs for images
    transformTags: {
      'a': (tagName: string, attribs: { [key: string]: string }) => {
        // Add rel="noopener noreferrer" for external links
        if (attribs.href && (attribs.href.startsWith('http://') || attribs.href.startsWith('https://'))) {
          attribs.rel = 'noopener noreferrer';
          attribs.target = '_blank';
        }
        return { tagName, attribs };
      },
    },
  },
};

/**
 * Sanitize HTML string based on context
 * @param html - HTML string to sanitize
 * @param level - Sanitization level: 'strict' | 'basic' | 'rich'
 * @returns Sanitized HTML string
 */
export function sanitizeHtmlContent(
  html: string,
  level: 'strict' | 'basic' | 'rich' = 'rich'
): string {
  if (!html || typeof html !== 'string') return '';
  return sanitizeHtml(html, SANITIZE_OPTIONS[level]);
}

/**
 * Recursively sanitizes HTML strings in JSON objects
 * Useful for sanitizing PageContent and similar nested structures
 * @param obj - Object to sanitize
 * @param level - Sanitization level
 * @returns Sanitized object
 */
export function sanitizeJsonHtml(
  obj: unknown,
  level: 'strict' | 'basic' | 'rich' = 'rich'
): unknown {
  if (typeof obj === 'string') {
    return sanitizeHtmlContent(obj, level);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJsonHtml(item, level));
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip sanitizing certain fields that shouldn't contain HTML
      if (['_id', 'id', 'createdAt', 'updatedAt', '__v'].includes(key)) {
        result[key] = value;
      } else {
        result[key] = sanitizeJsonHtml(value, level);
      }
    }
    return result;
  }
  return obj;
}

/**
 * Validates and sanitizes a search query
 * @param query - Search query string
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized search string or null if invalid
 */
export function sanitizeSearchQuery(query: string, maxLength = 100): string | null {
  if (!query || typeof query !== 'string') return null;

  // Trim and limit length
  const trimmed = query.trim().slice(0, maxLength);

  // Remove potentially dangerous characters while keeping Vietnamese and common chars
  // Allow: alphanumeric, spaces, hyphens, underscores, Vietnamese characters
  const sanitized = trimmed.replace(/[^\w\s\-_\u00C0-\u024F\u1E00-\u1EFF]/g, '');

  return sanitized.length > 0 ? sanitized : null;
}

/**
 * Validates MongoDB ObjectId format
 * @param id - String to validate
 * @returns true if valid ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
}

/**
 * Sanitizes object keys to prevent NoSQL injection
 * Removes keys starting with $ or containing .
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeMongoQuery(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeMongoQuery(item));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Skip keys that could be used for injection
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    result[key] = sanitizeMongoQuery(value);
  }
  return result;
}

/**
 * Rate limit tracking for search queries (in-memory, per-IP)
 * Note: For production, use Redis or similar
 */
const searchRateLimits = new Map<string, { count: number; resetAt: number }>();

/**
 * Check if search is rate limited
 * @param ip - Client IP address
 * @param maxRequests - Maximum requests per window
 * @param windowMs - Time window in milliseconds
 * @returns true if should be rate limited
 */
export function isSearchRateLimited(
  ip: string,
  maxRequests = 30,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = searchRateLimits.get(ip);

  if (!record || now > record.resetAt) {
    searchRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  record.count++;
  if (record.count > maxRequests) {
    return true;
  }

  return false;
}

/**
 * Clear expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, record] of searchRateLimits.entries()) {
    if (now > record.resetAt) {
      searchRateLimits.delete(ip);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

/**
 * Validate URL format and scheme
 * @param url - URL to validate
 * @param allowedSchemes - Allowed URL schemes
 * @returns true if valid URL with allowed scheme
 */
export function isValidUrl(
  url: string,
  allowedSchemes = ['http', 'https']
): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    return allowedSchemes.includes(parsed.protocol.replace(':', ''));
  } catch {
    return false;
  }
}

/**
 * Sanitize filename to prevent path traversal
 * @param filename - Original filename
 * @returns Safe filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';

  // Remove path traversal attempts and invalid characters
  return filename
    .replace(/[/\\]/g, '') // Remove slashes
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[<>:"|?*\x00-\x1f]/g, '') // Remove invalid filename chars
    .trim();
}
