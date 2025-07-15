// Load environment variables
require('dotenv').config();

const { initializeSupabase } = require('./src/config/database');

async function testDatabase() {
  try {
    console.log('Testing Supabase connection...');
    
    const supabase = initializeSupabase();
    
    // Test basic connection
    console.log('1. Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('influencers')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Check if table exists and has data
    console.log('2. Checking influencers table...');
    const { data, error, count } = await supabase
      .from('influencers')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('❌ Error querying influencers table:', error);
      return;
    }
    
    console.log(`✅ Influencers table accessible. Found ${count || 0} records`);
    
    if (data && data.length > 0) {
      console.log('📊 Sample data:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('⚠️  No data found in influencers table');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabase(); 