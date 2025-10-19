/*
  # Runimal Adventure - Complete Database Schema

  ## Overview
  This migration creates the complete database schema for the Runimal Adventure fitness gamification app.

  ## 1. New Tables

  ### `profiles`
  User profile information and settings
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `weight` (numeric, kg)
  - `height` (numeric, cm)
  - `age` (integer)
  - `fitness_goal` (text: get_fitter, lose_weight, train_for_race, stay_active)
  - `emergency_service` (text, default '112')
  - `emergency_contacts` (jsonb, array of contact objects)
  - `coins` (integer, default 500)
  - `total_distance` (numeric, default 0, in km)
  - `total_workouts` (integer, default 0)
  - `current_streak` (integer, default 0)
  - `longest_streak` (integer, default 0)
  - `last_activity_date` (date)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `runimals`
  Base Runimal types and evolution data
  - `id` (uuid, primary key)
  - `name` (text)
  - `type` (text: earthy, fiery, watery)
  - `level` (integer)
  - `description` (text)
  - `base_stats` (jsonb)
  - `created_at` (timestamptz)

  ### `user_runimals`
  User's collected Runimals
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `runimal_id` (uuid, references runimals)
  - `nickname` (text)
  - `level` (integer, default 1)
  - `xp` (integer, default 0)
  - `is_active` (boolean, default false)
  - `mood` (text: energetic, active, tired, sleepy)
  - `customization` (jsonb: outfit, accessories)
  - `collected_at` (timestamptz)
  - `last_interaction` (timestamptz)

  ### `activities`
  Workout activity records
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `runimal_id` (uuid, references user_runimals)
  - `activity_type` (text: run, walk, cycle, hike, treadmill, pool_swim)
  - `duration` (integer, seconds)
  - `distance` (numeric, km)
  - `pace` (numeric, min/km)
  - `elevation_gain` (numeric, meters)
  - `calories` (integer)
  - `heart_rate_avg` (integer)
  - `heart_rate_zones` (jsonb)
  - `route_data` (jsonb: GPS coordinates)
  - `indoor` (boolean, default false)
  - `xp_earned` (integer, default 0)
  - `coins_earned` (integer, default 0)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `challenges`
  Challenge definitions
  - `id` (uuid, primary key)
  - `type` (text: daily, weekly, special, ai_dynamic)
  - `title` (text)
  - `description` (text)
  - `requirements` (jsonb)
  - `rewards` (jsonb: coins, xp, items)
  - `active_from` (timestamptz)
  - `active_until` (timestamptz)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)

  ### `user_challenges`
  User's challenge progress
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `challenge_id` (uuid, references challenges)
  - `progress` (jsonb)
  - `completed` (boolean, default false)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `achievements`
  Achievement/badge definitions
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `icon` (text)
  - `criteria` (jsonb)
  - `created_at` (timestamptz)

  ### `user_achievements`
  User's earned achievements
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `achievement_id` (uuid, references achievements)
  - `earned_at` (timestamptz)

  ### `shop_items`
  Shop inventory
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `category` (text: outfit, accessory, special)
  - `price` (integer, coins)
  - `image_url` (text)
  - `stats_boost` (jsonb)
  - `created_at` (timestamptz)

  ### `user_inventory`
  User's purchased items
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `item_id` (uuid, references shop_items)
  - `purchased_at` (timestamptz)

  ### `friendships`
  Friend connections
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `friend_id` (uuid, references profiles)
  - `status` (text: pending, accepted)
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Public read access for runimal base types, challenges, achievements, and shop items
  - Friend data visible only to connected users

  ## 3. Important Notes
  - Emergency contacts stored as JSONB array: [{name: string, phone: string, relationship: string}]
  - Route data stored as JSONB with GPS coordinates
  - Heart rate zones stored as JSONB with time in each zone
  - Customization and stats stored as flexible JSONB objects
  - Streak calculations handled by application logic based on last_activity_date
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  weight numeric,
  height numeric,
  age integer,
  fitness_goal text CHECK (fitness_goal IN ('get_fitter', 'lose_weight', 'train_for_race', 'stay_active')),
  emergency_service text DEFAULT '112',
  emergency_contacts jsonb DEFAULT '[]'::jsonb,
  coins integer DEFAULT 500,
  total_distance numeric DEFAULT 0,
  total_workouts integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Runimals base types
CREATE TABLE IF NOT EXISTS runimals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('earthy', 'fiery', 'watery')),
  level integer NOT NULL,
  description text,
  base_stats jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- User's collected runimals
CREATE TABLE IF NOT EXISTS user_runimals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  runimal_id uuid NOT NULL REFERENCES runimals(id),
  nickname text,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  is_active boolean DEFAULT false,
  mood text DEFAULT 'energetic' CHECK (mood IN ('energetic', 'active', 'tired', 'sleepy')),
  customization jsonb DEFAULT '{}'::jsonb,
  collected_at timestamptz DEFAULT now(),
  last_interaction timestamptz DEFAULT now()
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  runimal_id uuid REFERENCES user_runimals(id),
  activity_type text NOT NULL CHECK (activity_type IN ('run', 'walk', 'cycle', 'hike', 'treadmill', 'pool_swim')),
  duration integer NOT NULL,
  distance numeric DEFAULT 0,
  pace numeric,
  elevation_gain numeric DEFAULT 0,
  calories integer DEFAULT 0,
  heart_rate_avg integer,
  heart_rate_zones jsonb DEFAULT '{}'::jsonb,
  route_data jsonb DEFAULT '{}'::jsonb,
  indoor boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  coins_earned integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('daily', 'weekly', 'special', 'ai_dynamic')),
  title text NOT NULL,
  description text,
  requirements jsonb DEFAULT '{}'::jsonb,
  rewards jsonb DEFAULT '{}'::jsonb,
  active_from timestamptz DEFAULT now(),
  active_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User challenge progress
CREATE TABLE IF NOT EXISTS user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress jsonb DEFAULT '{}'::jsonb,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  criteria jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Shop items
CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('outfit', 'accessory', 'special')),
  price integer NOT NULL,
  image_url text,
  stats_boost jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- User inventory
CREATE TABLE IF NOT EXISTS user_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES shop_items(id),
  purchased_at timestamptz DEFAULT now()
);

-- Friendships
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE runimals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_runimals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Runimals policies (public read for base types)
CREATE POLICY "Anyone can view runimal types"
  ON runimals FOR SELECT
  TO authenticated
  USING (true);

-- User runimals policies
CREATE POLICY "Users can view own runimals"
  ON user_runimals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own runimals"
  ON user_runimals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own runimals"
  ON user_runimals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view friend activities"
  ON activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE friendships.status = 'accepted'
      AND ((friendships.user_id = auth.uid() AND friendships.friend_id = activities.user_id)
        OR (friendships.friend_id = auth.uid() AND friendships.user_id = activities.user_id))
    )
  );

-- Challenges policies (public read)
CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User challenges policies
CREATE POLICY "Users can view own challenge progress"
  ON user_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge progress"
  ON user_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON user_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Shop items policies (public read)
CREATE POLICY "Anyone can view shop items"
  ON shop_items FOR SELECT
  TO authenticated
  USING (true);

-- User inventory policies
CREATE POLICY "Users can view own inventory"
  ON user_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON user_inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Friendships policies
CREATE POLICY "Users can view own friendships"
  ON friendships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships"
  ON friendships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friendships they're part of"
  ON friendships FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete own friendships"
  ON friendships FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_completed_at ON activities(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_runimals_user_id ON user_runimals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_runimals_is_active ON user_runimals(is_active);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);