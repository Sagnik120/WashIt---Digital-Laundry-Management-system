const generateOTP = () => {
    // For development, you can return a fixed OTP or random
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Using fixed OTP 123456');
        return '123456'; // Fixed OTP for development
    }
    
    // For production, generate random OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateStaffCode = () => {
    const prefix = 'STAFF';
    const randomNum = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNum}`;
};

const generateLaundryId = (userId) => {
    const timestamp = Date.now().toString().slice(-6);
    return `LDRY${userId}${timestamp}`;
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

module.exports = {
    generateOTP,
    generateStaffCode,
    generateLaundryId,
    validateEmail,
    validatePhone
};