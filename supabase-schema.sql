-- ============================================
-- Reddit Scout — Supabase Database Schema
-- ============================================
-- Go to your Supabase SQL Editor and run this entire file.

-- 1. Replies table (stores generated AI replies)
CREATE TABLE IF NOT EXISTS replies (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,
  search_query TEXT NOT NULL DEFAULT '',
  post_title  TEXT NOT NULL DEFAULT '',
  subreddit   TEXT NOT NULL DEFAULT '',
  reply_text  TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Index for fetching replies by user (sorted by newest)
CREATE INDEX IF NOT EXISTS idx_replies_user_created
  ON replies (user_id, created_at DESC);

-- Enable Row Level Security (permissive for Clerk auth)
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Allow all operations (auth is handled by Clerk via API routes)
CREATE POLICY "Allow all operations via API"
  ON replies FOR ALL
  USING (true)
  WITH CHECK (true);


-- 2. Searches table (stores search history)
CREATE TABLE IF NOT EXISTS searches (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    TEXT NOT NULL,
  query      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fetching searches by user (sorted by newest)
CREATE INDEX IF NOT EXISTS idx_searches_user_created
  ON searches (user_id, created_at DESC);

-- Enable Row Level Security (permissive for Clerk auth)
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;

-- Allow all operations (auth is handled by Clerk via API routes)
CREATE POLICY "Allow all operations via API"
  ON searches FOR ALL
  USING (true)
  WITH CHECK (true);
