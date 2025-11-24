# Deployment Guide for Vercel

## Prerequisites

1. ✅ GitHub repository with your code
2. ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
3. ✅ Supabase project with:
   - Database tables created (run all migrations)
   - At least one test user account
   - Storage bucket created (for photo uploads)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure these files are committed:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? player-portal (or your choice)
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### 3. Configure Environment Variables

**In Vercel Dashboard:**
1. Go to your project → Settings → Environment Variables
2. Add these variables:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

3. Click "Redeploy" to apply variables

### 4. Configure Supabase for Production

**Update Supabase Settings:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URLs to allowed redirects:
   - `https://your-project.vercel.app/**`
   - `https://your-custom-domain.com/**` (if using custom domain)

**Update Storage CORS (if using photo uploads):**
1. Go to Storage → Configuration → CORS
2. Add allowed origins:
   ```json
   [
     "https://your-project.vercel.app",
     "http://localhost:3000"
   ]
   ```

### 5. Verify Deployment

1. **Visit your deployed site:** `https://your-project.vercel.app`
2. **Test authentication:**
   - Try logging in
   - Verify redirect to dashboard
   - Test logout
3. **Test protected routes:**
   - Access `/player` (should work when logged in)
   - Access `/coach` (should require coach role)
4. **Test data fetching:**
   - Verify FIFA card loads
   - Verify training program loads
   - Test photo upload (if applicable)

### 6. Custom Domain (Optional)

1. Go to Project → Settings → Domains
2. Add your custom domain
3. Configure DNS:
   - Add CNAME record: `your-domain.com` → `cname.vercel-dns.com`
4. Wait for DNS propagation (5-30 minutes)
5. Update Supabase allowed URLs with your domain

## Post-Deployment Checklist

- [ ] Environment variables are set in Vercel
- [ ] Supabase redirect URLs include Vercel domain
- [ ] Login/logout works on production
- [ ] Player dashboard loads correctly
- [ ] Coach dashboard loads correctly (if you have coach users)
- [ ] Photo upload works (if configured)
- [ ] Mobile responsive design works
- [ ] SSL certificate is active (automatic with Vercel)

## Continuous Deployment

**Automatic deployments are enabled by default:**
- Push to `main` branch → Deploy to production
- Push to other branches → Deploy to preview URL
- Pull requests → Create preview deployments

**Configure build settings:**
1. Settings → Git
2. Set production branch (usually `main`)
3. Configure ignored build step (optional)

## Common Issues & Solutions

### Issue: "Missing environment variables"
**Solution:** 
- Add variables in Vercel dashboard
- Redeploy after adding variables

### Issue: "Authentication not working"
**Solution:**
- Verify Supabase URL and key are correct
- Check Supabase redirect URLs include Vercel domain
- Clear browser cache and try again

### Issue: "Images not loading"
**Solution:**
- Check image paths are relative
- Verify images are in `/public` folder
- Update `next.config.js` for external image domains

### Issue: "Build failing"
**Solution:**
- Check build logs in Vercel dashboard
- Test build locally: `npm run build`
- Verify all dependencies in `package.json`

### Issue: "404 on dynamic routes"
**Solution:**
- Next.js handles this automatically
- Verify you're not using custom server
- Check `next.config.js` for rewrites

## Monitoring & Analytics

**Enable Vercel Analytics:**
1. Install package: `npm i @vercel/analytics`
2. Add to `_app.js`:
   ```javascript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function App({ Component, pageProps }) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     );
   }
   ```

**View Deployment Logs:**
- Go to Deployments → Select deployment → View Function Logs

## Security Best Practices

- ✅ All sensitive data protected by RLS policies
- ✅ Environment variables never committed to Git
- ✅ HTTPS enforced automatically by Vercel
- ✅ Authentication tokens handled securely by Supabase
- ✅ File upload validation in place

## Performance Optimization

**Already configured:**
- ✅ Next.js automatic code splitting
- ✅ Image optimization with Next.js Image component
- ✅ CSS modules for scoped styling
- ✅ Automatic static optimization

**Additional optimizations:**
- Enable Vercel Edge Network (automatic)
- Configure caching headers if needed
- Use Vercel Speed Insights

## Rollback

**If deployment has issues:**
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
