-- FilmDekho Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'user' CHECK (user_role IN ('user', 'admin')),
  is_vip BOOLEAN DEFAULT FALSE,
  vip_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Series table
CREATE TABLE IF NOT EXISTS series (
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
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(series_id, episode_number)
);

-- VIP Plans table
CREATE TABLE IF NOT EXISTS vip_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_series_category ON series(category);
CREATE INDEX IF NOT EXISTS idx_series_trending ON series(is_trending);
CREATE INDEX IF NOT EXISTS idx_episodes_series ON episodes(series_id);
CREATE INDEX IF NOT EXISTS idx_episodes_number ON episodes(episode_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(user_role);
CREATE INDEX IF NOT EXISTS idx_users_vip ON users(is_vip);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_plans ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Series policies (public read, admin write)
CREATE POLICY "Anyone can view series"
  ON series FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert series"
  ON series FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

CREATE POLICY "Admins can update series"
  ON series FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

CREATE POLICY "Admins can delete series"
  ON series FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

-- Episodes policies (similar to series)
CREATE POLICY "Anyone can view episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert episodes"
  ON episodes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

CREATE POLICY "Admins can update episodes"
  ON episodes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

CREATE POLICY "Admins can delete episodes"
  ON episodes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

-- VIP Plans policies
CREATE POLICY "Anyone can view VIP plans"
  ON vip_plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage VIP plans"
  ON vip_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Automatic user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, user_role, is_vip)
  VALUES (NEW.id, NEW.email, 'user', false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert VIP Plans
INSERT INTO vip_plans (name, duration_days, price, features, is_popular) VALUES
('Weekly VIP', 7, 99.00, ARRAY['Unlock all episodes', 'HD streaming', 'No ads', 'Support creators'], false),
('Monthly VIP', 30, 299.00, ARRAY['Unlock all episodes', 'HD streaming', 'No ads', 'Early access to new series', 'Priority support'], true),
('Yearly VIP', 365, 2999.00, ARRAY['Unlock all episodes', '4K streaming', 'No ads', 'Early access', 'Offline downloads', 'Exclusive content', 'VIP badge'], false)
ON CONFLICT DO NOTHING;

-- Sample Series
INSERT INTO series (title, description, thumbnail, category, is_trending, is_premium, dubbed) VALUES
('The Phoenix Rising', 'A tale of revenge and redemption in ancient China', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', 'Drama', true, true, true),
('Mystic Academy', 'Students discover magical powers in a hidden realm', 'https://images.unsplash.com/photo-1518893063132-36e46dbe2428?w=400', 'Novel', true, false, false),
('Shadow Warrior', 'A lone samurai fights against dark forces', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400', 'Anime', false, true, true),
('Love in Seoul', 'Modern romance in the heart of South Korea', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', 'Drama', true, false, true),
('Cultivation Chronicles', 'Journey to immortality through martial arts', 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400', 'Novel', false, true, false)
ON CONFLICT DO NOTHING;

-- Sample Episodes (You'll need to get actual series IDs first)
-- Run this after creating series:
-- INSERT INTO episodes (series_id, episode_number, title, video_url, thumbnail, is_locked) VALUES
-- ('SERIES_ID_HERE', 1, 'Pilot Episode', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800', false),
-- ('SERIES_ID_HERE', 2, 'The Awakening', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', false),
-- ('SERIES_ID_HERE', 5, 'Secrets Revealed', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', true);

-- =====================================================
-- ADMIN USER SETUP
-- =====================================================

-- After you sign up through the app, run this query to make yourself an admin:
-- UPDATE users SET user_role = 'admin' WHERE email = 'your-email@example.com';

-- To make a user VIP:
-- UPDATE users SET is_vip = true, vip_expiry = NOW() + INTERVAL '30 days' WHERE email = 'user@example.com';
