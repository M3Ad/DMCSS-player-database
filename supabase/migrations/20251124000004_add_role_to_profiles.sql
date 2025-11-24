-- Add role column to profiles table
alter table profiles add column role text default 'player';

-- Add check constraint for valid roles
alter table profiles add constraint valid_role check (role in ('player', 'coach', 'admin'));

-- Update RLS policies to allow coaches to view all profiles
drop policy if exists "Users can view their own profile" on profiles;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Coaches can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );
