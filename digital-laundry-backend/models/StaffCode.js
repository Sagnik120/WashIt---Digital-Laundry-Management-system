const { query } = require('../config/database');

class StaffCode {
  static async create(staffCode, createdBy) {
    const result = await query(
      `INSERT INTO staff_codes (staff_code, created_by) 
       VALUES ($1, $2) RETURNING *`,
      [staffCode, createdBy]
    );
    return result.rows[0];
  }

  static async findByCode(staffCode) {
    const result = await query(
      'SELECT * FROM staff_codes WHERE staff_code = $1 AND is_used = false',
      [staffCode]
    );
    return result.rows[0];
  }

  static async markAsUsed(staffCode) {
    const result = await query(
      'UPDATE staff_codes SET is_used = true WHERE staff_code = $1 RETURNING *',
      [staffCode]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await query(
      `SELECT sc.*, u.full_name as created_by_name 
       FROM staff_codes sc
       LEFT JOIN users u ON sc.created_by = u.id
       ORDER BY sc.created_at DESC`
    );
    return result.rows;
  }

  static async getUnusedCodes() {
    const result = await query(
      'SELECT * FROM staff_codes WHERE is_used = false ORDER BY created_at DESC'
    );
    return result.rows;
  }
}

module.exports = StaffCode;