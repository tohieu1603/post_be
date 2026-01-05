/**
 * Cache Headers Middleware
 * Sets appropriate cache headers for different content types
 */

import { Request, Response, NextFunction } from 'express';

export interface CacheConfig {
  // Static assets (images, css, js)
  staticMaxAge?: number;        // Default: 31536000 (1 year)
  // Sitemaps
  sitemapMaxAge?: number;       // Default: 3600 (1 hour)
  // News sitemap
  newsSitemapMaxAge?: number;   // Default: 900 (15 minutes)
  // API responses - articles
  articleMaxAge?: number;       // Default: 300 (5 minutes)
  // API responses - listings/categories
  listingMaxAge?: number;       // Default: 60 (1 minute)
  // robots.txt
  robotsMaxAge?: number;        // Default: 86400 (24 hours)
}

const defaultConfig: Required<CacheConfig> = {
  staticMaxAge: 31536000,       // 1 year
  sitemapMaxAge: 3600,          // 1 hour
  newsSitemapMaxAge: 900,       // 15 minutes
  articleMaxAge: 300,           // 5 minutes
  listingMaxAge: 60,            // 1 minute
  robotsMaxAge: 86400,          // 24 hours
};

/**
 * Main cache middleware factory
 */
export function cacheMiddleware(config: CacheConfig = {}) {
  const cfg = { ...defaultConfig, ...config };

  return (req: Request, res: Response, next: NextFunction): void => {
    const path = req.path.toLowerCase();

    // Static assets
    if (path.startsWith('/static/') || path.startsWith('/uploads/')) {
      res.set('Cache-Control', `public, max-age=${cfg.staticMaxAge}, immutable`);
      return next();
    }

    // Sitemaps
    if (path === '/sitemap.xml' || path.startsWith('/sitemap-')) {
      res.set('Cache-Control', `public, max-age=${cfg.sitemapMaxAge}`);
      return next();
    }

    // News sitemap
    if (path === '/news-sitemap.xml') {
      res.set('Cache-Control', `public, max-age=${cfg.newsSitemapMaxAge}`);
      return next();
    }

    // robots.txt
    if (path === '/robots.txt') {
      res.set('Cache-Control', `public, max-age=${cfg.robotsMaxAge}`);
      return next();
    }

    // Public API - article detail
    if (path.match(/^\/api\/public\/post\/[^/]+$/)) {
      res.set('Cache-Control', `public, max-age=${cfg.articleMaxAge}, stale-while-revalidate=60`);
      return next();
    }

    // Public API - listings, categories, tags
    if (
      path.startsWith('/api/public/home/') ||
      path.startsWith('/api/public/category/') ||
      path.startsWith('/api/public/tag/') ||
      path.startsWith('/api/public/widget/') ||
      path.startsWith('/api/public/search')
    ) {
      res.set('Cache-Control', `public, max-age=${cfg.listingMaxAge}, stale-while-revalidate=30`);
      return next();
    }

    // SEO API
    if (path.startsWith('/api/seo/')) {
      res.set('Cache-Control', `public, max-age=${cfg.articleMaxAge}, stale-while-revalidate=60`);
      return next();
    }

    // Admin API - no cache
    if (path.startsWith('/api/') && !path.startsWith('/api/public')) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return next();
    }

    next();
  };
}

/**
 * Helper to set no-cache headers
 */
export function noCache(_req: Request, res: Response, next: NextFunction): void {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
}

/**
 * Helper to set immutable cache (for versioned assets)
 */
export function immutableCache(maxAge: number = 31536000) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', `public, max-age=${maxAge}, immutable`);
    next();
  };
}

/**
 * Helper to set stale-while-revalidate cache
 */
export function staleWhileRevalidate(maxAge: number, staleTime: number) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${staleTime}`);
    next();
  };
}
