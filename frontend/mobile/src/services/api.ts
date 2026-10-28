import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.api.post('/auth/register', { name, email, password });
    return response.data;
  }

  async logout() {
    await this.api.post('/auth/logout');
  }

  // Discovery endpoints
  async getDiscoveryUsers(params?: { limit?: number; offset?: number }) {
    const response = await this.api.get('/users/discover', { params });
    return response.data;
  }

  async swipe(userId: string, action: 'like' | 'nope' | 'superlike') {
    const response = await this.api.post('/swipe', { userId, action });
    return response.data;
  }

  // Matches endpoints
  async getMatches() {
    const response = await this.api.get('/matches');
    return response.data;
  }

  async unmatch(matchId: string) {
    await this.api.delete(`/matches/${matchId}`);
  }

  // Messaging endpoints
  async getConversation(matchId: string) {
    const response = await this.api.get(`/conversations/${matchId}`);
    return response.data;
  }

  async sendMessage(matchId: string, text: string, image?: string) {
    const response = await this.api.post('/messages', { matchId, text, image });
    return response.data;
  }

  // Profile endpoints
  async getProfile() {
    const response = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.api.put('/profile', data);
    return response.data;
  }

  async uploadPhoto(uri: string) {
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    const response = await this.api.post('/profile/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new ApiService();
