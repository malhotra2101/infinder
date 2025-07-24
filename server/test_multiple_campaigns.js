/**
 * Test Multiple Campaign Acceptance
 * 
 * This script tests that influencers can be accepted for multiple campaigns separately
 * after the database migration is applied.
 */

const { initializeSupabase } = require('./src/config/database');

async function testMultipleCampaigns() {
  console.log('🧪 Testing multiple campaign acceptance...');
  
  const supabase = initializeSupabase();
  
  try {
    // Step 1: Create test collaboration requests for the same influencer on different campaigns
    console.log('\n1️⃣ Creating test collaboration requests...');
    
    const testInfluencerId = 16; // Use a test influencer ID
    const testBrandId = 1; // Use a test brand ID
    
    // Get some campaign IDs
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, campaign_name')
      .limit(3);
    
    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return;
    }
    
    console.log('Available campaigns:', campaigns);
    
    // Create collaboration requests for different campaigns
    const requestsToCreate = campaigns.map(campaign => ({
      sender_type: 'influencer',
      sender_id: testInfluencerId,
      receiver_type: 'brand',
      receiver_id: testBrandId,
      campaign_id: campaign.id,
      request_type: 'campaign_assignment',
      status: 'pending',
      created_at: new Date().toISOString()
    }));
    
    const { data: createdRequests, error: createError } = await supabase
      .from('collaboration_requests')
      .insert(requestsToCreate)
      .select('*');
    
    if (createError) {
      console.error('Error creating test requests:', createError);
      return;
    }
    
    console.log('✅ Created test requests:', createdRequests);
    
    // Step 2: Accept the first campaign
    console.log('\n2️⃣ Accepting first campaign...');
    
    const firstRequest = createdRequests[0];
    console.log('Accepting request for campaign:', firstRequest.campaign_id);
    
    // Add to influencer_lists for first campaign
    const { error: firstListError } = await supabase
      .from('influencer_lists')
      .insert({
        influencer_id: testInfluencerId,
        list_type: 'selected',
        campaign_id: firstRequest.campaign_id,
        added_at: new Date().toISOString()
      });
    
    if (firstListError) {
      console.error('❌ Error adding first campaign to list:', firstListError);
      console.log('This might indicate the migration hasn\'t been applied yet.');
      return;
    }
    
    console.log('✅ Successfully added first campaign to selected list');
    
    // Step 3: Accept the second campaign
    console.log('\n3️⃣ Accepting second campaign...');
    
    const secondRequest = createdRequests[1];
    console.log('Accepting request for campaign:', secondRequest.campaign_id);
    
    // Add to influencer_lists for second campaign
    const { error: secondListError } = await supabase
      .from('influencer_lists')
      .insert({
        influencer_id: testInfluencerId,
        list_type: 'selected',
        campaign_id: secondRequest.campaign_id,
        added_at: new Date().toISOString()
      });
    
    if (secondListError) {
      console.error('❌ Error adding second campaign to list:', secondListError);
      console.log('This indicates the migration is needed or has issues.');
      return;
    }
    
    console.log('✅ Successfully added second campaign to selected list');
    
    // Step 4: Check influencer_lists entries
    console.log('\n4️⃣ Checking influencer_lists entries...');
    
    const { data: listEntries, error: listError } = await supabase
      .from('influencer_lists')
      .select('*')
      .eq('influencer_id', testInfluencerId)
      .eq('list_type', 'selected');
    
    if (listError) {
      console.error('Error checking list entries:', listError);
      return;
    }
    
    console.log('📋 Influencer list entries:', listEntries);
    
    // Step 5: Check remaining collaboration requests
    console.log('\n5️⃣ Checking remaining collaboration requests...');
    
    const { data: remainingRequests, error: remainingError } = await supabase
      .from('collaboration_requests')
      .select('*')
      .eq('sender_id', testInfluencerId)
      .eq('sender_type', 'influencer')
      .eq('status', 'pending');
    
    if (remainingError) {
      console.error('Error checking remaining requests:', remainingError);
      return;
    }
    
    console.log('📋 Remaining pending requests:', remainingRequests);
    
    // Step 6: Verify results
    console.log('\n6️⃣ Verifying results...');
    
    const expectedListEntries = 2; // Should have two entries for two accepted campaigns
    const expectedRemainingRequests = createdRequests.length - 2; // Should have one less pending request
    
    console.log(`Expected list entries: ${expectedListEntries}, Actual: ${listEntries.length}`);
    console.log(`Expected remaining requests: ${expectedRemainingRequests}, Actual: ${remainingRequests.length}`);
    
    if (listEntries.length === expectedListEntries && remainingRequests.length === expectedRemainingRequests) {
      console.log('✅ Test PASSED: Multiple campaign acceptance works correctly!');
      console.log('🎉 The migration has been successfully applied!');
    } else {
      console.log('❌ Test FAILED: Multiple campaign acceptance has issues!');
      console.log('🔧 The migration might not be applied correctly.');
    }
    
    // Step 7: Cleanup
    console.log('\n7️⃣ Cleaning up test data...');
    
    // Delete test requests
    const requestIds = createdRequests.map(req => req.id);
    const { error: deleteRequestsError } = await supabase
      .from('collaboration_requests')
      .delete()
      .in('id', requestIds);
    
    if (deleteRequestsError) {
      console.error('Error deleting test requests:', deleteRequestsError);
    } else {
      console.log('✅ Deleted test requests');
    }
    
    // Delete test list entries
    const listEntryIds = listEntries.map(entry => entry.id);
    if (listEntryIds.length > 0) {
      const { error: deleteListError } = await supabase
        .from('influencer_lists')
        .delete()
        .in('id', listEntryIds);
      
      if (deleteListError) {
        console.error('Error deleting test list entries:', deleteListError);
      } else {
        console.log('✅ Deleted test list entries');
      }
    }
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testMultipleCampaigns().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
}); 