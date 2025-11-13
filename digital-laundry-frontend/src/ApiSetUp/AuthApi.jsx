export const BaseUrl = "http://localhost:4000";
export const AWS_URL = "";
export const versionControl = "";
export const ApiUrlCommon = "";
export const BUCKET_URL = "";

export const api = {
  login: "/api/auth/login",
  studentRegister: "/api/auth/register/student",
  staffRegister: "/api/auth/register/staff",
  verifyEmail: "/api/auth/verify-email",
  sendOtp: "/api/auth/resend-otp",
  forgotPassword: "/api/auth/forgot-password",
  changePassword: "/api/auth/change-password",

  profileDetails: "/api/me",
  hostelDetails: "/api/admin/hostels",
  staffCodeDetails: "/api/admin/staff-codes",
  studentList: "/api/admin/students",
  staffList: "/api/admin/staff",
  studentDashboardData: "/api/dashboard/student",
  createOrder: "/api/orders",
  ordersList: "/api/orders",
  qrScan: "/api/qr/scan",
  complaintsList: "/api/complaints",
  notificationData: "/api/notifications",
  OrderListForAdmin: "/api/admin/orders",
};

export const LOGIN_TOKEN = "token";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
