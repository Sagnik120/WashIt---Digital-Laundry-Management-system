import db from '../config/database.js';

class User {
  static async findById(userId) {
    const query = `
      SELECT 
        id, email, full_name, role, roll_number, hostel_name, 
        room_number, phone_number, department_name, passing_year,
        profile_picture, laundry_id, is_verified, created_at
      FROM users 
      WHERE id = $1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async updateProfile(userId, updateData) {
    const {
      fullName, roll_number, hostel_name, room_number, 
      phone_number, department_name, passing_year
    } = updateData;

    const query = `
      UPDATE users 
      SET 
        full_name = $1, roll_number = $2, hostel_name = $3, 
        room_number = $4, phone_number = $5, department_name = $6, 
        passing_year = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const result = await db.query(query, [
      full_name, roll_number, hostel_name, room_number,
      phone_number, department_name, passing_year, userId
    ]);

    return result.rows[0];
  }

  // New method to get profile by user ID
  static async getProfile(userId) {
    try {
      const query = `
        SELECT 
          id, email, full_name, role, roll_number, hostel_name, 
          room_number, phone_number, department_name, passing_year,
          profile_picture, laundry_id, is_verified, created_at, updated_at
        FROM users 
        WHERE id = $1
      `;
      
      const result = await db.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // New method to update profile with dynamic fields
  static async updateUserProfile(userId, updateFields) {
    try {
      const allowedFields = [
        'full_name', 'roll_number', 'hostel_name', 'room_number',
        'phone_number', 'department_name', 'passing_year', 'profile_picture'
      ];
      
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      // Build dynamic update query
      Object.keys(updateFields).forEach(field => {
        if (allowedFields.includes(field) && updateFields[field] !== undefined) {
          setClauses.push(`${field} = $${paramCount}`);
          values.push(updateFields[field]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add updated_at and user_id
      setClauses.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default User;