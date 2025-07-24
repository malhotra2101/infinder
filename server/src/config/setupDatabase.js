/**
 * Database Setup Script
 * 
 * This script runs all the necessary SQL files to set up the database
 * with the required tables and columns for the dashboard functionality.
 */

const fs = require('fs');
const path = require('path');
const { initializeSupabase } = require('./supabase');

/**
 * Read and execute SQL file
 * @param {string} filePath - Path to SQL file
 * @returns {Promise<void>}
 */
const executeSqlFile = async (filePath) => {
  try {
    const supabase = initializeSupabase();
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📄 Executing: ${path.basename(filePath)}`);
    
    // Split SQL by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`❌ Error executing statement:`, error);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }
    
    console.log(`✅ Completed: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error executing ${filePath}:`, error);
  }
};

/**
 * Main setup function
 */
const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');
    
    const configDir = path.join(__dirname);
    const sqlFiles = [
      'createDashboardTables.sql',
      'updateInfluencersTable.sql',
      'createInfluencerListsTable.sql'
    ];
    
    for (const sqlFile of sqlFiles) {
      const filePath = path.join(configDir, sqlFile);
      if (fs.existsSync(filePath)) {
        await executeSqlFile(filePath);
      } else {
        console.warn(`⚠️  SQL file not found: ${sqlFile}`);
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 