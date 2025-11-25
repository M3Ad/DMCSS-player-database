-- Add flag column to player_card table for different nationality flags
ALTER TABLE player_card ADD COLUMN IF NOT EXISTS flag text DEFAULT '/trinidad_flag.png';

-- Available flags (you'll need to add these images to your public folder):
-- '/trinidad_flag.png' - Trinidad & Tobago (default)
-- '/puerto_rico_flag.png' - Puerto Rico
-- '/usa_flag.png' - United States
-- '/jamaica_flag.png' - Jamaica
-- '/barbados_flag.png' - Barbados
-- Add any other flags as needed

-- Example: Update a specific player's flag to Puerto Rico
-- UPDATE player_card SET flag = '/puerto_rico_flag.png' WHERE user_id = 'user-id-here';
