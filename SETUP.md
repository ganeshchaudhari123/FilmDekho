# 🚀 Quick Setup Guide

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > API** and copy:
   - Project URL
   - Anon/Public Key
3. Paste these into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 2: Database Setup

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the entire content of `supabase-schema.sql`
4. Paste and run it
5. This creates all tables, policies, and sample data

## Step 3: Create Admin Account

1. Run the app: `npm run dev`
2. Open http://localhost:3000
3. Click "Sign Up" and create an account with your email
4. Go back to Supabase SQL Editor
5. Run this query (replace with your email):
   ```sql
   UPDATE users SET user_role = 'admin' WHERE email = 'your-email@example.com';
   ```
6. Now you can access `/admin-dashboard`

## Step 4: Add Sample Episodes

After creating series through the admin panel, you can add episodes:

1. Get the series ID from Supabase (in the series table)
2. Run this in SQL Editor:
   ```sql
   INSERT INTO episodes (series_id, episode_number, title, video_url, thumbnail, is_locked) VALUES
   ('YOUR_SERIES_ID', 1, 'Episode 1', 'https://www.youtube.com/embed/VIDEO_ID', 'https://via.placeholder.com/1920x1080', false),
   ('YOUR_SERIES_ID', 2, 'Episode 2', 'https://www.youtube.com/embed/VIDEO_ID', 'https://via.placeholder.com/1920x1080', false),
   ('YOUR_SERIES_ID', 5, 'Episode 5 (VIP)', 'https://www.youtube.com/embed/VIDEO_ID', 'https://via.placeholder.com/1920x1080', true);
   ```

## Step 5: Test VIP Features

To test VIP features:

```sql
UPDATE users SET is_vip = true, vip_expiry = NOW() + INTERVAL '30 days' WHERE email = 'test@example.com';
```

## Video URL Formats

You can use these video sources:

- **YouTube**: `https://www.youtube.com/embed/VIDEO_ID`
- **Vimeo**: `https://player.vimeo.com/video/VIDEO_ID`
- **Telegram**: `https://t.me/channel/video_id`
- **Direct Link**: Any direct video URL

## Optional: Adsterra Integration

1. Sign up at [adsterra.com](https://www.adsterra.com)
2. Create Native Banner and Social Bar ad units
3. Add IDs to `.env.local`:
   ```env
   NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_ID=your_banner_id
   NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ID=your_social_bar_id
   ```

## Troubleshooting

### "Invalid API credentials"
- Double-check your Supabase URL and Anon Key
- Make sure there are no extra spaces in `.env.local`

### "User not found" after signup
- The trigger should auto-create user profile
- If not, manually run:
  ```sql
  INSERT INTO users (id, email, user_role) VALUES ('USER_AUTH_ID', 'email@example.com', 'user');
  ```

### RLS Policy Errors
- Make sure all policies are created correctly
- Check if you're logged in (auth token present)

### Episodes not loading
- Verify series_id matches exactly
- Check if RLS policies allow read access

## Next Steps

1. ✅ Set up Supabase
2. ✅ Run database migrations
3. ✅ Create admin account
4. ✅ Add series and episodes
5. ✅ Test VIP features
6. 🎨 Customize branding
7. 💰 Integrate payment gateway
8. 🚀 Deploy to production

---

Need help? Check the main README.md for detailed documentation!
