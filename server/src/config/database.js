const { createClient } = require('@supabase/supabase-js');

/**
 * Initialize Supabase client
 * @returns {Object} Supabase client instance
 */
const initializeSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  // Validate environment variables
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables:');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.error('   SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    throw new Error('Missing required Supabase environment variables');
  }
  
  // Validate URL format
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.error('❌ Invalid Supabase URL format:', supabaseUrl);
    throw new Error('Invalid Supabase URL format');
  }
  
  // Validate key format (should be a JWT token)
  if (!supabaseKey.startsWith('eyJ')) {
    console.error('❌ Invalid Supabase key format');
    throw new Error('Invalid Supabase key format');
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 Initializing Supabase connection...');
    console.log('   URL:', supabaseUrl);
    console.log('   Key:', supabaseKey.substring(0, 20) + '...');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
  
  return supabase;
};

module.exports = { initializeSupabase }; 