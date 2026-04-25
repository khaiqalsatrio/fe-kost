import api from '@/utils/api';

export const chatService = {
  async getChats() {
    const response = await api.get('/chat');
    return response.data;
  },

  async getChatById(id: string) {
    const response = await api.get(`/chat/${id}`);
    return response.data;
  },

  async startChat(ownerId: string) {
    const response = await api.post('/chat/start', { ownerId });
    return response.data;
  },
};
