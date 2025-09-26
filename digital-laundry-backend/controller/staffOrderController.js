import Order from '../models/Order.js';

const staffOrderController = {
  // Get all orders with filters (for staff)
  getAllOrders: async (req, res) => {
    try {
      const { status, hostel_name, student_id, date_from, date_to } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (hostel_name) filters.hostel_name = hostel_name;
      if (student_id) filters.student_id = parseInt(student_id);
      if (date_from) filters.date_from = date_from;
      if (date_to) filters.date_to = date_to;

      const orders = await Order.getAllOrdersForStaff(filters);

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
        filters: filters
      });

    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get orders by hostel
  getOrdersByHostel: async (req, res) => {
    try {
      const { hostelName } = req.params;

      if (!hostelName) {
        return res.status(400).json({
          success: false,
          message: 'Hostel name is required'
        });
      }

      const orders = await Order.getOrdersByHostel(hostelName);

      res.status(200).json({
        success: true,
        message: `Orders for hostel ${hostelName} retrieved successfully`,
        data: orders
      });

    } catch (error) {
      console.error('Get orders by hostel error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get orders by status
  getOrdersByStatus: async (req, res) => {
    try {
      const { status } = req.params;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const orders = await Order.getOrdersByStatus(status);

      res.status(200).json({
        success: true,
        message: `Orders with status ${status} retrieved successfully`,
        data: orders
      });

    } catch (error) {
      console.error('Get orders by status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const staffId = req.user.id;

      if (!status || !['in progress', 'completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Valid status is required (in progress or completed)'
        });
      }

      const updatedOrder = await Order.updateOrderStatus(orderId, status, staffId);

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: `Order status updated to ${status} successfully`,
        data: updatedOrder
      });

    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get order statistics for dashboard
  getOrderStatistics: async (req, res) => {
    try {
      const statistics = await Order.getOrderStatistics();

      res.status(200).json({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: statistics
      });

    } catch (error) {
      console.error('Get order statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get specific order details with full information
  getOrderDetails: async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await Order.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order details retrieved successfully',
        data: order
      });

    } catch (error) {
      console.error('Get order details error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

export default staffOrderController;