const { query } = require('../config/database');
const { validateHostelName } = require('./helpers');

const generateLaundryId = async (hostelName) => {
  if (!validateHostelName(hostelName)) {
    throw new Error('Invalid hostel name');
  }

  try {
    // Get the latest laundry ID for this hostel
    const result = await query(
      `SELECT laundry_id FROM users 
       WHERE hostel_name = $1 AND laundry_id IS NOT NULL 
       ORDER BY created_at DESC LIMIT 1`,
      [hostelName]
    );

    let sequenceNumber = 1;

    if (result.rows.length > 0) {
      const latestLaundryId = result.rows[0].laundry_id;
      const parts = latestLaundryId.split('-');
      if (parts.length === 2) {
        sequenceNumber = parseInt(parts[1]) + 1;
      }
    }

    // Ensure sequence number is at least 1 and format with leading zeros
    sequenceNumber = Math.max(1, sequenceNumber);
    const formattedSequence = sequenceNumber.toString().padStart(4, '0');

    return `${hostelName}-${formattedSequence}`;
  } catch (error) {
    console.error('Error generating laundry ID:', error);
    throw new Error('Failed to generate laundry ID');
  }
};

module.exports = generateLaundryId;