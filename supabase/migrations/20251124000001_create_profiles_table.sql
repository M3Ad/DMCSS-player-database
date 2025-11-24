-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  age int,
  position text,
  photo_url text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);
