import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://uojpdnzjinmbpamxtxco.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvanBkbnpqaW5tYnBhbXh0eGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzc3NDMsImV4cCI6MjA2NzExMzc0M30.OxaBUldXCqcSE";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('influencers').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test influencers table
    const { data: influencers, error: influencersError } = await supabase
      .from('influencers')
      .select('*')
      .limit(3);
    
    if (influencersError) {
      console.error('❌ Error accessing influencers table:', influencersError);
    } else {
      console.log('✅ Influencers table accessible. Found', influencers?.length || 0, 'records');
      if (influencers && influencers.length > 0) {
        console.log('📊 Sample influencer:', influencers[0]);
      }
    }
    
    // Test countries table
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .limit(3);
    
    if (countriesError) {
      console.error('❌ Error accessing countries table:', countriesError);
    } else {
      console.log('✅ Countries table accessible. Found', countries?.length || 0, 'records');
      if (countries && countries.length > 0) {
        console.log('📊 Sample country:', countries[0]);
      }
    }
    
    // Test influencer_lists table
    const { data: lists, error: listsError } = await supabase
      .from('influencer_lists')
      .select('*')
      .limit(3);
    
    if (listsError) {
      console.error('❌ Error accessing influencer_lists table:', listsError);
    } else {
      console.log('✅ Influencer lists table accessible. Found', lists?.length || 0, 'records');
      if (lists && lists.length > 0) {
        console.log('📊 Sample list entry:', lists[0]);
      }
    }
    
    console.log('🎉 All tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testSupabaseConnection(); 