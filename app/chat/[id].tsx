import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api, { BASE_URL } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function ChatRoomScreen() {
  const { id, partnerName } = useLocalSearchParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // 1. Fetch History
  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/${id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Setup Socket
  useEffect(() => {
    fetchMessages();

    // Inisialisasi Socket.io
    socketRef.current = io(BASE_URL, {
      auth: {
        token: accessToken
      }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      socketRef.current?.emit('joinRoom', id);
    });

    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prev) => {
        // Hindari duplikat jika pesan berasal dari diri sendiri (sudah ada via optimistic update)
        const isDuplicate = prev.some(m => 
          m.id === message.id || 
          (m.senderId === user?.id && m.text === message.text && Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000)
        );
        if (isDuplicate) return prev;
        return [...prev, message];
      });
      // Auto scroll ke bawah
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    socketRef.current.on('typingStatus', ({ conversationId, isTyping }) => {
      if (conversationId === id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [id]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(), // ID sementara untuk UI
      senderId: user?.id,
      text: inputText.trim(),
      createdAt: new Date().toISOString()
    };

    // Optimistic Update: Langsung tambahkan ke list
    setMessages((prev) => [...prev, newMessage]);
    
    // Auto scroll ke bawah
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    const payload = {
      conversationId: id,
      text: inputText.trim()
    };

    socketRef.current?.emit('sendMessage', payload);
    setInputText('');
    socketRef.current?.emit('typing', { conversationId: id, isTyping: false });
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    socketRef.current?.emit('typing', { conversationId: id, isTyping: text.length > 0 });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === user?.id;

    return (
      <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.partnerBubble, { backgroundColor: isMe ? Colors[colorScheme].tint : Colors[colorScheme].surface }]}>
        <ThemedText style={[styles.messageText, { color: isMe ? '#fff' : Colors[colorScheme].text }]}>
          {item.text}
        </ThemedText>
        <ThemedText style={[styles.timeLabel, { color: isMe ? 'rgba(255,255,255,0.7)' : Colors[colorScheme].icon }]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: partnerName as string || 'Chat',
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        )
      }} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[styles.messageList, { paddingBottom: 20 }]}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <ThemedText style={{ fontSize: 12, fontStyle: 'italic', color: Colors[colorScheme].icon }}>
              {partnerName} sedang mengetik...
            </ThemedText>
          </View>
        )}

        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12), backgroundColor: Colors[colorScheme].surface, borderTopColor: Colors[colorScheme].border }]}>
          <TextInput
            style={[styles.input, { color: Colors[colorScheme].text, backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].border }]}
            placeholder="Ketik pesan..."
            placeholderTextColor={Colors[colorScheme].icon}
            value={inputText}
            onChangeText={handleTyping}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  myBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  partnerBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timeLabel: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingIndicator: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 100,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
