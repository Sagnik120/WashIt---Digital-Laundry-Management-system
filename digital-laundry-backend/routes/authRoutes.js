const express = require('express');
const authController = require('../controllers/authController');
const { 
  validateStudentSignup, 
  validateStaffSignup, 
  validateLogin, 
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword 
} = require('../middleware/validationMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/student-signup', validateStudentSignup, authController.studentSignup);
router.post('/staff-signup', validateStaffSignup, authController.staffSignup);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// Protected routes
router.post('/change-password', authenticateToken, validateChangePassword, authController.changePassword);

// Optional: Keep test routes if you want
router.post('/test-verify-otp', authController.testVerifyOTP);
router.post('/test-create-student', authController.testCreateStudent);

module.exports = router;