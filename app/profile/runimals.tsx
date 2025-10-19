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
import { ChevronLeft, Mountain, Flame, Droplet, Star, Zap } from 'lucide-react-native';
import type { UserRunimal, Runimal } from '@/types/database';

export default function RunimalsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [runimals, setRunimals] = useState<(UserRunimal & { runimal: Runimal })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRunimals();
  }, []);

  const fetchRunimals = async () => {
    const { data } = await supabase
      .from('user_runimals')
      .select('*, runimal:runimals(*)')
      .eq('user_id', user?.id)
      .order('collected_at', { ascending: false });

    if (data) {
      setRunimals(data as any);
    }
    setLoading(false);
  };

  const getRunimalIcon = (type: string) => {
    switch (type) {
      case 'earthy':
        return <Mountain size={48} color="#8B7355" strokeWidth={2} />;
      case 'fiery':
        return <Flame size={48} color="#FF6B35" strokeWidth={2} />;
      case 'watery':
        return <Droplet size={48} color="#4A90E2" strokeWidth={2} />;
      default:
        return <Zap size={48} color="#999" strokeWidth={2} />;
    }
  };

  const getRunimalColor = (type: string) => {
    switch (type) {
      case 'earthy':
        return '#8B7355';
      case 'fiery':
        return '#FF6B35';
      case 'watery':
        return '#4A90E2';
      default:
        return '#999';
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My Runimals</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.collectionText}>
          You have collected {runimals.length} Runimal{runimals.length !== 1 ? 's' : ''}
        </Text>

        {runimals.map((userRunimal) => (
          <View
            key={userRunimal.id}
            style={[
              styles.runimalCard,
              userRunimal.is_active && styles.runimalCardActive,
            ]}
          >
            {userRunimal.is_active && (
              <View style={styles.activeBadge}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getRunimalColor(userRunimal.runimal.type)}20` },
              ]}
            >
              {getRunimalIcon(userRunimal.runimal.type)}
            </View>
            <View style={styles.runimalInfo}>
              <Text style={styles.runimalName}>
                {userRunimal.nickname || userRunimal.runimal.name}
              </Text>
              <Text style={styles.runimalType}>
                {userRunimal.runimal.type.charAt(0).toUpperCase() +
                  userRunimal.runimal.type.slice(1)}{' '}
                Type
              </Text>
              <View style={styles.levelContainer}>
                <Text style={styles.levelText}>Level {userRunimal.level}</Text>
                <View style={styles.xpBar}>
                  <View
                    style={[
                      styles.xpFill,
                      {
                        width: `${(userRunimal.xp % 100)}%`,
                        backgroundColor: getRunimalColor(userRunimal.runimal.type),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.xpText}>{userRunimal.xp % 100}/100 XP</Text>
              </View>
              <View style={styles.moodContainer}>
                <View
                  style={[
                    styles.moodIndicator,
                    { backgroundColor: getMoodColor(userRunimal.mood) },
                  ]}
                />
                <Text style={styles.moodText}>
                  Feeling {userRunimal.mood}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {runimals.length === 0 && (
          <View style={styles.emptyState}>
            <Zap size={64} color="#666" />
            <Text style={styles.emptyText}>No Runimals yet</Text>
            <Text style={styles.emptySubtext}>
              Complete activities to discover and collect new Runimals
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getMoodColor(mood: string) {
  switch (mood) {
    case 'energetic':
      return '#4ADE80';
    case 'active':
      return '#60A5FA';
    case 'tired':
      return '#FBBF24';
    case 'sleepy':
      return '#9CA3AF';
    default:
      return '#999';
  }
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  collectionText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  runimalCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  runimalCardActive: {
    borderColor: '#FF6B35',
  },
  activeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  runimalInfo: {
    alignItems: 'center',
  },
  runimalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  runimalType: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  levelContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 8,
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpFill: {
    height: '100%',
  },
  xpText: {
    fontSize: 12,
    color: '#999',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  moodText: {
    fontSize: 14,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
