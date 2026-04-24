import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER');

  const handleRegister = () => {
    // Logic for registration will go here
    console.log('Register attempt:', { name, email, role });
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ThemedText type="title">Create Account</ThemedText>
          <ThemedText type="subtitle">Join our community</ThemedText>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
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

          <View style={styles.roleContainer}>
            <ThemedText style={styles.label}>Register as:</ThemedText>
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

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <ThemedText style={styles.buttonText}>Register</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={() => router.back()}>
            <ThemedText>Already have an account? <ThemedText style={styles.linkText}>Login</ThemedText></ThemedText>
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
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
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleContainer: {
    marginVertical: 10,
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
