import { useEffect, useState } from 'react';
import { kostService } from '@/services/kost.service';
import { bookingService } from '@/services/booking.service';
import { Alert } from 'react-native';

export function useOwnerStats() {
  const [myKosts, setMyKosts] = useState<any[]>([]);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [kosts, bookings] = await Promise.all([
        kostService.getMyKosts(),
        bookingService.getIncomingBookings()
      ]);
      setMyKosts(kosts);
      setPendingBookings(bookings.filter((b: any) => b.status === 'PENDING'));
    } catch (error: any) {
      console.error('Dashboard Error:', error.response?.status);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const updateBookingStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await bookingService.updateBookingStatus(id, status);
      Alert.alert('Sukses', `Pesanan berhasil di-${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Error', 'Gagal update status pesanan');
    }
  };

  return {
    myKosts,
    pendingBookings,
    isLoading,
    refreshing,
    onRefresh,
    updateBookingStatus,
    refetch: fetchData,
  };
}
