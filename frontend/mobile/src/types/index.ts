export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location?: {
    city: string;
    distance?: number;
  };
  interests?: string[];
  occupation?: string;
  education?: string;
  height?: number;
  gender?: 'male' | 'female' | 'non-binary' | 'other';
  lookingFor?: string[];
  verified?: boolean;
  lastActive?: string;
}

export interface Match {
  id: string;
  user: User;
  matchedAt: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  gif?: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  matchId: string;
  messages: Message[];
}

export interface Profile extends User {
  email?: string;
  phone?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  discoverySettings: {
    ageRange: [number, number];
    maxDistance: number;
    showMe: 'male' | 'female' | 'everyone';
  };
  notifications: {
    matches: boolean;
    messages: boolean;
    likes: boolean;
    superLikes: boolean;
  };
  privacy: {
    showAge: boolean;
    showDistance: boolean;
    incognitoMode: boolean;
  };
}

export interface SwipeAction {
  type: 'like' | 'nope' | 'superlike';
  userId: string;
  timestamp: string;
}
