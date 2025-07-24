-- Collaboration Requests Table Migration
-- This migration creates the collaboration_requests table for handling collaboration requests

-- Create collaboration_requests table
CREATE TABLE IF NOT EXISTS collaboration_requests (
  id SERIAL PRIMARY KEY,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('brand', 'influencer')),
  sender_id INTEGER NOT NULL,
  receiver_type VARCHAR(20) NOT NULL CHECK (receiver_type IN ('brand', 'influencer')),
  receiver_id INTEGER NOT NULL,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  request_type VARCHAR(30) NOT NULL DEFAULT 'collaboration' CHECK (request_type IN ('collaboration', 'campaign_assignment')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add campaign_id column to influencer_lists table if it doesn't exist
ALTER TABLE influencer_lists 
ADD COLUMN IF NOT EXISTS campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_sender ON collaboration_requests(sender_type, sender_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_receiver ON collaboration_requests(receiver_type, receiver_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_campaign ON collaboration_requests(campaign_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_status ON collaboration_requests(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_requests_created_at ON collaboration_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_influencer_lists_campaign ON influencer_lists(campaign_id);

-- Create unique constraint to prevent duplicate requests
CREATE UNIQUE INDEX IF NOT EXISTS idx_collaboration_requests_unique 
ON collaboration_requests(sender_type, sender_id, receiver_type, receiver_id, request_type, campaign_id) 
WHERE campaign_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_collaboration_requests_unique_no_campaign 
ON collaboration_requests(sender_type, sender_id, receiver_type, receiver_id, request_type) 
WHERE campaign_id IS NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication needs)
-- For now, allowing all operations (you can restrict this later)
CREATE POLICY "Allow all operations for collaboration_requests" ON collaboration_requests
  FOR ALL USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collaboration_requests_updated_at 
    BEFORE UPDATE ON collaboration_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO collaboration_requests (sender_type, sender_id, receiver_type, receiver_id, campaign_id, request_type, status, message) VALUES
-- ('influencer', 1, 'brand', 1, 1, 'campaign_assignment', 'pending', 'I am interested in this campaign'),
-- ('influencer', 2, 'brand', 1, 1, 'campaign_assignment', 'pending', 'I would love to collaborate on this campaign');

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT ALL ON collaboration_requests TO authenticated;
-- GRANT ALL ON collaboration_requests TO anon; 