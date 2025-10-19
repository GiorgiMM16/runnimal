import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Search, UserPlus, Check } from 'lucide-react-native';
import type { Profile } from '@/types/database';

interface UserWithFriendship extends Profile {
  friendship_status?: 'none' | 'pending' | 'accepted';
}

export default function AddFriendsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserWithFriendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const dummyUsers: UserWithFriendship[] = [
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
        friendship_status: 'none',
      },
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
        friendship_status: 'none',
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
        friendship_status: 'none',
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
        friendship_status: 'none',
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
        friendship_status: 'none',
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
        friendship_status: 'none',
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
        friendship_status: 'none',
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
        friendship_status: 'none',
      },
    ];

    setUsers(dummyUsers);
    setLoading(false);
  };

  const handleSendRequest = async (friendId: string) => {
    setRequesting(friendId);

    setTimeout(() => {
      setRequesting(null);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === friendId ? { ...u, friendship_status: 'pending' } : u
        )
      );
      Alert.alert('Success', 'Friend request sent!');
    }, 500);
  };

  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Friends</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Suggested Friends</Text>
        {filteredUsers.map((suggestedUser) => (
          <View key={suggestedUser.id} style={styles.userCard}>
            {suggestedUser.avatar_url ? (
              <Image
                source={{ uri: suggestedUser.avatar_url }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {suggestedUser.full_name.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{suggestedUser.full_name}</Text>
              <Text style={styles.userStats}>
                {suggestedUser.total_distance?.toFixed(0) || 0} km •{' '}
                {suggestedUser.current_streak || 0} day streak
              </Text>
            </View>
            {suggestedUser.friendship_status === 'none' && (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  requesting === suggestedUser.id && styles.addButtonDisabled,
                ]}
                onPress={() => handleSendRequest(suggestedUser.id)}
                disabled={requesting === suggestedUser.id}
              >
                <UserPlus size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {suggestedUser.friendship_status === 'pending' && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            )}
            {suggestedUser.friendship_status === 'accepted' && (
              <View style={styles.friendBadge}>
                <Check size={18} color="#4ADE80" />
              </View>
            )}
          </View>
        ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D2D44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 12,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 13,
    color: '#999',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  pendingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFC107',
  },
  friendBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
