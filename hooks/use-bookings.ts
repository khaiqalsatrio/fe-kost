import { useEffect, useState } from 'react';
import { bookingService } from '@/services/booking.service';

export function useBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  return {
    bookings,
    isLoading,
    refreshing,
    onRefresh,
    refetch: fetchBookings,
  };
}
