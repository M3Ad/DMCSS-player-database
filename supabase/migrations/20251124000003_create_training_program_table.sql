-- Create training_program table
create table training_program (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  season_goals text,
  weekly_schedule text,
  strength_conditioning text,
  technical_tactical text,
  coach_notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table training_program enable row level security;

-- Create policies
create policy "Users can view their own training program"
  on training_program for select
  using (auth.uid() = user_id);

create policy "Users can update their own training program"
  on training_program for update
  using (auth.uid() = user_id);

create policy "Users can insert their own training program"
  on training_program for insert
  with check (auth.uid() = user_id);
