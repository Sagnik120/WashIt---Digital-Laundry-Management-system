const { query } = require('../config/database');

class LaundryOrder {
  static async create(orderData) {
    const { order_id, student_id, submission_date } = orderData;

    const result = await query(
      `INSERT INTO laundry_orders (order_id, student_id, submission_date) 
       VALUES ($1, $2, $3) RETURNING *`,
      [order_id, student_id, submission_date]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      `SELECT lo.*, u.full_name, u.laundry_id, u.hostel_name, u.room_number
       FROM laundry_orders lo
       JOIN users u ON lo.student_id = u.id
       WHERE lo.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByOrderId(orderId) {
    const result = await query(
      `SELECT lo.*, u.full_name, u.laundry_id, u.hostel_name, u.room_number
       FROM laundry_orders lo
       JOIN users u ON lo.student_id = u.id
       WHERE lo.order_id = $1`,
      [orderId]
    );
    return result.rows[0];
  }

  static async getOrdersByStudent(studentId) {
    const result = await query(
      `SELECT lo.*, 
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = lo.id) as item_count
       FROM laundry_orders lo
       WHERE lo.student_id = $1
       ORDER BY lo.created_at DESC`,
      [studentId]
    );
    return result.rows;
  }

  static async getOrdersByHostel(hostelName) {
    const result = await query(
      `SELECT lo.*, u.full_name, u.laundry_id, u.room_number
       FROM laundry_orders lo
       JOIN users u ON lo.student_id = u.id
       WHERE u.hostel_name = $1 AND lo.status = 'in progress'
       ORDER BY lo.created_at DESC`,
      [hostelName]
    );
    return result.rows;
  }

  static async updateStatus(orderId, status, completedBy = null) {
    const result = await query(
      `UPDATE laundry_orders 
       SET status = $1, completed_at = CURRENT_TIMESTAMP, completed_by = $2 
       WHERE order_id = $3 RETURNING *`,
      [status, completedBy, orderId]
    );
    return result.rows[0];
  }

  static async getOrderDetails(orderId) {
    const result = await query(
      `SELECT lo.*, u.full_name, u.laundry_id, u.hostel_name, u.room_number,
              li.item_name, oi.quantity
       FROM laundry_orders lo
       JOIN users u ON lo.student_id = u.id
       JOIN order_items oi ON lo.id = oi.order_id
       JOIN laundry_items li ON oi.item_id = li.id
       WHERE lo.order_id = $1`,
      [orderId]
    );
    return result.rows;
  }
}

module.exports = LaundryOrder;