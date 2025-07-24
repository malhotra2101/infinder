/**
 * Campaign Auto-Completion Service
 * 
 * Automatically completes campaigns when their end date has passed
 * and updates the database accordingly.
 */

const { initializeSupabase } = require('../config/database');

/**
 * Check for campaigns that have ended and auto-complete them
 * @returns {Promise<Object>} Result of the auto-completion process
 */
const autoCompleteExpiredCampaigns = async () => {
  try {
    const supabase = initializeSupabase();
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    console.log(`🔍 Checking for expired campaigns as of ${currentDate}...`);

    // Find campaigns that have ended but are still active
    const { data: expiredCampaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .lt('end_date', currentDate);

    if (error) {
      console.error('❌ Error fetching expired campaigns:', error);
      return {
        success: false,
        message: 'Failed to fetch expired campaigns',
        error: error.message
      };
    }

    if (!expiredCampaigns || expiredCampaigns.length === 0) {
      console.log('✅ No expired campaigns found');
      return {
        success: true,
        message: 'No expired campaigns found',
        completedCount: 0,
        campaigns: []
      };
    }

    console.log(`📋 Found ${expiredCampaigns.length} expired campaign(s)`);

    // Update each expired campaign to completed status
    const updatePromises = expiredCampaigns.map(async (campaign) => {
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({
          status: 'completed'
        })
        .eq('id', campaign.id);

      if (updateError) {
        console.error(`❌ Error updating campaign ${campaign.id}:`, updateError);
        return {
          id: campaign.id,
          name: campaign.campaign_name,
          success: false,
          error: updateError.message
        };
      }

      console.log(`✅ Auto-completed campaign: ${campaign.campaign_name} (ID: ${campaign.id})`);
      return {
        id: campaign.id,
        name: campaign.campaign_name,
        success: true,
        endDate: campaign.end_date
      };
    });

    const results = await Promise.all(updatePromises);
    const successfulUpdates = results.filter(result => result.success);
    const failedUpdates = results.filter(result => !result.success);

    console.log(`✅ Successfully completed ${successfulUpdates.length} campaign(s)`);
    if (failedUpdates.length > 0) {
      console.log(`❌ Failed to complete ${failedUpdates.length} campaign(s)`);
    }

    return {
      success: true,
      message: `Auto-completion process completed`,
      completedCount: successfulUpdates.length,
      failedCount: failedUpdates.length,
      campaigns: results
    };

  } catch (error) {
    console.error('❌ Auto-completion service error:', error);
    return {
      success: false,
      message: 'Auto-completion service failed',
      error: error.message
    };
  }
};

/**
 * Get campaigns that are approaching their end date (within specified days)
 * @param {number} daysThreshold - Number of days before end date to consider "approaching"
 * @returns {Promise<Object>} Result with approaching campaigns
 */
const getApproachingEndDateCampaigns = async (daysThreshold = 7) => {
  try {
    const supabase = initializeSupabase();
    const currentDate = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(currentDate.getDate() + daysThreshold);

    const currentDateStr = currentDate.toISOString().split('T')[0];
    const thresholdDateStr = thresholdDate.toISOString().split('T')[0];

    console.log(`🔍 Checking for campaigns ending within ${daysThreshold} days...`);

    const { data: approachingCampaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .gte('end_date', currentDateStr)
      .lte('end_date', thresholdDateStr)
      .order('end_date', { ascending: true });

    if (error) {
      console.error('❌ Error fetching approaching campaigns:', error);
      return {
        success: false,
        message: 'Failed to fetch approaching campaigns',
        error: error.message
      };
    }

    return {
      success: true,
      message: `Found ${approachingCampaigns?.length || 0} campaigns approaching end date`,
      campaigns: approachingCampaigns || [],
      thresholdDays: daysThreshold
    };

  } catch (error) {
    console.error('❌ Error in approaching campaigns service:', error);
    return {
      success: false,
      message: 'Failed to check approaching campaigns',
      error: error.message
    };
  }
};

/**
 * Get campaign completion statistics
 * @returns {Promise<Object>} Campaign statistics
 */
const getCampaignCompletionStats = async () => {
  try {
    const supabase = initializeSupabase();
    const currentDate = new Date().toISOString().split('T')[0];

    // Get total campaigns
    const { data: totalCampaigns, error: totalError } = await supabase
      .from('campaigns')
      .select('status', { count: 'exact' });

    if (totalError) {
      throw totalError;
    }

    // Get active campaigns
    const { data: activeCampaigns, error: activeError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active');

    if (activeError) {
      throw activeError;
    }

    // Get completed campaigns
    const { data: completedCampaigns, error: completedError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'completed');

    if (completedError) {
      throw completedError;
    }

    // Get expired but not yet completed campaigns
    const { data: expiredCampaigns, error: expiredError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .lt('end_date', currentDate);

    if (expiredError) {
      throw expiredError;
    }

    return {
      success: true,
      stats: {
        total: totalCampaigns?.length || 0,
        active: activeCampaigns?.length || 0,
        completed: completedCampaigns?.length || 0,
        expired: expiredCampaigns?.length || 0,
        completionRate: totalCampaigns?.length > 0 
          ? ((completedCampaigns?.length || 0) / totalCampaigns.length * 100).toFixed(2)
          : 0
      }
    };

  } catch (error) {
    console.error('❌ Error getting campaign stats:', error);
    return {
      success: false,
      message: 'Failed to get campaign statistics',
      error: error.message
    };
  }
};

module.exports = {
  autoCompleteExpiredCampaigns,
  getApproachingEndDateCampaigns,
  getCampaignCompletionStats
}; 