// Load environment variables
require('dotenv').config();

/**
 * Database Setup Script
 * 
 * Creates required tables and inserts sample data for the influencer platform.
 * Run this script to initialize the database with the necessary schema and data.
 */

const { initializeSupabase } = require('./database');

/**
 * Create database tables
 * @param {Object} supabase - Supabase client instance
 */
const createTables = async (supabase) => {
  console.log('Creating database tables...');

  // Note: Tables should be created manually in Supabase dashboard
  // This function will check if tables exist and provide instructions
  
  try {
    // Check if countries table exists
    const { data: countriesData, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .limit(1);

    if (countriesError && countriesError.code === '42P01') {
      console.log('❌ Countries table does not exist. Please create it manually in Supabase dashboard:');
      console.log(`
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ Countries table exists');
    }

    // Check if influencers table exists
    const { data: influencersData, error: influencersError } = await supabase
      .from('influencers')
      .select('*')
      .limit(1);

    if (influencersError && influencersError.code === '42P01') {
      console.log('❌ Influencers table does not exist. Please create it manually in Supabase dashboard:');
      console.log(`
CREATE TABLE influencers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  category VARCHAR(100),
  platform VARCHAR(50),
  followers INTEGER,
  engagement_rate DECIMAL(5,2),
  country VARCHAR(100),
  age_group VARCHAR(20),
  last_active TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
      `);
    } else {
      console.log('✅ Influencers table exists');
    }

    // Check if influencer_lists table exists
    const { data: listsData, error: listsError } = await supabase
      .from('influencer_lists')
      .select('*')
      .limit(1);

    if (listsError && listsError.code === '42P01') {
      console.log('❌ Influencer lists table does not exist. Please create it manually in Supabase dashboard:');
      console.log(`
CREATE TABLE influencer_lists (
  id SERIAL PRIMARY KEY,
  influencer_id INTEGER REFERENCES influencers(id),
  list_type VARCHAR(20) NOT NULL CHECK (list_type IN ('selected', 'rejected', 'suggested')),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(influencer_id, list_type)
);
      `);
    } else {
      console.log('✅ Influencer lists table exists');
    }

  } catch (error) {
    console.error('Error checking tables:', error);
  }
};

/**
 * Insert sample countries data
 * @param {Object} supabase - Supabase client instance
 */
const insertCountries = async (supabase) => {
  console.log('Inserting sample countries...');

  const countries = [
    { name: 'United States', code: 'USA' },
    { name: 'Canada', code: 'CAN' },
    { name: 'United Kingdom', code: 'GBR' },
    { name: 'Australia', code: 'AUS' },
    { name: 'Germany', code: 'DEU' },
    { name: 'France', code: 'FRA' },
    { name: 'Spain', code: 'ESP' },
    { name: 'Italy', code: 'ITA' },
    { name: 'Japan', code: 'JPN' },
    { name: 'South Korea', code: 'KOR' },
    { name: 'India', code: 'IND' },
    { name: 'Brazil', code: 'BRA' },
    { name: 'Mexico', code: 'MEX' },
    { name: 'Argentina', code: 'ARG' },
    { name: 'Chile', code: 'CHL' },
    { name: 'Colombia', code: 'COL' },
    { name: 'Peru', code: 'PER' },
    { name: 'Venezuela', code: 'VEN' },
    { name: 'Ecuador', code: 'ECU' },
    { name: 'Bolivia', code: 'BOL' },
    { name: 'Paraguay', code: 'PRY' },
    { name: 'Uruguay', code: 'URY' },
    { name: 'Guyana', code: 'GUY' },
    { name: 'Suriname', code: 'SUR' },
    { name: 'French Guiana', code: 'GUF' }
  ];

  for (const country of countries) {
    const { error } = await supabase
      .from('countries')
      .upsert(country, { onConflict: 'name' });

    if (error) {
      console.error(`Error inserting country ${country.name}:`, error);
    }
  }

  console.log('✅ Sample countries inserted');
};

/**
 * Insert sample influencers data
 * @param {Object} supabase - Supabase client instance
 */
const insertInfluencers = async (supabase) => {
  console.log('Inserting sample influencers...');

  const influencers = [
    // Original 10 influencers
    {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Lifestyle and fashion influencer sharing daily inspiration and style tips. Passionate about sustainable fashion and empowering women.',
      category: 'Lifestyle & Fashion',
      platform: 'Instagram',
      followers: 125000,
      engagement_rate: 4.2,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Tech enthusiast and startup founder. Sharing insights about entrepreneurship, technology trends, and productivity tips.',
      category: 'Technology',
      platform: 'LinkedIn',
      followers: 89000,
      engagement_rate: 5.1,
      country: 'Canada',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Fitness coach and wellness advocate. Helping people achieve their health goals through sustainable lifestyle changes.',
      category: 'Fitness & Wellness',
      platform: 'YouTube',
      followers: 234000,
      engagement_rate: 3.8,
      country: 'Spain',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Food blogger and culinary expert. Exploring global cuisines and sharing authentic recipes from around the world.',
      category: 'Food & Cooking',
      platform: 'TikTok',
      followers: 456000,
      engagement_rate: 6.2,
      country: 'South Korea',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Travel photographer and adventure seeker. Capturing breathtaking moments and inspiring others to explore the world.',
      category: 'Travel',
      platform: 'Instagram',
      followers: 189000,
      engagement_rate: 4.7,
      country: 'Australia',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'James Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Gaming content creator and esports enthusiast. Sharing gameplay highlights and gaming industry insights.',
      category: 'Gaming',
      platform: 'Twitch',
      followers: 567000,
      engagement_rate: 7.1,
      country: 'United States',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Beauty and makeup artist. Creating stunning looks and sharing beauty tips for all skin types.',
      category: 'Beauty',
      platform: 'Instagram',
      followers: 345000,
      engagement_rate: 5.8,
      country: 'United Kingdom',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Carlos Silva',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Business consultant and motivational speaker. Helping entrepreneurs build successful businesses.',
      category: 'Business',
      platform: 'LinkedIn',
      followers: 123000,
      engagement_rate: 4.9,
      country: 'Brazil',
      age_group: '35-44',
      last_active: new Date().toISOString()
    },
    {
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Fashion designer and style consultant. Creating unique fashion content and styling tips.',
      category: 'Fashion',
      platform: 'TikTok',
      followers: 789000,
      engagement_rate: 8.3,
      country: 'Japan',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Fitness trainer and nutrition expert. Helping people transform their lives through health and fitness.',
      category: 'Fitness & Wellness',
      platform: 'YouTube',
      followers: 234000,
      engagement_rate: 4.1,
      country: 'Canada',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    // Additional 40 influencers
    {
      name: 'Jessica Lee',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Digital marketing expert specializing in social media strategy and brand growth.',
      category: 'Marketing',
      platform: 'LinkedIn',
      followers: 156000,
      engagement_rate: 4.5,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Ryan Garcia',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Professional photographer capturing urban landscapes and street photography.',
      category: 'Photography',
      platform: 'Instagram',
      followers: 298000,
      engagement_rate: 5.3,
      country: 'Mexico',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Amanda Foster',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Yoga instructor and mindfulness coach promoting mental wellness and inner peace.',
      category: 'Wellness',
      platform: 'YouTube',
      followers: 178000,
      engagement_rate: 6.8,
      country: 'Canada',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Daniel Park',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Tech reviewer and gadget enthusiast sharing the latest in consumer electronics.',
      category: 'Technology',
      platform: 'YouTube',
      followers: 445000,
      engagement_rate: 4.9,
      country: 'South Korea',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Isabella Santos',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Fashion blogger and style consultant helping women find their unique fashion voice.',
      category: 'Fashion',
      platform: 'Instagram',
      followers: 267000,
      engagement_rate: 5.7,
      country: 'Brazil',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Kevin Zhang',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Software engineer and coding instructor teaching programming to beginners.',
      category: 'Education',
      platform: 'YouTube',
      followers: 189000,
      engagement_rate: 7.2,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Natalie Clark',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Interior designer sharing home decor tips and renovation projects.',
      category: 'Home & Garden',
      platform: 'Instagram',
      followers: 334000,
      engagement_rate: 4.3,
      country: 'United Kingdom',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Fitness coach and bodybuilding expert helping people achieve their fitness goals.',
      category: 'Fitness',
      platform: 'Instagram',
      followers: 456000,
      engagement_rate: 5.1,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Yuki Tanaka',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Anime and manga enthusiast sharing Japanese pop culture content.',
      category: 'Entertainment',
      platform: 'TikTok',
      followers: 678000,
      engagement_rate: 8.9,
      country: 'Japan',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Sofia Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Dance instructor and choreographer teaching various dance styles.',
      category: 'Dance',
      platform: 'YouTube',
      followers: 223000,
      engagement_rate: 6.4,
      country: 'Spain',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Brandon Wilson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Car enthusiast and automotive reviewer sharing the latest in the car world.',
      category: 'Automotive',
      platform: 'YouTube',
      followers: 389000,
      engagement_rate: 4.8,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Pet trainer and animal welfare advocate sharing tips for pet care.',
      category: 'Pets',
      platform: 'Instagram',
      followers: 145000,
      engagement_rate: 5.6,
      country: 'Canada',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Lucas Anderson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Music producer and DJ sharing behind-the-scenes of music production.',
      category: 'Music',
      platform: 'TikTok',
      followers: 567000,
      engagement_rate: 7.8,
      country: 'United Kingdom',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Aisha Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Meditation teacher and spiritual guide helping people find inner peace.',
      category: 'Spirituality',
      platform: 'Instagram',
      followers: 198000,
      engagement_rate: 6.2,
      country: 'India',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Tommy Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Skateboarder and extreme sports athlete sharing thrilling action content.',
      category: 'Sports',
      platform: 'TikTok',
      followers: 445000,
      engagement_rate: 8.1,
      country: 'United States',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Grace Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Art therapist and creative coach helping people express through art.',
      category: 'Art',
      platform: 'Instagram',
      followers: 167000,
      engagement_rate: 5.4,
      country: 'South Korea',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Diego Martinez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Chef and culinary instructor sharing authentic Mexican recipes.',
      category: 'Cooking',
      platform: 'YouTube',
      followers: 289000,
      engagement_rate: 6.7,
      country: 'Mexico',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Zoe Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Book reviewer and literature enthusiast sharing reading recommendations.',
      category: 'Books',
      platform: 'Instagram',
      followers: 134000,
      engagement_rate: 4.9,
      country: 'Australia',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Hiroshi Yamamoto',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Traditional Japanese craftsman sharing ancient techniques and modern applications.',
      category: 'Crafts',
      platform: 'YouTube',
      followers: 156000,
      engagement_rate: 5.8,
      country: 'Japan',
      age_group: '35-44',
      last_active: new Date().toISOString()
    },
    {
      name: 'Maya Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Environmental activist and sustainability advocate promoting eco-friendly living.',
      category: 'Environment',
      platform: 'Instagram',
      followers: 223000,
      engagement_rate: 6.9,
      country: 'Canada',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Rafael Silva',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Soccer coach and sports analyst sharing insights about the beautiful game.',
      category: 'Sports',
      platform: 'YouTube',
      followers: 345000,
      engagement_rate: 4.6,
      country: 'Brazil',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Chloe Williams',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Makeup artist and beauty influencer creating stunning transformations.',
      category: 'Beauty',
      platform: 'TikTok',
      followers: 789000,
      engagement_rate: 8.5,
      country: 'United States',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Adrian Lopez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Financial advisor and investment expert helping people build wealth.',
      category: 'Finance',
      platform: 'LinkedIn',
      followers: 178000,
      engagement_rate: 5.2,
      country: 'Spain',
      age_group: '35-44',
      last_active: new Date().toISOString()
    },
    {
      name: 'Lily Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Plant enthusiast and gardening expert sharing tips for green thumbs.',
      category: 'Gardening',
      platform: 'Instagram',
      followers: 198000,
      engagement_rate: 5.7,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Oscar Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Comedian and content creator making people laugh with relatable humor.',
      category: 'Comedy',
      platform: 'TikTok',
      followers: 567000,
      engagement_rate: 9.2,
      country: 'Mexico',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Nina Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Yoga instructor and wellness coach promoting holistic health practices.',
      category: 'Wellness',
      platform: 'Instagram',
      followers: 234000,
      engagement_rate: 6.1,
      country: 'India',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Jake Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Guitarist and music teacher sharing guitar lessons and music theory.',
      category: 'Music',
      platform: 'YouTube',
      followers: 289000,
      engagement_rate: 5.9,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Sakura Tanaka',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Fashion designer and style consultant creating unique fashion content.',
      category: 'Fashion',
      platform: 'Instagram',
      followers: 345000,
      engagement_rate: 6.3,
      country: 'Japan',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Carlos Mendez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Fitness trainer and nutrition expert helping people achieve their goals.',
      category: 'Fitness',
      platform: 'YouTube',
      followers: 456000,
      engagement_rate: 5.4,
      country: 'Argentina',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Interior designer and home decor expert sharing design inspiration.',
      category: 'Home & Garden',
      platform: 'Instagram',
      followers: 267000,
      engagement_rate: 4.8,
      country: 'United Kingdom',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Tech reviewer and gadget enthusiast sharing the latest tech reviews.',
      category: 'Technology',
      platform: 'YouTube',
      followers: 389000,
      engagement_rate: 5.6,
      country: 'United States',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Mia Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Pet groomer and animal care expert sharing pet care tips and tricks.',
      category: 'Pets',
      platform: 'Instagram',
      followers: 178000,
      engagement_rate: 6.7,
      country: 'Canada',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Sam Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Travel vlogger and adventure seeker exploring the world one destination at a time.',
      category: 'Travel',
      platform: 'YouTube',
      followers: 523000,
      engagement_rate: 7.3,
      country: 'Australia',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Yuki Sato',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Anime reviewer and Japanese culture enthusiast sharing insights about anime.',
      category: 'Entertainment',
      platform: 'TikTok',
      followers: 445000,
      engagement_rate: 8.7,
      country: 'Japan',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Dance instructor and choreographer teaching various dance styles and techniques.',
      category: 'Dance',
      platform: 'Instagram',
      followers: 234000,
      engagement_rate: 5.9,
      country: 'Spain',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'David Lee',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Car enthusiast and automotive journalist sharing the latest in automotive news.',
      category: 'Automotive',
      platform: 'YouTube',
      followers: 345000,
      engagement_rate: 4.7,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Sophia Brown',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Book reviewer and literature enthusiast sharing reading recommendations and reviews.',
      category: 'Books',
      platform: 'Instagram',
      followers: 156000,
      engagement_rate: 5.1,
      country: 'United Kingdom',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Lucas Santos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Music producer and DJ sharing behind-the-scenes of music production and DJ sets.',
      category: 'Music',
      platform: 'TikTok',
      followers: 678000,
      engagement_rate: 8.2,
      country: 'Brazil',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Aisha Khan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Meditation teacher and spiritual guide helping people find inner peace and mindfulness.',
      category: 'Spirituality',
      platform: 'Instagram',
      followers: 198000,
      engagement_rate: 6.4,
      country: 'India',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Tommy Anderson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Skateboarder and extreme sports athlete sharing thrilling action content and tutorials.',
      category: 'Sports',
      platform: 'TikTok',
      followers: 523000,
      engagement_rate: 8.9,
      country: 'United States',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Grace Park',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Art therapist and creative coach helping people express themselves through art therapy.',
      category: 'Art',
      platform: 'Instagram',
      followers: 167000,
      engagement_rate: 5.6,
      country: 'South Korea',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Diego Fernandez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Chef and culinary instructor sharing authentic Mexican recipes and cooking techniques.',
      category: 'Cooking',
      platform: 'YouTube',
      followers: 289000,
      engagement_rate: 6.8,
      country: 'Mexico',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Zoe Thompson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Book reviewer and literature enthusiast sharing reading recommendations and book reviews.',
      category: 'Books',
      platform: 'Instagram',
      followers: 134000,
      engagement_rate: 5.0,
      country: 'Australia',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Hiroshi Nakamura',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Traditional Japanese craftsman sharing ancient techniques and their modern applications.',
      category: 'Crafts',
      platform: 'YouTube',
      followers: 156000,
      engagement_rate: 5.9,
      country: 'Japan',
      age_group: '35-44',
      last_active: new Date().toISOString()
    },
    {
      name: 'Maya Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Environmental activist and sustainability advocate promoting eco-friendly living practices.',
      category: 'Environment',
      platform: 'Instagram',
      followers: 223000,
      engagement_rate: 7.0,
      country: 'Canada',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Rafael Costa',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Soccer coach and sports analyst sharing insights about the beautiful game and tactics.',
      category: 'Sports',
      platform: 'YouTube',
      followers: 345000,
      engagement_rate: 4.8,
      country: 'Brazil',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Chloe Anderson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Makeup artist and beauty influencer creating stunning transformations and tutorials.',
      category: 'Beauty',
      platform: 'TikTok',
      followers: 789000,
      engagement_rate: 8.6,
      country: 'United States',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Adrian Torres',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Financial advisor and investment expert helping people build wealth and financial security.',
      category: 'Finance',
      platform: 'LinkedIn',
      followers: 178000,
      engagement_rate: 5.3,
      country: 'Spain',
      age_group: '35-44',
      last_active: new Date().toISOString()
    },
    {
      name: 'Lily Wang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Plant enthusiast and gardening expert sharing tips for green thumbs and plant care.',
      category: 'Gardening',
      platform: 'Instagram',
      followers: 198000,
      engagement_rate: 5.8,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Oscar Martinez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Comedian and content creator making people laugh with relatable humor and sketches.',
      category: 'Comedy',
      platform: 'TikTok',
      followers: 567000,
      engagement_rate: 9.3,
      country: 'Mexico',
      age_group: '18-24',
      last_active: new Date().toISOString()
    },
    {
      name: 'Nina Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Yoga instructor and wellness coach promoting holistic health practices and mindfulness.',
      category: 'Wellness',
      platform: 'Instagram',
      followers: 234000,
      engagement_rate: 6.2,
      country: 'India',
      age_group: '25-34',
      last_active: new Date().toISOString()
    },
    {
      name: 'Jake Taylor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Guitarist and music teacher sharing guitar lessons, music theory, and performance tips.',
      category: 'Music',
      platform: 'YouTube',
      followers: 289000,
      engagement_rate: 6.0,
      country: 'United States',
      age_group: '25-34',
      last_active: new Date().toISOString()
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

  console.log('✅ Sample influencers inserted');
};

/**
 * Main setup function
 */
const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');
    
    const supabase = initializeSupabase();
    
    // Create tables
    await createTables(supabase);
    
    // Insert sample data
    await insertCountries(supabase);
    await insertInfluencers(supabase);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 You can now use the API endpoints:');
    console.log('   - GET /api/influencers');
    console.log('   - GET /api/influencers/:id');
    console.log('   - GET /api/influencers/countries/list');
    console.log('   - POST /api/influencers/lists/add');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 