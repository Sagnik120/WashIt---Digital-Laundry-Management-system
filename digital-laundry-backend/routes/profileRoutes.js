import express from 'express';
const router = express.Router();
import profileController from '../controller/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Apply authentication middleware to all profile routes
router.use(authMiddleware);

// GET /api/profile - Get student profile (authenticated user)
router.get('/', profileController.getProfile);

// PUT /api/profile - Update student profile
router.put('/', profileController.updateProfile);

// GET /api/profile/:id - Get profile by ID (for testing)
router.get('/:id', profileController.getProfileById);

export default router;