/**
 * Authentication Routes
 */

import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} from '../controllers/auth-controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate, authValidation, userValidation } from '../middleware/validation.middleware';

const router = Router();

// Public routes with validation
router.post('/register', validate(authValidation.register), register);
router.post('/login', validate(authValidation.login), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes with validation
router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, validate(userValidation.update), updateProfile);
router.post('/change-password', requireAuth, validate(userValidation.changePassword), changePassword);

export default router;
