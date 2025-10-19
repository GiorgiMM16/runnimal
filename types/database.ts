export type FitnessGoal = 'get_fitter' | 'lose_weight' | 'train_for_race' | 'stay_active';
export type RunimalType = 'earthy' | 'fiery' | 'watery';
export type RunimalMood = 'energetic' | 'active' | 'tired' | 'sleepy';
export type ActivityType = 'run' | 'walk' | 'cycle' | 'hike' | 'treadmill' | 'pool_swim';
export type ChallengeType = 'daily' | 'weekly' | 'special' | 'ai_dynamic';
export type ShopItemCategory = 'outfit' | 'accessory' | 'special';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  weight: number;
  height: number;
  age: number;
  fitness_goal: FitnessGoal;
  emergency_service: string;
  emergency_contacts: EmergencyContact[];
  coins: number;
  total_distance: number;
  total_workouts: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Runimal {
  id: string;
  name: string;
  type: RunimalType;
  level: number;
  description: string;
  base_stats: Record<string, any>;
  created_at: string;
}

export interface UserRunimal {
  id: string;
  user_id: string;
  runimal_id: string;
  nickname: string;
  level: number;
  xp: number;
  is_active: boolean;
  mood: RunimalMood;
  customization: {
    outfit?: string;
    accessories?: string[];
  };
  collected_at: string;
  last_interaction: string;
}

export interface Activity {
  id: string;
  user_id: string;
  runimal_id: string;
  activity_type: ActivityType;
  duration: number;
  distance: number;
  pace: number;
  elevation_gain: number;
  calories: number;
  heart_rate_avg: number;
  heart_rate_zones: Record<string, number>;
  route_data: {
    coordinates: [number, number][];
  };
  indoor: boolean;
  xp_earned: number;
  coins_earned: number;
  completed_at: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  requirements: Record<string, any>;
  rewards: {
    coins?: number;
    xp?: number;
    items?: string[];
  };
  active_from: string;
  active_until: string;
  is_active: boolean;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: Record<string, any>;
  completed: boolean;
  completed_at: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, any>;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopItemCategory;
  price: number;
  image_url: string;
  stats_boost: Record<string, any>;
  created_at: string;
}

export interface UserInventory {
  id: string;
  user_id: string;
  item_id: string;
  purchased_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
}
