import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OwnerIncomingBooking() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface, borderBottomColor: Colors[colorScheme].border }]}>
        <ThemedText type="title" style={styles.headerTitle}>Booking Masuk</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={[styles.emptyCircle, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
          <IconSymbol name="bell.slash.fill" size={50} color={Colors[colorScheme].tint} />
        </View>
        <ThemedText type="subtitle" style={styles.emptyTextTitle}>Belum ada booking</ThemedText>
        <ThemedText style={[styles.emptyText, { color: Colors[colorScheme].icon }]}>
          Saat ini tidak ada permintaan booking baru dari pencari kost.
        </ThemedText>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTextTitle: {
    marginBottom: 8,
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
