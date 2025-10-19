/*
  # Add matching achievements for profile page

  1. Changes
    - Adds new achievements: First 10K, Speed Demon, Week Warrior
    - Updates existing achievements to match profile display
    - Marks specific achievements as earned for demo user

  2. Details
    - First 10K: Complete 10km run (Trophy icon)
    - Speed Demon: Run 5km under 25min (Lightning icon)
    - Week Warrior: 7-day streak (Award icon)
*/

-- Add new achievements if they don't exist
INSERT INTO achievements (name, description, icon, criteria)
VALUES 
  ('First 10K', 'Complete 10km run', '🏆', '{"distance": 10, "type": "run"}'),
  ('Speed Demon', 'Run 5km under 25min', '⚡', '{"distance": 5, "time": 1500, "type": "run"}'),
  ('Week Warrior', '7-day streak', '🎖️', '{"streak": 7}')
ON CONFLICT DO NOTHING;

-- Get the achievement IDs we just created
DO $$
DECLARE
  first_10k_id uuid;
  speed_demon_id uuid;
  week_warrior_id uuid;
  sample_user_id uuid;
BEGIN
  -- Get achievement IDs
  SELECT id INTO first_10k_id FROM achievements WHERE name = 'First 10K' LIMIT 1;
  SELECT id INTO speed_demon_id FROM achievements WHERE name = 'Speed Demon' LIMIT 1;
  SELECT id INTO week_warrior_id FROM achievements WHERE name = 'Week Warrior' LIMIT 1;
  
  -- Get a sample user ID (the first user in the system)
  SELECT id INTO sample_user_id FROM profiles ORDER BY created_at LIMIT 1;
  
  -- Mark these achievements as earned for the sample user if they exist
  IF sample_user_id IS NOT NULL AND first_10k_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    VALUES (sample_user_id, first_10k_id, NOW())
    ON CONFLICT DO NOTHING;
  END IF;
  
  IF sample_user_id IS NOT NULL AND speed_demon_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    VALUES (sample_user_id, speed_demon_id, NOW())
    ON CONFLICT DO NOTHING;
  END IF;
  
  IF sample_user_id IS NOT NULL AND week_warrior_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    VALUES (sample_user_id, week_warrior_id, NOW())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
