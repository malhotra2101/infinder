# 🔧 Database Migration Instructions

## Problem
Currently, when a brand accepts one campaign from an influencer, all other campaigns from that same influencer are automatically getting accepted. This is happening because the database has an old constraint that prevents multiple entries for the same influencer in the `influencer_lists` table.

## Root Cause
The database constraint `influencer_lists_influencer_id_list_type_key` only allows one entry per influencer per list type, regardless of campaign. This needs to be updated to include `campaign_id` so that one influencer can be selected for multiple campaigns separately.

## Solution

### Step 1: Run Database Migration

**Go to your Supabase Dashboard:**
1. Navigate to your Supabase project
2. Go to **SQL Editor**
3. Run the following SQL commands:

```sql
-- Step 1: Drop the existing constraint
ALTER TABLE influencer_lists 
DROP CONSTRAINT IF EXISTS influencer_lists_influencer_id_list_type_key;

-- Step 2: Create new constraint with campaign_id
ALTER TABLE influencer_lists 
ADD CONSTRAINT influencer_lists_influencer_id_list_type_campaign_id_key 
UNIQUE (influencer_id, list_type, campaign_id);

-- Step 3: Create index for entries without campaign_id
CREATE UNIQUE INDEX IF NOT EXISTS influencer_lists_influencer_id_list_type_null_campaign 
ON influencer_lists (influencer_id, list_type) 
WHERE campaign_id IS NULL;

-- Step 4: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_influencer_lists_influencer_id ON influencer_lists(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_lists_list_type ON influencer_lists(list_type);
CREATE INDEX IF NOT EXISTS idx_influencer_lists_campaign_id ON influencer_lists(campaign_id);
CREATE INDEX IF NOT EXISTS idx_influencer_lists_influencer_campaign ON influencer_lists(influencer_id, campaign_id);
```

### Step 2: Test the Migration

After running the migration, test it using the provided test script:

```bash
cd server
node -r dotenv/config test_multiple_campaigns.js
```

This script will:
1. Create test collaboration requests for multiple campaigns
2. Accept the first campaign
3. Accept the second campaign
4. Verify that both campaigns are accepted separately
5. Clean up test data

### Step 3: Verify Frontend Functionality

1. **Start your development servers:**
   ```bash
   # Terminal 1 - Backend
   cd server && npm start
   
   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

2. **Test the functionality:**
   - Have an influencer apply for multiple campaigns
   - Accept one campaign
   - Verify that other campaigns remain pending
   - Accept another campaign
   - Verify both campaigns are now accepted

## What This Fixes

### Before Migration:
- ❌ One influencer could only be selected for one campaign
- ❌ Accepting one campaign affected all other campaigns
- ❌ Database constraint prevented multiple entries

### After Migration:
- ✅ One influencer can be selected for multiple campaigns
- ✅ Each campaign acceptance is independent
- ✅ Separate database entries for each campaign
- ✅ Proper constraint that includes campaign_id

## Backend Changes Made

The backend code has been updated with:

1. **Improved Acceptance Logic:**
   - Checks if influencer is already selected for specific campaign
   - Only adds influencer to selected list for that specific campaign
   - Doesn't affect other pending requests

2. **Enhanced Logging:**
   - Detailed logs for debugging acceptance process
   - Tracks which campaigns are being accepted
   - Shows other pending requests for verification

3. **Real-time Updates:**
   - Proper handling of collaboration request updates
   - Real-time status updates for UI

## Frontend Changes Made

The frontend has been updated with:

1. **Better Real-time Handling:**
   - Properly updates specific collaboration requests
   - Doesn't affect other requests from the same influencer

2. **Connection Status:**
   - Shows real-time connection status
   - Indicates when updates are live

## Verification Checklist

After completing the migration, verify:

- [ ] Database migration executed successfully
- [ ] Test script passes (`test_multiple_campaigns.js`)
- [ ] Frontend shows separate campaign acceptances
- [ ] Real-time updates work correctly
- [ ] No unintended side effects on other campaigns

## Troubleshooting

### If Migration Fails:
1. Check if you have proper permissions in Supabase
2. Ensure no active connections are using the table
3. Try running the migration in smaller steps

### If Test Script Fails:
1. Verify the migration was applied correctly
2. Check database constraints in Supabase dashboard
3. Ensure test data is cleaned up properly

### If Frontend Still Shows Issues:
1. Restart both frontend and backend servers
2. Clear browser cache
3. Check browser console for errors

## Support

If you encounter any issues:
1. Check the server logs for detailed error messages
2. Verify database constraints in Supabase dashboard
3. Run the test scripts to isolate the problem 