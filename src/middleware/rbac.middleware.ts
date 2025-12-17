/**
 * RBAC Middleware - Role-based access control for routes
 * Integrated with JWT authentication
 */

import { Request, Response, NextFunction } from 'express';
import { Permission, UserRole, hasPermission, hasAnyPermission, canEditPost, canDeletePost } from '../utils/rbac.util';
import { verifyToken, JwtPayload } from '../config/jwt';

/**
 * Extended Request interface with user info (uses JwtPayload for consistency)
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { isActive?: boolean };
}

/**
 * Middleware to check if user has a specific permission
 */
export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Please login' });
    }

    if (!hasPermission(user.role as UserRole, permission)) {
      return res.status(403).json({
        error: 'Forbidden - You do not have permission to perform this action',
        required: permission,
        userRole: user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has any of the specified permissions
 */
export function requireAnyPermission(permissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Please login' });
    }

    if (!hasAnyPermission(user.role as UserRole, permissions)) {
      return res.status(403).json({
        error: 'Forbidden - You do not have permission to perform this action',
        required: permissions,
        userRole: user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has minimum role level
 */
export function requireRole(minRole: UserRole) {
  const roleHierarchy: UserRole[] = ['viewer', 'writer', 'editor', 'admin', 'super_admin'];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Please login' });
    }

    const userRoleIndex = roleHierarchy.indexOf(user.role as UserRole);
    const minRoleIndex = roleHierarchy.indexOf(minRole);

    if (userRoleIndex < minRoleIndex) {
      return res.status(403).json({
        error: 'Forbidden - Insufficient role privileges',
        required: minRole,
        userRole: user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user can edit a specific post
 * Must be used after loading the post into req.post
 */
export interface RequestWithPost extends AuthenticatedRequest {
  post?: {
    id: string;
    authorId: string | null;
  };
}

export function requirePostEditPermission() {
  return (req: RequestWithPost, res: Response, next: NextFunction) => {
    const user = req.user;
    const post = req.post;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Please login' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!canEditPost(user.role as UserRole, user.userId, post.authorId)) {
      return res.status(403).json({
        error: 'Forbidden - You cannot edit this post',
        userRole: user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user can delete a specific post
 */
export function requirePostDeletePermission() {
  return (req: RequestWithPost, res: Response, next: NextFunction) => {
    const user = req.user;
    const post = req.post;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Please login' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!canDeletePost(user.role as UserRole, user.userId, post.authorId)) {
      return res.status(403).json({
        error: 'Forbidden - You cannot delete this post',
        userRole: user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to attach user to request from JWT token (optional auth)
 * Supports both JWT token and legacy header-based auth for development
 */
export function attachUser() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Try JWT token first
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);

      if (payload) {
        req.user = payload;
        return next();
      }
    }

    // Fallback to header-based auth for development
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as string;
    const userEmail = req.headers['x-user-email'] as string;

    if (userId && userRole) {
      req.user = {
        userId,
        role: userRole,
        email: userEmail || 'user@example.com',
      };
    }

    next();
  };
}

/**
 * Middleware to require authentication
 */
export function requireAuth() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Try JWT token first
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);

      if (payload) {
        req.user = payload;
        return next();
      }
    }

    // Fallback to header-based auth for development
    const userId = req.headers['x-user-id'] as string;
    const userRole = req.headers['x-user-role'] as string;
    const userEmail = req.headers['x-user-email'] as string;

    if (userId && userRole) {
      req.user = {
        userId,
        role: userRole,
        email: userEmail || 'user@example.com',
      };
      return next();
    }

    return res.status(401).json({ error: 'Unauthorized - Please login' });
  };
}
