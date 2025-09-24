const userRepository = require('../repositories/userRepository');
const { validateEmail, validateHostelName } = require('../utils/helpers');

class UserService {
  async getUserProfile(userId) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove sensitive data
    const { password, ...userProfile } = user;
    return userProfile;
  }

  async updateUserProfile(userId, updateData) {
    const { email, hostel_name } = updateData;

    // Validate email if provided
    if (email && !validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate hostel name if provided
    if (hostel_name && !validateHostelName(hostel_name)) {
      throw new Error('Invalid hostel name');
    }

    // Check if email already exists (if changing email)
    if (email) {
      const existingUser = await userRepository.findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already registered');
      }
    }

    const updatedUser = await userRepository.updateUserProfile(userId, updateData);
    
    // Remove sensitive data
    const { password, ...userProfile } = updatedUser;
    return userProfile;
  }

  async getStudentsByHostel(hostelName) {
    if (!validateHostelName(hostelName)) {
      throw new Error('Invalid hostel name');
    }

    return await userRepository.getStudentsByHostel(hostelName);
  }

  async getAllStaff() {
    return await userRepository.getAllStaff();
  }
}

module.exports = new UserService();