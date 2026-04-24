import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'OWNER'>('CUSTOMER');

  const handleLogin = () => {
    console.log('Login attempt:', email, 'as', role);
    login(role);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000' }} 
        style={styles.headerImage} 
      />
      <View style={[styles.overlay, isDark ? { backgroundColor: 'rgba(0,0,0,0.6)' } : { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.spacer} />
          
          <ThemedView style={[styles.formContainer, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
              <ThemedText style={{ color: Colors[colorScheme].icon }}>Login to your account to continue</ThemedText>
            </View>

            <View style={styles.form}>
              <ThemedText style={styles.label}>Login sebagai:</ThemedText>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'CUSTOMER' ? { borderColor: Colors[colorScheme].tint, backgroundColor: isDark ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF' } : { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }
                  ]}
                  onPress={() => setRole('CUSTOMER')}
                >
                  <IconSymbol name="person.fill" size={24} color={role === 'CUSTOMER' ? Colors[colorScheme].tint : Colors[colorScheme].icon} />
                  <ThemedText style={[styles.roleText, { color: role === 'CUSTOMER' ? Colors[colorScheme].tint : Colors[colorScheme].icon }]}>Pencari</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'OWNER' ? { borderColor: Colors[colorScheme].tint, backgroundColor: isDark ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF' } : { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }
                  ]}
                  onPress={() => setRole('OWNER')}
                >
                  <IconSymbol name="house.fill" size={24} color={role === 'OWNER' ? Colors[colorScheme].tint : Colors[colorScheme].icon} />
                  <ThemedText style={[styles.roleText, { color: role === 'OWNER' ? Colors[colorScheme].tint : Colors[colorScheme].icon }]}>Pemilik</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <IconSymbol name="envelope.fill" size={20} color={Colors[colorScheme].icon} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                    placeholder="Email"
                    placeholderTextColor={Colors[colorScheme].icon}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <IconSymbol name="lock.fill" size={20} color={Colors[colorScheme].icon} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].surface }]}
                    placeholder="Password"
                    placeholderTextColor={Colors[colorScheme].icon}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} onPress={handleLogin}>
                <ThemedText style={styles.buttonText}>Login</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/register')}>
                <ThemedText>Belum punya akun? <ThemedText style={[styles.linkText, { color: Colors[colorScheme].tint }]}>Daftar</ThemedText></ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  spacer: {
    height: 250,
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    fontWeight: '800',
  },
  form: {
    gap: 24,
  },
  label: {
    marginBottom: -12,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  roleButton: {
    flex: 1,
    height: 90,
    borderWidth: 1.5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  roleText: {
    fontWeight: '700',
    fontSize: 14,
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 46,
    paddingRight: 16,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    alignItems: 'center',
  },
  linkText: {
    fontWeight: 'bold',
  },
});
