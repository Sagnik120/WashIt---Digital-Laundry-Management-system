const { query } = require('../config/database');

class OTPVerification {
  static async create(email, otpCode, expiresAt) {
    // Delete any existing OTP for this email
    await query('DELETE FROM otp_verifications WHERE email = $1', [email]);

    const result = await query(
      `INSERT INTO otp_verifications (email, otp_code, expires_at) 
       VALUES ($1, $2, $3) RETURNING *`,
      [email, otpCode, expiresAt]
    );

    return result.rows[0];
  }

  static async findValidOTP(email, otpCode) {
    const result = await query(
      `SELECT * FROM otp_verifications 
       WHERE email = $1 AND otp_code = $2 AND expires_at > NOW() AND is_used = false`,
      [email, otpCode]
    );
    return result.rows[0];
  }

  static async markAsUsed(id) {
    const result = await query(
      'UPDATE otp_verifications SET is_used = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  static async cleanupExpiredOTPs() {
    await query('DELETE FROM otp_verifications WHERE expires_at < NOW()');
  }
}

module.exports = OTPVerification;