-- Add team_crest column to player_card table
ALTER TABLE player_card ADD COLUMN IF NOT EXISTS team_crest text;

-- Set default team crest for all existing cards
UPDATE player_card SET team_crest = '/DMCSS-crest.png' WHERE team_crest IS NULL;
