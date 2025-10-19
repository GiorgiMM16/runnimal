import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Runimal AI Coach. I'm here to help you with recovery advice, nutrition tips, and daily challenges based on your fitness goals!",
      isAI: true,
    },
    {
      id: '2',
      text: "You've run 24.5 km this week. Based on your fitness level, I recommend taking a rest day tomorrow to allow your muscles to recover.",
      isAI: true,
    },
  ]);
  const [inputText, setInputText] = useState('');

  const suggestions = [
    'When should I rest?',
    'Nutrition advice',
    'Daily challenge',
    'How to improve pace?',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Coach</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.aiHeader}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=68' }}
          style={styles.aiAvatar}
        />
        <View style={styles.aiInfo}>
          <Text style={styles.aiName}>Coach Riley</Text>
          <Text style={styles.aiStatus}>Online • Recovery & Nutrition Expert</Text>
        </View>
      </View>

      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isAI ? styles.aiMessage : styles.userMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Quick questions:</Text>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask your AI coach..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2D2D44',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  aiAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  aiInfo: {
    flex: 1,
  },
  aiName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiStatus: {
    fontSize: 13,
    color: '#4ADE80',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  aiMessage: {
    backgroundColor: '#2D2D44',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#FF6B35',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  suggestionsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  suggestionChip: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2D2D44',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
