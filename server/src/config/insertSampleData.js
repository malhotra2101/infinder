// Load environment variables
require('dotenv').config();

/**
 * Sample Data Insertion Script
 * 
 * Inserts sample data into existing tables for the influencer platform.
 * This script assumes the tables already exist in the database.
 */

const { initializeSupabase } = require('./database');

/**
 * Insert sample campaigns data
 * @param {Object} supabase - Supabase client instance
 */
const insertCampaigns = async (supabase) => {
  console.log('Inserting sample campaigns...');

  const campaigns = [
    { name: 'Summer Fashion Campaign', status: 'active', budget: 50000.00, start_date: '2024-06-01', end_date: '2024-08-31' },
    { name: 'Tech Product Launch', status: 'active', budget: 75000.00, start_date: '2024-07-01', end_date: '2024-09-30' },
    { name: 'Food & Lifestyle', status: 'active', budget: 30000.00, start_date: '2024-06-15', end_date: '2024-08-15' },
    { name: 'Fitness Challenge', status: 'active', budget: 40000.00, start_date: '2024-07-01', end_date: '2024-08-31' },
    { name: 'Beauty Products', status: 'active', budget: 60000.00, start_date: '2024-06-01', end_date: '2024-09-30' }
  ];

  for (const campaign of campaigns) {
    const { error } = await supabase
      .from('campaigns')
      .insert(campaign);

    if (error) {
      console.error(`Error inserting campaign ${campaign.name}:`, error.message);
    } else {
      console.log(`✅ Inserted campaign: ${campaign.name}`);
    }
  }

  console.log('✅ Sample campaigns inserted');
};

/**
 * Insert sample influencers with extended data
 * @param {Object} supabase - Supabase client instance
 */
const insertExtendedInfluencers = async (supabase) => {
  console.log('Inserting sample influencers with extended data...');

  const influencers = [
    {
      name: 'Devon Lane',
      email: 'devon.lane@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      platform: 'Instagram',
      followers: 125000,
      engagement_rate: 4.2,
      category: 'Fashion',
      country: 'United States',
      status: 'ACTIVE',
      level: 'MIDDLE',
      balance: 630.44,
      backlog: 19,
      in_progress: 15,
      done: 14
    },
    {
      name: 'Wade Warren',
      email: 'wade.warren@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      platform: 'TikTok',
      followers: 89000,
      engagement_rate: 6.8,
      category: 'Lifestyle',
      country: 'United Kingdom',
      status: 'BAN',
      level: 'JUNIOR',
      balance: 202.87,
      backlog: 0,
      in_progress: 16,
      done: 1
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      platform: 'YouTube',
      followers: 450000,
      engagement_rate: 8.5,
      category: 'Beauty',
      country: 'Canada',
      status: 'VERIFICATION',
      level: 'SENIOR',
      balance: 1250.00,
      backlog: 8,
      in_progress: 12,
      done: 25
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      platform: 'Instagram',
      followers: 320000,
      engagement_rate: 5.1,
      category: 'Tech',
      country: 'Australia',
      status: 'PROGRESS',
      level: 'MIDDLE',
      balance: 890.25,
      backlog: 12,
      in_progress: 8,
      done: 18
    },
    {
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      platform: 'TikTok',
      followers: 180000,
      engagement_rate: 7.2,
      category: 'Fitness',
      country: 'Germany',
      status: 'DELETE',
      level: 'JUNIOR',
      balance: 450.75,
      backlog: 5,
      in_progress: 10,
      done: 7
    },
    {
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      platform: 'Instagram',
      followers: 280000,
      engagement_rate: 4.8,
      category: 'Food',
      country: 'Spain',
      status: 'ACTIVE',
      level: 'MIDDLE',
      balance: 720.30,
      backlog: 15,
      in_progress: 20,
      done: 12
    },
    {
      name: 'Lisa Thompson',
      email: 'lisa.thompson@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      platform: 'YouTube',
      followers: 650000,
      engagement_rate: 9.1,
      category: 'Lifestyle',
      country: 'France',
      status: 'ACTIVE',
      level: 'SENIOR',
      balance: 2100.50,
      backlog: 25,
      in_progress: 30,
      done: 45
    },
    {
      name: 'David Kim',
      email: 'david.kim@company.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      platform: 'TikTok',
      followers: 420000,
      engagement_rate: 6.3,
      category: 'Tech',
      country: 'South Korea',
      status: 'ACTIVE',
      level: 'MIDDLE',
      balance: 950.75,
      backlog: 18,
      in_progress: 22,
      done: 15
    },
    {
      name: 'Maria Garcia',
      email: 'maria.garcia@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      platform: 'Instagram',
      followers: 190000,
      engagement_rate: 5.7,
      category: 'Beauty',
      country: 'Italy',
      status: 'ACTIVE',
      level: 'JUNIOR',
      balance: 380.20,
      backlog: 8,
      in_progress: 12,
      done: 9
    },
    {
      name: 'James Wilson',
      email: 'james.wilson@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      platform: 'YouTube',
      followers: 380000,
      engagement_rate: 7.8,
      category: 'Gaming',
      country: 'United States',
      status: 'ACTIVE',
      level: 'MIDDLE',
      balance: 1100.40,
      backlog: 22,
      in_progress: 18,
      done: 28
    }
  ];

  for (const influencer of influencers) {
    const { error } = await supabase
      .from('influencers')
      .insert(influencer);

    if (error) {
      console.error(`Error inserting influencer ${influencer.name}:`, error.message);
    } else {
      console.log(`✅ Inserted influencer: ${influencer.name}`);
    }
  }

  console.log('✅ Sample influencers with extended data inserted');
};

