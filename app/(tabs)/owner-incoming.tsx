import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';

export default function OwnerIncomingBooking() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  const [incoming, setIncoming] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncoming = async () => {
    try {
      const response = await api.get('/booking/incoming');
      setIncoming(response.data);
    } catch (error) {
      console.error('Error fetching incoming bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIncoming();
  };

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.patch(`/booking/${id}/status`, { status });
      Alert.alert('Berhasil', `Booking telah di-${status.toLowerCase()}`);
      fetchIncoming();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengupdate status.');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface, borderBottomColor: Colors[colorScheme].border }]}>
        <ThemedText type="title" style={styles.headerTitle}>Booking Masuk</ThemedText>
      </View>

      {isLoading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : incoming.length > 0 ? (
        <FlatList
          data={incoming}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={[styles.bookingCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
              <View style={styles.cardHeader}>
                <View>
                  <ThemedText type="defaultSemiBold">{item.customer?.name || 'Customer'}</ThemedText>
                  <ThemedText style={{ fontSize: 13, color: Colors[colorScheme].icon }}>{item.kost?.name}</ThemedText>
                </View>
                {item.status !== 'PENDING' ? (
                  <View style={[styles.statusBadge, { backgroundColor: item.status === 'APPROVED' ? '#DEF7EC' : '#FDE8E8' }]}>
                    <ThemedText style={{ fontSize: 10, fontWeight: '700', color: item.status === 'APPROVED' ? '#03543F' : '#9B1C1C' }}>
                      {item.status}
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#B45309' }}>PENDING</ThemedText>
                )}
              </View>
              
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <IconSymbol name="calendar" size={14} color={Colors[colorScheme].icon} />
                  <ThemedText style={{ fontSize: 13, color: Colors[colorScheme].icon }}>
                    Mulai: {new Date(item.startDate).toLocaleDateString()} | {item.durationMonths} bln
                  </ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <IconSymbol name="creditcard.fill" size={14} color={Colors[colorScheme].tint} />
                  <ThemedText style={{ fontSize: 14, fontWeight: '700', color: Colors[colorScheme].tint }}>Total: Rp {item.totalPrice?.toLocaleString('id-ID')}</ThemedText>
                </View>
              </View>

              {item.status === 'PENDING' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#FDE8E8' }]} 
                    onPress={() => handleUpdateStatus(item.id, 'REJECTED')}
                  >
                    <ThemedText style={{ color: '#9B1C1C', fontSize: 13, fontWeight: '700' }}>Reject</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#DEF7EC' }]} 
                    onPress={() => handleUpdateStatus(item.id, 'APPROVED')}
                  >
                    <ThemedText style={{ color: '#03543F', fontSize: 13, fontWeight: '700' }}>Approve</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <View style={styles.content}>
          <View style={[styles.emptyCircle, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
            <IconSymbol name="bell.slash.fill" size={50} color={Colors[colorScheme].tint} />
          </View>
          <ThemedText type="subtitle" style={styles.emptyTextTitle}>Belum ada booking</ThemedText>
          <ThemedText style={[styles.emptyText, { color: Colors[colorScheme].icon }]}>
            Saat ini tidak ada permintaan booking baru dari pencari kost.
          </ThemedText>
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ marginTop: 20 }} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTextTitle: {
    marginBottom: 8,
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    padding: 20,
    gap: 16,
  },
  bookingCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBody: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
