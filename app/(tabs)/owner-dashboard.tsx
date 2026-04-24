import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OwnerDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface, borderBottomColor: Colors[colorScheme].border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{
            width: 50, height: 50, backgroundColor: '#fff', borderRadius: 14,
            justifyContent: 'center', alignItems: 'center',
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3
          }}>
            <Image
              source={require('@/assets/images/logo_kost.jpg')}
              style={{ width: 34, height: 34 }}
              resizeMode="contain"
            />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <ThemedText type="title" style={{ fontSize: 24, lineHeight: 28, fontWeight: '800' }}>Dashboard Owner</ThemedText>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].surface, shadowColor: Colors[colorScheme].tint }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
              <IconSymbol name="house.fill" size={24} color={Colors[colorScheme].tint} />
            </View>
            <ThemedText type="title" style={{ fontSize: 28 }}>0</ThemedText>
            <ThemedText style={{ color: Colors[colorScheme].icon, marginTop: 4 }}>Total Kost</ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].surface, shadowColor: Colors[colorScheme].success }]}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors[colorScheme].success + '15' }]}>
              <IconSymbol name="person.2.fill" size={24} color={Colors[colorScheme].success} />
            </View>
            <ThemedText type="title" style={{ fontSize: 28 }}>0</ThemedText>
            <ThemedText style={{ color: Colors[colorScheme].icon, marginTop: 4 }}>Penyewa Aktif</ThemedText>
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Kost Saya</ThemedText>
        <View style={[styles.emptyState, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
          <View style={[styles.emptyIconCircle, { backgroundColor: Colors[colorScheme].border }]}>
            <IconSymbol name="house.lodge" size={40} color={Colors[colorScheme].icon} />
          </View>
          <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>Belum ada kost didaftarkan</ThemedText>
          <ThemedText style={{ color: Colors[colorScheme].icon, textAlign: 'center', marginBottom: 16 }}>
            Mulai daftarkan properti Anda dan dapatkan penyewa pertama hari ini.
          </ThemedText>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: Colors[colorScheme].tint + '15' }]}
            onPress={() => router.push('/kost/create')}
          >
            <ThemedText style={{ color: Colors[colorScheme].tint, fontWeight: '700' }}>+ Buat Listing Kost</ThemedText>
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
