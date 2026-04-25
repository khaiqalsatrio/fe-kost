import React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

import { useKostDetail } from '@/hooks/use-kost-detail';
import { styles } from './kost-detail.styles';

export default function KostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const { kost, isLoading, startChat } = useKostDetail(id as string);

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
            onPress={() => startChat(kost.ownerId, kost.owner?.name)}
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

