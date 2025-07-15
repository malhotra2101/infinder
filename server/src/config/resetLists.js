const { createClient } = require('@supabase/supabase-js');

// Use the same configuration as database.js
const SUPABASE_URL = "https://uojpdnzjinmbpamxtxco.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvanBkbnpqaW5tYnBhbXh0eGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzc3NDMsImV4cCI6MjA2NzExMzc0M30.OxaBUldXCqcSEH2-1kgr0A4ASZ4D7rYY8rhjHnIyMd4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function resetInfluencerLists() {
  try {
    console.log('🗑️  Starting influencer lists reset...');
    
    // Delete all records from influencer_lists table
    const { error } = await supabase
      .from('influencer_lists')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (error) {
      console.error('❌ Error resetting influencer lists:', error);
      return;
    }
    
    console.log('✅ Successfully reset all influencer lists!');
    console.log('📊 All selected and rejected influencers have been removed.');
    console.log('🔄 You can now start fresh with selecting and rejecting influencers.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the reset function
resetInfluencerLists(); 