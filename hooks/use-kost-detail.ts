import { useEffect, useState } from 'react';
import { kostService } from '@/services/kost.service';
import { chatService } from '@/services/chat.service';

import { useRouter } from 'expo-router';

export function useKostDetail(id: string) {
  const router = useRouter();
  const [kost, setKost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const data = await kostService.getKostById(id.toString());
      setKost(data);
    } catch (error) {
      console.error('Error fetching Detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const startChat = async (ownerId: string, ownerName: string) => {
    try {
      const data = await chatService.startChat(ownerId);
      router.push({
        pathname: '/chat/[id]',
        params: { id: data.id, partnerName: ownerName || 'Pemilik Kost' }
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return {
    kost,
    isLoading,
    startChat,
    refetch: fetchDetail,
  };
}
