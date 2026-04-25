import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';

export default function ManageRoomsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/kost/${id}`);
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  const handleDeleteRoom = async (roomId: string) => {
    Alert.alert(
      'Hapus Tipe Kamar',
      'Apakah Anda yakin ingin menghapus tipe kamar ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/kost/rooms/${roomId}`);
              alert('Tipe kamar berhasil dihapus');
              fetchRooms();
            } catch (error) {
              console.error('Delete room error:', error);
              alert('Gagal menghapus tipe kamar');
            }
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{
        title: 'Kelola Kamar',
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/kost/rooms/create', params: { kostId: id } })}
            style={{ marginRight: 10 }}
          >
            <IconSymbol name="plus.circle.fill" size={24} color={Colors[colorScheme].tint} />
          </TouchableOpacity>
        )
      }} />

      {isLoading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <ThemedText style={{ color: Colors[colorScheme].icon, marginBottom: 20 }}>
            Daftar tipe kamar yang tersedia di properti kost Anda.
          </ThemedText>

          {rooms.length > 0 ? (
            <View style={{ gap: 16 }}>
              {rooms.map((room: any) => {
                return (
                  <View key={room.id} style={[styles.roomCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
                    <View style={styles.roomInfo}>
                      <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>{room.name}</ThemedText>
                      <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: '700', marginTop: 4 }}>
                        Rp {room.price_per_month?.toLocaleString('id-ID')}/bln
                      </ThemedText>
                      <ThemedText style={{ color: Colors[colorScheme].icon, fontSize: 13, marginTop: 8 }}>
                        {room.available_rooms} dari {room.total_rooms} kamar tersedia
                      </ThemedText>
                    </View>

                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: Colors[colorScheme].background }]}
                        onPress={() => router.push({ pathname: '/kost/rooms/create', params: { kostId: id, roomId: room.id, roomData: JSON.stringify(room) } })}
                      >
                        <IconSymbol name="pencil" size={18} color={Colors[colorScheme].icon} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.iconButton, { backgroundColor: '#FEE2E2' }]}
                        onPress={() => handleDeleteRoom(room.id)}
                      >
                        <IconSymbol name="trash.fill" size={18} color="#991B1B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="bed.double.fill" size={60} color={Colors[colorScheme].border} />
              <ThemedText style={{ color: Colors[colorScheme].icon, marginTop: 16, textAlign: 'center' }}>
                Belum ada tipe kamar. Klik tombol di bawah untuk menambah.
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: Colors[colorScheme].tint, bottom: insets.bottom + 20 }]}
        onPress={() => router.push({ pathname: '/kost/rooms/create', params: { kostId: id } })}
      >
        <IconSymbol name="plus" size={30} color="#fff" />
        <ThemedText style={{ color: '#fff', fontWeight: 'bold', marginLeft: 8 }}>Tambah Kamar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
  },
  roomCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roomInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    padding: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
