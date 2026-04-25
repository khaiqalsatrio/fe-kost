import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const nameInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), backgroundColor: Colors[colorScheme].surface }]}>
        <ThemedText type="title" style={styles.headerTitle}>Profile</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: Colors[colorScheme].surface, shadowColor: Colors[colorScheme].tint }]}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: Colors[colorScheme].tint }]}>
            <ThemedText style={styles.avatarText}>{nameInitial}</ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText type="subtitle" style={styles.nameText}>{user?.name || 'User'}</ThemedText>
            <ThemedText style={{ color: Colors[colorScheme].icon }}>{user?.email || 'email@example.com'}</ThemedText>
            <View style={[styles.badge, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
              <ThemedText style={[styles.badgeText, { color: Colors[colorScheme].tint }]}>{user?.role || 'PENGGUNA'}</ThemedText>
            </View>
          </View>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Akun Saya</ThemedText>
        <View style={[styles.menuCard, { backgroundColor: Colors[colorScheme].surface, borderColor: Colors[colorScheme].border }]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: Colors[colorScheme].border }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
              <IconSymbol name="person.crop.circle" size={20} color={Colors[colorScheme].tint} />
            </View>
            <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: Colors[colorScheme].border }]}
            onPress={toggleTheme}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
              <IconSymbol name={mode === 'dark' ? 'moon.fill' : 'sun.max.fill'} size={20} color={Colors[colorScheme].tint} />
            </View>
            <ThemedText style={styles.menuText}>Dark Mode</ThemedText>
            <View style={[styles.switchTrack, { backgroundColor: mode === 'dark' ? Colors[colorScheme].tint : Colors[colorScheme].icon + '30' }]}>
              <View style={[styles.switchThumb, { marginLeft: mode === 'dark' ? 20 : 2 }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
               <IconSymbol name="gear" size={20} color={Colors[colorScheme].tint} />
            </View>
            <ThemedText style={styles.menuText}>Pengaturan</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={Colors[colorScheme].icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: Colors[colorScheme].error + '10', borderColor: Colors[colorScheme].error + '30' }]} 
          onPress={handleLogout}
        >
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={Colors[colorScheme].error} />
          <ThemedText style={[styles.logoutText, { color: Colors[colorScheme].error }]}>Logout</ThemedText>
        </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    gap: 16,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    fontSize: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
