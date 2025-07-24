const { createClient } = require('@supabase/supabase-js');
const config = require('./environment');

/**
 * Initialize Supabase client
 * @returns {Object} Supabase client instance
 */
const initializeSupabase = () => {
  try {
    const supabase = createClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: false
        }
      }
    );

    if (config.nodeEnv === 'development') {
      console.log('✅ Supabase client initialized successfully');
    }

    return supabase;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    throw error;
  }
};

/**
 * Get Supabase client with service role (for admin operations)
 * @returns {Object} Supabase client with service role
 */
const getServiceSupabase = () => {
  if (!config.supabase.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }

  return createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: false
      }
    }
  );
};

module.exports = {
  initializeSupabase,
  getServiceSupabase
}; 