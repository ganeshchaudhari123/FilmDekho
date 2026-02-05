# 🌐 Deployment Guide

## Deploying to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase project set up

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - FilmDekho streaming app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/filmdekho.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Environment Variables**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_ID=your_banner_id
   NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ID=your_social_bar_id
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

5. **Update Supabase Redirect URLs**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to allowed redirect URLs:
     - `https://your-app.vercel.app/**`

---

## Alternative: Deploy to Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `.netlify/functions`

2. **Environment Variables**
   Same as Vercel section above

3. **netlify.toml Configuration**
   Already included in project (see netlify.toml file)

---

## Custom Domain Setup

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

### On Netlify:
1. Domain Settings → Add custom domain
2. Update DNS records
3. Enable HTTPS

---

## Production Checklist

Before deploying to production:

- [ ] All environment variables set correctly
- [ ] Supabase RLS policies tested
- [ ] Admin account created and tested
- [ ] Sample content added
- [ ] VIP features tested
- [ ] Payment gateway integrated (if using)
- [ ] SEO meta tags verified
- [ ] Mobile responsiveness tested
- [ ] Analytics integrated (Google Analytics, etc.)
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Performance optimized
- [ ] Security headers configured

---

## Environment-Specific Configurations

### Development
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Staging
```env
NEXT_PUBLIC_APP_URL=https://staging.filmdekho.com
```

### Production
```env
NEXT_PUBLIC_APP_URL=https://filmdekho.com
```

---

## Monitoring & Analytics

### Google Analytics
Add to `app/layout.tsx`:
```tsx
import Script from 'next/script'

// Add in head
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to layout:
```tsx
import { Analytics } from '@vercel/analytics/react'

// In body
<Analytics />
```

---

## Performance Optimization

1. **Image Optimization**
   - Using Next.js Image component ✅
   - Compress images before upload
   - Use WebP format

2. **Code Splitting**
   - Automatic with Next.js ✅
   - Use dynamic imports for heavy components

3. **Caching**
   - Configure in `next.config.ts`
   - Set proper cache headers

4. **CDN**
   - Vercel Edge Network (automatic) ✅
   - Or use Cloudflare CDN

---

## Backup & Security

1. **Database Backups**
   - Supabase automatic daily backups ✅
   - Consider additional backup solution for critical data

2. **SSL/HTTPS**
   - Automatic with Vercel/Netlify ✅

3. **Rate Limiting**
   - Implement API rate limiting
   - Use Vercel Edge Middleware

4. **Security Headers**
   Add to `next.config.ts`:
   ```ts
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
         ],
       },
     ]
   }
   ```

---

## Troubleshooting Deployment

### Build Fails
- Check Node.js version (18+)
- Clear `.next` folder
- Verify all dependencies installed

### Environment Variables Not Working
- Prefix client-side vars with `NEXT_PUBLIC_`
- Restart deployment after adding vars
- Check for typos

### Database Connection Issues
- Verify Supabase URL and keys
- Check network/firewall settings
- Ensure RLS policies are correct

### Images Not Loading
- Check image URLs are accessible
- Verify CORS settings
- Use Next.js Image domains config

---

## Post-Deployment

1. **Test All Features**
   - Login/Signup flow
   - Video playback
   - VIP subscription
   - Admin panel access

2. **Monitor Performance**
   - Use Vercel Analytics
   - Google PageSpeed Insights
   - Lighthouse scores

3. **Set Up Alerts**
   - Uptime monitoring (UptimeRobot, etc.)
   - Error tracking
   - Performance alerts

---

## Scaling Considerations

As your app grows:

1. **Database**
   - Upgrade Supabase plan
   - Add read replicas
   - Implement caching (Redis)

2. **Storage**
   - Use CDN for video content
   - Implement video transcoding
   - Consider AWS S3/CloudFront

3. **Performance**
   - Edge caching
   - API optimization
   - Database indexing

---

**🚀 Ready to launch!**

For any deployment issues, refer to:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
