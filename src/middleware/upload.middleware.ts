/**
 * Secure File Upload Middleware
 * - File type validation (whitelist)
 * - File size limits
 * - Filename sanitization
 * - Magic bytes validation
 */

import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// ============================================
// ALLOWED FILE TYPES (Whitelist)
// ============================================
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
];

const ALL_ALLOWED_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_AUDIO_TYPES,
];

// ============================================
// FILE SIZE LIMITS
// ============================================
const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024, // 10MB for images
  document: 20 * 1024 * 1024, // 20MB for documents
  video: 100 * 1024 * 1024, // 100MB for videos
  audio: 50 * 1024 * 1024, // 50MB for audio
  default: 50 * 1024 * 1024, // 50MB default
};

// ============================================
// MAGIC BYTES (File signatures)
// ============================================
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

// ============================================
// DANGEROUS FILE EXTENSIONS (Blacklist)
// ============================================
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js',
  '.jar', '.msi', '.dll', '.scr', '.hta', '.cpl',
  '.php', '.php3', '.php4', '.php5', '.phtml',
  '.asp', '.aspx', '.jsp', '.jspx',
  '.py', '.rb', '.pl', '.cgi',
];

// ============================================
// SANITIZE FILENAME
// ============================================
export function sanitizeFilename(filename: string): string {
  // Remove path components
  const basename = path.basename(filename);

  // Remove null bytes
  let sanitized = basename.replace(/\0/g, '');

  // Replace dangerous characters
  sanitized = sanitized.replace(/[<>:"/\\|?*]/g, '_');

  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');

  // Limit length
  if (sanitized.length > 200) {
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    sanitized = name.substring(0, 200 - ext.length) + ext;
  }

  // Ensure not empty
  if (!sanitized) {
    sanitized = 'unnamed_file';
  }

  return sanitized;
}

// ============================================
// VALIDATE FILE TYPE
// ============================================
function validateFileType(
  file: Express.Multer.File,
  allowedTypes: string[] = ALL_ALLOWED_TYPES
): { valid: boolean; error?: string } {
  // Check MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `File type '${file.mimetype}' is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `File extension '${ext}' is not allowed for security reasons.`,
    };
  }

  // Validate magic bytes for known types
  if (file.buffer && MAGIC_BYTES[file.mimetype]) {
    const fileHeader = Array.from(file.buffer.slice(0, 8));
    const validSignatures = MAGIC_BYTES[file.mimetype];

    const hasValidSignature = validSignatures.some((signature) =>
      signature.every((byte, index) => fileHeader[index] === byte)
    );

    if (!hasValidSignature) {
      return {
        valid: false,
        error: 'File content does not match its declared type. Possible file spoofing detected.',
      };
    }
  }

  return { valid: true };
}

// ============================================
// MULTER FILE FILTER
// ============================================
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  // Sanitize filename
  file.originalname = sanitizeFilename(file.originalname);

  // Check extension first (before upload completes)
  const ext = path.extname(file.originalname).toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return callback(new Error(`File extension '${ext}' is not allowed for security reasons.`));
  }

  // Check MIME type
  if (!ALL_ALLOWED_TYPES.includes(file.mimetype)) {
    return callback(new Error(`File type '${file.mimetype}' is not allowed.`));
  }

  callback(null, true);
};

// ============================================
// SECURE UPLOAD MIDDLEWARE
// ============================================
export const secureUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_SIZE_LIMITS.default,
    files: 10, // Max 10 files per request
  },
  fileFilter,
});

// Image-only upload
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_SIZE_LIMITS.image,
    files: 10,
  },
  fileFilter: (req, file, callback) => {
    file.originalname = sanitizeFilename(file.originalname);

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return callback(new Error('Only image files are allowed.'));
    }
    callback(null, true);
  },
});

// Document upload
export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_SIZE_LIMITS.document,
    files: 5,
  },
  fileFilter: (req, file, callback) => {
    file.originalname = sanitizeFilename(file.originalname);

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      return callback(new Error('Only document files are allowed.'));
    }
    callback(null, true);
  },
});

// ============================================
// POST-UPLOAD VALIDATION MIDDLEWARE
// ============================================
export const validateUploadedFile = (
  allowedTypes: string[] = ALL_ALLOWED_TYPES
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
      return next(); // No file, continue
    }

    // Validate file type with magic bytes
    const validation = validateFileType(file, allowedTypes);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    next();
  };
};

// ============================================
// ERROR HANDLER FOR MULTER
// ============================================
export const handleUploadError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 50MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum is 10 files per request.',
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'File upload failed',
    });
  }

  next();
};

export {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_AUDIO_TYPES,
  ALL_ALLOWED_TYPES,
  FILE_SIZE_LIMITS,
};
