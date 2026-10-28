import api from './api';

export interface UserLevel {
  id: string;
  userId: string;
  level: number;
  tier: string;
  xp: number;
  totalXpEarned: number;
  xpRequired: number;
  xpForNext: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  xpReward: number;
  badgeUrl?: string;
  tier: string;
  requirement: any;
  isSecret: boolean;
  progress?: number;
  isCompleted?: boolean;
  completedAt?: string;
  earnedAt?: string;
}

export interface Quest {
  id: string;
  key: string;
  name: string;
  description: string;
  type: string;
  target: number;
  progress: number;
  xpReward: number;
  itemReward?: any;
  difficulty: string;
  isCompleted: boolean;
  completedAt?: string;
  canClaim: boolean;
}

export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  streakFrozen: boolean;
  freezeCount: number;
  totalDaysActive: number;
}

export interface UserStats {
  profileViews: number;
  profileViewsToday: number;
  profileViewsThisWeek: number;
  likesReceived: number;
  likesReceivedToday: number;
  likesSent: number;
  superLikesReceived: number;
  matchesCount: number;
  matchesToday: number;
  messagesCount: number;
  messagesToday: number;
  matchRate: number;
  replyRate: number;
  averageResponseTime?: number;
}

export interface UserInsights {
  profileViews: {
    total: number;
    today: number;
    thisWeek: number;
    trend: 'up' | 'down' | 'neutral';
  };
  likes: {
    received: number;
    receivedToday: number;
    sent: number;
    superLikes: number;
  };
  matches: {
    total: number;
    today: number;
    matchRate: number;
    rateLevel: string;
  };
  engagement: {
    messages: number;
    replyRate: number;
    averageResponseTime?: number;
    responsiveness: string;
  };
  ranking: {
    attractiveness: number;
    popularity: number;
    percentile: number;
  };
  tips: string[];
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  photo?: string;
  score: number;
  attractiveness: number;
}

export interface Leaderboard {
  topUsers: LeaderboardUser[];
  currentUser: {
    rank: number;
    score: number;
    attractiveness: number;
  };
}

class GamificationService {
  /**
   * Get user's current level and XP
   */
  async getUserLevel(): Promise<UserLevel> {
    const response = await api.get('/gamification/level');
    return response.data;
  }

  /**
   * Get user's achievements
   */
  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get('/gamification/achievements');
    return response.data;
  }

  /**
   * Get user's streak information
   */
  async getStreak(): Promise<Streak> {
    const response = await api.get('/gamification/streak');
    return response.data;
  }

  /**
   * Perform daily check-in
   */
  async dailyCheckIn(): Promise<{
    streakUpdated: boolean;
    currentStreak: number;
    xpAwarded: number;
  }> {
    const response = await api.post('/gamification/streak/check-in');
    return response.data;
  }

  /**
   * Get daily quests
   */
  async getDailyQuests(): Promise<Quest[]> {
    const response = await api.get('/gamification/quests/daily');
    return response.data;
  }

  /**
   * Get weekly quests
   */
  async getWeeklyQuests(): Promise<Quest[]> {
    const response = await api.get('/gamification/quests/weekly');
    return response.data;
  }

  /**
   * Claim quest reward
   */
  async claimQuest(questId: string): Promise<{
    quest: Quest;
    xpAwarded: number;
    leveledUp: boolean;
    newLevel?: number;
    itemReward?: any;
  }> {
    const response = await api.post(`/gamification/quests/${questId}/claim`);
    return response.data;
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStats> {
    const response = await api.get('/gamification/stats');
    return response.data;
  }

  /**
   * Get personalized insights
   */
  async getInsights(): Promise<UserInsights> {
    const response = await api.get('/gamification/stats/insights');
    return response.data;
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(): Promise<Leaderboard> {
    const response = await api.get('/gamification/leaderboard');
    return response.data;
  }

  /**
   * Get XP rewards configuration
   */
  async getXpRewards(): Promise<Record<string, number>> {
    const response = await api.get('/gamification/xp-rewards');
    return response.data;
  }

  /**
   * Get level thresholds
   */
  async getLevelThresholds(): Promise<Array<{
    level: number;
    tier: string;
    xp: number;
  }>> {
    const response = await api.get('/gamification/level-thresholds');
    return response.data;
  }
}

export default new GamificationService();
