/**
 * Redirect Middleware
 * Handles URL redirects from database for SEO (301/302 redirects)
 */

import { Request, Response, NextFunction } from 'express';
import { Redirect } from '../models/redirect.model';

/**
 * Middleware to check and handle redirects
 * Should be applied early in the middleware chain
 */
export async function redirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Skip API and admin routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) {
      return next();
    }

    // Normalize path (remove trailing slash for matching, except root)
    const path = req.path === '/' ? '/' : req.path.replace(/\/$/, '');

    // Check for redirect
    const redirect = await Redirect.findOne({
      fromPath: path,
      isActive: true,
    }).lean();

    if (redirect) {
      // Increment hit count asynchronously (don't wait)
      Redirect.updateOne(
        { _id: redirect._id },
        { $inc: { hitCount: 1 } }
      ).exec().catch(console.error);

      // Perform redirect
      res.redirect(redirect.statusCode, redirect.toPath);
      return;
    }

    // Also check with trailing slash variant
    const pathWithSlash = path + '/';
    const redirectWithSlash = await Redirect.findOne({
      fromPath: pathWithSlash,
      isActive: true,
    }).lean();

    if (redirectWithSlash) {
      Redirect.updateOne(
        { _id: redirectWithSlash._id },
        { $inc: { hitCount: 1 } }
      ).exec().catch(console.error);

      res.redirect(redirectWithSlash.statusCode, redirectWithSlash.toPath);
      return;
    }

    next();
  } catch (error) {
    // Don't block request on redirect errors
    console.error('Redirect middleware error:', error);
    next();
  }
}

/**
 * Helper to create a redirect when slug changes
 */
export async function createRedirectOnSlugChange(
  oldSlug: string,
  newSlug: string,
  statusCode: 301 | 302 = 301
): Promise<void> {
  if (oldSlug === newSlug) return;

  const fromPath = `/${oldSlug}/`;
  const toPath = `/${newSlug}/`;

  try {
    // Check if redirect already exists
    const existing = await Redirect.findOne({ fromPath });

    if (existing) {
      // Update existing redirect
      await Redirect.updateOne(
        { _id: existing._id },
        { toPath, statusCode, isActive: true }
      );
    } else {
      // Create new redirect
      await Redirect.create({
        fromPath,
        toPath,
        statusCode,
        isActive: true,
        note: `Auto-created on slug change: ${oldSlug} -> ${newSlug}`,
      });
    }
  } catch (error) {
    console.error('Error creating redirect:', error);
  }
}

/**
 * Helper to create redirect chain resolver
 * Prevents redirect loops and chains
 */
export async function resolveRedirectChain(
  path: string,
  maxDepth: number = 5
): Promise<string | null> {
  let currentPath = path;
  let depth = 0;

  while (depth < maxDepth) {
    const redirect = await Redirect.findOne({
      fromPath: currentPath,
      isActive: true,
    }).lean();

    if (!redirect) {
      return depth > 0 ? currentPath : null;
    }

    currentPath = redirect.toPath;
    depth++;
  }

  // Max depth reached - possible loop
  console.warn(`Redirect chain too deep for path: ${path}`);
  return null;
}
