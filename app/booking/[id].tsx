import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BookingFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('1');

  const handleBooking = () => {
    console.log('Booking request:', { id, startDate, duration });
    router.replace('/(tabs)/history');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title">Form Booking</ThemedText>
        <ThemedText style={styles.subtitle}>Kost ID: {id}</ThemedText>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Tanggal Mulai</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Durasi (Bulan)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 3"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View style={styles.summaryCard}>
            <ThemedText type="defaultSemiBold">Ringkasan Pembayaran</ThemedText>
            <View style={styles.summaryRow}>
              <ThemedText>Harga Sewa</ThemedText>
              <ThemedText>Rp 1.500.000</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText>Total (x{duration})</ThemedText>
              <ThemedText type="subtitle">Rp {1500000 * (parseInt(duration) || 1)}</ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleBooking}>
            <ThemedText style={styles.buttonText}>Konfirmasi Booking</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  subtitle: {
    marginBottom: 20,
    color: '#666',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    gap: 10,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
