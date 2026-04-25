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
      router.replace('/owner-dashboard');
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
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{
              width: 50, height: 50, backgroundColor: '#fff', borderRadius: 14,
              justifyContent: 'center', alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3
            }}>
              <Image
                source={require('@/assets/images/logo_kost.jpg')}
                style={{ width: 34, height: 34 }}
                resizeMode="contain"
              />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <ThemedText type="title" style={{ fontSize: 24, lineHeight: 28, fontWeight: '800' }}>Kost Aja</ThemedText>
            </View>
          </View>
          <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
            <IconSymbol name="person.fill" size={24} color={Colors[colorScheme].tint} />
          </View>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: Colors[colorScheme].surface, shadowColor: Colors[colorScheme].icon }]}>
          <IconSymbol name="magnifyingglass" size={20} color={Colors[colorScheme].icon} />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
            placeholder="Cari lokasi atau nama kost..."
            placeholderTextColor={Colors[colorScheme].icon}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
              style={[styles.card, { backgroundColor: Colors[colorScheme].surface, shadowColor: '#000' }]}
              onPress={() => router.push(`/kost/${item.id}`)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.cardTitle}>{item.name}</ThemedText>
                  <View style={styles.ratingContainer}>
                    <IconSymbol name="star.fill" size={14} color="#F59E0B" />
                    <ThemedText style={styles.ratingText}>4.8</ThemedText>
                  </View>
                </View>

                <View style={styles.locationContainer}>
                  <IconSymbol name="mappin.and.ellipse" size={14} color={Colors[colorScheme].icon} />
                  <ThemedText style={[styles.cityText, { color: Colors[colorScheme].icon }]}>{item.city}</ThemedText>
                </View>

                <View style={styles.facilitiesRow}>
                  {item.facilities?.slice(0, 3).map((fac: string, idx: number) => (
                    <View key={idx} style={[styles.facilityBadge, { backgroundColor: Colors[colorScheme].background }]}>
                      <ThemedText style={[styles.facilityText, { color: Colors[colorScheme].icon }]}>{fac}</ThemedText>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.priceFooter}>
                  <View style={styles.priceContainer}>
                    <ThemedText type="subtitle" style={[styles.price, { color: Colors[colorScheme].tint }]}>
                      Rp {item.price_per_month?.toLocaleString('id-ID')}
                    </ThemedText>
                    <ThemedText style={[styles.perMonth, { color: Colors[colorScheme].icon }]}>/bln</ThemedText>
                  </View>
                </View>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    padding: 20,
    paddingTop: 10,
    gap: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D97706',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  cityText: {
    fontSize: 14,
  },
  facilitiesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  facilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  facilityText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
    opacity: 0.5,
  },
  priceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
  },
  perMonth: {
    fontSize: 12,
    marginLeft: 4,
  },
});
