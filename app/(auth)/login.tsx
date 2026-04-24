import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER');

  const handleLogin = () => {
    // Dummy login logic
    console.log('Login attempt:', email, 'as', role);
    login(role);
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Welcome Back</ThemedText>
        <ThemedText type="subtitle">Login to your account</ThemedText>
      </View>

      <View style={styles.form}>
        <View style={styles.roleContainer}>
          <ThemedText style={styles.label}>Login sebagai:</ThemedText>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'CUSTOMER' && styles.roleButtonActive]}
              onPress={() => setRole('CUSTOMER')}
            >
              <ThemedText style={[styles.roleText, role === 'CUSTOMER' && styles.roleTextActive]}>Pencari</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'OWNER' && styles.roleButtonActive]}
              onPress={() => setRole('OWNER')}
            >
              <ThemedText style={[styles.roleText, role === 'OWNER' && styles.roleTextActive]}>Pemilik</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.push('/register')}>
          <ThemedText>Belum punya akun? <ThemedText style={styles.linkText}>Daftar</ThemedText></ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  form: {
    gap: 15,
  },
  roleContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 10,
    fontSize: 14,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
  },
  roleText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  roleTextActive: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
