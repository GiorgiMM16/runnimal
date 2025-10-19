import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, Weight, Ruler, Calendar, Target, Phone } from 'lucide-react-native';
import type { FitnessGoal, EmergencyContact } from '@/types/database';

export default function ProfileSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('get_fitter');
  const [emergencyService, setEmergencyService] = useState('112');
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { name: '', phone: '', relationship: '' },
  ]);

  const goals: { value: FitnessGoal; label: string }[] = [
    { value: 'get_fitter', label: 'Get Fitter' },
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'train_for_race', label: 'Train for a Race' },
    { value: 'stay_active', label: 'Stay Active' },
  ];

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', phone: '', relationship: '' }]);
    }
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const handleSubmit = async () => {
    if (!fullName || !weight || !height || !age) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    const validContacts = contacts.filter(c => c.name && c.phone);

    const { error } = await supabase.from('profiles').insert({
      id: user?.id,
      email: user?.email,
      full_name: fullName,
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      fitness_goal: fitnessGoal,
      emergency_service: emergencyService,
      emergency_contacts: validContacts,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/onboarding/runimal-selection');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Help us personalize your fitness journey
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputContainer}>
            <User size={20} color="#FF6B35" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Weight size={20} color="#FF6B35" />
              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                placeholderTextColor="#666"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Ruler size={20} color="#FF6B35" />
              <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                placeholderTextColor="#666"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Calendar size={20} color="#FF6B35" />
            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor="#666"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Goal</Text>
          <View style={styles.goalsContainer}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.goalButton,
                  fitnessGoal === goal.value && styles.goalButtonActive,
                ]}
                onPress={() => setFitnessGoal(goal.value)}
              >
                <Target
                  size={20}
                  color={fitnessGoal === goal.value ? '#FFFFFF' : '#FF6B35'}
                />
                <Text
                  style={[
                    styles.goalText,
                    fitnessGoal === goal.value && styles.goalTextActive,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts (Optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Stay safe during your outdoor activities
          </Text>

          <View style={styles.inputContainer}>
            <Phone size={20} color="#FF6B35" />
            <TextInput
              style={styles.input}
              placeholder="Emergency Service (e.g., 112)"
              placeholderTextColor="#666"
              value={emergencyService}
              onChangeText={setEmergencyService}
              keyboardType="phone-pad"
            />
          </View>

          {contacts.map((contact, index) => (
            <View key={index} style={styles.contactGroup}>
              <TextInput
                style={styles.inputSmall}
                placeholder="Name"
                placeholderTextColor="#666"
                value={contact.name}
                onChangeText={(text) => updateContact(index, 'name', text)}
              />
              <TextInput
                style={styles.inputSmall}
                placeholder="Phone"
                placeholderTextColor="#666"
                value={contact.phone}
                onChangeText={(text) => updateContact(index, 'phone', text)}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.inputSmall}
                placeholder="Relationship"
                placeholderTextColor="#666"
                value={contact.relationship}
                onChangeText={(text) => updateContact(index, 'relationship', text)}
              />
            </View>
          ))}

          {contacts.length < 3 && (
            <TouchableOpacity style={styles.addButton} onPress={addContact}>
              <Text style={styles.addButtonText}>+ Add Another Contact</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Profile...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 48,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    flex: 1,
    marginRight: 8,
  },
  goalsContainer: {
    gap: 12,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  goalText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  goalTextActive: {
    color: '#FFFFFF',
  },
  contactGroup: {
    backgroundColor: '#2D2D44',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  inputSmall: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  addButton: {
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
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
