import api from '@/utils/api';

export const bookingService = {
  async getIncomingBookings() {
    const response = await api.get('/booking/incoming');
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/booking');
    return response.data;
  },

  async updateBookingStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    const response = await api.patch(`/booking/${id}/status`, { status });
    return response.data;
  },
};
