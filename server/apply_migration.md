# Database Migration Guide

## Issue
The error `"Could not find the 'message' column of 'collaboration_requests' in the schema cache"` indicates that the `collaboration_requests` table hasn't been created in your Supabase database yet.

## Solution
You need to apply the database migration to create the `collaboration_requests` table.

## Steps to Apply Migration

### 1. Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Click "New Query"

### 2. Copy and Paste the Migration
Copy the entire contents of `collaboration_table_migration.sql` and paste it into the SQL Editor.

### 3. Run the Migration
Click the "Run" button to execute the migration.

### 4. Verify the Migration
After running the migration, you should see:
- A new `collaboration_requests` table created
- The `campaign_id` column added to the `influencer_lists` table
- All necessary indexes and constraints created

## What This Migration Does

1. **Creates the `collaboration_requests` table** with all necessary columns:
   - `id` - Primary key
   - `sender_type` - 'brand' or 'influencer'
   - `sender_id` - ID of the sender
   - `receiver_type` - 'brand' or 'influencer'
   - `receiver_id` - ID of the receiver
   - `campaign_id` - Reference to campaigns table
   - `request_type` - 'collaboration' or 'campaign_assignment'
   - `status` - 'pending', 'accepted', 'rejected', 'completed'
   - `message` - Optional message text
   - `created_at` and `updated_at` timestamps

2. **Adds campaign tracking** to the `influencer_lists` table

3. **Creates indexes** for better performance

4. **Sets up constraints** to prevent duplicate requests

## After Migration
Once the migration is applied, the collaboration system will work properly:
- Influencers can send requests for campaigns
- The "Sent Requests" tab will show all requests sent by influencers
- The "Received Requests" tab will show requests received by influencers
- Brands can accept/reject requests
- Accepted requests automatically add influencers to selected campaigns 