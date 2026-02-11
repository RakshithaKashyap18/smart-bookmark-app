-- ============================================
-- BOOKMARK MANAGER - SUPABASE DATABASE SETUP
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- Then click "Run" to execute

-- Step 1: Create bookmarks table
-- ============================================
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
-- ============================================
-- Policy: Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Step 4: Enable Realtime
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You should see: "Success. No rows returned"
-- 
-- Next steps:
-- 1. Go to Authentication > Providers
-- 2. Enable Google provider
-- 3. Add your Google OAuth credentials
-- ============================================
