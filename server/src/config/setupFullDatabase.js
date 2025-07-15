// Load environment variables
require('dotenv').config();

/**
 * Full Database Setup Script
 * 
 * Creates all required tables including influencer_performance and inserts sample data.
 * This script sets up the complete database schema for the dashboard analytics.
 */

const { initializeSupabase } = require('./database');

/**
 * Create all database tables including influencer_performance
 * @param {Object} supabase - Supabase client instance
 */
const createAllTables = async (supabase) => {
  console.log('Creating complete database schema...');

  // SQL commands to create all tables
  const sqlCommands = [
    // Create campaigns table
    `CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      budget DECIMAL(10,2) DEFAULT 0,
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    // Create influencers table with extended schema
    `CREATE TABLE IF NOT EXISTS influencers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      avatar VARCHAR(500),
      platform VARCHAR(100),
      followers INTEGER DEFAULT 0,
      engagement_rate DECIMAL(5,2) DEFAULT 0,
      category VARCHAR(100),
      country VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      level VARCHAR(50) DEFAULT 'JUNIOR',
      balance DECIMAL(10,2) DEFAULT 0,
      backlog INTEGER DEFAULT 0,
      in_progress INTEGER DEFAULT 0,
      done INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    // Create influencer_performance table
    `CREATE TABLE IF NOT EXISTS influencer_performance (
      id SERIAL PRIMARY KEY,
      influencer_id INTEGER REFERENCES influencers(id),
      campaign_id INTEGER REFERENCES campaigns(id),
      revenue DECIMAL(10,2) DEFAULT 0,
      engagement_rate DECIMAL(5,2) DEFAULT 0,
      followers INTEGER DEFAULT 0,
      month VARCHAR(10),
      year INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Create dashboard_metrics table
    `CREATE TABLE IF NOT EXISTS dashboard_metrics (
      id SERIAL PRIMARY KEY,
      total_revenue DECIMAL(12,2) DEFAULT 0,
      total_campaigns INTEGER DEFAULT 0,
      active_influencers INTEGER DEFAULT 0,
      avg_engagement DECIMAL(5,2) DEFAULT 0,
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Create countries table
    `CREATE TABLE IF NOT EXISTS countries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(3) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    // Create influencer_lists table
    `CREATE TABLE IF NOT EXISTS influencer_lists (
      id SERIAL PRIMARY KEY,
      influencer_id INTEGER REFERENCES influencers(id),
      list_type VARCHAR(20) NOT NULL CHECK (list_type IN ('selected', 'rejected', 'suggested')),
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(influencer_id, list_type)
    )`
  ];

  try {
    for (const sql of sqlCommands) {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.log('Note: Some tables may already exist or need manual creation in Supabase dashboard');
        console.log('SQL:', sql);
        console.log('Error:', error.message);
      }
    }
    console.log('✅ Database schema creation attempted');
  } catch (error) {
    console.log('Note: Tables need to be created manually in Supabase dashboard');
    console.log('Please run the SQL commands from database_setup.sql in your Supabase SQL editor');
  }
};

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
      .upsert(campaign, { onConflict: 'name' });

    if (error) {
      console.error(`Error inserting campaign ${campaign.name}:`, error);
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
      .upsert(influencer, { onConflict: 'name' });

    if (error) {
      console.error(`Error inserting influencer ${influencer.name}:`, error);
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
      .upsert(performance, { onConflict: 'influencer_id,campaign_id' });

    if (error) {
      console.error(`Error inserting performance data for influencer ${performance.influencer_id}:`, error);
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
    .upsert(metrics, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting dashboard metrics:', error);
  } else {
    console.log('✅ Dashboard metrics inserted');
  }
};

/**
 * Main setup function
 */
const setupFullDatabase = async () => {
  try {
    console.log('🚀 Starting full database setup...');
    
    const supabase = initializeSupabase();
    
    // Create all tables
    await createAllTables(supabase);
    
    // Insert sample data
    await insertCampaigns(supabase);
    await insertExtendedInfluencers(supabase);
    await insertPerformanceData(supabase);
    await insertDashboardMetrics(supabase);
    
    console.log('✅ Full database setup completed successfully!');
    console.log('📊 You can now use all API endpoints including dashboard analytics');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('💡 If tables don\'t exist, please create them manually in Supabase dashboard');
    console.log('📄 Use the SQL commands from database_setup.sql');
  }
};

// Run the setup if this file is executed directly
if (require.main === module) {
  setupFullDatabase();
}

module.exports = { setupFullDatabase }; 