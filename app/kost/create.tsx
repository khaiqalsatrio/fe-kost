import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CreateKostScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    price: '',
  });

  const handleSubmit = () => {
    console.log('Creating kost:', formData);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>Tambah Kost Baru</ThemedText>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nama Kost"
            value={formData.name}
            onChangeText={(v) => setFormData({ ...formData, name: v })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Deskripsi"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(v) => setFormData({ ...formData, description: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Alamat Lengkap"
            value={formData.address}
            onChangeText={(v) => setFormData({ ...formData, address: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Kota"
            value={formData.city}
            onChangeText={(v) => setFormData({ ...formData, city: v })}
          />
          <TextInput
            style={styles.input}
            placeholder="Harga per bulan (Rp)"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(v) => setFormData({ ...formData, price: v })}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>Simpan Kost</ThemedText>
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
  title: {
    marginBottom: 20,
  },
  form: {
    gap: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#34C759',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
