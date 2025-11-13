
import { Router } from 'express';
import auth from './modules/auth.routes.js';
import me from './modules/me.routes.js';
import adminHostels from './modules/admin.hostels.routes.js';
import adminStaffCodes from './modules/admin.staffcodes.routes.js';
import adminViews from './modules/admin.views.routes.js';
import orders from './modules/orders.routes.js';
import qr from './modules/qr.routes.js';
import complaints from './modules/complaints.routes.js';
import notifications from './modules/notifications.routes.js';
import dashboard from './modules/dashboard.routes.js';
import history from './modules/history.routes.js';

export const router = Router();

router.use('/auth', auth);
router.use('/me', me);
router.use('/admin/hostels', adminHostels);
router.use('/admin/staff-codes', adminStaffCodes);
router.use('/admin', adminViews);
router.use('/orders', orders);
router.use('/qr', qr);
router.use('/complaints', complaints);
router.use('/notifications', notifications);
router.use('/dashboard', dashboard);
router.use('/history', history);
