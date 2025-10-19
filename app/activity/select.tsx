import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useActivityTracking } from '@/contexts/ActivityTrackingContext';

interface ActivityType {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export default function SelectActivityScreen() {
  const router = useRouter();
  const { startActivity } = useActivityTracking();

  const activities: ActivityType[] = [
    { id: 'run', name: 'Run', emoji: '🏃', description: 'Outdoor or indoor running' },
    { id: 'walk', name: 'Walk', emoji: '🚶', description: 'Walking exercise' },
    { id: 'cycle', name: 'Cycle', emoji: '🚴', description: 'Bike ride' },
    { id: 'hike', name: 'Hike', emoji: '🥾', description: 'Trail hiking' },
    { id: 'treadmill', name: 'Treadmill', emoji: '🏃‍♀️', description: 'Indoor treadmill run' },
    { id: 'swim', name: 'Swim', emoji: '🏊', description: 'Pool swimming' },
    { id: 'yoga', name: 'Yoga', emoji: '🧘', description: 'Yoga session' },
    { id: 'strength', name: 'Strength', emoji: '💪', description: 'Weight training' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Activity</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose your workout type</Text>
        <View style={styles.activityGrid}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={() => {
                startActivity(activity.id);
                router.replace('/(tabs)/map');
              }}
            >
              <Text style={styles.activityEmoji}>{activity.emoji}</Text>
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
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
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  activityCard: {
    width: '48%',
    backgroundColor: '#2D2D44',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  activityEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  activityName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
