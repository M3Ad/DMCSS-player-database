-- Create storage bucket for player photos
insert into storage.buckets (id, name, public)
values ('player-photos', 'player-photos', true);

-- Enable RLS on the bucket
create policy "Anyone can view player photos"
  on storage.objects for select
  using (bucket_id = 'player-photos');

-- Players can upload their own photos
create policy "Players can upload their own photos"
  on storage.objects for insert
  with check (
    bucket_id = 'player-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Players can update their own photos
create policy "Players can update their own photos"
  on storage.objects for update
  using (
    bucket_id = 'player-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Players can delete their own photos
create policy "Players can delete their own photos"
  on storage.objects for delete
  using (
    bucket_id = 'player-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Coaches can upload photos for any player
create policy "Coaches can upload any photo"
  on storage.objects for insert
  with check (
    bucket_id = 'player-photos'
    and exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Coaches can update any photo
create policy "Coaches can update any photo"
  on storage.objects for update
  using (
    bucket_id = 'player-photos'
    and exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );

-- Coaches can delete any photo
create policy "Coaches can delete any photo"
  on storage.objects for delete
  using (
    bucket_id = 'player-photos'
    and exists (
      select 1 from profiles
      where id = auth.uid() and role = 'coach'
    )
  );
