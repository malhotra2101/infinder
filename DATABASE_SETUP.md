# Database Setup Guide

This guide will help you move the influencer data from mock data to a real database.

## Prerequisites

1. Make sure you have Node.js and pnpm installed
2. Ensure your Supabase project is set up and running

## Setup Steps

### 1. Set up the Backend Database

First, create the required database tables in your Supabase dashboard:

#### Create Tables in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL commands:

**Countries Table:**
```sql
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Influencers Table:**
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

**Influencer Lists Table:**
```sql
CREATE TABLE influencer_lists (
  id SERIAL PRIMARY KEY,
  influencer_id INTEGER REFERENCES influencers(id),
  list_type VARCHAR(20) NOT NULL CHECK (list_type IN ('selected', 'rejected', 'suggested')),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(influencer_id, list_type)
);
```

#### Insert Sample Data

After creating the tables, navigate to the server directory and run:

```bash
cd server
pnpm install
pnpm run setup-db
```

This will:
- Check if the required tables exist
- Insert sample influencer data
- Insert sample countries data

#### Test the Setup

After inserting the data, test that everything is working:

```bash
cd server
pnpm run test-setup
```

This will verify:
- Database connection is working
- Tables exist and contain data
- API endpoints are responding correctly

### 2. Start the Backend Server

```bash
cd server
pnpm run dev
```

The server will start on `http://localhost:5050`

### 3. Configure the Frontend

Create a `.env.local` file in the `client` directory with the following content:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5050/api

# Supabase Configuration (keep for other features)
VITE_SUPABASE_URL=https://uojpdnzjinmbpamxtxco.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvanBkbnpqaW5tYnBhbXh0eGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzc3NDMsImV4cCI6MjA2NzExMzc0M30.OxaBUldXCqcSEH2-1kgr0A4ASZ4D7rYY8rhjHnIyMd4
```

### 4. Start the Frontend

```bash
cd client
pnpm install
pnpm run dev
```

## API Endpoints

The backend now provides the following API endpoints:

- `GET /api/influencers` - Get all influencers with filtering and pagination
- `GET /api/influencers/:id` - Get a single influencer by ID
- `GET /api/influencers/countries/list` - Get available countries for filtering
- `POST /api/influencers/lists/add` - Add influencer to a list

## Database Schema

### Influencers Table
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

### Countries Table
```sql
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Influencer Lists Table
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

The setup script will insert 10 sample influencers with various:
- Platforms (Instagram, TikTok, YouTube, LinkedIn, Twitch)
- Categories (Lifestyle & Fashion, Technology, Fitness & Wellness, Food & Cooking, Travel, Gaming, Beauty, Business, Fashion)
- Countries (United States, Canada, Spain, South Korea, Australia, United Kingdom, Brazil, Japan)
- Follower counts (89K to 789K)
- Engagement rates (3.8% to 8.3%)

## Features

The updated system now includes:

1. **Real Database Integration**: All influencer data is stored in and fetched from Supabase
2. **Advanced Filtering**: Filter by platform, follower count, engagement rate, country, age group, and last active date
3. **Search Functionality**: Search across name, bio, and category fields
4. **Pagination**: Load more results as you scroll
5. **List Management**: Add influencers to selected, rejected, or suggested lists
6. **Error Handling**: Proper error handling for API failures

## Troubleshooting

### Database Connection Issues
- Ensure your Supabase project is active
- Check that the environment variables are correctly set
- Verify the database tables were created successfully

### API Connection Issues
- Make sure the backend server is running on port 5050
- Check that the frontend environment variable `VITE_API_URL` is set correctly
- Verify CORS is properly configured

### Data Not Loading
- Check the browser console for API errors
- Verify the database setup script ran successfully
- Ensure the sample data was inserted correctly 