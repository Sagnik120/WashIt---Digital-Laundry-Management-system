import db from '../config/database.js';

class StaffCode {
  // Generate a unique staff code
  static generateStaffCode() {
    const prefix = 'STAFF';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  }

  // Create a new staff code
  static async createStaffCode(createdBy) {
    let staffCode;
    let isUnique = false;
    let attempts = 0;

    // Generate unique staff code (max 5 attempts to avoid infinite loop)
    while (!isUnique && attempts < 5) {
      staffCode = this.generateStaffCode();
      const existingCode = await db.query(
        'SELECT id FROM staff_codes WHERE staff_code = $1',
        [staffCode]
      );
      if (existingCode.rows.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique staff code');
    }

    const result = await db.query(
      `INSERT INTO staff_codes (staff_code, created_by) 
       VALUES ($1, $2) RETURNING *`,
      [staffCode, createdBy]
    );

    return result.rows[0];
  }

  // Get all staff codes with creator info
  static async getAllStaffCodes() {
    const result = await db.query(
      `SELECT sc.*, u.full_name as created_by_name, u.email as created_by_email
       FROM staff_codes sc
       LEFT JOIN users u ON sc.created_by = u.id
       ORDER BY sc.created_at DESC`
    );
    return result.rows;
  }

  // Get staff codes by creator
  static async getStaffCodesByCreator(createdBy) {
    const result = await db.query(
      `SELECT sc.*, u.full_name as created_by_name 
       FROM staff_codes sc
       LEFT JOIN users u ON sc.created_by = u.id
       WHERE sc.created_by = $1
       ORDER BY sc.created_at DESC`,
      [createdBy]
    );
    return result.rows;
  }

  // Check if staff code exists and is unused
  static async validateStaffCode(staffCode) {
    const result = await db.query(
      'SELECT * FROM staff_codes WHERE staff_code = $1 AND is_used = false',
      [staffCode]
    );
    return result.rows[0];
  }

  // Mark staff code as used
  static async markAsUsed(staffCode, staffId) {
    const result = await db.query(
      'UPDATE staff_codes SET is_used = true WHERE staff_code = $1 RETURNING *',
      [staffCode]
    );
    return result.rows[0];
  }
}

export default StaffCode;