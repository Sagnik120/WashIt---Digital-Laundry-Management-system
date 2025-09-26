import db from '../config/database.js';

class Order {
  // Generate order ID: "HOSTEL-USERID-TIMESTAMP"
  static generateOrderId(hostelName, userId) {
    const timestamp = Date.now().toString().slice(-6);
    return `${hostelName.toUpperCase().replace(/\s+/g, '')}-${userId}-${timestamp}`;
  }

  // Generate laundry ID for tracking
  static generateLaundryId(studentId) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `LND-${studentId}-${random}`;
  }

  // Create a new laundry order
  static async createOrder(orderData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');

      // 1. Generate order ID and laundry ID
      const orderId = this.generateOrderId(orderData.hostel_name, orderData.student_id);
      const laundryId = this.generateLaundryId(orderData.student_id);

      // 2. Calculate total items
      const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

      // 3. Insert into laundry_orders with ALL required fields
      const orderQuery = `
        INSERT INTO laundry_orders (
          order_id, student_id, student_name, hostel_name, room_number, 
          laundry_id, submission_date, total_items
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, order_id, student_id, status, submission_date, created_at
      `;
      
      const orderResult = await client.query(orderQuery, [
        orderId,
        orderData.student_id,
        orderData.student_name,
        orderData.hostel_name,
        orderData.room_number,
        laundryId,
        orderData.submission_date,
        totalItems
      ]);

      const order = orderResult.rows[0];

      // 4. Insert order items with item_name
      if (orderData.items && orderData.items.length > 0) {
        for (const item of orderData.items) {
          const itemQuery = `
            INSERT INTO order_items (order_id, student_id, item_id, item_name, quantity)
            VALUES ($1, $2, $3, $4, $5)
          `;
          await client.query(itemQuery, [
            order.id, 
            orderData.student_id, 
            item.item_id, 
            item.item_name, 
            item.quantity
          ]);
        }
      }

      await client.query('COMMIT');
      
      // 5. Get complete order details
      const completeOrder = await this.getOrderById(order.id);
      return completeOrder;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get order by ID with item details
 // Get order by ID with item details
// Get order by ID with item details
// Add this method to your Order class in models/Order.js

// Get order by order_id string (like "HOSTEL-USER-TIMESTAMP")
static async getOrderByOrderIdString(orderIdString) {
  try {
    const query = `
      SELECT 
        lo.id,
        lo.order_id,
        lo.student_id,
        lo.student_name,
        lo.hostel_name,
        lo.room_number,
        lo.laundry_id,
        lo.status,
        lo.submission_date,
        lo.total_items,
        lo.created_at,
        lo.completed_at,
        lo.completed_by,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'item_id', oi.item_id,
            'item_name', oi.item_name,
            'quantity', oi.quantity
          )
        ) as items
      FROM laundry_orders lo
      LEFT JOIN order_items oi ON lo.id = oi.order_id
      WHERE lo.order_id = $1
      GROUP BY lo.id
    `;

    const result = await db.query(query, [orderIdString]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in getOrderByOrderIdString:', error);
    throw error;
  }
}


  // Get all orders for a student
  static async getOrdersByStudent(studentId) {
    const query = `
      SELECT 
        lo.id,
        lo.order_id,
        lo.laundry_id,
        lo.status,
        lo.submission_date,
        lo.total_items,
        lo.created_at,
        lo.completed_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'item_name', oi.item_name,
            'quantity', oi.quantity
          )
        ) as items
      FROM laundry_orders lo
      LEFT JOIN order_items oi ON lo.id = oi.order_id
      WHERE lo.student_id = $1
      GROUP BY lo.id
      ORDER BY lo.created_at DESC
    `;

    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  // Get order by laundry ID (for unique identification)
  static async getOrderByLaundryId(laundryId) {
    const query = `
      SELECT 
        lo.*,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'item_name', oi.item_name,
            'quantity', oi.quantity
          )
        ) as items
      FROM laundry_orders lo
      LEFT JOIN order_items oi ON lo.id = oi.order_id
      WHERE lo.laundry_id = $1
      GROUP BY lo.id
    `;

    const result = await db.query(query, [laundryId]);
    return result.rows[0];
  }

  // Get all laundry items
  static async getLaundryItems() {
    const query = `
      SELECT id, item_name 
      FROM laundry_items 
      ORDER BY item_name
    `;
    
    const result = await db.query(query);
    return result.rows;
  }

  // Get item by name (for validation)
  static async getItemByName(itemName) {
    const query = `
      SELECT id, item_name 
      FROM laundry_items 
      WHERE item_name = $1
    `;
    
    const result = await db.query(query, [itemName]);
    return result.rows[0];
  }

  // ================= STAFF METHODS =================

  // Get all orders with student details (for staff)
  static async getAllOrdersForStaff(filters = {}) {
    let query = `
      SELECT 
        lo.id,
        lo.order_id,
        lo.laundry_id,
        lo.student_id,
        lo.student_name,
        lo.hostel_name,
        lo.room_number,
        lo.status,
        lo.submission_date,
        lo.total_items,
        lo.created_at,
        lo.completed_at,
        lo.completed_by,
        u.roll_number,
        u.phone_number,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'item_name', oi.item_name,
            'quantity', oi.quantity
          )
        ) as items
      FROM laundry_orders lo
      LEFT JOIN users u ON lo.student_id = u.id
      LEFT JOIN order_items oi ON lo.id = oi.order_id
    `;

    const whereConditions = [];
    const queryParams = [];
    let paramCount = 0;

    // Add filters
    if (filters.status) {
      paramCount++;
      whereConditions.push(`lo.status = $${paramCount}`);
      queryParams.push(filters.status);
    }

    if (filters.hostel_name) {
      paramCount++;
      whereConditions.push(`lo.hostel_name = $${paramCount}`);
      queryParams.push(filters.hostel_name);
    }

    if (filters.student_id) {
      paramCount++;
      whereConditions.push(`lo.student_id = $${paramCount}`);
      queryParams.push(filters.student_id);
    }

    if (filters.date_from) {
      paramCount++;
      whereConditions.push(`lo.submission_date >= $${paramCount}`);
      queryParams.push(filters.date_from);
    }

    if (filters.date_to) {
      paramCount++;
      whereConditions.push(`lo.submission_date <= $${paramCount}`);
      queryParams.push(filters.date_to);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += ` GROUP BY lo.id, u.id ORDER BY lo.created_at DESC`;

    const result = await db.query(query, queryParams);
    return result.rows;
  }

  // Get orders by hostel (for staff)
  static async getOrdersByHostel(hostelName) {
    const query = `
      SELECT 
        lo.id,
        lo.order_id,
        lo.laundry_id,
        lo.student_id,
        lo.student_name,
        lo.hostel_name,
        lo.room_number,
        lo.status,
        lo.submission_date,
        lo.total_items,
        lo.created_at,
        u.roll_number,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'item_name', oi.item_name,
            'quantity', oi.quantity
          )
        ) as items
      FROM laundry_orders lo
      LEFT JOIN users u ON lo.student_id = u.id
      LEFT JOIN order_items oi ON lo.id = oi.order_id
      WHERE lo.hostel_name = $1
      GROUP BY lo.id, u.id
      ORDER BY lo.created_at DESC
    `;

    const result = await db.query(query, [hostelName]);
    return result.rows;
  }

  // Get orders by status (for staff)
  static async getOrdersByStatus(status) {
    const query = `
      SELECT 
        lo.id,
        lo.order_id,
        lo.laundry_id,
        lo.student_id,
        lo.student_name,
        lo.hostel_name,
        lo.room_number,
        lo.status,
        lo.submission_date,
        lo.total_items,
        lo.created_at,
        u.roll_number,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'item_name', oi.item_name,
            'quantity', oi.quantity
          )
        ) as items
      FROM laundry_orders lo
      LEFT JOIN users u ON lo.student_id = u.id
      LEFT JOIN order_items oi ON lo.id = oi.order_id
      WHERE lo.status = $1
      GROUP BY lo.id, u.id
      ORDER BY lo.created_at DESC
    `;

    const result = await db.query(query, [status]);
    return result.rows;
  }

  // Update order status (for staff)
  static async updateOrderStatus(orderId, status, completedBy = null) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');

      let query, params;

      if (status === 'completed') {
        query = `
          UPDATE laundry_orders 
          SET status = $1, completed_at = CURRENT_TIMESTAMP, completed_by = $2 
          WHERE id = $3 
          RETURNING *
        `;
        params = [status, completedBy, orderId];
      } else {
        query = `
          UPDATE laundry_orders 
          SET status = $1, completed_at = NULL, completed_by = NULL 
          WHERE id = $2 
          RETURNING *
        `;
        params = [status, orderId];
      }

      const result = await client.query(query, params);
      
      await client.query('COMMIT');
      return result.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get order statistics (for staff dashboard)
  static async getOrderStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'in progress' THEN 1 END) as in_progress_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COALESCE(SUM(total_items), 0) as total_items_processed,
        COUNT(DISTINCT student_id) as total_students_served
      FROM laundry_orders
    `;

    const result = await db.query(query);
    return result.rows[0];
  }
}

export default Order;