const StaffCode = require('../models/StaffCode');
const User = require('../models/User');

class AdminRepository {
  async createStaffCode(staffCode, createdBy) {
    return await StaffCode.create(staffCode, createdBy);
  }

  async findStaffCode(code) {
    return await StaffCode.findByCode(code);
  }

  async markStaffCodeAsUsed(code) {
    return await StaffCode.markAsUsed(code);
  }

  async getAllStaffCodes() {
    return await StaffCode.getAll();
  }

  async getUnusedStaffCodes() {
    return await StaffCode.getUnusedCodes();
  }

  async getSystemStats() {
    const studentCount = await User.getStudentCountByHostel();
    const totalStudents = studentCount.reduce((sum, item) => sum + parseInt(item.student_count), 0);
    
    const staffCountResult = await User.getAllStaff();
    const totalStaff = staffCountResult.length;

    return {
      totalStudents,
      totalStaff,
      studentsByHostel: studentCount
    };
  }
}

module.exports = new AdminRepository();