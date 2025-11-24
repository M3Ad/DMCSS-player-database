-- Fix the infinite recursion in RLS policies
-- The problem: Coaches policy checks profiles.role which triggers the same policy

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Coaches can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Recreate simple policies without recursion
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- For coaches to view all profiles, we'll use a different approach
-- Coaches will be identified by a custom claim or we'll handle it in the app layer
-- For now, just allow users to see their own data

-- Fix player_card policies (remove coach policies that cause recursion)
DROP POLICY IF EXISTS "Coaches can view all cards" ON player_card;
DROP POLICY IF EXISTS "Coaches can update all cards" ON player_card;
DROP POLICY IF EXISTS "Coaches can insert any card" ON player_card;

-- Fix training_program policies
DROP POLICY IF EXISTS "Coaches can view all programs" ON training_program;
DROP POLICY IF EXISTS "Coaches can update all programs" ON training_program;
DROP POLICY IF EXISTS "Coaches can insert any program" ON training_program;
