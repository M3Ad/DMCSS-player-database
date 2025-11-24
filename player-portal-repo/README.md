# Player Portal (FIFA-Style Player Page)

This is a example Next.js + Supabase project for a player portal.
Each player can sign in and view their FIFA-style card and training program.

## Setup

1. Clone this repo:
   ```bash
   git clone <your-repo-url>
   cd player-portal-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and get:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

5. Create the following tables in Supabase (SQL example):

   ```sql
   create table profiles (
     id uuid primary key references auth.users(id),
     full_name text,
     age int,
     position text,
     photo_url text,
     created_at timestamptz default now()
   );

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
   ```

6. Run the dev server:
   ```bash
   npm run dev
   ```

   Then open http://localhost:3000

## Notes

- Authentication is handled by Supabase auth.
- The `/` page is the sign-in screen.
- The `/player` page shows the player card and training program for the logged-in user.
