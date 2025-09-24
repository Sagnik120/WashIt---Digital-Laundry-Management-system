const User = require('../models/User');

class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findUserByEmail(email) {
    return await User.findByEmail(email);
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async findUserByLaundryId(laundryId) {
    return await User.findByLaundryId(laundryId);
  }

  async updateUserProfile(id, updateData) {
    return await User.updateProfile(id, updateData);
  }

  async updateUserPassword(id, newPassword) {
    return await User.updatePassword(id, newPassword);
  }

  async verifyUserEmail(email) {
    return await User.verifyEmail(email);
  }

  async getStudentsByHostel(hostelName) {
    return await User.getStudentsByHostel(hostelName);
  }

  async getAllStaff() {
    return await User.getAllStaff();
  }

  async getStudentCountByHostel() {
    return await User.getStudentCountByHostel();
  }
}

module.exports = new UserRepository();