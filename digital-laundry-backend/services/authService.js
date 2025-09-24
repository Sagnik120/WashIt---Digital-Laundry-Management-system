const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const otpRepository = require('../repositories/otpRepository');
const adminRepository = require('../repositories/adminRepository');
const emailService = require('./emailService');
const { generateOTP, generateLaundryId, validateEmail, validatePhone } = require('../utils/helpers');

// Add the missing validation functions
const validatePassword = (password) => {
    if (password.length < 6) {
        return false;
    }
    
    // Check if password contains at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasLetter && hasNumber;
};

const validateHostelName = (hostelName) => {
    if (!hostelName || hostelName.trim().length === 0) {
        return false;
    }
    
    // Basic hostel name validation - you can customize this
    const validHostels = ['B1', 'B2', 'B3', 'B4', 'G1', 'G2', 'G3', 'G4']; // Add your hostel names
    return validHostels.includes(hostelName.toUpperCase());
};

class AuthService {
  async sendOTP(email) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists (but allow for registration)
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await otpRepository.createOTP(email, otpCode, expiresAt);
    
    // This will handle development/production mode internally
    await emailService.sendOTP(email, otpCode);

    return { message: 'OTP sent successfully' };
  }

  async verifyOTP(email, otpCode) {
    const validOTP = await otpRepository.findValidOTP(email, otpCode);
    if (!validOTP) {
      throw new Error('Invalid or expired OTP');
    }

    await otpRepository.markOTPAsUsed(validOTP.id);
    return { message: 'OTP verified successfully' };
  }

  async studentSignup(studentData) {
    const { email, password, confirmPassword, full_name, roll_number, hostel_name, room_number, phone_number, otp } = studentData;

    // Validations
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters with at least one letter and one number');
    }

    if (!validateHostelName(hostel_name)) {
      throw new Error('Invalid hostel name');
    }

    if (!validatePhone(phone_number)) {
      throw new Error('Invalid phone number format');
    }

    // Verify OTP
    await this.verifyOTP(email, otp);

    // Check if email already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if roll number already exists (fix the method call)
    const existingRollNumber = await userRepository.findUserByRollNumber(roll_number);
    if (existingRollNumber) {
      throw new Error('Roll number already registered');
    }

    // Generate laundry ID (fix the function call)
    const laundry_id = generateLaundryId(roll_number || email);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      full_name,
      role: 'student',
      roll_number,
      hostel_name: hostel_name.toUpperCase(), // Standardize hostel name
      room_number,
      phone_number,
      laundry_id,
      department_name: null,
      passing_year: null,
      profile_picture: null,
      is_verified: true // Auto-verify after OTP verification
    };

    const user = await userRepository.createUser(userData);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async staffSignup(staffData) {
    const { staff_code, email, password, confirmPassword, full_name, otp } = staffData;

    // Validations
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters with at least one letter and one number');
    }

    // Verify staff code (fix method name)
    const validStaffCode = await adminRepository.findStaffCodeByCode(staff_code);
    if (!validStaffCode || validStaffCode.is_used) {
      throw new Error('Invalid or already used staff code');
    }

    // Verify OTP
    await this.verifyOTP(email, otp);

    // Check if email already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate laundry ID for staff
    const laundry_id = generateLaundryId(`STAFF_${email}`);

    const userData = {
      email,
      password: hashedPassword,
      full_name,
      role: 'staff',
      roll_number: null,
      hostel_name: null,
      room_number: null,
      phone_number: null,
      laundry_id,
      department_name: null,
      passing_year: null,
      profile_picture: null,
      is_verified: true
    };

    const user = await userRepository.createUser(userData);
    
    // Mark staff code as used (fix method name)
    await adminRepository.updateStaffCode(staff_code, { is_used: true, used_by: user.id });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email, password, role) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== role) {
      throw new Error(`Invalid role. Expected: ${role}, Found: ${user.role}`);
    }

    // For non-admin users, check verification status
    if (role !== 'admin' && !user.is_verified) {
      throw new Error('Please verify your email first');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT token (fix expiresIn)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  async adminLogin(email, password) {
    // For admin, we use predefined credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@laundry.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== adminEmail) {
      throw new Error('Invalid admin credentials');
    }

    // Find or create admin user
    let adminUser = await userRepository.findUserByEmail(email);
    
    if (!adminUser) {
      // Create admin user if not exists
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await userRepository.createUser({
        email: adminEmail,
        password: hashedPassword,
        full_name: 'System Administrator',
        role: 'admin',
        is_verified: true
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      // Also check against plain text for initial setup
      if (password !== adminPassword) {
        throw new Error('Invalid admin credentials');
      }
    }

    const token = jwt.sign(
      { 
        userId: adminUser.id, 
        email: adminUser.email, 
        role: adminUser.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = adminUser;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  async changePassword(userId, oldPassword, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (!validatePassword(newPassword)) {
      throw new Error('Password must be at least 6 characters with at least one letter and one number');
    }

    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updateUserPassword(userId, hashedNewPassword);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Email not registered');
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await otpRepository.createOTP(email, otpCode, expiresAt);
    await emailService.sendOTP(email, otpCode);

    return { message: 'OTP sent to your email for password reset' };
  }

  async resetPassword(email, otp, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!validatePassword(newPassword)) {
      throw new Error('Password must be at least 6 characters with at least one letter and one number');
    }

    // Verify OTP
    await this.verifyOTP(email, otp);

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updateUserPassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }
}

module.exports = new AuthService();