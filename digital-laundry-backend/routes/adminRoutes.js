const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected and require admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.post('/generate-staff-code', adminController.generateStaffCode);
router.get('/staff-codes', adminController.getAllStaffCodes);
router.get('/unused-staff-codes', adminController.getUnusedStaffCodes);
router.get('/system-stats', adminController.getSystemStats);
router.get('/student-stats', adminController.getStudentsByHostel);

module.exports = router;