/**
 * Database Setup Script
 * Creates the necessary tables and inserts sample data
 */

// Load environment variables
require('dotenv').config();

const { getServiceSupabase } = require('../../src/config/supabase');

async function setupDatabase() {
  const supabase = getServiceSupabase();
  
  console.log('🔄 Setting up database...');

  try {
    // Create brands table
    console.log('🏢 Creating brands table...');
    const { error: brandsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS brands (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          contact_name VARCHAR(255),
          industry VARCHAR(100),
          website VARCHAR(500),
          description TEXT,
          logo_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (brandsTableError) {
      console.log('⚠️  Brands table might already exist or RPC not available. Trying direct insert...');
    } else {
      console.log('✅ Brands table created');
    }

    // Create campaigns table
    console.log('📈 Creating campaigns table...');
    const { error: campaignsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS campaigns (
          id SERIAL PRIMARY KEY,
          brand_id INTEGER,
          campaign_name VARCHAR(255) NOT NULL,
          description TEXT,
          platform VARCHAR(100),
          vertical VARCHAR(100),
          budget_min DECIMAL(10,2),
          budget_max DECIMAL(10,2),
          budget_currency VARCHAR(10) DEFAULT 'USD',
          start_date DATE,
          end_date DATE,
          status VARCHAR(50) DEFAULT 'active',
          requirements TEXT,
          deliverables TEXT,
          target_audience TEXT,
          content_guidelines TEXT,
          kpi VARCHAR(255),
          tracking_url VARCHAR(500),
          creative_url VARCHAR(500),
          is_private BOOLEAN DEFAULT false,
          requires_approval BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (campaignsTableError) {
      console.log('⚠️  Campaigns table might already exist or RPC not available. Trying direct insert...');
    } else {
      console.log('✅ Campaigns table created');
    }

    // Try inserting sample data directly (tables might already exist)
    console.log('📊 Inserting sample brand...');
    
    // First try to insert into brands table
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .upsert([{
        id: 1,
        name: 'TechFlow Solutions',
        email: 'marketing@techflow.com',
        contact_name: 'Sarah Johnson',
        industry: 'Technology',
        website: 'https://techflow.com',
        description: 'Leading provider of innovative tech solutions for modern businesses',
        logo_url: 'https://techflow.com/logo.png'
      }], { onConflict: 'id' })
      .select();

    if (brandError) {
      console.error('❌ Error inserting brand:', brandError);
      console.log('💡 Please create the brands table manually in your Supabase dashboard:');
      console.log(`
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  contact_name VARCHAR(255),
  industry VARCHAR(100),
  website VARCHAR(500),
  description TEXT,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `);
      return;
    }
    
    console.log('✅ Brand inserted successfully:', brand[0]?.name);

    // Insert sample campaigns
    console.log('📈 Inserting sample campaigns...');
    const campaigns = [
      {
        id: 1,
        brand_id: 1,
        campaign_name: 'Summer Tech Collection 2024',
        description: 'Promote our latest line of innovative tech gadgets and accessories for the summer season. Looking for authentic content creators who can showcase our products in real-world scenarios.',
        platform: 'Instagram',
        vertical: 'Technology',
        budget_min: 500.00,
        budget_max: 2000.00,
        budget_currency: 'USD',
        start_date: '2024-06-01',
        end_date: '2024-08-31',
        status: 'active',
        requirements: 'Must have 10K+ followers, high engagement rate (>3%), tech-focused content, located in US/Canada',
        deliverables: '2-3 feed posts, 4-5 stories, 1 reel/video, product unboxing, usage demonstration',
        target_audience: 'Tech enthusiasts, young professionals, early adopters aged 18-35',
        content_guidelines: 'Authentic, unboxing-style content. Show real usage scenarios. Maintain your personal style while highlighting key product features.',
        kpi: 'Engagement rate, reach, click-through rate, conversion to product page',
        is_private: false,
        requires_approval: true
      },
      {
        id: 2,
        brand_id: 1,
        campaign_name: 'Holiday Gaming Setup Campaign',
        description: 'Showcase our premium gaming accessories and setup solutions for the holiday season. Perfect for gaming influencers and tech reviewers.',
        platform: 'YouTube',
        vertical: 'Gaming',
        budget_min: 1000.00,
        budget_max: 5000.00,
        budget_currency: 'USD',
        start_date: '2024-11-01',
        end_date: '2024-12-31',
        status: 'active',
        requirements: 'Gaming content focus, 25K+ subscribers, previous brand collaborations, quality video production',
        deliverables: '1 main review video (8-12 mins), 2 shorts/clips, social media posts, setup showcase',
        target_audience: 'Gamers, PC enthusiasts, content creators aged 16-30',
        content_guidelines: 'Detailed product reviews, setup tutorials, gaming performance demos. Professional but engaging tone.',
        kpi: 'Video views, subscriber growth, product link clicks, sales conversions',
        is_private: false,
        requires_approval: true
      },
      {
        id: 3,
        brand_id: 1,
        campaign_name: 'Workspace Productivity Challenge',
        description: 'Month-long campaign featuring our productivity tools and workspace solutions. Looking for lifestyle and productivity influencers.',
        platform: 'TikTok',
        vertical: 'Lifestyle',
        budget_min: 300.00,
        budget_max: 1500.00,
        budget_currency: 'USD',
        start_date: '2024-09-01',
        end_date: '2024-09-30',
        status: 'active',
        requirements: '50K+ followers, productivity/lifestyle niche, consistent posting, high engagement',
        deliverables: '8-10 TikTok videos throughout the month, Instagram stories, productivity tips featuring products',
        target_audience: 'Young professionals, students, entrepreneurs aged 20-35',
        content_guidelines: 'Trendy, educational content. Show before/after workspace transformations. Use trending sounds and hashtags.',
        kpi: 'Video completion rate, shares, comments, hashtag usage, website traffic',
        is_private: false,
        requires_approval: true
      }
    ];

    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .upsert(campaigns, { onConflict: 'id' })
      .select();

    if (campaignsError) {
      console.error('❌ Error inserting campaigns:', campaignsError);
      console.log('💡 Please create the campaigns table manually in your Supabase dashboard:');
      console.log(`
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER,
  campaign_name VARCHAR(255) NOT NULL,
  description TEXT,
  platform VARCHAR(100),
  vertical VARCHAR(100),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  budget_currency VARCHAR(10) DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  requirements TEXT,
  deliverables TEXT,
  target_audience TEXT,
  content_guidelines TEXT,
  kpi VARCHAR(255),
  tracking_url VARCHAR(500),
  creative_url VARCHAR(500),
  is_private BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `);
      return;
    }

    console.log('✅ Campaigns inserted successfully:');
    campaignsData.forEach(campaign => {
      console.log(`   - ${campaign.campaign_name} (${campaign.platform})`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 brand: ${brand[0]?.name}`);
    console.log(`   - ${campaignsData.length} campaigns`);
    console.log('\n🔗 You can now:');
    console.log('   - View campaigns in the frontend');
    console.log('   - Create email sequences for these campaigns');
    console.log('   - Test the email composer with real campaign data');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('\n💡 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Run the SQL from /server/migrations/002_campaigns_and_brands.sql');
    console.log('3. The email sequencing tables should already exist from migration 001');
  }
}

// Run the script
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
