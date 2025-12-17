/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../config/jwt';
import { User } from '../models/user.model';
import { Types } from 'mongoose';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { isActive?: boolean };
    }
  }
}

/**
 * Require authentication - returns 401 if not authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer '
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or expired token' });
  }

  req.user = payload;
  next();
}

/**
 * Optional authentication - attaches user if token present, continues otherwise
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (payload) {
      req.user = payload;
    }
  }

  next();
}

/**
 * Require specific role(s)
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }

    next();
  };
}

/**
 * Require admin role (admin only)
 */
export const requireAdmin = requireRole('admin');

/**
 * Require editor or admin role
 */
export const requireEditor = requireRole('admin', 'editor');

/**
 * Require author or higher role
 */
export const requireAuthor = requireRole('admin', 'editor', 'author');

/**
 * Verify user is active and exists in database
 */
export async function verifyActiveUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (!Types.ObjectId.isValid(req.user.userId)) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(req.user.userId).lean();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    req.user.isActive = user.isActive;
    next();
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
}
