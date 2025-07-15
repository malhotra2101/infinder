/**
 * Test Database Setup
 * 
 * Script to test if the database setup is working correctly.
 * Run this after setting up the database to verify everything is working.
 */

const { initializeSupabase } = require('./database');

/**
 * Test database connection and data
 */
const testSetup = async () => {
  try {
    console.log('🧪 Testing database setup...');
    
    const supabase = initializeSupabase();
    
    // Test countries table
    console.log('\n📊 Testing countries table...');
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .limit(5);
    
    if (countriesError) {
      console.error('❌ Countries table error:', countriesError);
    } else {
      console.log(`✅ Countries table working - Found ${countries.length} countries`);
      console.log('Sample countries:', countries.map(c => c.name).join(', '));
    }
    
    // Test influencers table
    console.log('\n👥 Testing influencers table...');
    const { data: influencers, error: influencersError } = await supabase
      .from('influencers')
      .select('*')
      .limit(5);
    
    if (influencersError) {
      console.error('❌ Influencers table error:', influencersError);
    } else {
      console.log(`✅ Influencers table working - Found ${influencers.length} influencers`);
      console.log('Sample influencers:', influencers.map(i => i.name).join(', '));
    }
    
    // Test API endpoints
    console.log('\n🌐 Testing API endpoints...');
    
    // Test GET /api/influencers
    try {
      const response = await fetch('http://localhost:5050/api/influencers?limit=3');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ GET /api/influencers working');
        console.log(`   Found ${data.data.length} influencers`);
      } else {
        console.log('❌ GET /api/influencers failed:', response.status);
      }
    } catch (error) {
      console.log('❌ GET /api/influencers error:', error.message);
    }
    
    // Test GET /api/influencers/countries/list
    try {
      const response = await fetch('http://localhost:5050/api/influencers/countries/list');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ GET /api/influencers/countries/list working');
        console.log(`   Found ${data.data.length} countries`);
      } else {
        console.log('❌ GET /api/influencers/countries/list failed:', response.status);
      }
    } catch (error) {
      console.log('❌ GET /api/influencers/countries/list error:', error.message);
    }
    
    console.log('\n🎉 Database setup test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure the backend server is running: pnpm run dev');
    console.log('2. Create .env.local in client directory with VITE_API_URL=http://localhost:5050/api');
    console.log('3. Start the frontend: cd client && pnpm run dev');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testSetup();
}

module.exports = { testSetup }; 