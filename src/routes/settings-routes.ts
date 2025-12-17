import { Router } from 'express';
import {
  getAllSettings,
  getSettingByKey,
  updateSetting,
  bulkUpdateSettings,
  initializeSettings,
} from '../controllers/settings-controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();

// Public read (for site settings like title, logo)
router.get('/', getAllSettings);
router.get('/:key', getSettingByKey);

// Protected write routes - admin only
router.post('/initialize', requireAuth, requireRole('admin'), initializeSettings);
router.put('/bulk', requireAuth, requireRole('admin'), bulkUpdateSettings);
router.put('/:key', requireAuth, requireRole('admin'), updateSetting);

export default router;
