import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function CreateKostScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    price: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.city || !formData.price) {
      alert('Mohon isi semua field wajib');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/kost', {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        price_per_month: Number(formData.price),
        facilities: ['WiFi', 'Kasur'], 
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'],
      });
      alert('Kost berhasil dipublikasikan!');
      await refreshUser();
      router.replace('/owner-dashboard');
    } catch (error: any) {
      console.error('Error creating kost:', error);
      const message = error.response?.data?.message || 'Gagal membuat kost. Silakan coba lagi.';
      alert(Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Tambah Kost</ThemedText>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 20) }]} showsVerticalScrollIndicator={false}>
          
          <ThemedText style={[styles.sectionDesc, { color: Colors[colorScheme].icon }]}>
            Isi detail informasi properti kost Anda untuk mulai menarik penyewa.
          </ThemedText>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nama Kost</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="Contoh: Kost Exclusive Melati"
                placeholderTextColor={Colors[colorScheme].icon}
                value={formData.name}
                onChangeText={(v) => setFormData({ ...formData, name: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Alamat Lengkap</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="Jalan, Nomor, RT/RW..."
                placeholderTextColor={Colors[colorScheme].icon}
                value={formData.address}
                onChangeText={(v) => setFormData({ ...formData, address: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Kota</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="Contoh: Jakarta Selatan"
                placeholderTextColor={Colors[colorScheme].icon}
                value={formData.city}
                onChangeText={(v) => setFormData({ ...formData, city: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Harga per Bulan (Rp)</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="Contoh: 1500000"
                placeholderTextColor={Colors[colorScheme].icon}
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(v) => setFormData({ ...formData, price: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Deskripsi Singkat</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="Fasilitas, keunggulan lokal, dll."
                placeholderTextColor={Colors[colorScheme].icon}
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(v) => setFormData({ ...formData, description: v })}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: Colors[colorScheme].tint, opacity: isLoading ? 0.7 : 1 }]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.submitButtonText}>Simpan & Publikasikan</ThemedText>
              )}
            </TouchableOpacity>
          </View>
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
  sectionDesc: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
