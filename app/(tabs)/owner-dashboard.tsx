import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OwnerDashboard() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Dashboard Pemilik</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/kost/create')}
        >
          <ThemedText style={styles.addButtonText}>+ Kost Baru</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <ThemedText type="subtitle">0</ThemedText>
            <ThemedText>Total Kost</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText type="subtitle">0</ThemedText>
            <ThemedText>Penyewa</ThemedText>
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Kost Saya</ThemedText>
        <View style={styles.emptyState}>
          <ThemedText>Belum ada kost yang didaftarkan.</ThemedText>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
