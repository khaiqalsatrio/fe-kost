import { useEffect, useState } from 'react';
import { kostService } from '@/services/kost.service';

export function useKosts() {
  const [kosts, setKosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchKosts = async () => {
    try {
      const data = await kostService.getAllKosts();
      setKosts(data);
    } catch (error) {
      console.error('Error fetching kosts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchKosts();
  };

  return {
    kosts,
    isLoading,
    refreshing,
    onRefresh,
    refetch: fetchKosts,
  };
}
