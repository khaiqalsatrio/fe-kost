import { Image, Platform, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function ExploreTipsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'OWNER') {
      router.replace('/owner-dashboard');
    }
  }, [user]);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore Tips
        </ThemedText>
      </ThemedView>
      <ThemedText>Temukan tips mencari kost terbaik dan informasi menarik lainnya di sini.</ThemedText>
      <Collapsible title="Cek Lokasi Strategis">
        <ThemedText>
          Pastikan kost dekat dengan transportasi umum (MRT, Halte Busway) untuk menghemat waktu dan biaya.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Cek Fasilitas">
        <ThemedText>
          Pastikan biaya sewa sudah termasuk air, listrik, atau WiFi jika memungkinkan.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
