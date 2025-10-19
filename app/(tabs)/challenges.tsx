import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy, Target, Zap, Gift } from 'lucide-react-native';

export default function Challenges() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dailyBonusCard}>
          <Gift size={32} color="#FFD700" />
          <View style={styles.dailyBonusText}>
            <Text style={styles.dailyBonusTitle}>Daily Login Bonus</Text>
            <Text style={styles.dailyBonusSubtitle}>+50 Coins</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
          <View style={styles.challengeCard}>
            <View style={styles.challengeIcon}>
              <Target size={24} color="#FF6B35" />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>Run 1km</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
              <Text style={styles.challengeProgress}>0 / 1 km</Text>
            </View>
            <View style={styles.challengeReward}>
              <Text style={styles.rewardText}>+20</Text>
            </View>
          </View>

          <View style={styles.challengeCard}>
            <View style={styles.challengeIcon}>
              <Target size={24} color="#FF6B35" />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>Walk for 15 minutes</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '0%' }]} />
              </View>
              <Text style={styles.challengeProgress}>0 / 15 min</Text>
            </View>
            <View style={styles.challengeReward}>
              <Text style={styles.rewardText}>+15</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Streak</Text>
          <View style={styles.streakCard}>
            <View style={styles.streakDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <View key={index} style={styles.streakDay}>
                  <Text style={styles.streakDayText}>{day}</Text>
                  <View
                    style={[
                      styles.streakDayCircle,
                      index === 0 && styles.streakDayActive,
                    ]}
                  />
                </View>
              ))}
            </View>
            <Text style={styles.streakText}>Keep your streak alive!</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Challenges</Text>
          <View style={styles.challengeCard}>
            <View style={[styles.challengeIcon, { backgroundColor: 'rgba(138, 43, 226, 0.2)' }]}>
              <Zap size={24} color="#8A2BE2" />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>Weekend Warrior</Text>
              <Text style={styles.challengeDescription}>
                Complete 3 workouts this weekend
              </Text>
            </View>
            <View style={styles.challengeReward}>
              <Trophy size={20} color="#FFD700" />
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
  dailyBonusCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  dailyBonusText: {
    flex: 1,
  },
  dailyBonusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dailyBonusSubtitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
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
  challengeCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#999',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1A1A2E',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
  },
  challengeProgress: {
    fontSize: 12,
    color: '#999',
  },
  challengeReward: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  streakCard: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 20,
  },
  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  streakDay: {
    alignItems: 'center',
    gap: 8,
  },
  streakDayText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  streakDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#3D3D54',
  },
  streakDayActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  streakText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
