import { useEffect, useState, useMemo } from 'react';
import { chatService } from '@/services/chat.service';
import { useAuth } from '@/context/AuthContext';
import { LayoutAnimation } from 'react-native';

export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const fetchChats = async () => {
    try {
      const data = await chatService.getChats();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const filteredChats = useMemo(() => {
    let result = chats;
    
    if (activeTab === 'unread') {
      result = result.filter(chat => chat.unreadCount > 0);
    }

    if (searchQuery) {
      result = result.filter(chat => {
        const partner = user?.role === 'CUSTOMER' ? chat.owner : chat.customer;
        return partner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    return result;
  }, [chats, searchQuery, activeTab, user]);

  const updateSearchQuery = (text: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchQuery(text);
  };

  const updateActiveTab = (tab: 'all' | 'unread') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setActiveTab(tab);
  };

  return {
    chats,
    filteredChats,
    isLoading,
    refreshing,
    searchQuery,
    setSearchQuery: updateSearchQuery,
    activeTab,
    setActiveTab: updateActiveTab,
    onRefresh,
    refetch: fetchChats,
  };
}
