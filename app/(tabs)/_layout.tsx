import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -4 },
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          href: role === 'CUSTOMER' ? '/' : null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
          href: role === 'CUSTOMER' ? '/history' : null,
        }}
      />
      <Tabs.Screen
        name="owner-dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
          href: role === 'OWNER' ? '/owner-dashboard' : null,
        }}
      />
      <Tabs.Screen
        name="owner-incoming"
        options={{
          title: 'Incoming',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
          href: role === 'OWNER' ? '/owner-incoming' : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
