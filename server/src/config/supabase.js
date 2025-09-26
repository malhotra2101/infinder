const { createClient } = require('@supabase/supabase-js');

let cachedServiceClient = null;

function getServiceSupabase() {
  if (cachedServiceClient) return cachedServiceClient;
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !serviceKey) {
    const details = `Supabase env missing: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/ANON`;
    throw new Error(details);
  }
  cachedServiceClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: true, persistSession: false },
  });
  return cachedServiceClient;
}

module.exports = { getServiceSupabase };


