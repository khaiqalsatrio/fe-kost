import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useBookings } from '@/hooks/use-bookings';

export default function HistoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  const { bookings, isLoading, refreshing, onRefresh } = useBookings();

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface, borderBottomColor: Colors[colorScheme].border }]}>
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
          <ThemedText type="title" style={styles.headerTitle}>Riwayat Booking</ThemedText>
        </View>
      </View>
      
      {isLoading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={[styles.bookingCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
              <View style={styles.cardHeader}>
                <ThemedText type="defaultSemiBold">{item.kost?.name || 'Kost Property'}</ThemedText>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'APPROVED' ? '#DEF7EC' : item.status === 'REJECTED' ? '#FDE8E8' : '#FEF3C7' }]}>
                  <ThemedText style={{ fontSize: 10, fontWeight: '700', color: item.status === 'APPROVED' ? '#03543F' : item.status === 'REJECTED' ? '#9B1C1C' : '#92400E' }}>
                    {item.status}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <IconSymbol name="calendar" size={14} color={Colors[colorScheme].icon} />
                  <ThemedText style={{ fontSize: 13, color: Colors[colorScheme].icon }}>{new Date(item.startDate).toLocaleDateString()} ({item.durationMonths} bln)</ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <IconSymbol name="creditcard.fill" size={14} color={Colors[colorScheme].tint} />
                  <ThemedText style={{ fontSize: 14, fontWeight: '700', color: Colors[colorScheme].tint }}>Rp {item.totalPrice?.toLocaleString('id-ID')}</ThemedText>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.content}>
          <View style={[styles.emptyCircle, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
            <IconSymbol name="clock.arrow.circlepath" size={60} color={Colors[colorScheme].tint} />
          </View>
          <ThemedText type="subtitle" style={styles.emptyTextTitle}>Belum ada riwayat</ThemedText>
          <ThemedText style={[styles.emptyText, { color: Colors[colorScheme].icon }]}>
            Anda belum pernah melakukan pemesanan kost. Mulai cari dan booking kost idaman Anda.
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTextTitle: {
    marginBottom: 8,
    fontSize: 22,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
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
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
