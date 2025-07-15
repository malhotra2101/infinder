# Database Setup Guide

## Step 1: Run the SQL Script

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database_setup.sql` into the editor
4. Click "Run" to execute the script

This will create:
- `campaigns` table with dummy campaign data
- `influencers` table with dummy influencer data  
- `influencer_performance` table with performance metrics
- `dashboard_metrics` table with aggregated metrics
- Proper indexes for performance

## Step 2: Verify the Setup

After running the script, you should see:
- 5 campaigns in the `campaigns` table
- 10 influencers in the `influencers` table
- Performance data in the `influencer_performance` table
- Dashboard metrics in the `dashboard_metrics` table

## Step 3: Test the Dashboard

The dashboard components have been updated to fetch data from Supabase:
- `MetricsCards` - Fetches dashboard metrics
- `InfluencersTable` - Fetches paginated influencer data with search
- `TopInfluencers` - Fetches top performing influencers

All components now include:
- Loading states
- Error handling
- Real-time data from your database

## Troubleshooting

If you encounter issues:
1. Check your Supabase connection in `supabase.js`
2. Verify the tables were created successfully
3. Check the browser console for any API errors
4. Ensure your Supabase URL and API key are correct 