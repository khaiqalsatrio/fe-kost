import { useEffect, useState } from 'react';
import { bookingService } from '@/services/booking.service';
import { Alert } from 'react-native';

export function useIncomingBookings() {
  const [incoming, setIncoming] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncoming = async () => {
    try {
      const data = await bookingService.getIncomingBookings();
      setIncoming(data);
    } catch (error) {
      console.error('Error fetching incoming bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIncoming();
  };

  const updateBookingStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await bookingService.updateBookingStatus(id, status);
      Alert.alert('Berhasil', `Booking telah di-${status.toLowerCase()}`);
      fetchIncoming();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengupdate status.');
    }
  };

  return {
    incoming,
    isLoading,
    refreshing,
    onRefresh,
    updateBookingStatus,
    refetch: fetchIncoming,
  };
}
