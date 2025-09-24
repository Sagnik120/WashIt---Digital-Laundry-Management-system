const express = require('express');
const userController = require('../controllers/userController');
const { validateUpdateProfile } = require('../middleware/validationMiddleware');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// All authenticated users can access these routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, userController.updateProfile);

// Staff and Admin routes
router.get('/students/:hostelName', authenticateToken, authorizeRoles('staff', 'admin'), userController.getStudentsByHostel);
router.get('/staff', authenticateToken, authorizeRoles('admin'), userController.getAllStaff);

module.exports = router;