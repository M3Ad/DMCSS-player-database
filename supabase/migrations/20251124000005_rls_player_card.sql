-- Enhanced Row Level Security policies for player_card table
-- Players can only view/update their own cards
-- Coaches can view and update all cards

-- Drop existing policies
drop policy if exists "Users can view their own player card" on player_card;
drop policy if exists "Users can update their own player card" on player_card;
drop policy if exists "Users can insert their own player card" on player_card;

-- Players can SELECT their own card
create policy "Players can view their own card"
  on player_card for select
  using (auth.uid() = user_id);

-- Coaches can SELECT all cards
create policy "Coaches can view all cards"
  on player_card for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Players can INSERT their own card
create policy "Players can insert their own card"
  on player_card for insert
  with check (auth.uid() = user_id);

-- Players can UPDATE their own card
create policy "Players can update their own card"
  on player_card for update
  using (auth.uid() = user_id);

-- Coaches can UPDATE all cards
create policy "Coaches can update all cards"
  on player_card for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );
