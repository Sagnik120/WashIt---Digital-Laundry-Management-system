const authService = require('../services/authService');

const authController = {
  async sendOTP(req, res) {
    try {
      const { email } = req.body;
      
      const result = await authService.sendOTP(email);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;
      
      const result = await authService.verifyOTP(email, otp);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async studentSignup(req, res) {
    try {
      const studentData = req.body;
      
      const user = await authService.studentSignup(studentData);
      
      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async staffSignup(req, res) {
    try {
      const staffData = req.body;
      
      const user = await authService.staffSignup(staffData);
      
      res.status(201).json({
        success: true,
        message: 'Staff registered successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password, role } = req.body;
      
      let result;
      if (role === 'admin') {
        result = await authService.adminLogin(email, password);
      } else {
        result = await authService.login(email, password, role);
      }
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const userId = req.user.id;
      
      const result = await authService.changePassword(userId, oldPassword, newPassword, confirmPassword);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      const result = await authService.forgotPassword(email);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;
      
      const result = await authService.resetPassword(email, otp, newPassword, confirmPassword);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Remove or fix these test routes if they don't exist in authService
  async testVerifyOTP(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Test route working'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async testCreateStudent(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Test route working'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = authController;