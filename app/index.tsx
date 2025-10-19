import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      checkOnboardingStatus();
    }
  }, [loading, user]);

  const checkOnboardingStatus = async () => {
    if (!user) {
      router.replace('/onboarding/welcome');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile) {
      router.replace('/onboarding/profile-setup');
    } else {
      const { data: userRunimals } = await supabase
        .from('user_runimals')
        .select('*')
        .eq('user_id', user.id);

      if (!userRunimals || userRunimals.length === 0) {
        router.replace('/onboarding/runimal-selection');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B35" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
});
