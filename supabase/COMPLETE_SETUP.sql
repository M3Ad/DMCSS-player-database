-- ============================================
-- COMPLETE DATABASE SETUP FOR DMCSS PLAYER PORTAL
-- Run this ENTIRE script in Supabase SQL Editor
-- This includes ALL migrations from the beginning
-- ============================================

-- Migration 1: Create profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  age int,
  position text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create initial policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- Migration 2: Create player_card table
-- ============================================
CREATE TABLE IF NOT EXISTS player_card (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  pac int,
  sho int,
  pas int,
  dri int,
  def int,
  phy int,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE player_card ENABLE ROW LEVEL SECURITY;


-- Migration 3: Create training_program table
-- ============================================
CREATE TABLE IF NOT EXISTS training_program (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  season_goals text,
  weekly_schedule text,
  strength_conditioning text,
  technical_tactical text,
  coach_notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE training_program ENABLE ROW LEVEL SECURITY;


-- Migration 4: Add role column to profiles
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'player';
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_role;
ALTER TABLE profiles ADD CONSTRAINT valid_role CHECK (role IN ('player', 'coach', 'admin'));

-- Update RLS policies to allow coaches to view all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Coaches can view all profiles" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Coaches can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );


-- Migration 5: Enhanced RLS for player_card
-- ============================================
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own player card" ON player_card;
DROP POLICY IF EXISTS "Users can update their own player card" ON player_card;
DROP POLICY IF EXISTS "Users can insert their own player card" ON player_card;
DROP POLICY IF EXISTS "Players can view their own card" ON player_card;
DROP POLICY IF EXISTS "Coaches can view all cards" ON player_card;
DROP POLICY IF EXISTS "Players can insert their own card" ON player_card;
DROP POLICY IF EXISTS "Players can update their own card" ON player_card;
DROP POLICY IF EXISTS "Coaches can update all cards" ON player_card;

-- Players can SELECT their own card
CREATE POLICY "Players can view their own card"
  ON player_card FOR SELECT
  USING (auth.uid() = user_id);

-- Coaches can SELECT all cards
CREATE POLICY "Coaches can view all cards"
  ON player_card FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- Players can INSERT their own card
CREATE POLICY "Players can insert their own card"
  ON player_card FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Players can UPDATE their own card
CREATE POLICY "Players can update their own card"
  ON player_card FOR UPDATE
  USING (auth.uid() = user_id);

-- Coaches can UPDATE all cards
CREATE POLICY "Coaches can update all cards"
  ON player_card FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- Coaches can INSERT cards for any player
CREATE POLICY "Coaches can insert any card"
  ON player_card FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );


-- Migration 6: Enhanced RLS for training_program
-- ============================================
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own training program" ON training_program;
DROP POLICY IF EXISTS "Users can update their own training program" ON training_program;
DROP POLICY IF EXISTS "Users can insert their own training program" ON training_program;
DROP POLICY IF EXISTS "Players can view their own program" ON training_program;
DROP POLICY IF EXISTS "Coaches can view all programs" ON training_program;
DROP POLICY IF EXISTS "Players can insert their own program" ON training_program;
DROP POLICY IF EXISTS "Players can update their own program" ON training_program;
DROP POLICY IF EXISTS "Coaches can update all programs" ON training_program;

-- Players can SELECT their own program
CREATE POLICY "Players can view their own program"
  ON training_program FOR SELECT
  USING (auth.uid() = user_id);

-- Coaches can SELECT all programs
CREATE POLICY "Coaches can view all programs"
  ON training_program FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- Players can INSERT their own program
CREATE POLICY "Players can insert their own program"
  ON training_program FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Players can UPDATE their own program
CREATE POLICY "Players can update their own program"
  ON training_program FOR UPDATE
  USING (auth.uid() = user_id);

-- Coaches can UPDATE all programs
CREATE POLICY "Coaches can update all programs"
  ON training_program FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- Coaches can INSERT programs for any player
CREATE POLICY "Coaches can insert any program"
  ON training_program FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );


-- Migration 7: Create storage bucket for player photos
-- ============================================
-- Create storage bucket (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('player-photos', 'player-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view player photos" ON storage.objects;
DROP POLICY IF EXISTS "Players can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Players can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Players can delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can upload any photo" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can update any photo" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can delete any photo" ON storage.objects;

-- Anyone can view player photos
CREATE POLICY "Anyone can view player photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'player-photos');

-- Players can upload their own photos
CREATE POLICY "Players can upload their own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'player-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Players can update their own photos
CREATE POLICY "Players can update their own photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'player-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Players can delete their own photos
CREATE POLICY "Players can delete their own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'player-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Coaches can upload photos for any player
CREATE POLICY "Coaches can upload any photo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'player-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- Coaches can update any photo
CREATE POLICY "Coaches can update any photo"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'player-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- Coaches can delete any photo
CREATE POLICY "Coaches can delete any photo"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'player-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database now has:
-- ✅ profiles table with role column
-- ✅ player_card table with stats
-- ✅ training_program table
-- ✅ Role-based access control (player/coach/admin)
-- ✅ Enhanced security policies for all tables
-- ✅ Photo storage bucket with proper permissions
-- ============================================
