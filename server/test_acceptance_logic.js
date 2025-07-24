/**
 * Test script to verify acceptance logic
 * 
 * This script tests that accepting one campaign doesn't affect other campaigns
 * from the same influencer.
 */

const { initializeSupabase } = require('./src/config/database');

async function testAcceptanceLogic() {
  console.log('🧪 Testing acceptance logic...');
  
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
    
    // Step 2: Accept only the first request
    console.log('\n2️⃣ Accepting first request...');
    
    const firstRequest = createdRequests[0];
    console.log('Accepting request:', firstRequest);
    
    // Simulate the acceptance logic
    const { data: existingEntry, error: checkError } = await supabase
      .from('influencer_lists')
      .select('id')
      .eq('influencer_id', testInfluencerId)
      .eq('campaign_id', firstRequest.campaign_id)
      .eq('list_type', 'selected')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing entry:', checkError);
      return;
    }
    
    if (existingEntry) {
      console.log('✅ Influencer already selected for this campaign');
    } else {
      console.log('➕ Adding influencer to selected list for this campaign');
      
      const { error: listError } = await supabase
        .from('influencer_lists')
        .insert({
          influencer_id: testInfluencerId,
          list_type: 'selected',
          campaign_id: firstRequest.campaign_id,
          added_at: new Date().toISOString()
        });
      
      if (listError) {
        console.error('Error adding to influencer_lists:', listError);
        return;
      } else {
        console.log('✅ Successfully added influencer to selected list');
      }
    }
    
    // Step 3: Check that other requests are still pending
    console.log('\n3️⃣ Checking other requests...');
    
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
    
    // Step 5: Verify results
    console.log('\n5️⃣ Verifying results...');
    
    const expectedListEntries = 1; // Should only have one entry for the accepted campaign
    const expectedRemainingRequests = createdRequests.length - 1; // Should have one less pending request
    
    console.log(`Expected list entries: ${expectedListEntries}, Actual: ${listEntries.length}`);
    console.log(`Expected remaining requests: ${expectedRemainingRequests}, Actual: ${remainingRequests.length}`);
    
    if (listEntries.length === expectedListEntries && remainingRequests.length === expectedRemainingRequests) {
      console.log('✅ Test PASSED: Acceptance logic works correctly!');
    } else {
      console.log('❌ Test FAILED: Acceptance logic has issues!');
    }
    
    // Step 6: Cleanup
    console.log('\n6️⃣ Cleaning up test data...');
    
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
testAcceptanceLogic().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
}); 