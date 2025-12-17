import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  toggleUserActive,
  getUserActivity,
} from '../controllers/user-controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate, userValidation, isValidObjectId, searchValidation } from '../middleware/validation.middleware';

const router = Router();

// All user management routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole('admin'));

// List users with search/pagination
router.get('/', validate(searchValidation), getAllUsers);

// Get user by ID
router.get('/:id', validate([isValidObjectId('id')]), getUserById);

// Get user activity
router.get('/:id/activity', validate([isValidObjectId('id')]), getUserActivity);

// Create user (admin only)
router.post('/', validate(userValidation.create), createUser);

// Update user
router.put('/:id', validate([isValidObjectId('id'), ...userValidation.update]), updateUser);

// Delete user
router.delete('/:id', validate([isValidObjectId('id')]), deleteUser);

// Update user role
router.patch('/:id/role', validate([isValidObjectId('id')]), updateUserRole);

// Toggle user active status
router.patch('/:id/toggle-active', validate([isValidObjectId('id')]), toggleUserActive);

export default router;
