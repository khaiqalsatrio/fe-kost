import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const DUMMY_KOST = [
  { id: '1', name: 'Kost Melati', price: '1.200.000', city: 'Jakarta Selatan' },
  { id: '2', name: 'Kost Mawar', price: '1.500.000', city: 'Jakarta Barat' },
  { id: '3', name: 'Kost Anggrek', price: '900.000', city: 'Depok' },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Cari Kost</ThemedText>
        <TextInput 
          style={styles.searchInput}
          placeholder="Cari berdasarkan kota..."
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={DUMMY_KOST}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/kost/${item.id}`)}
          >
            <View style={styles.imagePlaceholder}>
              <ThemedText style={styles.imageText}>Gambar</ThemedText>
            </View>
            <View style={styles.cardInfo}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <ThemedText style={styles.city}>{item.city}</ThemedText>
              <ThemedText type="subtitle" style={styles.price}>Rp {item.price}/bln</ThemedText>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    gap: 15,
  },
  searchInput: {
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#888',
  },
  cardInfo: {
    padding: 15,
  },
  city: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    marginTop: 8,
    color: '#007AFF',
  },
});
