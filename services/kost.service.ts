import api from '@/utils/api';

export const kostService = {
  async getAllKosts() {
    const response = await api.get('/kost');
    return response.data;
  },

  async getMyKosts() {
    const response = await api.get('/kost/my');
    return response.data;
  },

  async getKostById(id: string) {
    const response = await api.get(`/kost/${id}`);
    return response.data;
  },
};
