/**
 * Image Utility - Optimization and processing for Core Web Vitals
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Image size presets for responsive images
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  ogImage: { width: 1200, height: 630 }, // Open Graph standard
  fullHd: { width: 1920, height: 1080 },
} as const;

export type ImageSizePreset = keyof typeof IMAGE_SIZES;

/**
 * Supported image formats for optimization
 */
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

/**
 * Generate srcset string for responsive images
 */
export function generateSrcset(
  baseUrl: string,
  widths: number[] = [320, 640, 1024, 1920]
): string {
  // Assuming URL structure: /uploads/filename.ext
  // Would generate: /uploads/filename-320w.ext 320w, /uploads/filename-640w.ext 640w, ...
  const ext = path.extname(baseUrl);
  const basePath = baseUrl.replace(ext, '');

  return widths
    .map((w) => `${basePath}-${w}w${ext} ${w}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(
  breakpoints: Array<{ minWidth?: number; maxWidth?: number; size: string }>
): string {
  return breakpoints
    .map((bp) => {
      if (bp.minWidth && bp.maxWidth) {
        return `(min-width: ${bp.minWidth}px) and (max-width: ${bp.maxWidth}px) ${bp.size}`;
      }
      if (bp.minWidth) {
        return `(min-width: ${bp.minWidth}px) ${bp.size}`;
      }
      if (bp.maxWidth) {
        return `(max-width: ${bp.maxWidth}px) ${bp.size}`;
      }
      return bp.size;
    })
    .join(', ');
}

/**
 * Default sizes attribute for blog content images
 */
export const DEFAULT_IMAGE_SIZES = generateSizes([
  { maxWidth: 640, size: '100vw' },
  { maxWidth: 1024, size: '80vw' },
  { size: '1024px' },
]);

/**
 * Calculate aspect ratio from dimensions
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Generate blur placeholder data URL (simplified - returns gray placeholder)
 * In production, use sharp or similar library to generate actual blur
 */
export function generateBlurPlaceholder(width: number = 10, height: number = 10): string {
  // Simple gray SVG placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#e0e0e0"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Image metadata interface
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number; // bytes
  aspectRatio: string;
}

/**
 * Generate preload link for critical images
 */
export function generatePreloadLink(
  imageUrl: string,
  options: {
    as?: 'image';
    type?: string;
    media?: string;
    fetchpriority?: 'high' | 'low' | 'auto';
    imagesrcset?: string;
    imagesizes?: string;
  } = {}
): string {
  const attrs: string[] = [
    `rel="preload"`,
    `href="${imageUrl}"`,
    `as="${options.as || 'image'}"`,
  ];

  if (options.type) attrs.push(`type="${options.type}"`);
  if (options.media) attrs.push(`media="${options.media}"`);
  if (options.fetchpriority) attrs.push(`fetchpriority="${options.fetchpriority}"`);
  if (options.imagesrcset) attrs.push(`imagesrcset="${options.imagesrcset}"`);
  if (options.imagesizes) attrs.push(`imagesizes="${options.imagesizes}"`);

  return `<link ${attrs.join(' ')}>`;
}

/**
 * Image optimization settings
 */
export interface ImageOptimizationConfig {
  quality: number; // 1-100
  maxWidth: number;
  maxHeight: number;
  format: 'jpeg' | 'webp' | 'png' | 'avif';
  progressive: boolean; // For JPEG
}

/**
 * Default optimization config
 */
export const DEFAULT_OPTIMIZATION_CONFIG: ImageOptimizationConfig = {
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'webp',
  progressive: true,
};

/**
 * Get optimized image URL path
 * Assumes image processing service generates files at predictable paths
 */
export function getOptimizedImagePath(
  originalPath: string,
  width: number,
  format: 'jpeg' | 'webp' | 'png' | 'avif' = 'webp'
): string {
  const dir = path.dirname(originalPath);
  const basename = path.basename(originalPath, path.extname(originalPath));
  return `${dir}/${basename}-${width}w.${format}`;
}

/**
 * Check if file is an image based on MIME type
 */
export function isImage(mimeType: string): boolean {
  return SUPPORTED_FORMATS.includes(mimeType as any);
}

/**
 * Get image format from MIME type
 */
export function getFormatFromMimeType(mimeType: string): string | null {
  const map: Record<string, string> = {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  };
  return map[mimeType] || null;
}

/**
 * Generate lazy loading attributes for images
 */
export function getLazyLoadAttributes(
  priority: boolean = false
): Record<string, string> {
  if (priority) {
    return {
      loading: 'eager',
      fetchpriority: 'high',
      decoding: 'async',
    };
  }
  return {
    loading: 'lazy',
    decoding: 'async',
  };
}
