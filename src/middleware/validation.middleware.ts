/**
 * Input Validation Middleware
 * Validates and sanitizes request inputs using express-validator
 */

import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// ============================================
// VALIDATION RESULT HANDLER
// ============================================
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: (err as any).path || (err as any).param,
        message: err.msg,
      })),
    });
  };
};

// ============================================
// COMMON VALIDATORS
// ============================================

// MongoDB ObjectId validator
export const isValidObjectId = (field: string, location: 'param' | 'body' | 'query' = 'param') => {
  const validator = location === 'param' ? param(field) : location === 'body' ? body(field) : query(field);
  return validator
    .isMongoId()
    .withMessage(`${field} must be a valid ID`);
};

// Required string
export const requiredString = (field: string, minLength = 1, maxLength = 500) => {
  return body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required`)
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`);
};

// Optional string
export const optionalString = (field: string, maxLength = 500) => {
  return body(field)
    .optional({ nullable: true })
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${field} must not exceed ${maxLength} characters`);
};

// Email validator
export const isValidEmail = (field: string = 'email') => {
  return body(field)
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address');
};

// Password validator
export const isStrongPassword = (field: string = 'password') => {
  return body(field)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number');
};

// Slug validator
export const isValidSlug = (field: string = 'slug') => {
  return body(field)
    .optional({ nullable: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens');
};

// URL validator
export const isValidUrl = (field: string) => {
  return body(field)
    .optional({ nullable: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage(`${field} must be a valid URL`);
};

// ============================================
// SPECIFIC VALIDATORS
// ============================================

// Post validators
export const postValidation = {
  create: [
    requiredString('title', 1, 500),
    requiredString('content', 1, 100000),
    isValidObjectId('categoryId', 'body'),
    optionalString('excerpt', 1000),
    optionalString('slug', 500),
    optionalString('coverImage', 1000),
    optionalString('metaTitle', 255),
    optionalString('metaDescription', 500),
    body('status')
      .optional()
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Status must be draft, published, or archived'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('isFeatured')
      .optional()
      .isBoolean()
      .withMessage('isFeatured must be a boolean'),
  ],
  update: [
    optionalString('title', 500),
    optionalString('content', 100000),
    body('categoryId')
      .optional()
      .isMongoId()
      .withMessage('categoryId must be a valid ID'),
    optionalString('excerpt', 1000),
    optionalString('slug', 500),
    body('status')
      .optional()
      .isIn(['draft', 'published', 'archived'])
      .withMessage('Status must be draft, published, or archived'),
  ],
};

// Category validators
export const categoryValidation = {
  create: [
    requiredString('name', 1, 255),
    optionalString('description', 1000),
    optionalString('slug', 255),
    body('parentId')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === '' || value === 'null') return true;
        if (!/^[a-f\d]{24}$/i.test(value)) {
          throw new Error('parentId must be a valid ID or null');
        }
        return true;
      }),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],
};

// Tag validators
export const tagValidation = {
  create: [
    requiredString('name', 1, 100),
    optionalString('slug', 100),
    optionalString('description', 500),
    body('color')
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage('Color must be a valid hex color'),
  ],
};

// User validators
export const userValidation = {
  create: [
    requiredString('name', 1, 255),
    isValidEmail(),
    isStrongPassword(),
    body('role')
      .optional()
      .isIn(['admin', 'editor', 'author', 'viewer'])
      .withMessage('Role must be admin, editor, author, or viewer'),
  ],
  update: [
    optionalString('name', 255),
    body('email')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('role')
      .optional()
      .isIn(['admin', 'editor', 'author', 'viewer'])
      .withMessage('Role must be admin, editor, author, or viewer'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    isStrongPassword('newPassword'),
  ],
};

// Auth validators
export const authValidation = {
  login: [
    isValidEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  register: [
    requiredString('name', 1, 255),
    isValidEmail(),
    isStrongPassword(),
  ],
};

// Search/pagination validators
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isString()
    .trim()
    .escape(),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('Sort order must be ASC or DESC'),
];

export const searchValidation = [
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query must not exceed 200 characters')
    .escape(),
  ...paginationValidation,
];
