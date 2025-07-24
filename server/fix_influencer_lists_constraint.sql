-- Fix influencer_lists table unique constraint
-- This migration updates the unique constraint to include campaign_id for campaign-specific entries

-- First, drop the existing unique constraint
ALTER TABLE influencer_lists 
DROP CONSTRAINT IF EXISTS influencer_lists_influencer_id_list_type_key;

-- Create a new unique constraint that includes campaign_id
-- This allows multiple entries for the same influencer and list_type if they have different campaign_ids
-- But prevents duplicates for the same influencer, list_type, and campaign_id combination
ALTER TABLE influencer_lists 
ADD CONSTRAINT influencer_lists_influencer_id_list_type_campaign_id_key 
UNIQUE (influencer_id, list_type, campaign_id);

-- Create a separate unique constraint for entries without campaign_id (general list entries)
-- This prevents multiple general entries for the same influencer and list_type
CREATE UNIQUE INDEX IF NOT EXISTS influencer_lists_influencer_id_list_type_null_campaign 
ON influencer_lists (influencer_id, list_type) 
WHERE campaign_id IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_influencer_lists_influencer_id ON influencer_lists(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_lists_list_type ON influencer_lists(list_type);
CREATE INDEX IF NOT EXISTS idx_influencer_lists_campaign_id ON influencer_lists(campaign_id);
CREATE INDEX IF NOT EXISTS idx_influencer_lists_influencer_campaign ON influencer_lists(influencer_id, campaign_id);

-- Add a comment to document the constraint structure
COMMENT ON TABLE influencer_lists IS 'Stores influencer list assignments. Campaign-specific entries have campaign_id, general entries have NULL campaign_id.';
COMMENT ON CONSTRAINT influencer_lists_influencer_id_list_type_campaign_id_key ON influencer_lists IS 'Prevents duplicate entries for the same influencer, list_type, and campaign_id combination.'; 