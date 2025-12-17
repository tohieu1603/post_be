/**
 * Security Middleware - Comprehensive protection against common vulnerabilities
 * - XSS (Cross-Site Scripting)
 * - NoSQL Injection
 * - HTTP Parameter Pollution
 * - Rate Limiting (DDoS protection)
 * - Security Headers
 */

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import sanitizeHtml from 'sanitize-html';

// ============================================
// 1. HELMET - Security Headers
// ============================================
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow Swagger UI inline scripts
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding images from external sources
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// ============================================
// 2. RATE LIMITING - DDoS Protection
// ============================================

// General API rate limit
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  },
});

// Strict rate limit for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Rate limit for password reset
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    success: false,
    error: 'Too many password reset attempts, please try again after 1 hour.',
  },
});

// Rate limit for file uploads
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    success: false,
    error: 'Upload limit exceeded, please try again later.',
  },
});

// Rate limit for public API (more generous)
export const publicApiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    error: 'Too many requests, please slow down.',
  },
});

// ============================================
// 3. NOSQL INJECTION PROTECTION
// ============================================
export const noSqlInjectionProtection = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[Security] Potential NoSQL injection blocked: ${key} in ${req.path}`);
  },
});

// ============================================
// 4. HTTP PARAMETER POLLUTION PROTECTION
// ============================================
export const httpParamPollutionProtection = hpp({
  whitelist: [
    'tags', // Allow multiple tags
    'categoryId',
    'status',
  ],
});

// ============================================
// 5. XSS PROTECTION - Sanitize HTML Input
// ============================================
const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'strong', 'em', 'b', 'i', 'u', 's', 'strike',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
    'figure', 'figcaption',
  ],
  allowedAttributes: {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'code': ['class'], // For syntax highlighting
    'pre': ['class'],
    'div': ['class', 'id'],
    'span': ['class'],
    'table': ['class'],
    'th': ['colspan', 'rowspan'],
    'td': ['colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  transformTags: {
    'a': (tagName, attribs) => {
      // Add security attributes to external links
      if (attribs.href && !attribs.href.startsWith('/')) {
        return {
          tagName,
          attribs: {
            ...attribs,
            target: '_blank',
            rel: 'noopener noreferrer nofollow',
          },
        };
      }
      return { tagName, attribs };
    },
  },
};

// Sanitize string value
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Check if it looks like HTML content (for content field)
    if (value.includes('<') && value.includes('>')) {
      return sanitizeHtml(value, sanitizeOptions);
    }
    // For other strings, just escape basic XSS
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const sanitized: any = {};
    for (const key of Object.keys(value)) {
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  return value;
}

// XSS protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body
  if (req.body) {
    // Special handling for content field - allow HTML but sanitize
    if (req.body.content && typeof req.body.content === 'string') {
      req.body.content = sanitizeHtml(req.body.content, sanitizeOptions);
    }

    // Sanitize other fields
    const fieldsToSanitize = ['title', 'excerpt', 'name', 'description', 'metaTitle', 'metaDescription'];
    for (const field of fieldsToSanitize) {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field]
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+=/gi, ''); // Remove event handlers
      }
    }
  }

  // Sanitize query params
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string)
          .replace(/<[^>]*>/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '');
      }
    }
  }

  next();
};

// ============================================
// 6. REQUEST SIZE LIMIT
// ============================================
export const requestSizeLimit = {
  json: '10mb', // Max JSON body size
  urlencoded: '10mb',
};

// ============================================
// 7. CORS SECURITY
// ============================================
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.warn(`[Security] Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
  maxAge: 86400, // 24 hours
};

// ============================================
// 8. SECURITY LOGGING
// ============================================
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL injection
    /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i, // XSS
    /(\%00)/i, // Null byte
    /(\.\.\/|\.\.\\)/i, // Path traversal
  ];

  const fullUrl = req.originalUrl || req.url;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullUrl) || pattern.test(JSON.stringify(req.body || {}))) {
      console.warn(`[Security] Suspicious request detected:`, {
        ip: req.ip,
        method: req.method,
        path: fullUrl,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });
      break;
    }
  }

  next();
};

// ============================================
// 9. SECURE RESPONSE HEADERS
// ============================================
export const secureResponseHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  next();
};

// ============================================
// COMBINED SECURITY MIDDLEWARE
// ============================================
export const securityMiddleware = [
  securityHeaders,
  secureResponseHeaders,
  securityLogger,
  noSqlInjectionProtection,
  httpParamPollutionProtection,
  xssProtection,
];
