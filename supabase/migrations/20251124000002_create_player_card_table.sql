-- Create player_card table
create table player_card (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  pac int,
  sho int,
  pas int,
  dri int,
  def int,
  phy int,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table player_card enable row level security;

-- Create policies
create policy "Users can view their own player card"
  on player_card for select
  using (auth.uid() = user_id);

create policy "Users can update their own player card"
  on player_card for update
  using (auth.uid() = user_id);

create policy "Users can insert their own player card"
  on player_card for insert
  with check (auth.uid() = user_id);
