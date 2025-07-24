/**
 * Scheduled Tasks Service
 * 
 * Handles scheduled tasks like auto-completing campaigns
 * and other time-based operations.
 */

const { autoCompleteExpiredCampaigns, getApproachingEndDateCampaigns } = require('./campaignAutoCompletion');

/**
 * Initialize scheduled tasks
 */
const initializeScheduledTasks = () => {
  console.log('⏰ Initializing scheduled tasks...');
  
  // Run auto-completion check every hour
  setInterval(async () => {
    console.log('🔄 Running scheduled auto-completion check...');
    try {
      const result = await autoCompleteExpiredCampaigns();
      if (result.success) {
        console.log(`✅ Auto-completion check completed: ${result.completedCount} campaigns completed`);
      } else {
        console.error('❌ Auto-completion check failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Scheduled auto-completion error:', error);
    }
  }, 60 * 60 * 1000); // Every hour

  // Run approaching campaigns check every 6 hours
  setInterval(async () => {
    console.log('🔍 Running approaching campaigns check...');
    try {
      const result = await getApproachingEndDateCampaigns(7); // 7 days threshold
      if (result.success && result.campaigns.length > 0) {
        console.log(`⚠️  Found ${result.campaigns.length} campaigns approaching end date`);
        // Here you could send notifications or alerts
        result.campaigns.forEach(campaign => {
          console.log(`   - ${campaign.campaign_name} ends on ${campaign.end_date}`);
        });
      }
    } catch (error) {
      console.error('❌ Approaching campaigns check error:', error);
    }
  }, 6 * 60 * 60 * 1000); // Every 6 hours

  console.log('✅ Scheduled tasks initialized');
};

/**
 * Run auto-completion manually
 * @returns {Promise<Object>} Result of the manual auto-completion
 */
const runManualAutoCompletion = async () => {
  console.log('🔧 Running manual auto-completion...');
  try {
    const result = await autoCompleteExpiredCampaigns();
    return result;
  } catch (error) {
    console.error('❌ Manual auto-completion error:', error);
    return {
      success: false,
      message: 'Manual auto-completion failed',
      error: error.message
    };
  }
};

/**
 * Get scheduled task status
 * @returns {Object} Status of scheduled tasks
 */
const getScheduledTaskStatus = () => {
  return {
    initialized: true,
    autoCompletionInterval: '1 hour',
    approachingCampaignsInterval: '6 hours',
    lastRun: new Date().toISOString()
  };
};

module.exports = {
  initializeScheduledTasks,
  runManualAutoCompletion,
  getScheduledTaskStatus
}; 