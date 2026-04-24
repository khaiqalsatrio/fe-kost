import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const DUMMY_KOST = [
  { 
    id: '1', 
    name: 'Kost Exclusive Senopati', 
    price: '3.200.000', 
    city: 'Jakarta Selatan',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500',
    facilities: ['AC', 'WiFi', 'Km Dalam']
  },
  { 
    id: '2', 
    name: 'Kost Mawar Kemang', 
    price: '2.500.000', 
    city: 'Jakarta Selatan',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d344?auto=format&fit=crop&q=80&w=500',
    facilities: ['AC', 'WiFi']
  },
  { 
    id: '3', 
    name: 'Kost Anggrek UI', 
    price: '1.500.000', 
    city: 'Depok',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=500',
    facilities: ['WiFi', 'Dapur']
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.headerTop}>
          <View>
            <ThemedText style={{ color: Colors[colorScheme].icon }}>Selamat Datang,</ThemedText>
            <ThemedText type="title" style={styles.greeting}>Pencari Kost</ThemedText>
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

      <FlatList
        data={DUMMY_KOST}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: Colors[colorScheme].surface, shadowColor: '#000' }]}
            onPress={() => router.push(`/kost/${item.id}`)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
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
                {item.facilities.map((fac, idx) => (
                  <View key={idx} style={[styles.facilityBadge, { backgroundColor: Colors[colorScheme].background }]}>
                    <ThemedText style={[styles.facilityText, { color: Colors[colorScheme].icon }]}>{fac}</ThemedText>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />
              
              <View style={styles.priceFooter}>
                <View style={styles.priceContainer}>
                  <ThemedText type="subtitle" style={[styles.price, { color: Colors[colorScheme].tint }]}>Rp {item.price}</ThemedText>
                  <ThemedText style={[styles.perMonth, { color: Colors[colorScheme].icon }]}>/bln</ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
