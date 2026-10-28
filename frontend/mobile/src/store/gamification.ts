import { create } from 'zustand';
import gamificationService, {
  UserLevel,
  Achievement,
  Quest,
  Streak,
  UserStats,
  UserInsights,
  Leaderboard,
} from '@/services/gamification';

interface GamificationState {
  // Data
  level: UserLevel | null;
  achievements: Achievement[];
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  streak: Streak | null;
  stats: UserStats | null;
  insights: UserInsights | null;
  leaderboard: Leaderboard | null;

  // Loading states
  loading: boolean;
  refreshing: boolean;

  // XP Animation
  xpGained: number;
  xpSource: string;
  showXpToast: boolean;

  // Level up
  showLevelUp: boolean;
  newLevel: number;

  // Achievement unlock
  showAchievement: boolean;
  unlockedAchievement: Achievement | null;

  // Actions
  fetchLevel: () => Promise<void>;
  fetchAchievements: () => Promise<void>;
  fetchQuests: () => Promise<void>;
  fetchStreak: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  fetchAll: () => Promise<void>;

  dailyCheckIn: () => Promise<any>;
  claimQuest: (questId: string) => Promise<any>;

  // UI Actions
  showXpGain: (amount: number, source: string) => void;
  hideXpToast: () => void;
  showLevelUpModal: (level: number) => void;
  hideLevelUpModal: () => void;
  showAchievementModal: (achievement: Achievement) => void;
  hideAchievementModal: () => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  // Initial state
  level: null,
  achievements: [],
  dailyQuests: [],
  weeklyQuests: [],
  streak: null,
  stats: null,
  insights: null,
  leaderboard: null,

  loading: false,
  refreshing: false,

  xpGained: 0,
  xpSource: '',
  showXpToast: false,

  showLevelUp: false,
  newLevel: 1,

  showAchievement: false,
  unlockedAchievement: null,

  // Fetch user level
  fetchLevel: async () => {
    try {
      set({ loading: true });
      const level = await gamificationService.getUserLevel();
      set({ level, loading: false });
    } catch (error) {
      console.error('Failed to fetch level:', error);
      set({ loading: false });
    }
  },

  // Fetch achievements
  fetchAchievements: async () => {
    try {
      const achievements = await gamificationService.getAchievements();
      set({ achievements });
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  },

  // Fetch quests
  fetchQuests: async () => {
    try {
      const [dailyQuests, weeklyQuests] = await Promise.all([
        gamificationService.getDailyQuests(),
        gamificationService.getWeeklyQuests(),
      ]);
      set({ dailyQuests, weeklyQuests });
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    }
  },

  // Fetch streak
  fetchStreak: async () => {
    try {
      const streak = await gamificationService.getStreak();
      set({ streak });
    } catch (error) {
      console.error('Failed to fetch streak:', error);
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const stats = await gamificationService.getStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  // Fetch insights
  fetchInsights: async () => {
    try {
      const insights = await gamificationService.getInsights();
      set({ insights });
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    }
  },

  // Fetch leaderboard
  fetchLeaderboard: async () => {
    try {
      const leaderboard = await gamificationService.getLeaderboard();
      set({ leaderboard });
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  },

  // Fetch all data
  fetchAll: async () => {
    try {
      set({ refreshing: true });
      await Promise.all([
        get().fetchLevel(),
        get().fetchAchievements(),
        get().fetchQuests(),
        get().fetchStreak(),
        get().fetchStats(),
        get().fetchInsights(),
      ]);
      set({ refreshing: false });
    } catch (error) {
      console.error('Failed to fetch all data:', error);
      set({ refreshing: false });
    }
  },

  // Daily check-in
  dailyCheckIn: async () => {
    try {
      const result = await gamificationService.dailyCheckIn();

      // Update streak
      const streak = await gamificationService.getStreak();
      set({ streak });

      // Show XP toast
      if (result.xpAwarded > 0) {
        get().showXpGain(result.xpAwarded, 'Daily Check-in');
      }

      // Refresh level
      await get().fetchLevel();

      return result;
    } catch (error) {
      console.error('Failed to check in:', error);
      throw error;
    }
  },

  // Claim quest
  claimQuest: async (questId: string) => {
    try {
      const result = await gamificationService.claimQuest(questId);

      // Refresh data
      await Promise.all([
        get().fetchQuests(),
        get().fetchLevel(),
      ]);

      // Show XP toast
      if (result.xpAwarded > 0) {
        get().showXpGain(result.xpAwarded, result.quest.name);
      }

      // Show level up modal
      if (result.leveledUp && result.newLevel) {
        get().showLevelUpModal(result.newLevel);
      }

      return result;
    } catch (error) {
      console.error('Failed to claim quest:', error);
      throw error;
    }
  },

  // Show XP gain toast
  showXpGain: (amount: number, source: string) => {
    set({
      xpGained: amount,
      xpSource: source,
      showXpToast: true,
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      get().hideXpToast();
    }, 3000);
  },

  // Hide XP toast
  hideXpToast: () => {
    set({ showXpToast: false });
  },

  // Show level up modal
  showLevelUpModal: (level: number) => {
    set({
      showLevelUp: true,
      newLevel: level,
    });
  },

  // Hide level up modal
  hideLevelUpModal: () => {
    set({ showLevelUp: false });
  },

  // Show achievement modal
  showAchievementModal: (achievement: Achievement) => {
    set({
      showAchievement: true,
      unlockedAchievement: achievement,
    });
  },

  // Hide achievement modal
  hideAchievementModal: () => {
    set({ showAchievement: false });
  },
}));
