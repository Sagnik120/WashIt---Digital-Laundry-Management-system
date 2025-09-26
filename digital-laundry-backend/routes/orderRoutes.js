import express from 'express';
import orderController from '../controller/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(authMiddleware);

// POST /api/orders/submit - Submit new laundry order
router.post('/submit', orderController.submitOrder);

// GET /api/orders/items - Get all available laundry items
router.get('/items', orderController.getLaundryItems);

// GET /api/orders/history - Get order history for student
router.get('/history', orderController.getOrderHistory);

// GET /api/orders/laundry/:laundryId - Get order by laundry ID
router.get('/laundry/:laundryId', orderController.getOrderByLaundryId);

// GET /api/orders/:orderId - Get specific order details
router.get('/:orderId', orderController.getOrderDetails);

export default router;