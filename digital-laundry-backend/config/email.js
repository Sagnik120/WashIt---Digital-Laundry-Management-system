const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    console.log('📧 OTPs will be logged to console instead');
  }
};

module.exports = {
  transporter,
  verifyEmailConnection,
};