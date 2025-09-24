const { query } = require('../config/database');

class LaundryItem {
  static async getAll() {
    const result = await query('SELECT * FROM laundry_items ORDER BY item_name');
    return result.rows;
  }

  static async findByName(itemName) {
    const result = await query(
      'SELECT * FROM laundry_items WHERE item_name = $1',
      [itemName]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM laundry_items WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = LaundryItem;