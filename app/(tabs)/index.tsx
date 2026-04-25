import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user?.role === 'OWNER') {
      if (user.hasKost) {
        router.replace('/owner-dashboard');
      } else {
        router.replace('/kost/create');
      }
    }
  }, [user]);

  const [kosts, setKosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchKosts = async () => {
    try {
      const response = await api.get('/kost');
      setKosts(response.data);
    } catch (error) {
      console.error('Error fetching kosts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchKosts();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={[styles.iconBox, { backgroundColor: Colors[colorScheme].surface }]}>
              <IconSymbol name="house.fill" size={24} color="#111" />
            </View>
            <ThemedText type="title" style={styles.headerTitle}>Kost Aja</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push('/profile')}
          >
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
              style={styles.avatarImage} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchWrapper, { backgroundColor: Colors[colorScheme].surface, shadowColor: '#000' }]}>
          <IconSymbol name="magnifyingglass" size={20} color={Colors[colorScheme].icon} />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
            placeholder="Cari lokasi atau nama kost..."
            placeholderTextColor={Colors[colorScheme].icon}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerIndicator}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : (
        <FlatList
          data={kosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: Colors[colorScheme].surface }]}
              onPress={() => router.push(`/kost/${item.id}`)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardInfo}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold" style={styles.kostName}>{item.name}</ThemedText>
                    <ThemedText style={[styles.locationText, { color: Colors[colorScheme].icon }]}>
                      {item.city}, Indonesia
                    </ThemedText>
                  </View>
                  <View style={styles.ratingBadge}>
                    <ThemedText style={styles.ratingValue}>4.8</ThemedText>
                    <IconSymbol name="star.fill" size={12} color="#F59E0B" />
                  </View>
                </View>

                <View style={styles.facilitiesRow}>
                  {item.facilities?.includes('WiFi') && (
                    <View style={[styles.tag, { backgroundColor: '#E0F2F1' }]}>
                      <IconSymbol name="safari.fill" size={14} color="#00796B" />
                      <ThemedText style={[styles.tagText, { color: '#00796B' }]}>WIFI</ThemedText>
                    </View>
                  )}
                  {item.facilities?.includes('Kasur') && (
                    <View style={[styles.tag, { backgroundColor: '#E3F2FD' }]}>
                      <IconSymbol name="bed.double.fill" size={14} color="#1976D2" />
                      <ThemedText style={[styles.tagText, { color: '#1976D2' }]}>Kasur</ThemedText>
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.priceTag, { color: Colors[colorScheme].tint }]}>
                  Rp {item.price_per_month?.toLocaleString('id-ID')} <ThemedText style={styles.pricePeriod}>/ bln</ThemedText>
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        />
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
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  centerIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
    gap: 25,
  },
  card: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 20,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  kostName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D97706',
  },
  facilitiesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceTag: {
    fontSize: 18,
    fontWeight: '900',
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
});
