# Database Setup Instructions

To fix the dashboard errors, you need to create the missing tables and columns in your Supabase database.

## Step 1: Go to Supabase Dashboard

1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Create a new query

## Step 2: Create Missing Tables

Copy and paste the following SQL into the SQL Editor and run it:

```sql
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

-- Create influencer_performance table
CREATE TABLE IF NOT EXISTS influencer_performance (
  id SERIAL PRIMARY KEY,
  influencer_id INTEGER REFERENCES influencers(id) ON DELETE CASCADE,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  revenue DECIMAL(10,2) DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  followers INTEGER DEFAULT 0,
  month VARCHAR(10),
  year INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_date ON dashboard_metrics(date);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_created_at ON dashboard_metrics(created_at);

CREATE INDEX IF NOT EXISTS idx_influencer_performance_influencer_id ON influencer_performance(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_performance_campaign_id ON influencer_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_influencer_performance_revenue ON influencer_performance(revenue);
CREATE INDEX IF NOT EXISTS idx_influencer_performance_year_month ON influencer_performance(year, month);

-- Enable Row Level Security (RLS)
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication needs)
-- For now, allowing all operations (you can restrict this later)
CREATE POLICY "Allow all operations for dashboard_metrics" ON dashboard_metrics
  FOR ALL USING (true);

CREATE POLICY "Allow all operations for influencer_performance" ON influencer_performance
  FOR ALL USING (true);
```

## Step 3: Add Missing Columns to Existing Tables

Run this SQL to add missing columns:

```sql
-- Add missing columns to influencers table for dashboard functionality

-- Add email column
ALTER TABLE influencers 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add balance column
ALTER TABLE influencers 
ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0;

-- Add level column
ALTER TABLE influencers 
ADD COLUMN IF NOT EXISTS level VARCHAR(20) DEFAULT 'JUNIOR' CHECK (level IN ('JUNIOR', 'MIDDLE', 'SENIOR'));

-- Add backlog column
ALTER TABLE influencers 
ADD COLUMN IF NOT EXISTS backlog INTEGER DEFAULT 0;

-- Add in_progress column
ALTER TABLE influencers 
ADD COLUMN IF NOT EXISTS in_progress INTEGER DEFAULT 0;

-- Add done column
ALTER TABLE influencers 
ADD COLUMN IF NOT EXISTS done INTEGER DEFAULT 0;

-- Add status column if it doesn't exist
ALTER TABLE influencers 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BAN', 'VERIFICATION', 'PROGRESS', 'DELETE'));

-- Add budget column to campaigns table if it doesn't exist
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS budget DECIMAL(12,2) DEFAULT 0;

-- Add name column to campaigns table if it doesn't exist (for analytics)
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Update existing campaigns to have a name if it's null
UPDATE campaigns 
SET name = campaign_name 
WHERE name IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_influencers_email ON influencers(email);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON influencers(status);
CREATE INDEX IF NOT EXISTS idx_influencers_level ON influencers(level);
CREATE INDEX IF NOT EXISTS idx_campaigns_budget ON campaigns(budget);
```

## Step 4: Insert Sample Data

Run this SQL to add sample data:

```sql
-- Insert sample dashboard metrics
INSERT INTO dashboard_metrics (total_revenue, total_campaigns, active_influencers, avg_engagement, date) VALUES
(125000.00, 24, 156, 4.8, CURRENT_DATE),
(118000.00, 22, 148, 4.5, CURRENT_DATE - INTERVAL '1 day'),
(132000.00, 26, 162, 5.1, CURRENT_DATE - INTERVAL '2 days');

-- Update influencers with sample data
UPDATE influencers 
SET 
  email = CASE 
    WHEN id = 1 THEN 'john.doe@example.com'
    WHEN id = 2 THEN 'jane.smith@example.com'
    WHEN id = 3 THEN 'mike.johnson@example.com'
    WHEN id = 4 THEN 'sarah.wilson@example.com'
    WHEN id = 5 THEN 'david.brown@example.com'
    ELSE CONCAT(LOWER(REPLACE(name, ' ', '.')), '@example.com')
  END,
  balance = CASE 
    WHEN id = 1 THEN 2500.00
    WHEN id = 2 THEN 1800.00
    WHEN id = 3 THEN 3200.00
    WHEN id = 4 THEN 1500.00
    WHEN id = 5 THEN 4100.00
    ELSE FLOOR(RANDOM() * 5000) + 500
  END,
  level = CASE 
    WHEN followers > 100000 THEN 'SENIOR'
    WHEN followers > 50000 THEN 'MIDDLE'
    ELSE 'JUNIOR'
  END,
  backlog = FLOOR(RANDOM() * 10) + 1,
  in_progress = FLOOR(RANDOM() * 5) + 1,
  done = FLOOR(RANDOM() * 20) + 5,
  status = 'ACTIVE'
WHERE email IS NULL;

-- Update campaigns with sample budgets
UPDATE campaigns 
SET budget = CASE 
  WHEN id = 1 THEN 50000.00
  WHEN id = 2 THEN 75000.00
  WHEN id = 3 THEN 30000.00
  WHEN id = 4 THEN 100000.00
  WHEN id = 5 THEN 45000.00
  ELSE FLOOR(RANDOM() * 100000) + 10000
END
WHERE budget = 0;

-- Insert sample influencer performance data
INSERT INTO influencer_performance (influencer_id, campaign_id, revenue, engagement_rate, followers, month, year) 
SELECT 
  i.id as influencer_id,
  c.id as campaign_id,
  FLOOR(RANDOM() * 10000) + 1000 as revenue,
  (RANDOM() * 10 + 1)::DECIMAL(5,2) as engagement_rate,
  i.followers,
  '07' as month,
  2025 as year
FROM influencers i
CROSS JOIN campaigns c
WHERE i.id <= 5 AND c.id <= 2
LIMIT 10;
```

## Step 5: Verify Setup

After running all the SQL commands, your dashboard should work without errors. The tables that will be created/updated are:

1. **dashboard_metrics** - Stores dashboard metrics data
2. **influencer_performance** - Stores influencer performance data
3. **influencers** - Updated with missing columns (email, balance, level, etc.)
4. **campaigns** - Updated with missing columns (budget, name)

## Troubleshooting

If you still see errors:

1. **Check table existence**: Go to **Table Editor** in Supabase and verify all tables exist
2. **Check column existence**: Verify that all required columns are present in the tables
3. **Check RLS policies**: Make sure Row Level Security policies allow read access
4. **Refresh browser**: Clear browser cache and refresh the page

## Next Steps

After completing this setup:

1. Restart your server: `cd server && pnpm dev`
2. Refresh your frontend: The dashboard should now load without errors
3. Test the dashboard functionality to ensure everything works correctly 