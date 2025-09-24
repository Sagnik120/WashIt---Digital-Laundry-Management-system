const { query } = require('../config/database');

class OrderItem {
  static async createMultiple(orderId, items) {
    const values = items.map(item => `(${orderId}, ${item.item_id}, ${item.quantity})`).join(',');
    
    const result = await query(
      `INSERT INTO order_items (order_id, item_id, quantity) 
       VALUES ${values} RETURNING *`
    );

    return result.rows;
  }

  static async getItemsByOrder(orderId) {
    const result = await query(
      `SELECT li.item_name, oi.quantity 
       FROM order_items oi
       JOIN laundry_items li ON oi.item_id = li.id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return result.rows;
  }
}

module.exports = OrderItem;