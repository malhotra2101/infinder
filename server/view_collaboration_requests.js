require('dotenv').config();
const { initializeSupabase } = require('./src/config/database');

async function viewCollaborationRequests() {
  try {
    console.log('🔍 Fetching collaboration requests from database...\n');
    
    const supabase = initializeSupabase();
    
    // Get all collaboration requests sent by influencers
    const { data: sentRequests, error: sentError } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `)
      .eq('sender_type', 'influencer')
      .order('created_at', { ascending: false });

    if (sentError) {
      console.error('❌ Error fetching sent requests:', sentError);
      return;
    }

    // Get all collaboration requests received by influencers
    const { data: receivedRequests, error: receivedError } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `)
      .eq('receiver_type', 'influencer')
      .order('created_at', { ascending: false });

    if (receivedError) {
      console.error('❌ Error fetching received requests:', receivedError);
      return;
    }

    console.log('📊 COLLABORATION REQUESTS SUMMARY');
    console.log('=====================================\n');

    console.log(`📤 REQUESTS SENT BY INFLUENCERS: ${sentRequests.length}`);
    console.log('----------------------------------------');
    
    if (sentRequests.length === 0) {
      console.log('No requests sent by influencers found.\n');
    } else {
      sentRequests.forEach((request, index) => {
        console.log(`${index + 1}. Request ID: ${request.id}`);
        console.log(`   Influencer ID: ${request.sender_id}`);
        console.log(`   Brand ID: ${request.receiver_id}`);
        console.log(`   Campaign: ${request.campaign?.campaign_name || 'N/A'}`);
        console.log(`   Brand: ${request.campaign?.brand_name || 'N/A'}`);
        console.log(`   Platform: ${request.campaign?.platform || 'N/A'}`);
        console.log(`   Request Type: ${request.request_type}`);
        console.log(`   Status: ${request.status}`);
        console.log(`   Created: ${new Date(request.created_at).toLocaleString()}`);
        console.log(`   Updated: ${new Date(request.updated_at).toLocaleString()}`);
        console.log('');
      });
    }

    console.log(`📥 REQUESTS RECEIVED BY INFLUENCERS: ${receivedRequests.length}`);
    console.log('------------------------------------------');
    
    if (receivedRequests.length === 0) {
      console.log('No requests received by influencers found.\n');
    } else {
      receivedRequests.forEach((request, index) => {
        console.log(`${index + 1}. Request ID: ${request.id}`);
        console.log(`   Brand ID: ${request.sender_id}`);
        console.log(`   Influencer ID: ${request.receiver_id}`);
        console.log(`   Campaign: ${request.campaign?.campaign_name || 'N/A'}`);
        console.log(`   Brand: ${request.campaign?.brand_name || 'N/A'}`);
        console.log(`   Platform: ${request.campaign?.platform || 'N/A'}`);
        console.log(`   Request Type: ${request.request_type}`);
        console.log(`   Status: ${request.status}`);
        console.log(`   Created: ${new Date(request.created_at).toLocaleString()}`);
        console.log(`   Updated: ${new Date(request.updated_at).toLocaleString()}`);
        console.log('');
      });
    }

    // Summary statistics
    console.log('📈 STATISTICS');
    console.log('-------------');
    
    const statusCounts = {};
    const influencerCounts = {};
    
    [...sentRequests, ...receivedRequests].forEach(request => {
      // Count by status
      statusCounts[request.status] = (statusCounts[request.status] || 0) + 1;
      
      // Count by influencer
      const influencerId = request.sender_type === 'influencer' ? request.sender_id : request.receiver_id;
      influencerCounts[influencerId] = (influencerCounts[influencerId] || 0) + 1;
    });

    console.log('Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    console.log('\nInfluencer Activity:');
    Object.entries(influencerCounts).forEach(([influencerId, count]) => {
      console.log(`  Influencer ${influencerId}: ${count} requests`);
    });

    console.log('\n✅ Database query completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
viewCollaborationRequests(); 