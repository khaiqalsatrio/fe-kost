import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}>
          <ThemedText style={styles.avatarText}>JD</ThemedText>
        </View>
        <ThemedText type="subtitle">John Doe</ThemedText>
        <ThemedText>john.doe@example.com</ThemedText>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>CUSTOMER</ThemedText>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <ThemedText>Edit Profile</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <ThemedText>Settings</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutButton]} 
          onPress={() => router.replace('/(auth)/login')}
        >
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileSection: {
    alignItems: 'center',
    padding: 30,
    gap: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 5,
  },
  badgeText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menu: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 20,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});
