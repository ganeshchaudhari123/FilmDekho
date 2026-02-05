# 🎬 FilmDekho - Premium Mini-Drama Streaming WebApp

A high-end, mobile-responsive streaming webapp inspired by DramaBox/ReelShort, built with Next.js 14, Tailwind CSS, Supabase, and Swiper.js.

## ✨ Features

### 🎨 UI/UX Design
- **Premium Dark Mode** with Black/Gold/Red accents
- **Home Screen** with Categories (Drama, Novel, Anime), Trending Sliders, and Poster Grids
- **Vertical Full-Screen Player** using Swiper.js for episode navigation
- **Bottom Navigation Bar** (Home, VIP, My List, Profile)
- **Mobile-Responsive** - Feels like a native APK

### 🔐 Authentication
- **Unified Login** for both Users and Admins
- **Role-Based Routing** - Admins → `/admin-dashboard`, Users → `/home`
- Powered by **Supabase Auth**

### 💎 VIP System
- **VIP Subscription Plans** with payment UI (Razorpay ready)
- **Episode Locking** - Episodes 5+ locked for non-VIP users
- **Premium Content Access**

### 👨‍💼 Admin Panel
- **Series Management** - Add/Edit series with thumbnails
- **Episode Management** - Upload episodes (YouTube/Telegram/Direct links)
- **User Management** - View user list
- **VIP Plan Management**

### 📺 Player Features
- **Vertical Swipe Navigation** between episodes
- **Thumbnail Preview** with Play button before loading
- **Episode Locking** for VIP content
- **Full-Screen Experience**

### 📢 Ads Integration
- **Adsterra Native Banners**
- **Social Bar Ads**
- Strategic placement between swipes and on home page

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Adsterra account (optional, for ads)

### Installation

1. **Clone and Install**
   ```bash
   cd FilmDekho
   npm install
   ```

2. **Set Up Environment Variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_ID=your_native_banner_id
   NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ID=your_social_bar_id
   ```

3. **Set Up Supabase Database**

   Run the following SQL in your Supabase SQL Editor:

   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Users table (extends auth.users)
   CREATE TABLE users (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     email TEXT NOT NULL,
     user_role TEXT NOT NULL DEFAULT 'user' CHECK (user_role IN ('user', 'admin')),
     is_vip BOOLEAN DEFAULT FALSE,
     vip_expiry TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Series table
   CREATE TABLE series (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT NOT NULL,
     description TEXT,
     thumbnail TEXT,
     category TEXT NOT NULL CHECK (category IN ('Drama', 'Novel', 'Anime')),
     is_trending BOOLEAN DEFAULT FALSE,
     is_premium BOOLEAN DEFAULT FALSE,
     dubbed BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Episodes table
   CREATE TABLE episodes (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     series_id UUID REFERENCES series(id) ON DELETE CASCADE,
     episode_number INTEGER NOT NULL,
     title TEXT NOT NULL,
     video_url TEXT NOT NULL,
     thumbnail TEXT,
     duration INTEGER DEFAULT 0,
     is_locked BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- VIP Plans table
   CREATE TABLE vip_plans (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     duration_days INTEGER NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     features TEXT[] DEFAULT '{}',
     is_popular BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX idx_series_category ON series(category);
   CREATE INDEX idx_series_trending ON series(is_trending);
   CREATE INDEX idx_episodes_series ON episodes(series_id);
   CREATE INDEX idx_episodes_number ON episodes(episode_number);

   -- Insert sample VIP plans
   INSERT INTO vip_plans (name, duration_days, price, features, is_popular) VALUES
   ('Weekly', 7, 99, ARRAY['Unlock all episodes', 'HD streaming', 'No ads'], false),
   ('Monthly', 30, 299, ARRAY['Unlock all episodes', 'HD streaming', 'No ads', 'Early access'], true),
   ('Yearly', 365, 2999, ARRAY['Unlock all episodes', '4K streaming', 'No ads', 'Early access', 'Offline downloads'], false);

   -- Insert sample admin user (change email/password as needed)
   -- Note: You'll need to sign up through the app first, then update the role
   -- After signing up, run this to make a user an admin:
   -- UPDATE users SET user_role = 'admin' WHERE email = 'admin@filmdekho.com';
   ```

