import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useKosts } from '@/hooks/use-kosts';
import { styles } from './index.styles';

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  // Clean Logic using Custom Hooks
  useAuthRedirect();
  const { kosts, isLoading, refreshing, onRefresh } = useKosts();

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[
        styles.header,
        {
          paddingTop: insets.top + 10,
          backgroundColor: Colors[colorScheme].background,
          borderBottomColor: Colors[colorScheme].border,
          borderBottomWidth: 1
        }
      ]}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{
              width: 44, height: 44, backgroundColor: '#fff', borderRadius: 12,
              justifyContent: 'center', alignItems: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
              borderWidth: 1, borderColor: '#f3f4f6'
            }}>
              <Image
                source={require('@/assets/images/logo_kost.jpg')}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </View>
            <ThemedText type="title" style={styles.headerTitle}>Kost Aja</ThemedText>
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => router.push('/profile')}
          >
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchWrapper, { backgroundColor: Colors[colorScheme].surface, shadowColor: '#000' }]}>
          <IconSymbol name="magnifyingglass" size={20} color={Colors[colorScheme].icon} />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
            placeholder="Cari lokasi atau nama kost..."
            placeholderTextColor={Colors[colorScheme].icon}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerIndicator}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </View>
      ) : (
        <FlatList
          data={kosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: Colors[colorScheme].surface }]}
              onPress={() => router.push(`/kost/${item.id}`)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=500' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardInfo}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold" style={styles.kostName}>{item.name}</ThemedText>
                    <ThemedText style={[styles.locationText, { color: Colors[colorScheme].icon }]}>
                      {item.city}, Indonesia
                    </ThemedText>
                  </View>
                  <View style={styles.ratingBadge}>
                    <ThemedText style={styles.ratingValue}>4.8</ThemedText>
                    <IconSymbol name="star.fill" size={12} color="#F59E0B" />
                  </View>
                </View>

                <View style={styles.facilitiesRow}>
                  {item.facilities?.includes('WiFi') && (
                    <View style={[styles.tag, { backgroundColor: '#E0F2F1' }]}>
                      <IconSymbol name="safari.fill" size={14} color="#00796B" />
                      <ThemedText style={[styles.tagText, { color: '#00796B' }]}>WIFI</ThemedText>
                    </View>
                  )}
                  {item.facilities?.includes('Kasur') && (
                    <View style={[styles.tag, { backgroundColor: '#E3F2FD' }]}>
                      <IconSymbol name="bed.double.fill" size={14} color="#1976D2" />
                      <ThemedText style={[styles.tagText, { color: '#1976D2' }]}>Kasur</ThemedText>
                    </View>
                  )}
                </View>

                <ThemedText style={[styles.priceTag, { color: Colors[colorScheme].tint }]}>
                  Rp {item.price_per_month?.toLocaleString('id-ID')} <ThemedText style={styles.pricePeriod}>/ bln</ThemedText>
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ThemedView>
  );
}

