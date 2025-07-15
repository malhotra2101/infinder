-- Database setup for dashboard analytics
-- Run this in your Supabase SQL editor

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  budget DECIMAL(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create influencers table (if not exists)
CREATE TABLE IF NOT EXISTS influencers (
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
);

-- Create influencer_performance table
CREATE TABLE IF NOT EXISTS influencer_performance (
  id SERIAL PRIMARY KEY,
  influencer_id INTEGER REFERENCES influencers(id),
  campaign_id INTEGER REFERENCES campaigns(id),
  revenue DECIMAL(10,2) DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  followers INTEGER DEFAULT 0,
  month VARCHAR(10),
  year INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create dashboard_metrics table
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id SERIAL PRIMARY KEY,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_campaigns INTEGER DEFAULT 0,
  active_influencers INTEGER DEFAULT 0,
  avg_engagement DECIMAL(5,2) DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert dummy data for campaigns
INSERT INTO campaigns (name, status, budget, start_date, end_date) VALUES
('Summer Fashion Campaign', 'active', 50000.00, '2024-06-01', '2024-08-31'),
('Tech Product Launch', 'active', 75000.00, '2024-07-01', '2024-09-30'),
('Food & Lifestyle', 'active', 30000.00, '2024-06-15', '2024-08-15'),
('Fitness Challenge', 'active', 40000.00, '2024-07-01', '2024-08-31'),
('Beauty Products', 'active', 60000.00, '2024-06-01', '2024-09-30');

-- Insert dummy data for influencers
INSERT INTO influencers (name, email, avatar, platform, followers, engagement_rate, category, country, status, level, balance, backlog, in_progress, done) VALUES
('Devon Lane', 'devon.lane@company.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', 'Instagram', 125000, 4.2, 'Fashion', 'United States', 'ACTIVE', 'MIDDLE', 630.44, 19, 15, 14),
('Wade Warren', 'wade.warren@company.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', 'TikTok', 89000, 6.8, 'Lifestyle', 'United Kingdom', 'BAN', 'JUNIOR', 202.87, 0, 16, 1),
('Sarah Johnson', 'sarah.johnson@company.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', 'YouTube', 450000, 8.5, 'Beauty', 'Canada', 'VERIFICATION', 'SENIOR', 1250.00, 8, 12, 25),
('Michael Chen', 'michael.chen@company.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', 'Instagram', 320000, 5.1, 'Tech', 'Australia', 'PROGRESS', 'MIDDLE', 890.25, 12, 8, 18),
('Emma Wilson', 'emma.wilson@company.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', 'TikTok', 180000, 7.2, 'Fitness', 'Germany', 'DELETE', 'JUNIOR', 450.75, 5, 10, 7),
('Alex Rodriguez', 'alex.rodriguez@company.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', 'Instagram', 280000, 4.8, 'Food', 'Spain', 'ACTIVE', 'MIDDLE', 720.30, 15, 20, 12),
('Lisa Thompson', 'lisa.thompson@company.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', 'YouTube', 650000, 9.1, 'Lifestyle', 'France', 'ACTIVE', 'SENIOR', 2100.50, 25, 30, 45),
('David Kim', 'david.kim@company.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', 'TikTok', 420000, 6.3, 'Tech', 'South Korea', 'ACTIVE', 'MIDDLE', 950.75, 18, 22, 15),
('Maria Garcia', 'maria.garcia@company.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', 'Instagram', 190000, 5.7, 'Beauty', 'Italy', 'ACTIVE', 'JUNIOR', 380.20, 8, 12, 9),
('James Wilson', 'james.wilson@company.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', 'YouTube', 380000, 7.8, 'Gaming', 'United States', 'ACTIVE', 'MIDDLE', 1100.40, 22, 18, 28);

-- Insert dummy performance data
INSERT INTO influencer_performance (influencer_id, campaign_id, revenue, engagement_rate, followers, month, year) VALUES
(1, 1, 1250.00, 4.2, 125000, '06', 2024),
(2, 1, 890.00, 6.8, 89000, '06', 2024),
(3, 2, 2100.00, 8.5, 450000, '06', 2024),
(4, 2, 1450.00, 5.1, 320000, '06', 2024),
(5, 3, 720.00, 7.2, 180000, '06', 2024),
(6, 3, 980.00, 4.8, 280000, '06', 2024),
(7, 4, 2800.00, 9.1, 650000, '06', 2024),
(8, 4, 1650.00, 6.3, 420000, '06', 2024),
(9, 5, 620.00, 5.7, 190000, '06', 2024),
(10, 5, 1950.00, 7.8, 380000, '06', 2024);

-- Insert dashboard metrics
INSERT INTO dashboard_metrics (total_revenue, total_campaigns, active_influencers, avg_engagement) VALUES
(13410.00, 5, 8, 6.67);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_influencers_status ON influencers(status);
CREATE INDEX IF NOT EXISTS idx_influencers_platform ON influencers(platform);
CREATE INDEX IF NOT EXISTS idx_performance_influencer ON influencer_performance(influencer_id);
CREATE INDEX IF NOT EXISTS idx_performance_campaign ON influencer_performance(campaign_id); 