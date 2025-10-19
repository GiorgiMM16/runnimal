import { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import {
  User,
  Award,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Trophy,
  Coins,
  Zap,
  Shield,
  Heart,
  Lock,
} from 'lucide-react-native';
import type { Profile } from '@/types/database';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .maybeSingle();

    if (data) setProfile(data);
    setLoading(false);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

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
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://i.pinimg.com/736x/6c/79/57/6c79575778c34fa8c0e7cbe9b8c01712.jpg' }} style={styles.avatarImage} />
          <Text style={styles.name}>{profile?.full_name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>

          <View style={styles.coinsDisplay}>
            <Coins size={24} color="#FFD700" />
            <Text style={styles.coinsText}>{profile?.coins || 0} Coins</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>287</Text>
            <Text style={styles.statLabel}>Total km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>68</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <Text style={styles.sectionTitle}>Your Runimal Avatar</Text>
          <View style={styles.avatarShowcase}>
            <Image
              source={{ uri: 'https://gamingshift.com/wp-content/uploads/2019/12/mega-man-animation.gif' }}
              style={styles.avatarShowcaseImage}
            />
            <Text style={styles.avatarName}>Terra Pup</Text>
            <Text style={styles.avatarLevel}>Level 15 • Muscular Build</Text>
          </View>

          <View style={styles.avatarStats}>
            <View style={styles.avatarStatItem}>
              <Zap size={20} color="#FF6B35" />
              <Text style={styles.avatarStatLabel}>Speed</Text>
              <Text style={styles.avatarStatValue}>92</Text>
            </View>
            <View style={styles.avatarStatItem}>
              <Shield size={20} color="#4A90E2" />
              <Text style={styles.avatarStatLabel}>Endurance</Text>
              <Text style={styles.avatarStatValue}>88</Text>
            </View>
            <View style={styles.avatarStatItem}>
              <Heart size={20} color="#FF6B6B" />
              <Text style={styles.avatarStatLabel}>Stamina</Text>
              <Text style={styles.avatarStatValue}>95</Text>
            </View>
          </View>

          <View style={styles.itemsSection}>
            <Text style={styles.itemsTitle}>Equipped Items</Text>
            <View style={styles.itemsGrid}>
              <View style={styles.itemCard}>
                <Text style={styles.itemEmoji}>👟</Text>
                <Text style={styles.itemName}>Speed Shoes</Text>
                <Text style={styles.itemBoost}>+10 Speed</Text>
              </View>
              <View style={styles.itemCard}>
                <Text style={styles.itemEmoji}>💪</Text>
                <Text style={styles.itemName}>Power Band</Text>
                <Text style={styles.itemBoost}>+8 Strength</Text>
              </View>
              <View style={styles.itemCard}>
                <Text style={styles.itemEmoji}>⚡</Text>
                <Text style={styles.itemName}>Energy Drink</Text>
                <Text style={styles.itemBoost}>+12 Stamina</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.runimalsCollection}>
          <Text style={styles.sectionTitle}>My Runimal Collection</Text>
          <View style={styles.runimalGrid}>
            <View style={styles.runimalCard}>
              <View style={[styles.runimalIcon, { backgroundColor: 'rgba(255, 107, 53, 0.2)' }]}>
                <Text style={styles.runimalEmoji}>🔥</Text>
              </View>
              <Text style={styles.runimalCardName}>Blazey</Text>
              <Text style={styles.runimalCardLevel}>Lv 12</Text>
            </View>
            <View style={styles.runimalCard}>
              <View style={[styles.runimalIcon, { backgroundColor: 'rgba(74, 144, 226, 0.2)' }]}>
                <Text style={styles.runimalEmoji}>💧</Text>
              </View>
              <Text style={styles.runimalCardName}>Splash</Text>
              <Text style={styles.runimalCardLevel}>Lv 8</Text>
            </View>
            <View style={styles.runimalCard}>
              <View style={[styles.runimalIcon, { backgroundColor: 'rgba(139, 115, 85, 0.2)' }]}>
                <Text style={styles.runimalEmoji}>🌍</Text>
              </View>
              <Text style={styles.runimalCardName}>Rocky</Text>
              <Text style={styles.runimalCardLevel}>Lv 10</Text>
            </View>
            <View style={[styles.runimalCard, styles.lockedCard]}>
              <View style={styles.runimalIcon}>
                <Lock size={24} color="#666" />
              </View>
              <Text style={styles.runimalCardName}>Locked</Text>
              <Text style={styles.runimalCardLevel}>Reach Lv 20</Text>
            </View>
          </View>
        </View>

        <View style={styles.achievementsPreview}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <TouchableOpacity onPress={() => router.push('/profile/achievements')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementBadge, { backgroundColor: 'rgba(255, 215, 0, 0.2)' }]}>
                <Trophy size={24} color="#FFD700" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>First 10K</Text>
                <Text style={styles.achievementDesc}>Complete 10km run</Text>
              </View>
              <Text style={styles.achievementStatus}>✓</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementBadge, { backgroundColor: 'rgba(255, 107, 53, 0.2)' }]}>
                <Zap size={24} color="#FF6B35" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>Speed Demon</Text>
                <Text style={styles.achievementDesc}>Run 5km under 25min</Text>
              </View>
              <Text style={styles.achievementStatus}>✓</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementBadge, { backgroundColor: 'rgba(74, 144, 226, 0.2)' }]}>
                <Award size={24} color="#4A90E2" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>Week Warrior</Text>
                <Text style={styles.achievementDesc}>7-day streak</Text>
              </View>
              <Text style={styles.achievementStatus}>✓</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/achievements')}
          >
            <View style={styles.menuIconContainer}>
              <Award size={24} color="#FF6B35" />
            </View>
            <Text style={styles.menuText}>Achievements</Text>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/runimals')}
          >
            <View style={styles.menuIconContainer}>
              <Trophy size={24} color="#FF6B35" />
            </View>
            <Text style={styles.menuText}>My Runimals</Text>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/shop')}
          >
            <View style={styles.menuIconContainer}>
              <ShoppingBag size={24} color="#FF6B35" />
            </View>
            <Text style={styles.menuText}>Shop</Text>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profile/edit')}
          >
            <View style={styles.menuIconContainer}>
              <User size={24} color="#FF6B35" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#FF6B35" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Runimal Adventure v1.0.0</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  avatarSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  avatarShowcase: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarShowcaseImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  avatarLevel: {
    fontSize: 14,
    color: '#FF6B35',
  },
  avatarStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  avatarStatItem: {
    flex: 1,
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  avatarStatLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 4,
  },
  avatarStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemsSection: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  itemsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  itemCard: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemBoost: {
    fontSize: 10,
    color: '#4ADE80',
  },
  runimalsCollection: {
    marginBottom: 24,
  },
  runimalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  runimalCard: {
    width: '48%',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  lockedCard: {
    opacity: 0.5,
  },
  runimalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  runimalEmoji: {
    fontSize: 32,
  },
  runimalCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  runimalCardLevel: {
    fontSize: 12,
    color: '#999',
  },
  achievementsPreview: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
  },
  achievementBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 13,
    color: '#999',
  },
  achievementStatus: {
    fontSize: 24,
    color: '#4ADE80',
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  statsCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#3D3D54',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});
