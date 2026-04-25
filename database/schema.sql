-- Enable RLS on the audits table
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Add user_id column to audits table if it doesn't exist
ALTER TABLE audits ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create policy for users to only see their own audits
CREATE POLICY "Users can only view their own audits" ON audits
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to only insert their own audits
CREATE POLICY "Users can only insert their own audits" ON audits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to only update their own audits
CREATE POLICY "Users can only update their own audits" ON audits
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to only delete their own audits
CREATE POLICY "Users can only delete their own audits" ON audits
    FOR DELETE USING (auth.uid() = user_id);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON audits(user_id);

-- Update existing audits to have a default user_id (temporary for migration)
-- This should be run once to migrate existing data
UPDATE audits SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
