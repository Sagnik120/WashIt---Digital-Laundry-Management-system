const express = require('express');
const orderController = require('../controllers/orderController');
const { validateCreateOrder } = require('../middleware/validationMiddleware');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route (for getting laundry items)
router.get('/items', orderController.getLaundryItems);

// Student routes
router.post('/create', authenticateToken, authorizeRoles('student'), validateCreateOrder, orderController.createOrder);
router.get('/history', authenticateToken, authorizeRoles('student'), orderController.getOrderHistory);
router.get('/details/:orderId', authenticateToken, orderController.getOrderDetails);

// Staff routes
router.post('/scan', authenticateToken, authorizeRoles('staff'), orderController.scanOrder);
router.get('/hostel/:hostelName', authenticateToken, authorizeRoles('staff'), orderController.getOrdersByHostel);
router.put('/:orderId/complete', authenticateToken, authorizeRoles('staff'), orderController.updateOrderStatus);
router.get('/:orderId/items', authenticateToken, orderController.getOrderItems);

module.exports = router;