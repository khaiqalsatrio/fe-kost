import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function InboxScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chat');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const renderChatItem = ({ item }: { item: any }) => {
    // Tentukan siapa lawan bicaranya (partner)
    const partner = user?.role === 'CUSTOMER' ? item.owner : item.customer;

    return (
      <TouchableOpacity 
        style={[styles.chatItem, { borderBottomColor: Colors[colorScheme].border }]}
        onPress={() => router.push({
          pathname: '/chat/[id]',
          params: { id: item.id, partnerName: partner?.name }
        })}
      >
        <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
          <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: '700' }}>
            {partner?.name?.charAt(0).toUpperCase() || 'P'}
          </ThemedText>
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <ThemedText type="defaultSemiBold" style={styles.partnerName}>{partner?.name || 'Partner Chat'}</ThemedText>
            <ThemedText style={styles.timeText}>
              {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </ThemedText>
          </View>
          <ThemedText numberOfLines={1} style={[styles.lastMessage, { color: Colors[colorScheme].icon }]}>
            {item.lastMessage || 'Ketuk untuk mulai mengobrol...'}
          </ThemedText>
        </View>
        {item.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: Colors[colorScheme].tint }]}>
            <ThemedText style={styles.unreadText}>{item.unreadCount}</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface, borderBottomColor: Colors[colorScheme].border }]}>
        <ThemedText type="title" style={styles.headerTitle}>Pesan</ThemedText>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: Colors[colorScheme].surface }]}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={60} color={Colors[colorScheme].border} />
          </View>
          <ThemedText type="subtitle" style={styles.emptyTitle}>Belum ada pesan</ThemedText>
          <ThemedText style={[styles.emptyDesc, { color: Colors[colorScheme].icon }]}>
            Pesan Anda bersama pemilik kost akan muncul di sini.
          </ThemedText>
          <TouchableOpacity 
            style={[styles.refreshButton, { borderColor: Colors[colorScheme].tint }]}
            onPress={onRefresh}
          >
            <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: '600' }}>Refresh</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  list: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 17,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  emptyDesc: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
});
