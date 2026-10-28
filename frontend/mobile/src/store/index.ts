import { create } from 'zustand';
import { User, Profile, Match, Conversation, Message } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  user: Profile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
}

interface DiscoveryState {
  users: User[];
  currentIndex: number;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  swipeLeft: (userId: string) => void;
  swipeRight: (userId: string) => void;
  superLike: (userId: string) => void;
}

interface MatchState {
  matches: Match[];
  loading: boolean;
  fetchMatches: () => Promise<void>;
  removeMatch: (matchId: string) => void;
}

interface ChatState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  sendMessage: (matchId: string, text: string) => Promise<void>;
  loadConversation: (matchId: string) => Promise<void>;
  setActiveConversation: (matchId: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  login: async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      const mockUser: Profile = {
        id: '1',
        name: 'User',
        age: 25,
        bio: 'Living my best life',
        photos: [],
        email,
      };

      await AsyncStorage.setItem('token', 'mock-token');
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      set({ isAuthenticated: true, user: mockUser, token: 'mock-token' });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      set({ isAuthenticated: false, user: null, token: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  updateProfile: (updates: Partial<Profile>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  users: [],
  currentIndex: 0,
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      // TODO: Replace with actual API call
      const mockUsers: User[] = [
        {
          id: '2',
          name: 'Sarah',
          age: 24,
          bio: 'Adventure seeker 🏔️ | Dog lover 🐕 | Coffee addict ☕',
          photos: ['https://randomuser.me/api/portraits/women/1.jpg'],
          location: { city: 'New York', distance: 5 },
          interests: ['Travel', 'Hiking', 'Photography'],
          occupation: 'Marketing Manager',
          verified: true,
        },
        {
          id: '3',
          name: 'Emma',
          age: 26,
          bio: 'Yoga instructor | Plant mom 🌱 | Beach lover 🏖️',
          photos: ['https://randomuser.me/api/portraits/women/2.jpg'],
          location: { city: 'Los Angeles', distance: 8 },
          interests: ['Yoga', 'Meditation', 'Cooking'],
          occupation: 'Yoga Instructor',
        },
      ];

      set({ users: mockUsers, loading: false });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      set({ loading: false });
    }
  },

  swipeLeft: (userId: string) => {
    console.log('Nope:', userId);
    set((state) => ({ currentIndex: state.currentIndex + 1 }));
  },

  swipeRight: (userId: string) => {
    console.log('Like:', userId);
    set((state) => ({ currentIndex: state.currentIndex + 1 }));
    // TODO: Check for match and show match modal
  },

  superLike: (userId: string) => {
    console.log('Super Like:', userId);
    set((state) => ({ currentIndex: state.currentIndex + 1 }));
  },
}));

export const useMatchStore = create<MatchState>((set) => ({
  matches: [],
  loading: false,

  fetchMatches: async () => {
    set({ loading: true });
    try {
      // TODO: Replace with actual API call
      const mockMatches: Match[] = [
        {
          id: '1',
          user: {
            id: '4',
            name: 'Jessica',
            age: 25,
            bio: 'Artist and dreamer',
            photos: ['https://randomuser.me/api/portraits/women/3.jpg'],
            verified: true,
          },
          matchedAt: new Date().toISOString(),
          lastMessage: {
            id: '1',
            senderId: '4',
            text: 'Hey! How are you?',
            createdAt: new Date().toISOString(),
            read: false,
          },
          unreadCount: 1,
        },
      ];

      set({ matches: mockMatches, loading: false });
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      set({ loading: false });
    }
  },

  removeMatch: (matchId: string) => {
    set((state) => ({
      matches: state.matches.filter((m) => m.id !== matchId),
    }));
  },
}));

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: {},
  activeConversationId: null,

  sendMessage: async (matchId: string, text: string) => {
    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        text,
        createdAt: new Date().toISOString(),
        read: false,
      };

      set((state) => {
        const conversation = state.conversations[matchId];
        if (conversation) {
          return {
            conversations: {
              ...state.conversations,
              [matchId]: {
                ...conversation,
                messages: [...conversation.messages, message],
              },
            },
          };
        }
        return state;
      });

      // TODO: Send to API
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  loadConversation: async (matchId: string) => {
    try {
      // TODO: Replace with actual API call
      const mockConversation: Conversation = {
        id: matchId,
        matchId,
        messages: [
          {
            id: '1',
            senderId: matchId,
            text: 'Hey! How are you?',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            read: true,
          },
        ],
      };

      set((state) => ({
        conversations: {
          ...state.conversations,
          [matchId]: mockConversation,
        },
      }));
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  },

  setActiveConversation: (matchId: string | null) => {
    set({ activeConversationId: matchId });
  },
}));
