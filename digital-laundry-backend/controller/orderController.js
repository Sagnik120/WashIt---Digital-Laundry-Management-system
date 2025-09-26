import Order from '../models/Order.js';
import User from '../models/User.js';

const orderController = {
  // Submit a new laundry order
  submitOrder: async (req, res) => {
    try {
      const studentId = req.user.id;
      const { submission_date, items } = req.body;

      // Validate required fields
      if (!submission_date || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Submission date and at least one item are required'
        });
      }

      // Validate items structure and get item IDs
      const validatedItems = [];
      for (const item of items) {
        if (!item.item_name || !item.quantity || item.quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Each item must have item_name and quantity greater than 0'
          });
        }

        // Get item ID from item_name
        const itemDetails = await Order.getItemByName(item.item_name);
        if (!itemDetails) {
          return res.status(400).json({
            success: false,
            message: `Invalid item name: ${item.item_name}`
          });
        }

        validatedItems.push({
          item_id: itemDetails.id,
          item_name: item.item_name,
          quantity: item.quantity
        });
      }

      // Get user details for order information
      const user = await User.findById(studentId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has required profile information
      if (!user.hostel_name || !user.room_number) {
        return res.status(400).json({
          success: false,
          message: 'Please complete your profile with hostel and room information'
        });
      }

      // Prepare order data with all required fields
      const orderData = {
        student_id: studentId,
        student_name: user.full_name,
        hostel_name: user.hostel_name,
        room_number: user.room_number,
        submission_date: submission_date,
        items: validatedItems
      };

      // Create the order
      const newOrder = await Order.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: 'Laundry order submitted successfully',
        data: {
          order_id: newOrder.order_id,
          laundry_id: newOrder.laundry_id, // Unique identifier for client
          student_name: newOrder.student_name,
          hostel_name: newOrder.hostel_name,
          room_number: newOrder.room_number,
          submission_date: newOrder.submission_date,
          total_items: newOrder.total_items,
          status: newOrder.status,
          items: newOrder.items,
          created_at: newOrder.created_at
        }
      });

    } catch (error) {
      console.error('Submit order error:', error);
      
      if (error.code === '23503') { // Foreign key violation
        return res.status(400).json({
          success: false,
          message: 'Invalid data provided'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get all laundry items available
  getLaundryItems: async (req, res) => {
    try {
      const items = await Order.getLaundryItems();

      res.status(200).json({
        success: true,
        message: 'Laundry items retrieved successfully',
        data: items
      });

    } catch (error) {
      console.error('Get laundry items error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get order history for student
  getOrderHistory: async (req, res) => {
    try {
      const studentId = req.user.id;

      const orders = await Order.getOrdersByStudent(studentId);

      res.status(200).json({
        success: true,
        message: 'Order history retrieved successfully',
        data: orders
      });

    } catch (error) {
      console.error('Get order history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get specific order details
getOrderDetails: async (req, res) => {
  try {
    const { orderId } = req.params;
    const studentId = req.user.id;

    console.log('🔍 DEBUG Order Details Request:');
    console.log('Received orderId:', orderId);
    console.log('Type of orderId:', typeof orderId);

    let order;

    // ✅ FIX: Handle both numeric ID and order_id string
    if (!isNaN(parseInt(orderId)) && parseInt(orderId) > 0) {
      // It's a numeric ID (database primary key)
      console.log('🔍 Looking up by numeric ID');
      order = await Order.getOrderById(parseInt(orderId));
    } else {
      // It's an order_id string (like "G5-21-024023")
      console.log('🔍 Looking up by order_id string');
      order = await Order.getOrderByOrderIdString(orderId);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify the order belongs to the student
    if (order.student_id !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this order'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order details retrieved successfully',
      data: order
    });

  } catch (error) {
    console.error('Get order details error:', error);
    
    // Handle specific PostgreSQL error
    if (error.code === '22P02') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
},

  // Get order by laundry ID (for unique identification)
  getOrderByLaundryId: async (req, res) => {
    try {
      const { laundryId } = req.params;
      const studentId = req.user.id;

      const order = await Order.getOrderByLaundryId(laundryId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Verify the order belongs to the student
      if (order.student_id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this order'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order details retrieved successfully',
        data: order
      });

    } catch (error) {
      console.error('Get order by laundry ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

export default orderController;