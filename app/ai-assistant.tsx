import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useState, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    'When should I rest?',
    'Nutrition advice',
    'Daily challenge',
    'How to improve pace?',
  ];

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    setShowSuggestions(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isAI: false,
    };

    const currentMessages = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const apiMessages = [
        {
          role: 'system',
          content: "You are Coach Riley, an expert AI fitness coach for the Runimal app. You provide recovery advice, nutrition tips, and daily challenges to help users reach their fitness goals. Be supportive, motivating, and concise in your responses.",
        },
        ...currentMessages.map(msg => ({
          role: msg.isAI ? 'assistant' : 'user',
          content: msg.text,
        })),
        {
          role: 'user',
          content: userMessage.text,
        },
      ];

      console.log('Sending request to OpenAI...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      console.log('OpenAI response:', data);

      if (data.choices && data.choices[0]?.message?.content) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.choices[0].message.content,
          isAI: true,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (data.error) {
        console.error('OpenAI error:', data.error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Error: ${data.error.message || 'Unable to get response'}`,
          isAI: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isAI: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

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

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
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

        {isLoading && (
          <View style={[styles.messageBubble, styles.aiMessage]}>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </View>
        )}

        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick questions:</Text>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask your AI coach..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={isLoading || !inputText.trim()}
        >
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
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
