import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export function useAuthRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'OWNER') {
      if (user.hasKost) {
        router.replace('/owner-dashboard');
      } else {
        router.replace('/kost/create');
      }
    }
  }, [user]);
}
