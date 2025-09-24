const { query } = require('../config/database');

class User {
  static async create(userData) {
    const {
      email, password, full_name, role, roll_number, hostel_name, 
      room_number, phone_number, department_name, passing_year, 
      profile_picture, laundry_id
    } = userData;

    const result = await query(
      `INSERT INTO users (
        email, password, full_name, role, roll_number, hostel_name, 
        room_number, phone_number, department_name, passing_year, 
        profile_picture, laundry_id, is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING *`,
      [
        email, password, full_name, role, roll_number, hostel_name,
        room_number, phone_number, department_name, passing_year,
        profile_picture, laundry_id, role === 'admin' ? true : false
      ]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByLaundryId(laundryId) {
    const result = await query(
      'SELECT * FROM users WHERE laundry_id = $1',
      [laundryId]
    );
    return result.rows[0];
  }

  static async updateProfile(id, updateData) {
    const {
      full_name, roll_number, email, hostel_name, room_number,
      department_name, passing_year, phone_number, profile_picture
    } = updateData;

    const result = await query(
      `UPDATE users SET 
        full_name = $1, roll_number = $2, email = $3, hostel_name = $4,
        room_number = $5, department_name = $6, passing_year = $7,
        phone_number = $8, profile_picture = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [
        full_name, roll_number, email, hostel_name, room_number,
        department_name, passing_year, phone_number, profile_picture, id
      ]
    );

    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const result = await query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newPassword, id]
    );
    return result.rows[0];
  }

  static async verifyEmail(email) {
    const result = await query(
      'UPDATE users SET is_verified = true WHERE email = $1 RETURNING *',
      [email]
    );
    return result.rows[0];
  }

  static async getStudentsByHostel(hostelName) {
    const result = await query(
      'SELECT id, full_name, roll_number, email, room_number, laundry_id FROM users WHERE role = $1 AND hostel_name = $2',
      ['student', hostelName]
    );
    return result.rows;
  }

  static async getAllStaff() {
    const result = await query(
      'SELECT id, full_name, email, created_at FROM users WHERE role = $1',
      ['staff']
    );
    return result.rows;
  }

  static async updateLaundryId(id, laundryId) {
    const result = await query(
        'UPDATE users SET laundry_id = $1 WHERE id = $2 RETURNING *',
        [laundryId, id]
    );
    return result.rows[0];
}

  static async getStudentCountByHostel() {
    const result = await query(
      `SELECT hostel_name, COUNT(*) as student_count 
       FROM users WHERE role = 'student' 
       GROUP BY hostel_name`
    );
    return result.rows;
  }
}

module.exports = User;