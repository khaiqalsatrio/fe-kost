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
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isCustomer ? 120 : 40 }}>
        {/* Header Image Section */}
        <View style={styles.imageHeader}>
          <Image 
            source={{ uri: kost.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000' }} 
            style={[styles.headerImage, { width }]} 
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={() => router.back()}
          >
            <View style={styles.backCircle}>
              <IconSymbol name="chevron.left" size={20} color="#111" />
            </View>
            <ThemedText style={styles.backText}>BACK</ThemedText>
          </TouchableOpacity>

          {/* Pagination Dots Simulator */}
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Image Counter Badge */}
          <View style={styles.imageCounter}>
            <ThemedText style={styles.counterText}>1/5</ThemedText>
          </View>
        </View>

        {/* Content Card Section */}
        <View style={[styles.contentCard, { backgroundColor: Colors[colorScheme].background }]}>
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="title" style={styles.kostName}>{kost.name}</ThemedText>
              <View style={styles.locationRow}>
                <IconSymbol name="safari.fill" size={14} color={Colors[colorScheme].icon} />
                <ThemedText style={[styles.locationText, { color: Colors[colorScheme].icon }]}>
                  {kost.city}, Indonesia
                </ThemedText>
              </View>
            </View>
            <View style={styles.ratingBox}>
              <ThemedText style={styles.ratingValue}>4.8</ThemedText>
            </View>
          </View>

          {!isCustomer && (
            <TouchableOpacity 
              style={[styles.ownerBadge, { backgroundColor: Colors[colorScheme].tint + '10' }]}
              onPress={() => router.push(`/kost/rooms/${id}`)}
            >
              <IconSymbol name="square.grid.2x2.fill" size={18} color={Colors[colorScheme].tint} />
              <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: '700' }}>Manage Rooms</ThemedText>
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Alamat</ThemedText>
            <ThemedText style={[styles.sectionContent, { color: Colors[colorScheme].icon }]}>
              {kost.address}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Deskripsi</ThemedText>
            <View style={styles.descriptionBox}>
              <IconSymbol name="star.fill" size={14} color={Colors[colorScheme].icon} />
              <ThemedText style={[styles.sectionContent, { color: Colors[colorScheme].icon, flex: 1 }]}>
                {kost.description || 'Lokasi strategis dekat dengan pusat kota dan akses transportasi umum.'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>Pilih Tipe Kamar</ThemedText>
            <View style={styles.roomList}>
              {kost.rooms?.map((room: any) => (
                <TouchableOpacity
                  key={room.id}
                  style={[styles.roomCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}
                  onPress={() => router.push({
                    pathname: '/kost/room/[roomId]',
                    params: { roomId: room.id, kostId: id }
                  })}
                >
                  <Image 
                    source={{ uri: room.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=300' }} 
                    style={styles.roomThumb} 
                  />
                  <View style={styles.roomInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.roomName}>{room.name}</ThemedText>
                    <ThemedText style={styles.availableText}>({room.available_rooms} Unit Tersedia)</ThemedText>
                    <ThemedText style={[styles.roomPrice, { color: Colors[colorScheme].tint }]}>
                      Rp {room.price_per_month?.toLocaleString('id-ID')} <ThemedText style={{ fontSize: 10 }}>/bln</ThemedText>
                    </ThemedText>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={Colors[colorScheme].icon} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Footer */}
      {isCustomer && (
        <View style={[styles.floatingFooter, { backgroundColor: Colors[colorScheme].surface }]}>
          <View style={styles.footerPrice}>
            <ThemedText style={styles.footerLabel}>Harga Mulai:</ThemedText>
            <ThemedText style={[styles.footerAmount, { color: Colors[colorScheme].text }]}>
              Rp {(kost.price_per_month)?.toLocaleString('id-ID')} <ThemedText style={styles.footerPeriod}>/bln</ThemedText>
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.footerChatButton, { borderColor: Colors[colorScheme].tint }]}
            onPress={async () => {
              try {
                const res = await api.post('/chat/start', { ownerId: kost.ownerId });
                router.push({
                  pathname: '/chat/[id]',
                  params: { id: res.data.id, partnerName: kost.owner?.name || 'Pemilik Kost' }
                });
              } catch (error) {
                console.error('Error starting chat:', error);
              }
            }}
          >
            <IconSymbol name="text.bubble.fill" size={22} color={Colors[colorScheme].tint} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.footerMainButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={() => {}} // Booking flow can go here
          >
            <ThemedText style={styles.footerMainText}>HUBUNGI PEMILIK</ThemedText>
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
  imageHeader: {
    position: 'relative',
    height: 400,
  },
  headerImage: {
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 20,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  backText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowRadius: 2,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#fff',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentCard: {
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    minHeight: 500,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  kostName: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingBox: {
    width: 54,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  descriptionBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  roomList: {
    gap: 12,
    marginTop: 8,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 15,
  },
  roomThumb: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '800',
  },
  availableText: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 2,
  },
  roomPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  floatingFooter: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 100,
  },
  footerPrice: {
    flex: 1,
    paddingLeft: 10,
  },
  footerLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  footerAmount: {
    fontSize: 15,
    fontWeight: '900',
  },
  footerPeriod: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
  },
  footerChatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  footerMainButton: {
    paddingHorizontal: 20,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerMainText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
});
