import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';

import { useAuth } from '@/context/AuthContext';

export default function KostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const [kost, setKost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const response = await api.get(`/kost/${id}`);
      setKost(response.data);
    } catch (error) {
      console.error('Error fetching Detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      </ThemedView>
    );
  }

  if (!kost) return null;

  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isCustomer ? 100 : 20 }}>
        <View style={styles.headerImageContainer}>
          <Image 
            source={{ uri: kost.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000' }} 
            style={[styles.headerImage, { width }]} 
          />
          <TouchableOpacity 
            style={[styles.backButton, { top: Math.max(insets.top, 20) }]}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        <View style={[styles.contentContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="title" style={styles.title}>{kost.name}</ThemedText>
              <View style={styles.locationContainer}>
                <IconSymbol name="mappin.and.ellipse" size={16} color={Colors[colorScheme].icon} />
                <ThemedText style={{ color: Colors[colorScheme].icon, fontSize: 16 }}>{kost.city}, Indonesia</ThemedText>
              </View>
            </View>
            <View style={[styles.ratingBadge, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
              <IconSymbol name="star.fill" size={16} color="#F59E0B" />
              <ThemedText style={styles.ratingText}>4.8</ThemedText>
            </View>
          </View>
          
          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Alamat</ThemedText>
          <ThemedText style={[styles.description, { color: Colors[colorScheme].icon, marginBottom: 16 }]}>
            {kost.address}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Deskripsi</ThemedText>
          <ThemedText style={[styles.description, { color: Colors[colorScheme].icon }]}>
            {kost.description}
          </ThemedText>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Fasilitas</ThemedText>
          <View style={styles.facilities}>
            {kost.facilities?.map((fac: string, idx: number) => (
              <View key={idx} style={[styles.facilityItem, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={Colors[colorScheme].tint} />
                <ThemedText style={styles.facilityText}>{fac}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {isCustomer && (
        <View style={[styles.footer, { backgroundColor: Colors[colorScheme].surface, paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.priceContainer}>
            <ThemedText style={{ color: Colors[colorScheme].icon, fontSize: 14 }}>Harga</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <ThemedText type="subtitle" style={[styles.priceAmount, { color: Colors[colorScheme].tint }]}>
                Rp {kost.price_per_month?.toLocaleString('id-ID')}
              </ThemedText>
              <ThemedText style={[styles.priceMonth, { color: Colors[colorScheme].icon }]}> /bln</ThemedText>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.bookingButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={() => router.push(`/booking/${id}`)}
          >
            <ThemedText style={styles.bookingButtonText}>Pesan Sekarang</ThemedText>
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
  headerImageContainer: {
    position: 'relative',
  },
  headerImage: {
    height: 350,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  facilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  facilityItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  facilityText: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    justifyContent: 'center',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '800',
  },
  priceMonth: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookingButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
