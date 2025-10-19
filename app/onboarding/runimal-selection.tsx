import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Mountain, Flame, Droplet, Zap } from 'lucide-react-native';
import type { Runimal } from '@/types/database';

export default function RunimalSelection() {
  const { user } = useAuth();
  const router = useRouter();
  const [runimals, setRunimals] = useState<Runimal[]>([]);
  const [selectedRunimal, setSelectedRunimal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRunimals();
  }, []);

  const fetchRunimals = async () => {
    const { data, error } = await supabase
      .from('runimals')
      .select('*')
      .eq('level', 1)
      .order('type');

    if (error) {
      Alert.alert('Error', 'Failed to load Runimals');
    } else {
      setRunimals(data || []);
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

  const handleSelect = async () => {
    if (!selectedRunimal) {
      Alert.alert('Error', 'Please select a Runimal');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('user_runimals').insert({
      user_id: user?.id,
      runimal_id: selectedRunimal,
      is_active: true,
      mood: 'energetic',
      level: 1,
      xp: 0,
    });

    setSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Choose Your First Runimal</Text>
      <Text style={styles.subtitle}>
        This energy creature will grow and evolve with you on your fitness journey
      </Text>

      <View style={styles.runimals}>
        {runimals.map((runimal) => (
          <TouchableOpacity
            key={runimal.id}
            style={[
              styles.runimalCard,
              selectedRunimal === runimal.id && styles.runimalCardSelected,
              {
                borderColor:
                  selectedRunimal === runimal.id
                    ? getRunimalColor(runimal.type)
                    : 'transparent',
              },
            ]}
            onPress={() => setSelectedRunimal(runimal.id)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getRunimalColor(runimal.type)}20` },
              ]}
            >
              {getRunimalIcon(runimal.type)}
            </View>
            <Text style={styles.runimalName}>{runimal.name}</Text>
            <Text style={styles.runimalType}>
              {runimal.type.charAt(0).toUpperCase() + runimal.type.slice(1)} Type
            </Text>
            <Text style={styles.runimalDescription}>{runimal.description}</Text>

            <View style={styles.stats}>
              {Object.entries(runimal.base_stats).map(([key, value]) => (
                <View key={key} style={styles.stat}>
                  <Text style={styles.statLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <View style={styles.statBar}>
                    <View
                      style={[
                        styles.statFill,
                        {
                          width: `${((value as number) / 10) * 100}%`,
                          backgroundColor: getRunimalColor(runimal.type),
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSelect}
        disabled={submitting || !selectedRunimal}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Hatching...' : 'Choose This Runimal'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 48,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  runimals: {
    gap: 16,
    marginBottom: 24,
  },
  runimalCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  runimalCardSelected: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
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
  runimalName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  runimalType: {
    fontSize: 14,
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  runimalDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  stats: {
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    width: 70,
  },
  statBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
