import React from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

import { useChats } from '@/hooks/use-chats';

import { styles } from './inbox.styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AVATAR_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];

export default function InboxScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const {
    chats,
    filteredChats,
    isLoading,
    refreshing,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    onRefresh
  } = useChats();

  const getAvatarColor = (name: string) => {
    const charCode = name?.charCodeAt(0) || 0;
    return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{
          width: 44, height: 44, backgroundColor: '#fff', borderRadius: 12,
          justifyContent: 'center', alignItems: 'center',
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
          borderWidth: 1, borderColor: '#f3f4f6'
        }}>
          <Image
            source={require('@/assets/images/logo_kost.jpg')}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </View>
        <ThemedText type="title" style={styles.headerTitle}>Pesan</ThemedText>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <IconSymbol name="magnifyingglass" size={20} color={theme.icon} />
        <TextInput
          placeholder="Cari pesan..."
          placeholderTextColor={theme.icon}
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={(text) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSearchQuery(text);
          }}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setActiveTab('all');
          }}
          style={[
            styles.tab, 
            activeTab === 'all' && { backgroundColor: theme.tint, borderColor: theme.tint }
          ]}
        >
          <ThemedText style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Semua
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setActiveTab('unread');
          }}
          style={[
            styles.tab, 
            activeTab === 'unread' && { backgroundColor: theme.tint, borderColor: theme.tint }
          ]}
        >
          <ThemedText style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Belum Dibaca
          </ThemedText>
          {chats.some(c => c.unreadCount > 0) && activeTab !== 'unread' && (
            <View style={styles.tabBadge} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChatItem = ({ item }: { item: any }) => {
    const partner = user?.role === 'CUSTOMER' ? item.owner : item.customer;
    const avatarColor = getAvatarColor(partner?.name || 'P');

    return (
      <TouchableOpacity 
        style={[styles.chatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        activeOpacity={0.7}
        onPress={() => router.push({
          pathname: '/chat/[id]',
          params: { id: item.id, partnerName: partner?.name }
        })}
      >
        <View style={[styles.avatarContainer, { backgroundColor: avatarColor + '20' }]}>
          {partner?.avatar ? (
            <ExpoImage 
              source={{ uri: partner.avatar }} 
              style={styles.avatarImage} 
            />
          ) : (
            <ThemedText style={[styles.avatarInitial, { color: avatarColor }]}>
              {partner?.name?.charAt(0).toUpperCase() || 'P'}
            </ThemedText>
          )}
          <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatTopRow}>
            <ThemedText type="defaultSemiBold" style={styles.partnerName} numberOfLines={1}>
              {partner?.name || 'Partner Chat'}
            </ThemedText>
            <ThemedText style={[styles.timeText, { color: theme.icon }]}>
              {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </ThemedText>
          </View>
          
          <View style={styles.chatBottomRow}>
            <ThemedText 
              numberOfLines={1} 
              style={[
                styles.lastMessage, 
                { color: item.unreadCount > 0 ? theme.text : theme.icon, fontWeight: item.unreadCount > 0 ? '600' : '400' }
              ]}
            >
              {item.lastMessage || 'Ketuk untuk mulai mengobrol...'}
            </ThemedText>
            
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: theme.tint }]}>
                <ThemedText style={styles.unreadCountText}>{item.unreadCount}</ThemedText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), borderBottomColor: theme.border }]}>
        {renderHeader()}
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      ) : filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconContainer, { backgroundColor: theme.surface }]}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={60} color={theme.icon} />
          </View>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            {searchQuery ? 'Tidak ada hasil' : 'Belum ada pesan'}
          </ThemedText>
          <ThemedText style={[styles.emptyDesc, { color: theme.icon }]}>
            {searchQuery 
              ? `Tidak dapat menemukan obrolan untuk "${searchQuery}"`
              : 'Pesan Anda bersama pemilik kost akan muncul di sini.'}
          </ThemedText>
          {!searchQuery && (
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: theme.tint }]}
              onPress={onRefresh}
            >
              <ThemedText style={styles.primaryButtonText}>Segarkan</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ThemedView>
  );
}

