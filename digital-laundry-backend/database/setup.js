const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations/001_initial_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement with error handling for already-existing objects
    for (const statement of statements) {
      try {
        if (statement.trim()) {
          await query(statement);
        }
      } catch (error) {
        // Ignore "already exists" errors, throw others
        if (!error.message.includes('already exists') && 
            !error.message.includes('42710') && // duplicate object
            !error.message.includes('42P07')) { // duplicate table
          throw error;
        }
        console.log(`ℹ️  Object already exists: ${error.message.split('\n')[0]}`);
      }
    }
    
    console.log('✅ Database setup completed successfully');
    
    // Clean up expired OTPs periodically
    setInterval(async () => {
      try {
        await query('DELETE FROM otp_verifications WHERE expires_at < NOW()');
        console.log('🔄 Expired OTPs cleaned up');
      } catch (error) {
        console.error('Error cleaning up expired OTPs:', error);
      }
    }, 60 * 60 * 1000); // Run every hour
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    throw error;
  }
};

module.exports = setupDatabase;