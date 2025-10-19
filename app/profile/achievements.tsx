import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Lock } from 'lucide-react-native';
import type { Achievement, UserAchievement } from '@/types/database';

interface AchievementWithStatus extends Achievement {
  earned: boolean;
  earned_at?: string;
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const [achievementsRes, userAchievementsRes] = await Promise.all([
      supabase.from('achievements').select('*').order('created_at'),
      supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', user?.id),
    ]);

    if (achievementsRes.data) {
      const userAchievementIds = new Set(
        userAchievementsRes.data?.map((ua) => ua.achievement_id) || []
      );

      const achievementsWithStatus = achievementsRes.data.map((achievement) => {
        const userAchievement = userAchievementsRes.data?.find(
          (ua) => ua.achievement_id === achievement.id
        );
        return {
          ...achievement,
          earned: userAchievementIds.has(achievement.id),
          earned_at: userAchievement?.earned_at,
        };
      });

      setAchievements(achievementsWithStatus);
    }
    setLoading(false);
  };

  const earnedCount = achievements.filter((a) => a.earned).length;

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
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressText}>
          {earnedCount} / {achievements.length} Unlocked
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(earnedCount / achievements.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.earned && styles.achievementCardLocked,
              ]}
            >
              {achievement.earned ? (
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              ) : (
                <View style={styles.lockedIcon}>
                  <Lock size={32} color="#666" />
                </View>
              )}
              <Text
                style={[
                  styles.achievementName,
                  !achievement.earned && styles.achievementNameLocked,
                ]}
              >
                {achievement.name}
              </Text>
              <Text
                style={[
                  styles.achievementDescription,
                  !achievement.earned && styles.achievementDescriptionLocked,
                ]}
              >
                {achievement.description}
              </Text>
              {achievement.earned && achievement.earned_at && (
                <Text style={styles.earnedDate}>
                  Earned {new Date(achievement.earned_at).toLocaleDateString()}
                </Text>
              )}
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
  progressCard: {
    backgroundColor: '#2D2D44',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#1A1A2E',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  achievementCardLocked: {
    backgroundColor: '#1F1F2E',
    borderColor: 'transparent',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  lockedIcon: {
    marginBottom: 12,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: '#666',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementDescriptionLocked: {
    color: '#555',
  },
  earnedDate: {
    fontSize: 10,
    color: '#FF6B35',
    marginTop: 8,
  },
});
