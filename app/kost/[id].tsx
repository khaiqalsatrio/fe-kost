import React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function KostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.imagePlaceholder}>
          <ThemedText style={styles.imageText}>Gambar Kost</ThemedText>
        </View>

        <View style={styles.infoSection}>
          <ThemedText type="title">Nama Kost {id}</ThemedText>
          <ThemedText style={styles.location}>Jakarta Selatan, Indonesia</ThemedText>
          
          <View style={styles.priceContainer}>
            <ThemedText type="subtitle">Rp 1.500.000</ThemedText>
            <ThemedText style={styles.perMonth}>/ bulan</ThemedText>
          </View>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold">Deskripsi</ThemedText>
          <ThemedText style={styles.description}>
            Kost nyaman dengan fasilitas lengkap. Strategis dekat perkantoran dan transportasi umum.
          </ThemedText>

          <View style={styles.divider} />

          <ThemedText type="defaultSemiBold">Fasilitas</ThemedText>
          <View style={styles.facilities}>
            <View style={styles.facilityBadge}><ThemedText>WiFi</ThemedText></View>
            <View style={styles.facilityBadge}><ThemedText>AC</ThemedText></View>
            <View style={styles.facilityBadge}><ThemedText>Km Dalam</ThemedText></View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookingButton}
          onPress={() => router.push(`/booking/${id}`)}
        >
          <ThemedText style={styles.bookingButtonText}>Booking Sekarang</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#888',
  },
  infoSection: {
    padding: 20,
  },
  location: {
    color: '#666',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  perMonth: {
    marginLeft: 5,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  description: {
    marginTop: 5,
    lineHeight: 20,
    color: '#444',
  },
  facilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  facilityBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookingButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
