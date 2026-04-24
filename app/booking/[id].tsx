import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function BookingFormScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('1');

  const basePrice = 1500000;
  const numDur = parseInt(duration) || 1;
  const totalPrice = basePrice * numDur;

  const handleBooking = () => {
    console.log('Booking request:', { id, startDate, duration });
    router.replace('/(tabs)/history');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Form Booking</ThemedText>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 20) }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.infoCard, { backgroundColor: Colors[colorScheme].tint + '10', borderColor: Colors[colorScheme].tint }]}>
             <IconSymbol name="info.circle.fill" size={24} color={Colors[colorScheme].tint} />
             <View style={{ flex: 1 }}>
               <ThemedText style={{ fontWeight: '600' }}>Kost Exclusive {id}</ThemedText>
               <ThemedText style={{ fontSize: 13, color: Colors[colorScheme].icon }}>Pastikan data sewa yang Anda masukkan sudah benar.</ThemedText>
             </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Tanggal Mulai</ThemedText>
              <View style={styles.inputWrapper}>
                <IconSymbol name="calendar" size={20} color={Colors[colorScheme].icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors[colorScheme].icon}
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Durasi Sewa (Bulan)</ThemedText>
              <View style={styles.inputWrapper}>
                <IconSymbol name="clock.fill" size={20} color={Colors[colorScheme].icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                  placeholder="Berapa bulan? (Contoh: 3)"
                  placeholderTextColor={Colors[colorScheme].icon}
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </View>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
            <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>Ringkasan Pembayaran</ThemedText>
            
            <View style={styles.summaryRow}>
              <ThemedText style={{ color: Colors[colorScheme].icon }}>Harga Satuan</ThemedText>
              <ThemedText style={{ fontWeight: '500' }}>Rp 1.500.000</ThemedText>
            </View>
            
            <View style={styles.summaryRow}>
              <ThemedText style={{ color: Colors[colorScheme].icon }}>Durasi</ThemedText>
              <ThemedText style={{ fontWeight: '500' }}>{numDur} Bulan</ThemedText>
            </View>
            
            <View style={[styles.summaryDivider, { backgroundColor: Colors[colorScheme].border }]} />
            
            <View style={styles.summaryRow}>
              <ThemedText type="defaultSemiBold">Total Pembayaran</ThemedText>
              <ThemedText type="subtitle" style={[styles.totalAmount, { color: Colors[colorScheme].tint }]}>
                Rp {totalPrice.toLocaleString('id-ID')}
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} onPress={handleBooking}>
            <ThemedText style={styles.buttonText}>Konfirmasi & Pesan Kost</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
  },
  scroll: {
    padding: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  formContainer: {
    gap: 20,
    marginBottom: 30,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    marginBottom: 30,
    borderStyle: 'dashed',
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 4,
  },
  totalAmount: {
    fontSize: 22,
  },
  button: {
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
