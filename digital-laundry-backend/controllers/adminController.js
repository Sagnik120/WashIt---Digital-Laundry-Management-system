const adminService = require('../services/adminService');

const adminController = {
  async generateStaffCode(req, res) {
    try {
      const adminId = req.user.id;
      
      const result = await adminService.generateStaffCode(adminId);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: { staff_code: result.staff_code }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getAllStaffCodes(req, res) {
    try {
      const staffCodes = await adminService.getAllStaffCodes();
      
      res.status(200).json({
        success: true,
        message: 'Staff codes fetched successfully',
        data: staffCodes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getUnusedStaffCodes(req, res) {
    try {
      const staffCodes = await adminService.getUnusedStaffCodes();
      
      res.status(200).json({
        success: true,
        message: 'Unused staff codes fetched successfully',
        data: staffCodes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getSystemStats(req, res) {
    try {
      const stats = await adminService.getSystemStats();
      
      res.status(200).json({
        success: true,
        message: 'System stats fetched successfully',
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getStudentsByHostel(req, res) {
    try {
      const stats = await adminService.getStudentsByHostel();
      
      res.status(200).json({
        success: true,
        message: 'Student statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = adminController;