-- Enhanced Row Level Security policies for training_program table
-- Players can only view/update their own programs
-- Coaches can view and update all programs

-- Drop existing policies
drop policy if exists "Users can view their own training program" on training_program;
drop policy if exists "Users can update their own training program" on training_program;
drop policy if exists "Users can insert their own training program" on training_program;

-- Players can SELECT their own program
create policy "Players can view their own program"
  on training_program for select
  using (auth.uid() = user_id);

-- Coaches can SELECT all programs
create policy "Coaches can view all programs"
  on training_program for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Players can INSERT their own program
create policy "Players can insert their own program"
  on training_program for insert
  with check (auth.uid() = user_id);

-- Players can UPDATE their own program
create policy "Players can update their own program"
  on training_program for update
  using (auth.uid() = user_id);

-- Coaches can UPDATE all programs
create policy "Coaches can update all programs"
  on training_program for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );
