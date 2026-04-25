import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';

export default function NewBookingScreen() {
  const { kostId, roomId, kostName, roomName, price } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = Number(price) * Number(duration);

  const handleBooking = async () => {
    if (!startDate || !duration) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/booking', {
        kostId,
        roomId: roomId || undefined,
        startDate: new Date(startDate).toISOString(),
        durationMonths: Number(duration),
      });

      Alert.alert('Sukses', 'Pengajuan sewa berhasil dikirim! Silakan tunggu konfirmasi owner.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/history') }
      ]);
    } catch (error: any) {
      console.error('Booking error:', error);
      const message = error.response?.data?.message || 'Gagal melakukan pemesanan.';
      Alert.alert('Error', Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Konfirmasi Sewa',
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        )
      }} />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>
        <View style={[styles.infoCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>{kostName}</ThemedText>
          <ThemedText style={{ color: Colors[colorScheme].icon }}>{roomName}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Tanggal Mulai</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
            <IconSymbol name="calendar" size={20} color={Colors[colorScheme].icon} />
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text }]}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors[colorScheme].icon}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Durasi Sewa (Bulan)</ThemedText>
          <View style={styles.durationRow}>
            {[1, 3, 6, 12].map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.durationChip,
                  { 
                    backgroundColor: Number(duration) === m ? Colors[colorScheme].tint : Colors[colorScheme].surface,
                    borderColor: Colors[colorScheme].border 
                  }
                ]}
                onPress={() => setDuration(m.toString())}
              >
                <ThemedText style={{ color: Number(duration) === m ? '#fff' : Colors[colorScheme].text, fontWeight: '700' }}>
                  {m} Bln
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border, marginTop: 12 }]}>
            <TextInput
              style={[styles.input, { color: Colors[colorScheme].text, paddingLeft: 0 }]}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="Jumlah bulan lainnya..."
              placeholderTextColor={Colors[colorScheme].icon}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
          <View style={styles.summaryRow}>
            <ThemedText style={{ color: Colors[colorScheme].icon }}>Harga Kamar</ThemedText>
            <ThemedText>Rp {Number(price).toLocaleString('id-ID')}/bln</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={{ color: Colors[colorScheme].icon }}>Durasi</ThemedText>
            <ThemedText>{duration} Bulan</ThemedText>
          </View>
          <View style={[styles.divider, { marginVertical: 12 }]} />
          <View style={styles.summaryRow}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>Total Pembayaran</ThemedText>
            <ThemedText type="title" style={{ fontSize: 18, color: Colors[colorScheme].tint }}>
              Rp {totalPrice.toLocaleString('id-ID')}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: Colors[colorScheme].tint, opacity: isLoading ? 0.7 : 1 }]}
          onPress={handleBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.bookButtonText}>Konfirmasi & Pesan Kost</ThemedText>
          )}
        </TouchableOpacity>
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
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationChip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
