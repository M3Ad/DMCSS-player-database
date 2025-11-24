-- Summary of Row Level Security Policies
-- This file documents all RLS policies across the application

-- ===========================================
-- PROFILES TABLE
-- ===========================================
-- ✓ Users can view their own profile
-- ✓ Users can update their own profile  
-- ✓ Users can insert their own profile
-- ✓ Coaches can view all profiles

-- ===========================================
-- PLAYER_CARD TABLE
-- ===========================================
-- ✓ Players can view their own card
-- ✓ Players can insert their own card
-- ✓ Players can update their own card
-- ✓ Coaches can view all cards
-- ✓ Coaches can update all cards

-- ===========================================
-- TRAINING_PROGRAM TABLE
-- ===========================================
-- ✓ Players can view their own program
-- ✓ Players can insert their own program
-- ✓ Players can update their own program
-- ✓ Coaches can view all programs
-- ✓ Coaches can update all programs

-- ===========================================
-- ROLE REQUIREMENTS
-- ===========================================
-- To grant coach permissions to a user:
-- UPDATE profiles SET role = 'coach' WHERE id = 'user-uuid-here';

-- To verify a user's role:
-- SELECT id, full_name, role FROM profiles WHERE id = auth.uid();

-- ===========================================
-- TESTING RLS POLICIES
-- ===========================================
-- As a player, test SELECT (should only see own data):
-- SELECT * FROM player_card;
-- SELECT * FROM training_program;

-- As a coach, test SELECT (should see all data):
-- SELECT * FROM player_card;
-- SELECT * FROM training_program;

-- As a coach, test UPDATE (should succeed for any user_id):
-- UPDATE player_card SET pac = 90 WHERE user_id = 'some-player-id';
-- UPDATE training_program SET coach_notes = 'Updated' WHERE user_id = 'some-player-id';
