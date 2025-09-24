const userService = require('../services/userService');

const userController = {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const userProfile = await userService.getUserProfile(userId);
      
      res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: userProfile
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      
      // Handle file upload for profile picture
      if (req.file) {
        updateData.profile_picture = req.file.filename; // You'll need multer for file uploads
      }
      
      const updatedProfile = await userService.updateUserProfile(userId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile
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
      const { hostelName } = req.params;
      
      const students = await userService.getStudentsByHostel(hostelName);
      
      res.status(200).json({
        success: true,
        message: 'Students fetched successfully',
        data: students
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getAllStaff(req, res) {
    try {
      const staff = await userService.getAllStaff();
      
      res.status(200).json({
        success: true,
        message: 'Staff fetched successfully',
        data: staff
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = userController;