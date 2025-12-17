import { Router } from 'express';
import {
  getAllMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaUsage,
  getFolders,
  assignMedia,
  unassignMedia,
  getMediaBySection,
} from '../controllers/media-controller';
import {
  secureUpload,
  validateUploadedFile,
  handleUploadError,
} from '../middleware/upload.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, isValidObjectId, searchValidation } from '../middleware/validation.middleware';

const router = Router();

// All media routes require authentication
router.use(requireAuth);

// GET routes
router.get('/folders', getFolders);
router.get('/by-section', getMediaBySection);
router.get('/', validate(searchValidation), getAllMedia);
router.get('/:id', validate([isValidObjectId('id')]), getMediaById);
router.get('/:id/usage', validate([isValidObjectId('id')]), getMediaUsage);

// POST routes with secure upload
router.post(
  '/upload',
  requirePermission('media:upload'),
  secureUpload.single('file'),
  handleUploadError,
  validateUploadedFile(),
  uploadMedia
);

router.post('/:id/assign', requirePermission('media:edit_own'), validate([isValidObjectId('id')]), assignMedia);
router.post('/:id/unassign', requirePermission('media:edit_own'), validate([isValidObjectId('id')]), unassignMedia);

// PUT/DELETE routes
router.put('/:id', requirePermission('media:edit_own'), validate([isValidObjectId('id')]), updateMedia);
router.delete('/:id', requirePermission('media:delete_own'), validate([isValidObjectId('id')]), deleteMedia);

export default router;
