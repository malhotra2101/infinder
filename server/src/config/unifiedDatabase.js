// Load environment variables
require('dotenv').config();

/**
 * Unified Database Setup Script
 * 
 * Creates a single influencers table with all necessary data for:
 * - Search page
 * - Top performance component
 * - Influencer table
 * - Dashboard analytics
 */

const { initializeSupabase } = require('./database');

/**
 * Drop existing tables and create unified structure
 * @param {Object} supabase - Supabase client instance
 */
const createUnifiedStructure = async (supabase) => {
  console.log('🔄 Creating unified database structure...');

  try {
    // Drop existing tables if they exist
    console.log('🗑️  Dropping existing tables...');
    await supabase.rpc('exec_sql', { sql: 'DROP TABLE IF EXISTS influencer_performance CASCADE;' });
    await supabase.rpc('exec_sql', { sql: 'DROP TABLE IF EXISTS dashboard_metrics CASCADE;' });
    await supabase.rpc('exec_sql', { sql: 'DROP TABLE IF EXISTS campaigns CASCADE;' });
    await supabase.rpc('exec_sql', { sql: 'DROP TABLE IF EXISTS influencers CASCADE;' });

    // Create unified influencers table with all necessary fields
    console.log('📊 Creating unified influencers table...');
    const createTableSQL = `
      CREATE TABLE influencers (
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
        revenue DECIMAL(10,2) DEFAULT 0,
        monthly_revenue DECIMAL(10,2) DEFAULT 0,
        total_campaigns INTEGER DEFAULT 0,
        active_campaigns INTEGER DEFAULT 0,
        avg_views INTEGER DEFAULT 0,
        avg_likes INTEGER DEFAULT 0,
        avg_comments INTEGER DEFAULT 0,
        avg_shares INTEGER DEFAULT 0,
        last_post_date DATE,
        verified BOOLEAN DEFAULT false,
        bio TEXT,
        website VARCHAR(500),
        instagram_handle VARCHAR(100),
        youtube_channel VARCHAR(100),
        tiktok_handle VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await supabase.rpc('exec_sql', { sql: createTableSQL });

    // Create campaigns table
    console.log('📋 Creating campaigns table...');
    const campaignsSQL = `
      CREATE TABLE campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        budget DECIMAL(10,2) DEFAULT 0,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await supabase.rpc('exec_sql', { sql: campaignsSQL });

    // Create campaign_influencers junction table
    console.log('🔗 Creating campaign_influencers table...');
    const junctionSQL = `
      CREATE TABLE campaign_influencers (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id),
        influencer_id INTEGER REFERENCES influencers(id),
        revenue DECIMAL(10,2) DEFAULT 0,
        engagement_rate DECIMAL(5,2) DEFAULT 0,
        performance_score DECIMAL(5,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(campaign_id, influencer_id)
      );
    `;

    await supabase.rpc('exec_sql', { sql: junctionSQL });

    console.log('✅ Unified database structure created successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error creating unified structure:', error.message);
    return false;
  }
};

/**
 * Insert comprehensive sample data
 * @param {Object} supabase - Supabase client instance
 */
