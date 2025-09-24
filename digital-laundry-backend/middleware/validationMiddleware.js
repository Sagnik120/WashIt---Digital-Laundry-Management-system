const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Student signup validation
const validateStudentSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty().trim(),
  body('roll_number').notEmpty().trim(),
  body('hostel_name').notEmpty().trim(),
  body('room_number').notEmpty().trim(),
  body('phone_number').isMobilePhone(),
  body('otp').isLength({ min: 6, max: 6 }),
  handleValidationErrors
];

// Staff signup validation
const validateStaffSignup = [
  body('staff_code').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').notEmpty().trim(),
  body('otp').isLength({ min: 6, max: 6 }),
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('role').isIn(['student', 'staff', 'admin']),
  handleValidationErrors
];

// Change password validation
const validateChangePassword = [
  body('oldPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  body('confirmPassword').notEmpty(),
  handleValidationErrors
];

// Forgot password validation
const validateForgotPassword = [
  body('email').isEmail().normalizeEmail(),
  handleValidationErrors
];

// Reset password validation
const validateResetPassword = [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('newPassword').isLength({ min: 6 }),
  body('confirmPassword').notEmpty(),
  handleValidationErrors
];

// Update profile validation
const validateUpdateProfile = [
  body('email').optional().isEmail().normalizeEmail(),
  body('full_name').optional().notEmpty().trim(),
  body('roll_number').optional().notEmpty().trim(),
  body('hostel_name').optional().notEmpty().trim(),
  body('room_number').optional().notEmpty().trim(),
  body('phone_number').optional().isMobilePhone(),
  body('department_name').optional().trim(),
  body('passing_year').optional().isInt({ min: 2000, max: 2030 }),
  handleValidationErrors
];

// Create order validation
const validateCreateOrder = [
  body('submission_date').isDate(),
  body('items').isArray({ min: 1 }),
  body('items.*.item_name').notEmpty().trim(),
  body('items.*.quantity').isInt({ min: 1 }),
  handleValidationErrors
];

module.exports = {
  validateStudentSignup,
  validateStaffSignup,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateCreateOrder,
  handleValidationErrors
};