import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Zap, Flame, Bot, Coins, Play, Mountain, Droplet, Image as ImageIcon } from 'lucide-react-native';
import { Image } from 'react-native';
import type { Profile, UserRunimal, Runimal } from '@/types/database';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeRunimal, setActiveRunimal] = useState<(UserRunimal & { runimal: Runimal }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [profileRes, runimalRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user?.id).maybeSingle(),
      supabase
        .from('user_runimals')
        .select('*, runimal:runimals(*)')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .maybeSingle(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (runimalRes.data) setActiveRunimal(runimalRes.data as any);
    setLoading(false);
  };

  const getMoodMessage = (mood: string) => {
    switch (mood) {
      case 'energetic':
        return 'Your Runimal is feeling energetic today! Let\'s go!';
      case 'active':
        return 'Your Runimal is ready for action!';
      case 'tired':
        return 'Your Runimal could use some rest or a light workout.';
      case 'sleepy':
        return 'Your Runimal is feeling sleepy. A short walk could wake it up!';
      default:
        return 'Time for an adventure!';
    }
  };

  const getRunimalIcon = (type: string, size: number) => {
    switch (type) {
      case 'earthy':
        return <Mountain size={size} color="#8B7355" strokeWidth={2} />;
      case 'fiery':
        return <Zap size={size} color="#FF6B35" strokeWidth={2.5} />;
      case 'watery':
        return <Droplet size={size} color="#4A90E2" strokeWidth={2} />;
      default:
        return <Zap size={size} color="#999" strokeWidth={2} />;
    }
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
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={{ uri: 'https://i.pinimg.com/736x/6c/79/57/6c79575778c34fa8c0e7cbe9b8c01712.jpg' }} style={styles.profileImage} />
          </TouchableOpacity>
          <View style={styles.streakBadge}>
            <Flame size={16} color="#FF6B35" />
            <Text style={styles.streakText}>5</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.coinsContainer}>
            <Coins size={20} color="#FFD700" />
            <Text style={styles.coinsText}>{profile?.coins || 0}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/ai-assistant')}>
            <Bot size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.runimalContainer}>
          <View style={styles.runimalDisplay}>
            {activeRunimal && (
              <>
                <Image
                  source={{ uri: 'https://gamingshift.com/wp-content/uploads/2019/12/mega-man-animation.gif' }}
                  style={styles.runimalImageLarge}
                />
                <View style={styles.runimalInfo}>
                  <Text style={styles.runimalName}>
                    Terra Pup
                  </Text>
                  <Text style={styles.runimalLevel}>Level {activeRunimal.level}</Text>
                  <View style={styles.xpBar}>
                    <View
                      style={[
                        styles.xpFill,
                        { width: `${(activeRunimal.xp % 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.xpText}>
                    28/100 XP to next level
                  </Text>
                </View>
              </>
            )}
          </View>
          <Text style={styles.statusMessage}>
            {activeRunimal ? getMoodMessage(activeRunimal.mood) : 'No active Runimal'}
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={() => router.push('/activity/select')}>
          <Play size={24} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.startButtonText}>START ACTIVITY</Text>
        </TouchableOpacity>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>287.3</Text>
            <Text style={styles.statLabel}>Total KM</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>68</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.quickStatsCard}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>This Week</Text>
              <Text style={styles.quickStatValue}>24.5 km</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>This Month</Text>
              <Text style={styles.quickStatValue}>98.2 km</Text>
            </View>
          </View>
          <View style={styles.quickStatsCard}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>Avg Pace</Text>
              <Text style={styles.quickStatValue}>5:42/km</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>Calories</Text>
              <Text style={styles.quickStatValue}>3,240</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  coinsText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  runimalContainer: {
    backgroundColor: '#2D2D44',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  runimalDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  runimalIconLarge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  runimalImageLarge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 16,
  },
  runimalInfo: {
    alignItems: 'center',
    width: '100%',
  },
  runimalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  runimalLevel: {
    fontSize: 14,
    color: '#FF6B35',
    marginBottom: 12,
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
  },
  xpText: {
    fontSize: 12,
    color: '#999',
  },
  statusMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  quickStatsCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: '#3D3D54',
    marginHorizontal: 16,
  },
});