const insertUnifiedData = async (supabase) => {
  console.log('📝 Inserting comprehensive sample data...');

  try {
    // Insert campaigns
    const campaigns = [
      { name: 'Summer Fashion Campaign', status: 'active', budget: 50000.00, start_date: '2024-06-01', end_date: '2024-08-31' },
      { name: 'Tech Product Launch', status: 'active', budget: 75000.00, start_date: '2024-07-01', end_date: '2024-09-30' },
      { name: 'Food & Lifestyle', status: 'active', budget: 30000.00, start_date: '2024-06-15', end_date: '2024-08-15' },
      { name: 'Fitness Challenge', status: 'active', budget: 40000.00, start_date: '2024-07-01', end_date: '2024-08-31' },
      { name: 'Beauty Products', status: 'active', budget: 60000.00, start_date: '2024-06-01', end_date: '2024-09-30' }
    ];

    for (const campaign of campaigns) {
      await supabase.from('campaigns').insert(campaign);
    }

    // Insert comprehensive influencers data
    const influencers = [
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
        done: 45,
        revenue: 2800.00,
        monthly_revenue: 2800.00,
        total_campaigns: 8,
        active_campaigns: 3,
        avg_views: 125000,
        avg_likes: 8500,
        avg_comments: 1200,
        avg_shares: 450,
        last_post_date: '2024-07-10',
        verified: true,
        bio: 'Lifestyle content creator sharing daily inspiration and tips',
        website: 'https://lisathompson.com',
        youtube_channel: '@LisaThompson',
        instagram_handle: '@lisathompson',
        tiktok_handle: '@lisathompson'
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
        done: 25,
        revenue: 2100.00,
        monthly_revenue: 2100.00,
        total_campaigns: 6,
        active_campaigns: 2,
        avg_views: 98000,
        avg_likes: 7200,
        avg_comments: 950,
        avg_shares: 380,
        last_post_date: '2024-07-12',
        verified: false,
        bio: 'Beauty and makeup tutorials for every occasion',
        website: 'https://sarahjohnsonbeauty.com',
        youtube_channel: '@SarahJohnsonBeauty',
        instagram_handle: '@sarahjohnsonbeauty',
        tiktok_handle: '@sarahjohnsonbeauty'
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
        done: 28,
        revenue: 1950.00,
        monthly_revenue: 1950.00,
        total_campaigns: 7,
        active_campaigns: 2,
        avg_views: 85000,
        avg_likes: 6200,
        avg_comments: 850,
        avg_shares: 320,
        last_post_date: '2024-07-11',
        verified: true,
        bio: 'Gaming content creator and streamer',
        website: 'https://jameswilsongaming.com',
        youtube_channel: '@JamesWilsonGaming',
        instagram_handle: '@jameswilsongaming',
        tiktok_handle: '@jameswilsongaming'
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
        done: 7,
        revenue: 720.00,
        monthly_revenue: 720.00,
        total_campaigns: 4,
        active_campaigns: 1,
        avg_views: 45000,
        avg_likes: 3800,
        avg_comments: 520,
        avg_shares: 180,
        last_post_date: '2024-07-09',
        verified: false,
        bio: 'Fitness and wellness content creator',
        website: 'https://emmawilsonfitness.com',
        youtube_channel: '@EmmaWilsonFitness',
        instagram_handle: '@emmawilsonfitness',
        tiktok_handle: '@emmawilsonfitness'
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
        done: 1,
        revenue: 890.00,
        monthly_revenue: 890.00,
        total_campaigns: 3,
        active_campaigns: 0,
        avg_views: 22000,
        avg_likes: 1800,
        avg_comments: 280,
        avg_shares: 120,
        last_post_date: '2024-07-08',
        verified: false,
        bio: 'Lifestyle and travel content creator',
        website: 'https://wadewarren.com',
        youtube_channel: '@WadeWarren',
        instagram_handle: '@wadewarren',
        tiktok_handle: '@wadewarren'
      },
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
        done: 14,
        revenue: 1250.00,
        monthly_revenue: 1250.00,
        total_campaigns: 5,
        active_campaigns: 2,
        avg_views: 35000,
        avg_likes: 2200,
        avg_comments: 350,
        avg_shares: 150,
        last_post_date: '2024-07-13',
        verified: true,
        bio: 'Fashion and style content creator',
        website: 'https://devonlane.com',
        youtube_channel: '@DevonLane',
        instagram_handle: '@devonlane',
        tiktok_handle: '@devonlane'
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
        done: 18,
        revenue: 1450.00,
        monthly_revenue: 1450.00,
        total_campaigns: 6,
        active_campaigns: 2,
        avg_views: 75000,
        avg_likes: 4800,
        avg_comments: 650,
        avg_shares: 280,
        last_post_date: '2024-07-12',
        verified: true,
        bio: 'Tech reviews and gadget tutorials',
        website: 'https://michaelchentech.com',
        youtube_channel: '@MichaelChenTech',
        instagram_handle: '@michaelchentech',
        tiktok_handle: '@michaelchentech'
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
        done: 12,
        revenue: 980.00,
        monthly_revenue: 980.00,
        total_campaigns: 5,
        active_campaigns: 2,
        avg_views: 65000,
        avg_likes: 4200,
        avg_comments: 580,
        avg_shares: 220,
        last_post_date: '2024-07-11',
        verified: false,
        bio: 'Food and cooking content creator',
        website: 'https://alexrodriguezfood.com',
        youtube_channel: '@AlexRodriguezFood',
        instagram_handle: '@alexrodriguezfood',
        tiktok_handle: '@alexrodriguezfood'
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
        done: 15,
        revenue: 1650.00,
        monthly_revenue: 1650.00,
        total_campaigns: 7,
        active_campaigns: 3,
        avg_views: 95000,
        avg_likes: 6800,
        avg_comments: 890,
        avg_shares: 420,
        last_post_date: '2024-07-10',
        verified: true,
        bio: 'Tech and gadget reviews',
        website: 'https://davidkimtech.com',
        youtube_channel: '@DavidKimTech',
        instagram_handle: '@davidkimtech',
        tiktok_handle: '@davidkimtech'
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
        done: 9,
        revenue: 620.00,
        monthly_revenue: 620.00,
        total_campaigns: 4,
        active_campaigns: 1,
        avg_views: 45000,
        avg_likes: 3200,
        avg_comments: 450,
        avg_shares: 180,
        last_post_date: '2024-07-09',
        verified: false,
        bio: 'Beauty and skincare content creator',
        website: 'https://mariagarcia.com',
        youtube_channel: '@MariaGarcia',
        instagram_handle: '@mariagarcia',
        tiktok_handle: '@mariagarcia'
      }
    ];

    for (const influencer of influencers) {
      await supabase.from('influencers').insert(influencer);
    }

    // Insert campaign-influencer relationships
    console.log('🔗 Creating campaign-influencer relationships...');
    const relationships = [
      { campaign_id: 1, influencer_id: 1, revenue: 1250.00, engagement_rate: 4.2, performance_score: 8.5 },
      { campaign_id: 1, influencer_id: 2, revenue: 890.00, engagement_rate: 6.8, performance_score: 7.2 },
      { campaign_id: 2, influencer_id: 3, revenue: 2100.00, engagement_rate: 8.5, performance_score: 9.1 },
      { campaign_id: 2, influencer_id: 4, revenue: 1450.00, engagement_rate: 5.1, performance_score: 7.8 },
      { campaign_id: 3, influencer_id: 5, revenue: 720.00, engagement_rate: 7.2, performance_score: 8.0 },
      { campaign_id: 3, influencer_id: 6, revenue: 980.00, engagement_rate: 4.8, performance_score: 6.5 },
      { campaign_id: 4, influencer_id: 7, revenue: 2800.00, engagement_rate: 9.1, performance_score: 9.5 },
      { campaign_id: 4, influencer_id: 8, revenue: 1650.00, engagement_rate: 6.3, performance_score: 8.2 },
      { campaign_id: 5, influencer_id: 9, revenue: 620.00, engagement_rate: 5.7, performance_score: 6.8 },
      { campaign_id: 5, influencer_id: 10, revenue: 1950.00, engagement_rate: 7.8, performance_score: 8.7 }
    ];

    for (const relationship of relationships) {
      await supabase.from('campaign_influencers').insert(relationship);
    }

    console.log('✅ Sample data inserted successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error inserting data:', error.message);
    return false;
  }
};

/**
 * Main function to set up unified database
 */
const setupUnifiedDatabase = async () => {
  console.log('🚀 Setting up unified database structure...\n');

  try {
    const supabase = initializeSupabase();
    
    if (!supabase) {
      console.error('❌ Failed to initialize Supabase connection');
      return;
    }

    // Create unified structure
    const structureCreated = await createUnifiedStructure(supabase);
    if (!structureCreated) {
      console.error('❌ Failed to create unified structure');
      return;
    }

    // Insert sample data
    const dataInserted = await insertUnifiedData(supabase);
    if (!dataInserted) {
      console.error('❌ Failed to insert sample data');
      return;
    }

    console.log('\n🎉 Unified database setup completed successfully!');
    console.log('📊 Single influencers table now contains all data for:');
    console.log('   - Search page');
    console.log('   - Top performance component');
    console.log('   - Influencer table');
    console.log('   - Dashboard analytics');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
};

// Run the setup
setupUnifiedDatabase(); 