import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/utils/api';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Tolong isi semua bidang');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      alert('Registrasi berhasil! Silakan login.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      alert(Array.isArray(message) ? message.join('\n') : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000' }}
      style={styles.container}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center', padding: 20 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.loginCard, { backgroundColor: '#fff' }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <IconSymbol name="person.badge.plus.fill" size={30} color="#111" />
              </View>
              <ThemedText type="title" style={styles.title}>Daftar Akun</ThemedText>
              <ThemedText style={styles.subtitle}>Create an account to find your dream room</ThemedText>
            </View>

            <View style={styles.inputGroup}>
              <View>
                <ThemedText style={styles.label}>Pilih Peran</ThemedText>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'CUSTOMER' ? { borderColor: Colors[colorScheme].tint, backgroundColor: '#F3F4F6' } : { borderColor: '#E5E7EB' }
                    ]}
                    onPress={() => setRole('CUSTOMER')}
                  >
                    <ThemedText style={[styles.roleText, role === 'CUSTOMER' && { color: Colors[colorScheme].tint }]}>Pencari</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'OWNER' ? { borderColor: Colors[colorScheme].tint, backgroundColor: '#F3F4F6' } : { borderColor: '#E5E7EB' }
                    ]}
                    onPress={() => setRole('OWNER')}
                  >
                    <ThemedText style={[styles.roleText, role === 'OWNER' && { color: Colors[colorScheme].tint }]}>Pemilik</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <ThemedText style={styles.label}>Nama Lengkap</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View>
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan email Anda"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View>
                <ThemedText style={styles.label}>Password</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan password Anda"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: Colors[colorScheme].tint, marginTop: 20 }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.loginButtonText}>Daftar Sekarang</ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => router.back()}>
              <ThemedText style={styles.bottomText}>
                Sudah punya akun? <ThemedText style={[styles.linkText, { color: Colors[colorScheme].tint }]}>Login</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  loginCard: {
    borderRadius: 30,
    padding: 30,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputGroup: {
    gap: 12,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#111',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  loginButton: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#4B5563',
  },
  linkText: {
    fontWeight: 'bold',
  },
});

