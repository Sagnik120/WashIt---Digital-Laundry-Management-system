import express from 'express';
import staffOrderController from '../controller/staffOrderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply authentication and staff role middleware
router.use(authMiddleware);
router.use(roleMiddleware(['staff', 'admin']));

// GET /api/staff/orders - Get all orders with filters
router.get('/orders', staffOrderController.getAllOrders);

// GET /api/staff/orders/hostel/:hostelName - Get orders by hostel
router.get('/orders/hostel/:hostelName', staffOrderController.getOrdersByHostel);

// GET /api/staff/orders/status/:status - Get orders by status
router.get('/orders/status/:status', staffOrderController.getOrdersByStatus);

// GET /api/staff/orders/statistics - Get order statistics
router.get('/orders/statistics', staffOrderController.getOrderStatistics);

// GET /api/staff/orders/:orderId - Get specific order details
router.get('/orders/:orderId', staffOrderController.getOrderDetails);

// PUT /api/staff/orders/:orderId/status - Update order status
router.put('/orders/:orderId/status', staffOrderController.updateOrderStatus);

export default router;