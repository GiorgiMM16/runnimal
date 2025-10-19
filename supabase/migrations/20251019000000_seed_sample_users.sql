/*
  # Seed Sample Users for Friends Feature

  ## Overview
  This migration adds 8 sample user profiles for testing the friends feature.

  ## Sample Users
  - Sarah Johnson
  - Mike Chen
  - Emma Wilson
  - Alex Rodriguez
  - Lisa Park
  - David Kim
  - Sophie Martinez
  - James Anderson

  Each user has realistic stats for distance, workouts, and streaks.
*/

INSERT INTO profiles (id, email, full_name, weight, height, age, fitness_goal, coins, total_distance, total_workouts, current_streak, longest_streak) VALUES
('11111111-1111-1111-1111-111111111111', 'sarah@example.com', 'Sarah Johnson', 62, 168, 28, 'get_fitter', 850, 145.5, 42, 12, 18),
('22222222-2222-2222-2222-222222222222', 'mike@example.com', 'Mike Chen', 78, 182, 32, 'train_for_race', 1200, 287.3, 68, 15, 22),
('33333333-3333-3333-3333-333333333333', 'emma@example.com', 'Emma Wilson', 58, 165, 26, 'lose_weight', 650, 98.2, 28, 7, 14),
('44444444-4444-4444-4444-444444444444', 'alex@example.com', 'Alex Rodriguez', 85, 178, 35, 'stay_active', 920, 176.8, 51, 9, 16),
('55555555-5555-5555-5555-555555555555', 'lisa@example.com', 'Lisa Park', 64, 170, 29, 'get_fitter', 780, 132.4, 39, 11, 20),
('66666666-6666-6666-6666-666666666666', 'david@example.com', 'David Kim', 72, 175, 31, 'train_for_race', 1050, 221.6, 59, 13, 19),
('77777777-7777-7777-7777-777777777777', 'sophie@example.com', 'Sophie Martinez', 60, 163, 27, 'lose_weight', 590, 87.5, 25, 6, 12),
('88888888-8888-8888-8888-888888888888', 'james@example.com', 'James Anderson', 82, 185, 34, 'stay_active', 880, 164.9, 47, 10, 17)
ON CONFLICT (id) DO NOTHING;
