const adminRepository = require('../repositories/adminRepository');
const generateStaffCode = require('../utils/generateStaffCode');

class AdminService {
  async generateStaffCode(adminId) {
    const staffCode = generateStaffCode();
    await adminRepository.createStaffCode(staffCode, adminId);
    
    return {
      staff_code: staffCode,
      message: 'Staff code generated successfully'
    };
  }

  async getAllStaffCodes() {
    return await adminRepository.getAllStaffCodes();
  }

  async getUnusedStaffCodes() {
    return await adminRepository.getUnusedStaffCodes();
  }

  async getSystemStats() {
    return await adminRepository.getSystemStats();
  }

  async getStudentsByHostel() {
    return await adminRepository.getStudentCountByHostel();
  }
}

module.exports = new AdminService();