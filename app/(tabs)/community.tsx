import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Users, TrendingUp, UserPlus, Trophy } from 'lucide-react-native';
import type { Profile } from '@/types/database';

interface FriendWithProfile extends Profile {
  friendship_id: string;
}

export default function Community() {
  const router = useRouter();
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const dummyLeaderboard: Profile[] = [
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'mike@example.com',
        full_name: 'Mike Chen',
        avatar_url: 'https://i.pravatar.cc/150?img=12',
        weight: 78,
        height: 182,
        age: 32,
        fitness_goal: 'train_for_race',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 1200,
        total_distance: 287.3,
        total_workouts: 68,
        current_streak: 15,
        longest_streak: 22,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        email: 'david@example.com',
        full_name: 'David Kim',
        avatar_url: 'https://i.pravatar.cc/150?img=33',
        weight: 72,
        height: 175,
        age: 31,
        fitness_goal: 'train_for_race',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 1050,
        total_distance: 221.6,
        total_workouts: 59,
        current_streak: 13,
        longest_streak: 19,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'alex@example.com',
        full_name: 'Alex Rodriguez',
        avatar_url: 'https://i.pravatar.cc/150?img=15',
        weight: 85,
        height: 178,
        age: 35,
        fitness_goal: 'stay_active',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 920,
        total_distance: 176.8,
        total_workouts: 51,
        current_streak: 9,
        longest_streak: 16,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        email: 'james@example.com',
        full_name: 'James Anderson',
        avatar_url: 'https://i.pravatar.cc/150?img=51',
        weight: 82,
        height: 185,
        age: 34,
        fitness_goal: 'stay_active',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 880,
        total_distance: 164.9,
        total_workouts: 47,
        current_streak: 10,
        longest_streak: 17,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'sarah@example.com',
        full_name: 'Sarah Johnson',
        avatar_url: 'https://i.pravatar.cc/150?img=44',
        weight: 62,
        height: 168,
        age: 28,
        fitness_goal: 'get_fitter',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 850,
        total_distance: 145.5,
        total_workouts: 42,
        current_streak: 12,
        longest_streak: 18,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'lisa@example.com',
        full_name: 'Lisa Park',
        avatar_url: 'https://i.pravatar.cc/150?img=20',
        weight: 64,
        height: 170,
        age: 29,
        fitness_goal: 'get_fitter',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 780,
        total_distance: 132.4,
        total_workouts: 39,
        current_streak: 11,
        longest_streak: 20,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'emma@example.com',
        full_name: 'Emma Wilson',
        avatar_url: 'https://i.pravatar.cc/150?img=31',
        weight: 58,
        height: 165,
        age: 26,
        fitness_goal: 'lose_weight',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 650,
        total_distance: 98.2,
        total_workouts: 28,
        current_streak: 7,
        longest_streak: 14,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        email: 'sophie@example.com',
        full_name: 'Sophie Martinez',
        avatar_url: 'https://i.pravatar.cc/150?img=27',
        weight: 60,
        height: 163,
        age: 27,
        fitness_goal: 'lose_weight',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 590,
        total_distance: 87.5,
        total_workouts: 25,
        current_streak: 6,
        longest_streak: 12,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
      },
    ];

    const dummyFriends: FriendWithProfile[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'sarah@example.com',
        full_name: 'Sarah Johnson',
        avatar_url: 'https://i.pravatar.cc/150?img=44',
        weight: 62,
        height: 168,
        age: 28,
        fitness_goal: 'get_fitter',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 850,
        total_distance: 145.5,
        total_workouts: 42,
        current_streak: 12,
        longest_streak: 18,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
        friendship_id: 'f1',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'emma@example.com',
        full_name: 'Emma Wilson',
        avatar_url: 'https://i.pravatar.cc/150?img=31',
        weight: 58,
        height: 165,
        age: 26,
        fitness_goal: 'lose_weight',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 650,
        total_distance: 98.2,
        total_workouts: 28,
        current_streak: 7,
        longest_streak: 14,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
        friendship_id: 'f2',
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'lisa@example.com',
        full_name: 'Lisa Park',
        avatar_url: 'https://i.pravatar.cc/150?img=20',
        weight: 64,
        height: 170,
        age: 29,
        fitness_goal: 'get_fitter',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 780,
        total_distance: 132.4,
        total_workouts: 39,
        current_streak: 11,
        longest_streak: 20,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
        friendship_id: 'f3',
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        email: 'david@example.com',
        full_name: 'David Kim',
        avatar_url: 'https://i.pravatar.cc/150?img=33',
        weight: 72,
        height: 175,
        age: 31,
        fitness_goal: 'train_for_race',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 1050,
        total_distance: 221.6,
        total_workouts: 59,
        current_streak: 13,
        longest_streak: 19,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
        friendship_id: 'f4',
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        email: 'james@example.com',
        full_name: 'James Anderson',
        avatar_url: 'https://i.pravatar.cc/150?img=51',
        weight: 82,
        height: 185,
        age: 34,
        fitness_goal: 'stay_active',
        emergency_service: '112',
        emergency_contacts: [],
        coins: 880,
        total_distance: 164.9,
        total_workouts: 47,
        current_streak: 10,
        longest_streak: 17,
        last_activity_date: '',
        created_at: '',
        updated_at: '',
        friendship_id: 'f5',
      },
    ];

    setFriends(dummyFriends);
    setLeaderboard(dummyLeaderboard);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Community</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Runimal Teams</Text>
          <View style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>Fire Runimals</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1st Place</Text>
              </View>
            </View>
            <View style={styles.teamStats}>
              <View style={styles.teamStat}>
                <Text style={styles.teamStatValue}>50,000</Text>
                <Text style={styles.teamStatLabel}>km this week</Text>
              </View>
              <View style={styles.teamStatDivider} />
              <View style={styles.teamStat}>
                <Text style={styles.teamStatValue}>1,234</Text>
                <Text style={styles.teamStatLabel}>members</Text>
              </View>
            </View>
          </View>

          <View style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>Water Runimals</Text>
              <View style={[styles.badge, styles.badgeSecond]}>
                <Text style={styles.badgeText}>2nd Place</Text>
              </View>
            </View>
            <View style={styles.teamStats}>
              <View style={styles.teamStat}>
                <Text style={styles.teamStatValue}>48,000</Text>
                <Text style={styles.teamStatLabel}>km this week</Text>
              </View>
              <View style={styles.teamStatDivider} />
              <View style={styles.teamStat}>
                <Text style={styles.teamStatValue}>1,156</Text>
                <Text style={styles.teamStatLabel}>members</Text>
              </View>
            </View>
          </View>

          <View style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>Earth Runimals</Text>
              <View style={[styles.badge, styles.badgeThird]}>
                <Text style={styles.badgeText}>3rd Place</Text>
              </View>
            </View>
            <View style={styles.teamStats}>
              <View style={styles.teamStat}>
                <Text style={styles.teamStatValue}>45,500</Text>
                <Text style={styles.teamStatLabel}>km this week</Text>
              </View>
              <View style={styles.teamStatDivider} />
              <View style={styles.teamStat}>
                <Text style={styles.teamStatValue}>1,089</Text>
                <Text style={styles.teamStatLabel}>members</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <TouchableOpacity
            style={styles.addFriendButton}
            onPress={() => router.push('/community/add-friends')}
          >
            <UserPlus size={20} color="#FF6B35" />
            <Text style={styles.addFriendText}>Add Friends</Text>
          </TouchableOpacity>

          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="#666" />
              <Text style={styles.emptyStateText}>No friends yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add friends to see their activities and compete together
              </Text>
            </View>
          ) : (
            friends.map((friend) => (
              <View key={friend.friendship_id} style={styles.friendCard}>
                {friend.avatar_url ? (
                  <Image
                    source={{ uri: friend.avatar_url }}
                    style={styles.friendAvatarImage}
                  />
                ) : (
                  <View style={styles.friendAvatar}>
                    <Text style={styles.friendAvatarText}>
                      {friend.full_name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.full_name}</Text>
                  <Text style={styles.friendStats}>
                    {friend.total_distance?.toFixed(0) || 0} km •{' '}
                    {friend.current_streak || 0} day streak
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          {leaderboard.map((profile, index) => (
            <View
              key={profile.id}
              style={[
                styles.leaderboardItem,
                index < 3 && styles.leaderboardItemTop,
              ]}
            >
              <View style={styles.leaderboardRank}>
                {index < 3 ? (
                  <Trophy
                    size={20}
                    color={
                      index === 0
                        ? '#FFD700'
                        : index === 1
                        ? '#C0C0C0'
                        : '#CD7F32'
                    }
                  />
                ) : (
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                )}
              </View>
              {profile.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.leaderboardAvatarImage}
                />
              ) : (
                <View style={styles.leaderboardAvatar}>
                  <Text style={styles.leaderboardAvatarText}>
                    {profile.full_name.charAt(0)}
                  </Text>
                </View>
              )}
              <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardName}>{profile.full_name}</Text>
                <Text style={styles.leaderboardDistance}>
                  {profile.total_distance?.toFixed(1) || 0} km
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  teamCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeSecond: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
  },
  badgeThird: {
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  teamStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamStat: {
    flex: 1,
    alignItems: 'center',
  },
  teamStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  teamStatLabel: {
    fontSize: 12,
    color: '#999',
  },
  teamStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#3D3D54',
  },
  addFriendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  addFriendText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  emptyState: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  friendAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  friendStats: {
    fontSize: 13,
    color: '#999',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  leaderboardItemTop: {
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leaderboardAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  leaderboardAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  leaderboardDistance: {
    fontSize: 13,
    color: '#999',
  },
});
