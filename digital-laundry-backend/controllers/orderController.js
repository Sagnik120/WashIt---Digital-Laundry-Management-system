const orderService = require('../services/orderService');

const orderController = {
  async getLaundryItems(req, res) {
    try {
      const items = await orderService.getLaundryItems();
      
      res.status(200).json({
        success: true,
        message: 'Laundry items fetched successfully',
        data: items
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async createOrder(req, res) {
    try {
      const studentId = req.user.id;
      const orderData = req.body;
      
      const result = await orderService.createOrder(studentId, orderData);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: { order_id: result.order_id }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getOrderHistory(req, res) {
    try {
      const studentId = req.user.id;
      
      const orders = await orderService.getOrderHistory(studentId);
      
      res.status(200).json({
        success: true,
        message: 'Order history fetched successfully',
        data: orders
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getOrderDetails(req, res) {
    try {
      const { orderId } = req.params;
      
      const orderDetails = await orderService.getOrderDetails(orderId);
      
      res.status(200).json({
        success: true,
        message: 'Order details fetched successfully',
        data: orderDetails
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async scanOrder(req, res) {
    try {
      const { orderId } = req.body;
      
      const orderDetails = await orderService.scanOrder(orderId);
      
      res.status(200).json({
        success: true,
        message: 'Order scanned successfully',
        data: orderDetails
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getOrdersByHostel(req, res) {
    try {
      const { hostelName } = req.params;
      
      const orders = await orderService.getOrdersByHostel(hostelName);
      
      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: orders
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const staffId = req.user.id;
      
      const updatedOrder = await orderService.updateOrderStatus(orderId, 'completed', staffId);
      
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async getOrderItems(req, res) {
    try {
      const { orderId } = req.params;
      
      const items = await orderService.getOrderItems(orderId);
      
      res.status(200).json({
        success: true,
        message: 'Order items fetched successfully',
        data: items
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = orderController;