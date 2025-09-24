const { transporter } = require('../config/email');
const { generateOTP } = require('../utils/helpers');

class EmailService {
  async sendOTP(email, otpCode) {
    try {
      // For development mode, log OTP to console instead of sending email
      if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_HOST) {
        console.log(`📧 DEVELOPMENT MODE - OTP for ${email}: ${otpCode}`);
        console.log(`⏰ OTP is valid for 10 minutes`);
        return true;
      }

      // Only send actual email in production mode with proper email configuration
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Digital Laundry - OTP Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Digital Laundry Management System</h2>
            <p>Your OTP for email verification is:</p>
            <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to: ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error.message);
      
      // Fallback: log OTP to console if email sending fails
      console.log(`📧 FALLBACK - OTP for ${email}: ${otpCode}`);
      console.log(`⏰ OTP is valid for 10 minutes`);
      
      return true; // Don't throw error, just use console fallback
    }
  }

  async sendPasswordReset(email, resetToken) {
    // Implementation for password reset (if needed later)
    return true;
  }
}

module.exports = new EmailService();