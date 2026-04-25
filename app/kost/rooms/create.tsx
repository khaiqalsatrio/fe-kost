import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';

export default function CreateRoomScreen() {
  const { kostId, roomId, roomData } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const isEditing = !!roomId;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_month: '',
    total_rooms: '',
    available_rooms: '',
    facilities: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && roomData) {
      const data = JSON.parse(roomData as string);
      setFormData({
        name: data.name,
        description: data.description || '',
        price_per_month: data.price_per_month.toString(),
        total_rooms: data.total_rooms.toString(),
        available_rooms: data.available_rooms.toString(),
        facilities: data.facilities?.join(', ') || '',
      });
    }
  }, [isEditing, roomData]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.price_per_month || !formData.total_rooms) {
      Alert.alert('Error', 'Nama, Harga, dan Total Kamar harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price_per_month: Number(formData.price_per_month),
        total_rooms: Number(formData.total_rooms),
        available_rooms: Number(formData.available_rooms || formData.total_rooms),
        facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f),
      };

      if (isEditing) {
        await api.patch(`/kost/rooms/${roomId}`, payload);
        alert('Tipe kamar berhasil diperbarui');
      } else {
        await api.post('/kost/rooms', payload);
        alert('Tipe kamar berhasil ditambahkan');
      }
      
      router.back();
    } catch (error: any) {
      console.error('Save room error:', error);
      const message = error.response?.data?.message || 'Gagal menyimpan tipe kamar.';
      alert(Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ 
        title: isEditing ? 'Edit Tipe Kamar' : 'Tambah Tipe Kamar',
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        )
      }} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nama Tipe Kamar</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="Contoh: Kamar AC Single"
                value={formData.name}
                onChangeText={(v) => setFormData({ ...formData, name: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Harga per Bulan (Rp)</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="1500000"
                keyboardType="numeric"
                value={formData.price_per_month}
                onChangeText={(v) => setFormData({ ...formData, price_per_month: v })}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.label}>Total Unit</ThemedText>
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                  placeholder="10"
                  keyboardType="numeric"
                  value={formData.total_rooms}
                  onChangeText={(v) => setFormData({ ...formData, total_rooms: v })}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.label}>Tersedia</ThemedText>
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                  placeholder="10"
                  keyboardType="numeric"
                  value={formData.available_rooms}
                  onChangeText={(v) => setFormData({ ...formData, available_rooms: v })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Fasilitas (pisahkan dengan koma)</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="AC, Kamar Mandi Dalam, WiFi"
                value={formData.facilities}
                onChangeText={(v) => setFormData({ ...formData, facilities: v })}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Deskripsi (Opsional)</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                placeholder="Detail ukuran kamar, perabotan, dll."
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
                <ThemedText style={styles.submitButtonText}>
                  {isEditing ? 'Update Tipe Kamar' : 'Simpan Tipe Kamar'}
                </ThemedText>
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
  scroll: {
    padding: 20,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
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
