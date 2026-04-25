import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export default function RoomDetailScreen() {
  const { roomId, kostId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const [room, setRoom] = useState<any>(null);
  const [kost, setKost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Kita ambil detail kost untuk mendapatkan data kamar yang spesifik
      const response = await api.get(`/kost/${kostId}`);
      setKost(response.data);
      const foundRoom = response.data.rooms?.find((r: any) => r.id === roomId);
      setRoom(foundRoom);
    } catch (error) {
      console.error('Error fetching room detail:', error);
      Alert.alert('Error', 'Gagal memuat detail kamar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roomId, kostId]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      </ThemedView>
    );
  }

  if (!room) return null;

  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: room.name,
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity 
            style={[styles.backButton, { marginTop: insets.top }]} 
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#111" />
          </TouchableOpacity>
        )
      }} />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Image 
          source={{ uri: room.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000' }} 
          style={styles.headerImage} 
        />

        <View style={[styles.content, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="title" style={styles.title}>{room.name}</ThemedText>
          <ThemedText style={{ color: Colors[colorScheme].tint, fontSize: 18, fontWeight: '700', marginBottom: 20 }}>
            Rp {room.price_per_month?.toLocaleString('id-ID')} / bulan
          </ThemedText>

          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: Colors[colorScheme].surface }]}>
              <IconSymbol name="bed.double.fill" size={20} color={Colors[colorScheme].tint} />
              <ThemedText style={styles.statText}>{room.available_rooms} Kamar Sisa</ThemedText>
            </View>
            <View style={[styles.statItem, { backgroundColor: Colors[colorScheme].surface }]}>
              <IconSymbol name="person.2.fill" size={20} color={Colors[colorScheme].tint} />
              <ThemedText style={styles.statText}>Putra/Putri</ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Deskripsi Kamar</ThemedText>
          <ThemedText style={[styles.description, { color: Colors[colorScheme].icon }]}>
            {room.description || 'Tidak ada deskripsi tambahan untuk tipe kamar ini.'}
          </ThemedText>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Fasilitas Kamar</ThemedText>
          <View style={styles.facilities}>
            {room.facilities?.map((fac: string, idx: number) => (
              <View key={idx} style={[styles.facilityItem, { backgroundColor: Colors[colorScheme].surface }]}>
                <IconSymbol name="checkmark.seal.fill" size={18} color={Colors[colorScheme].success} />
                <ThemedText style={styles.facilityText}>{fac}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {isCustomer && (
        <View style={[styles.footer, { backgroundColor: Colors[colorScheme].surface, paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity 
            style={[styles.chatButton, { borderColor: Colors[colorScheme].tint }]}
            onPress={async () => {
              try {
                const res = await api.post('/chat/start', { ownerId: kost?.ownerId });
                router.push({
                  pathname: '/chat/[id]',
                  params: { id: res.data.id, partnerName: kost?.owner?.name || 'Pemilik Kost' }
                });
              } catch (error) {
                console.error('Error starting chat:', error);
                alert('Gagal memulai chat dengan pemilik');
              }
            }}
          >
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={20} color={Colors[colorScheme].tint} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.bookingButton, { backgroundColor: Colors[colorScheme].tint, flex: 1, marginLeft: 16 }]}
            onPress={() => router.push({
              pathname: '/booking/new',
              params: {
                kostId: kostId,
                roomId: room.id,
                kostName: kost?.name,
                roomName: room.name,
                price: room.price_per_month
              }
            })}
          >
            <ThemedText style={styles.bookingButtonText}>Lanjutkan Booking</ThemedText>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  content: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
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
    gap: 10,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  facilityText: {
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
