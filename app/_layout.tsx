import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { AuthProvider } from '@/context/AuthContext';

import { useAuth } from '@/context/AuthContext';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/context/ThemeContext';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(auth)">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="kost/[id]" options={{ title: 'Detail Kost' }} />
        <Stack.Screen name="kost/create" options={{ title: 'Tambah Kost' }} />
        <Stack.Screen name="booking/[id]" options={{ title: 'Booking' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </AppThemeProvider>
  );
}