4. **Create Demo Content (Optional)**

   ```sql
   -- Insert sample series
   INSERT INTO series (title, description, thumbnail, category, is_trending, dubbed) VALUES
   ('The Last Kingdom', 'Epic drama of kingdoms at war', 'https://via.placeholder.com/300x450', 'Drama', true, true),
   ('Mystic Novel', 'A journey through magical worlds', 'https://via.placeholder.com/300x450', 'Novel', true, false),
   ('Samurai Chronicles', 'Ancient warriors tale', 'https://via.placeholder.com/300x450', 'Anime', false, true);

   -- Insert sample episodes (replace series_id with actual ID from above)
   INSERT INTO episodes (series_id, episode_number, title, video_url, thumbnail, is_locked) VALUES
   ('YOUR_SERIES_ID_HERE', 1, 'The Beginning', 'https://www.youtube.com/embed/VIDEO_ID', 'https://via.placeholder.com/1920x1080', false),
   ('YOUR_SERIES_ID_HERE', 2, 'Rising Tension', 'https://www.youtube.com/embed/VIDEO_ID', 'https://via.placeholder.com/1920x1080', false),
   ('YOUR_SERIES_ID_HERE', 5, 'VIP Content', 'https://www.youtube.com/embed/VIDEO_ID', 'https://via.placeholder.com/1920x1080', true);
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Demo Credentials

- **Admin**: admin@filmdekho.com / admin123
- **User**: user@filmdekho.com / user123

*(Note: You need to create these accounts and set roles in Supabase)*

## 🗂️ Project Structure

```
FilmDekho/
├── app/
│   ├── page.tsx                 # Login page
│   ├── home/page.tsx            # Home screen
│   ├── player/[id]/page.tsx     # Video player
│   ├── vip/page.tsx             # VIP subscription
│   ├── my-list/page.tsx         # Saved series
│   ├── profile/page.tsx         # User profile
│   ├── admin-dashboard/page.tsx # Admin panel
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── AdsterraAd.tsx           # Ad component
│   ├── BottomNav.tsx            # Navigation bar
│   └── SeriesCard.tsx           # Series card
├── lib/
│   └── supabase.ts              # Supabase client
├── types/
│   └── database.ts              # TypeScript types
└── public/                      # Static assets
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom premium theme
- **Database & Auth**: Supabase
- **Video Player**: Swiper.js (Vertical Swipe)
- **Icons**: Lucide React
- **Ads**: Adsterra Integration
- **TypeScript**: Full type safety

## 🔧 Configuration

### Tailwind Theme
The app uses a premium dark theme with:
- **Primary Colors**: Black variations (#0A0A0A, #121212)
- **Accent Colors**: Gold (#FFD700) and Red (#E50914)
- **Custom Animations**: fade-in, slide-up, shimmer, pulse-glow

### Swiper Configuration
- Vertical direction for episode navigation
- Mousewheel and keyboard support
- Custom styling for premium feel

## 📝 To-Do / Future Enhancements

- [ ] Payment gateway integration (Razorpay)
- [ ] Search functionality
- [ ] Watch history tracking
- [ ] User reviews and ratings
- [ ] PWA support for installable app
- [ ] Push notifications
- [ ] Social sharing features
- [ ] Advanced analytics dashboard

## 🤝 Contributing

This is a custom project. For any issues or feature requests, please create an issue in the repository.

## 📄 License

This project is proprietary and confidential.

## 🙏 Credits

Built with ❤️ using modern web technologies.

---

**FilmDekho** - Your Premium Mini-Drama Destination 🎬✨
