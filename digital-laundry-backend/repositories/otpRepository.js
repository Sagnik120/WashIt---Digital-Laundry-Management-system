const OTPVerification = require('../models/OTPVerification');

class OTPRepository {
  async createOTP(email, otpCode, expiresAt) {
    return await OTPVerification.create(email, otpCode, expiresAt);
  }

  async findValidOTP(email, otpCode) {
    return await OTPVerification.findValidOTP(email, otpCode);
  }

  async markOTPAsUsed(id) {
    return await OTPVerification.markAsUsed(id);
  }

  async cleanupExpiredOTPs() {
    return await OTPVerification.cleanupExpiredOTPs();
  }
}

module.exports = new OTPRepository();