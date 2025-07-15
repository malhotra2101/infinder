# Supabase Frontend Setup

## Environment Variables

Create a `.env.local` file in the `client` directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://uojpdnzjinmbpamxtxco.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvanBkbnpqaW5tYnBhbXh0eGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzc3NDMsImV4cCI6MjA2NzExMzc0M30.OxaBUldXCqcSE
```

## Database Schema

The search functionality expects the following tables in your Supabase database:

### 1. `influencers` table
```sql
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
```

### 2. `countries` table
```sql
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. `influencer_lists` table
```sql
CREATE TABLE influencer_lists (
  id SERIAL PRIMARY KEY,
  influencer_id INTEGER REFERENCES influencers(id),
  list_type VARCHAR(20) NOT NULL CHECK (list_type IN ('selected', 'rejected', 'suggested')),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(influencer_id, list_type)
);
```

## Sample Data

You can insert sample data to test the functionality:

```sql
-- Insert sample countries
INSERT INTO countries (name, code) VALUES
('United States', 'USA'),
('Canada', 'CAN'),
('United Kingdom', 'GBR'),
('Australia', 'AUS'),
('Germany', 'DEU'),
('France', 'FRA'),
('Spain', 'ESP'),
('Italy', 'ITA'),
('Japan', 'JPN'),
('South Korea', 'KOR'),
('India', 'IND'),
('Brazil', 'BRA'),
('Mexico', 'MEX'),
('Argentina', 'ARG'),
('Chile', 'CHL'),
('Colombia', 'COL'),
('Peru', 'PER'),
('Venezuela', 'VEN'),
('Ecuador', 'ECU'),
('Bolivia', 'BOL'),
('Paraguay', 'PRY'),
('Uruguay', 'URY'),
('Guyana', 'GUY'),
('Suriname', 'SUR'),
('French Guiana', 'GUF');

-- Insert sample influencers
INSERT INTO influencers (name, avatar, bio, category, platform, followers, engagement_rate, country, age_group, last_active) VALUES
('Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Lifestyle and fashion influencer sharing daily inspiration and style tips.', 'Lifestyle & Fashion', 'Instagram', 125000, 4.2, 'United States', '25-34', NOW()),
('Alex Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Tech enthusiast and startup founder. Sharing insights about entrepreneurship.', 'Technology', 'LinkedIn', 89000, 5.1, 'Canada', '25-34', NOW()),
('Maria Rodriguez', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Fitness coach and wellness advocate. Helping people achieve their health goals.', 'Fitness & Wellness', 'YouTube', 234000, 3.8, 'Spain', '25-34', NOW()),
('David Kim', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Food blogger and culinary expert. Exploring global cuisines.', 'Food & Cooking', 'TikTok', 456000, 6.2, 'South Korea', '25-34', NOW()),
('Emma Wilson', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'Travel photographer and adventure seeker. Capturing breathtaking moments.', 'Travel', 'Instagram', 189000, 4.7, 'Australia', '25-34', NOW());
```

## Features

The search page includes:

1. **Real-time Search**: Debounced search with 300ms delay
2. **Advanced Filtering**: 
   - Platform selection (Instagram, TikTok, YouTube, etc.)
   - Follower range filters
   - Engagement rate filters
   - Country selection
   - Age group filters
   - Last active filters
3. **Infinite Scroll**: Load more results as you scroll
4. **List Management**: Add influencers to selected, rejected, or suggested lists
5. **Responsive Design**: Works on all device sizes
6. **Accessibility**: ARIA labels and keyboard navigation
7. **Performance Optimizations**: Debounced search, lazy loading, memoization

## Usage

1. Navigate to `/search` in your application
2. Use the search bar to find influencers by name, category, or location
3. Click the "Filters" button to open advanced filtering options
4. Use the action buttons on each card to:
   - Select an influencer (adds to selected list)
   - Reject an influencer (removes from view)
   - Contact an influencer (opens contact modal)
5. Switch between tabs to view different lists (All, Selected, Rejected, Suggested)

## Customization

You can customize the search functionality by:

1. Modifying the filter options in `FilterSidebar.jsx`
2. Adjusting the search query logic in `supabase.js`
3. Customizing the card layout in `InfluencerCard.jsx`
4. Adding new action buttons or modifying existing ones
5. Adjusting the debounce delay in `useDebounce.js` 