/**
 * Insert sample performance data
 * @param {Object} supabase - Supabase client instance
 */
const insertPerformanceData = async (supabase) => {
  console.log('Inserting sample performance data...');

  const performanceData = [
    { influencer_id: 1, campaign_id: 1, revenue: 1250.00, engagement_rate: 4.2, followers: 125000, month: '06', year: 2024 },
    { influencer_id: 2, campaign_id: 1, revenue: 890.00, engagement_rate: 6.8, followers: 89000, month: '06', year: 2024 },
    { influencer_id: 3, campaign_id: 2, revenue: 2100.00, engagement_rate: 8.5, followers: 450000, month: '06', year: 2024 },
    { influencer_id: 4, campaign_id: 2, revenue: 1450.00, engagement_rate: 5.1, followers: 320000, month: '06', year: 2024 },
    { influencer_id: 5, campaign_id: 3, revenue: 720.00, engagement_rate: 7.2, followers: 180000, month: '06', year: 2024 },
    { influencer_id: 6, campaign_id: 3, revenue: 980.00, engagement_rate: 4.8, followers: 280000, month: '06', year: 2024 },
    { influencer_id: 7, campaign_id: 4, revenue: 2800.00, engagement_rate: 9.1, followers: 650000, month: '06', year: 2024 },
    { influencer_id: 8, campaign_id: 4, revenue: 1650.00, engagement_rate: 6.3, followers: 420000, month: '06', year: 2024 },
    { influencer_id: 9, campaign_id: 5, revenue: 620.00, engagement_rate: 5.7, followers: 190000, month: '06', year: 2024 },
    { influencer_id: 10, campaign_id: 5, revenue: 1950.00, engagement_rate: 7.8, followers: 380000, month: '06', year: 2024 }
  ];

  for (const performance of performanceData) {
    const { error } = await supabase
      .from('influencer_performance')
      .insert(performance);

    if (error) {
      console.error(`Error inserting performance data for influencer ${performance.influencer_id}:`, error.message);
    } else {
      console.log(`✅ Inserted performance data for influencer ${performance.influencer_id}`);
    }
  }

  console.log('✅ Sample performance data inserted');
};

/**
 * Insert dashboard metrics
 * @param {Object} supabase - Supabase client instance
 */
const insertDashboardMetrics = async (supabase) => {
  console.log('Inserting dashboard metrics...');

  const metrics = {
    total_revenue: 13410.00,
    total_campaigns: 5,
    active_influencers: 8,
    avg_engagement: 6.67
  };

  const { error } = await supabase
    .from('dashboard_metrics')
    .insert(metrics);

  if (error) {
    console.error('Error inserting dashboard metrics:', error.message);
  } else {
    console.log('✅ Dashboard metrics inserted');
  }
};

/**
 * Main setup function
 */
const insertSampleData = async () => {
  try {
    console.log('🚀 Starting sample data insertion...');
    
    const supabase = initializeSupabase();
    
    // Insert sample data
    await insertCampaigns(supabase);
    await insertExtendedInfluencers(supabase);
    await insertPerformanceData(supabase);
    await insertDashboardMetrics(supabase);
    
    console.log('✅ Sample data insertion completed successfully!');
    console.log('📊 You can now view top performing influencers in the dashboard');
    
  } catch (error) {
    console.error('❌ Sample data insertion failed:', error);
    console.log('💡 Make sure the database tables exist in Supabase dashboard');
  }
};

// Run the setup if this file is executed directly
if (require.main === module) {
  insertSampleData();
}

module.exports = { insertSampleData }; 