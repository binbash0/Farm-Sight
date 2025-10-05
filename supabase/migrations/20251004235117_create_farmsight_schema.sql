/*
  # FarmSight Game Database Schema

  ## Overview
  Complete database schema for FarmSight educational farming simulation game.
  
  ## New Tables
  
  ### 1. `profiles`
  User profile and game progress tracking
  - `id` (uuid, FK to auth.users)
  - `username` (text, unique)
  - `total_score` (integer) - Overall sustainability score
  - `level` (integer) - Player level
  - `money` (numeric) - In-game currency
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `farms`
  Player's farm instances
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `name` (text)
  - `location_lat` (numeric) - Farm latitude for NASA data
  - `location_lng` (numeric) - Farm longitude for NASA data
  - `water_level` (numeric) - Available irrigation water
  - `fertilizer_stock` (numeric) - Available fertilizer units
  - `soil_health` (numeric) - Soil quality score (0-100)
  - `created_at` (timestamptz)

  ### 3. `plots`
  Individual farm plots for planting
  - `id` (uuid, PK)
  - `farm_id` (uuid, FK to farms)
  - `plot_number` (integer)
  - `position_x` (numeric) - Grid position
  - `position_y` (numeric) - Grid position
  - `soil_moisture` (numeric) - Current soil moisture %
  - `crop_id` (uuid, nullable, FK to crops)
  - `planted_at` (timestamptz, nullable)
  - `growth_stage` (integer) - 0-4 (seed, sprout, growing, mature, harvestable)
  - `health` (numeric) - Crop health 0-100
  - `is_irrigated` (boolean)
  - `is_fertilized` (boolean)
  - `last_watered` (timestamptz, nullable)
  - `created_at` (timestamptz)

  ### 4. `crops`
  Crop type definitions
  - `id` (uuid, PK)
  - `name` (text)
  - `growth_time_days` (integer) - Days to mature
  - `water_need` (numeric) - Water requirement
  - `optimal_temp_min` (numeric) - Min optimal temperature
  - `optimal_temp_max` (numeric) - Max optimal temperature
  - `base_yield` (numeric) - Base yield per harvest
  - `price_per_unit` (numeric) - Selling price
  - `sustainability_score` (integer) - Base sustainability points
  - `icon` (text) - Emoji or icon identifier

  ### 5. `livestock`
  Livestock on the farm
  - `id` (uuid, PK)
  - `farm_id` (uuid, FK to farms)
  - `type` (text) - cow, chicken, sheep
  - `name` (text)
  - `health` (numeric) - 0-100
  - `happiness` (numeric) - 0-100
  - `last_fed` (timestamptz)
  - `production_ready` (boolean) - Ready to produce milk/eggs
  - `created_at` (timestamptz)

  ### 6. `game_events`
  Track player actions and events
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `farm_id` (uuid, FK to farms)
  - `event_type` (text) - planted, irrigated, fertilized, harvested, etc.
  - `details` (jsonb) - Event-specific data
  - `score_impact` (integer) - Sustainability score change
  - `created_at` (timestamptz)

  ### 7. `environmental_data`
  Cached NASA/environmental data snapshots
  - `id` (uuid, PK)
  - `farm_id` (uuid, FK to farms)
  - `date` (date)
  - `temperature` (numeric)
  - `rainfall` (numeric)
  - `soil_moisture_index` (numeric)
  - `vegetation_index` (numeric)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Crop definitions are readable by all authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  total_score integer DEFAULT 0,
  level integer DEFAULT 1,
  money numeric DEFAULT 1000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  location_lat numeric DEFAULT 37.7749,
  location_lng numeric DEFAULT -122.4194,
  water_level numeric DEFAULT 100,
  fertilizer_stock numeric DEFAULT 50,
  soil_health numeric DEFAULT 75,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farms"
  ON farms FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own farms"
  ON farms FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own farms"
  ON farms FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own farms"
  ON farms FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create crops table (reference data)
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  growth_time_days integer NOT NULL,
  water_need numeric NOT NULL,
  optimal_temp_min numeric NOT NULL,
  optimal_temp_max numeric NOT NULL,
  base_yield numeric NOT NULL,
  price_per_unit numeric NOT NULL,
  sustainability_score integer DEFAULT 10,
  icon text NOT NULL
);

ALTER TABLE crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view crops"
  ON crops FOR SELECT
  TO authenticated
  USING (true);

-- Create plots table
CREATE TABLE IF NOT EXISTS plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  plot_number integer NOT NULL,
  position_x numeric NOT NULL,
  position_y numeric NOT NULL,
  soil_moisture numeric DEFAULT 50,
  crop_id uuid REFERENCES crops(id) ON DELETE SET NULL,
  planted_at timestamptz,
  growth_stage integer DEFAULT 0,
  health numeric DEFAULT 100,
  is_irrigated boolean DEFAULT false,
  is_fertilized boolean DEFAULT false,
  last_watered timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(farm_id, plot_number)
);

ALTER TABLE plots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farm plots"
  ON plots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = plots.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert plots on own farms"
  ON plots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = plots.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own farm plots"
  ON plots FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = plots.farm_id
      AND farms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = plots.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own farm plots"
  ON plots FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = plots.farm_id
      AND farms.user_id = auth.uid()
    )
  );

-- Create livestock table
CREATE TABLE IF NOT EXISTS livestock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  type text NOT NULL,
  name text NOT NULL,
  health numeric DEFAULT 100,
  happiness numeric DEFAULT 100,
  last_fed timestamptz DEFAULT now(),
  production_ready boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE livestock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farm livestock"
  ON livestock FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = livestock.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert livestock on own farms"
  ON livestock FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = livestock.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own farm livestock"
  ON livestock FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = livestock.farm_id
      AND farms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = livestock.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own farm livestock"
  ON livestock FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = livestock.farm_id
      AND farms.user_id = auth.uid()
    )
  );

-- Create game_events table
CREATE TABLE IF NOT EXISTS game_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  score_impact integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game events"
  ON game_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own game events"
  ON game_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create environmental_data table
CREATE TABLE IF NOT EXISTS environmental_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  date date NOT NULL,
  temperature numeric,
  rainfall numeric,
  soil_moisture_index numeric,
  vegetation_index numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(farm_id, date)
);

ALTER TABLE environmental_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farm environmental data"
  ON environmental_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = environmental_data.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert environmental data for own farms"
  ON environmental_data FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM farms
      WHERE farms.id = environmental_data.farm_id
      AND farms.user_id = auth.uid()
    )
  );

-- Insert sample crop data
INSERT INTO crops (name, growth_time_days, water_need, optimal_temp_min, optimal_temp_max, base_yield, price_per_unit, sustainability_score, icon) VALUES
  ('Corn', 90, 500, 15, 30, 8, 3.5, 15, '🌽'),
  ('Wheat', 120, 400, 10, 25, 10, 4, 20, '🌾'),
  ('Tomatoes', 75, 600, 18, 28, 12, 5, 12, '🍅'),
  ('Lettuce', 45, 300, 10, 20, 6, 6, 25, '🥬'),
  ('Soybeans', 100, 450, 15, 28, 9, 4.5, 30, '🫘'),
  ('Carrots', 70, 350, 12, 24, 7, 5.5, 18, '🥕')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_plots_farm_id ON plots(farm_id);
CREATE INDEX IF NOT EXISTS idx_livestock_farm_id ON livestock(farm_id);
CREATE INDEX IF NOT EXISTS idx_game_events_user_id ON game_events(user_id);
CREATE INDEX IF NOT EXISTS idx_game_events_farm_id ON game_events(farm_id);
CREATE INDEX IF NOT EXISTS idx_environmental_data_farm_id ON environmental_data(farm_id);
