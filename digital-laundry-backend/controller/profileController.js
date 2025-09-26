import User from '../models/User.js';
import db from '../config/database.js';

const profileController = {
  // Get student profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const user = await User.getProfile(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Return profile data (excluding sensitive information)
      const profileData = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        roll_number: user.roll_number,
        hostel_name: user.hostel_name,
        room_number: user.room_number,
        phone_number: user.phone_number,
        department_name: user.department_name,
        passing_year: user.passing_year,
        profile_picture: user.profile_picture,
        laundry_id: user.laundry_id,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
      };

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profileData
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update student profile
  updateProfile: async (req, res) => {
    try {
        console.log("jai");
      const userId = req.user.id;
      const updateData = req.body;
      console.log(updateData.full_name)

      // Validate required fields
      if (!updateData.full_name) {
        return res.status(400).json({
          success: false,
          message: 'Full name is required'
        });
      }

      // Update profile
      const updatedUser = await User.updateUserProfile(userId, updateData);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedUser.id,
          full_name: updatedUser.full_name,
          roll_number: updatedUser.roll_number,
          hostel_name: updatedUser.hostel_name,
          room_number: updatedUser.room_number,
          phone_number: updatedUser.phone_number,
          department_name: updatedUser.department_name,
          passing_year: updatedUser.passing_year,
          profile_picture: updatedUser.profile_picture,
          updated_at: updatedUser.updated_at
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        if (error.constraint.includes('roll_number')) {
          return res.status(400).json({
            success: false,
            message: 'Roll number already exists'
          });
        }
        if (error.constraint.includes('email')) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get profile by ID (for testing)
  getProfileById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const user = await User.getProfile(id);
      console.log(user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const profileData = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        roll_number: user.roll_number,
        hostel_name: user.hostel_name,
        room_number: user.room_number,
        phone_number: user.phone_number,
        department_name: user.department_name,
        passing_year: user.passing_year
      };

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profileData
      });

    } catch (error) {
      console.error('Get profile by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

export default profileController;