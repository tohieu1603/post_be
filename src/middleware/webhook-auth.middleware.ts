/**
 * Webhook Authentication Middleware
 * Verifies Authorization: Bearer {CMS_API_KEY} header using constant-time comparison
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function webhookAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key không hợp lệ',
      },
    });
  }

  const providedKey = authHeader.substring(7);
  const expectedKey = process.env.CMS_API_KEY || '';

  if (!expectedKey) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key không hợp lệ',
      },
    });
  }

  // Hash both to fixed length before comparison — prevents key length leak
  const hash = (s: string) => crypto.createHash('sha256').update(s).digest();
  if (!crypto.timingSafeEqual(hash(providedKey), hash(expectedKey))) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key không hợp lệ',
      },
    });
  }

  next();
}
