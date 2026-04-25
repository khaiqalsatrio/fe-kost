import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for Android Emulator. 
// Change to IP Address (e.g., http://192.168.1.10:4000) for real devices or iOS.
const API_BASE_URL = 'http://10.0.2.2:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle global errors (e.g., token expiry)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Logic for logout if token is invalid could go here
      await AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

export default api;
