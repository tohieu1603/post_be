import { Router } from 'express';
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  mergeTags,
  generateTagSlug,
  toggleTagActive,
} from '../controllers/tag-controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, tagValidation, isValidObjectId, searchValidation } from '../middleware/validation.middleware';

const router = Router();

// Generate slug must come before :id route
router.post('/generate-slug', generateTagSlug);
router.post('/merge', requireAuth, requirePermission('tag:manage'), mergeTags);

// Public read routes
router.get('/', validate(searchValidation), getAllTags);
router.get('/:id', validate([isValidObjectId('id')]), getTagById);

// Protected write routes
router.post('/', requireAuth, requirePermission('tag:manage'), validate(tagValidation.create), createTag);
router.put('/:id', requireAuth, requirePermission('tag:manage'), validate([isValidObjectId('id'), ...tagValidation.create]), updateTag);
router.delete('/:id', requireAuth, requirePermission('tag:manage'), validate([isValidObjectId('id')]), deleteTag);
router.patch('/:id/toggle-active', requireAuth, requirePermission('tag:manage'), validate([isValidObjectId('id')]), toggleTagActive);

export default router;
