# Environment Variables for Vercel Deployment

## Required Environment Variables

Add these in your Vercel project settings (Settings → Environment Variables):

### Supabase Configuration

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Description: Your Supabase project URL
   - Example: `https://your-project.supabase.co`
   - Get from: Supabase Dashboard → Settings → API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Description: Your Supabase anonymous/public key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Get from: Supabase Dashboard → Settings → API

## How to Add Environment Variables in Vercel

### Via Vercel Dashboard:
1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environment: Production, Preview, Development (select all)
5. Click "Save"
6. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Via Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
```

### Via .env File (for local development only):
```bash
# .env.local (already exists, DO NOT commit to Git)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## After Adding Variables

1. **Redeploy your application** - Environment variables only take effect after redeployment
2. **Verify** - Check that your app can connect to Supabase
3. **Test authentication** - Try logging in on the deployed site

## Security Notes

- ✅ Variables starting with `NEXT_PUBLIC_` are safe to expose to the browser
- ❌ Never commit `.env.local` to Git (already in `.gitignore`)
- ✅ Use different Supabase projects for development and production if needed
- ✅ Row Level Security (RLS) policies protect your data regardless of exposed keys

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Ensure variables are added in Vercel dashboard
- Check variable names are exactly correct (case-sensitive)
- Redeploy after adding variables

**Error: "Invalid Supabase credentials"**
- Verify you copied the correct values from Supabase
- Check for extra spaces or line breaks
- Ensure using the correct Supabase project

**Variables not updating:**
- Redeploy the project
- Clear Vercel build cache (Settings → General → Clear Build Cache)
