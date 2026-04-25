import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useOwnerStats } from '@/hooks/use-owner-stats';
import { styles } from './owner-dashboard.styles';

export default function OwnerDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  const {
    myKosts,
    pendingBookings,
    isLoading,
    refreshing,
    onRefresh,
    updateBookingStatus
  } = useOwnerStats();

  const handleUpdateStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateBookingStatus(id, status);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface, borderBottomColor: Colors[colorScheme].border }]}>
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
            <ThemedText type="title" style={{ fontSize: 24, lineHeight: 28, fontWeight: '800' }}>Dashboard Owner</ThemedText>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].surface, shadowColor: Colors[colorScheme].tint }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
              <IconSymbol name="house.fill" size={24} color={Colors[colorScheme].tint} />
            </View>
            <ThemedText type="title" style={{ fontSize: 28 }}>{myKosts.length}</ThemedText>
            <ThemedText style={{ color: Colors[colorScheme].icon, marginTop: 4 }}>Total Kost</ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].surface, shadowColor: Colors[colorScheme].success }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors[colorScheme].success + '15' }]}>
              <IconSymbol name="person.2.fill" size={24} color={Colors[colorScheme].success} />
            </View>
            <ThemedText type="title" style={{ fontSize: 28 }}>{pendingBookings.length}</ThemedText>
            <ThemedText style={{ color: Colors[colorScheme].icon, marginTop: 4 }}>Request Pending</ThemedText>
          </View>
        </View>

        {pendingBookings.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Request Sewa Baru</ThemedText>
            <View style={{ gap: 12 }}>
              {pendingBookings.map((booking) => (
                <View key={booking.id} style={[styles.bookingRequestCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
                  <View style={styles.bookingRequestHeader}>
                    <View>
                      <ThemedText type="defaultSemiBold">{booking.user?.name || 'Calon Penyewa'}</ThemedText>
                      <ThemedText style={{ color: Colors[colorScheme].icon, fontSize: 13 }}>{booking.kost?.name} - {booking.room?.name || 'Standard'}</ThemedText>
                    </View>
                    <ThemedText style={[styles.bookingPrice, { color: Colors[colorScheme].tint }]}>
                      Rp {booking.totalPrice?.toLocaleString('id-ID')}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.bookingDetails}>
                    <View style={styles.detailItem}>
                      <IconSymbol name="calendar" size={14} color={Colors[colorScheme].icon} />
                      <ThemedText style={{ fontSize: 12, color: Colors[colorScheme].icon }}>
                        Mulai: {new Date(booking.startDate).toLocaleDateString()} ({booking.durationMonths} bln)
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]} 
                      onPress={() => handleUpdateStatus(booking.id, 'REJECTED')}
                    >
                      <ThemedText style={{ color: '#991B1B', fontWeight: '700', fontSize: 13 }}>Tolak</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: Colors[colorScheme].tint }]} 
                      onPress={() => handleUpdateStatus(booking.id, 'APPROVED')}
                    >
                      <ThemedText style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Terima</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <ThemedText type="subtitle" style={styles.sectionTitle}>Kost Saya</ThemedText>
        
        {isLoading && !refreshing ? (
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} style={{ marginTop: 20 }} />
        ) : myKosts.length > 0 ? (
          <View style={{ gap: 16 }}>
            {myKosts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.kostItem, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}
                onPress={() => router.push(`/kost/${item.id}`)}
              >
                <Image 
                  source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200' }} 
                  style={styles.kostItemImage} 
                />
                <View style={{ flex: 1, padding: 12 }}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.name}</ThemedText>
                  <ThemedText style={{ color: Colors[colorScheme].icon, fontSize: 13 }}>{item.city}</ThemedText>
                  <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: '700', marginTop: 4 }}>
                    Rp {item.price_per_month?.toLocaleString('id-ID')}
                  </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme].icon} style={{ marginRight: 12 }} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.addButtonSticky, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={() => router.push('/kost/create')}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>+ Tambah Kost Lagi</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.emptyState, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
            <View style={[styles.emptyIconCircle, { backgroundColor: Colors[colorScheme].border }]}>
              <IconSymbol name="house.lodge" size={40} color={Colors[colorScheme].icon} />
            </View>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>Belum ada kost didaftarkan</ThemedText>
            <ThemedText style={{ color: Colors[colorScheme].icon, textAlign: 'center', marginBottom: 16 }}>
              Mulai daftarkan properti Anda dan dapatkan penyewa pertama hari ini.
            </ThemedText>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: Colors[colorScheme].tint + '15' }]}
              onPress={() => router.push('/kost/create')}
            >
              <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: '700' }}>+ Buat Listing Kost</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

