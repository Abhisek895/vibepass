import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

interface XpReward {
  amount: number;
  source: string;
  description: string;
}

interface LevelInfo {
  level: number;
  tier: string;
  xpRequired: number;
  xpForNext: number;
}

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  // Level thresholds
  private readonly LEVEL_THRESHOLDS = [
    { level: 1, tier: 'Newbie', xp: 0 },
    { level: 2, tier: 'Explorer', xp: 100 },
    { level: 3, tier: 'Charmer', xp: 300 },
    { level: 4, tier: 'Heartbreaker', xp: 600 },
    { level: 5, tier: 'Legend', xp: 1000 },
    { level: 6, tier: 'Elite', xp: 2000 },
    { level: 7, tier: 'Icon', xp: 5000 },
    { level: 8, tier: 'Superstar', xp: 10000 },
    { level: 9, tier: 'Celebrity', xp: 20000 },
    { level: 10, tier: 'VIP Hall of Fame', xp: 50000 },
  ];

  // XP rewards for different actions
  private readonly XP_REWARDS = {
    COMPLETE_PROFILE: 50,
    ADD_PHOTO: 20,
    GET_MATCH: 10,
    SEND_FIRST_MESSAGE: 5,
    REPLY_WITHIN_HOUR: 3,
    GET_REPLY: 5,
    DAILY_LOGIN: 5,
    STREAK_7_DAYS: 50,
    STREAK_30_DAYS: 200,
    VOICE_CALL: 15,
    VIDEO_CALL: 25,
    MEET_IN_PERSON: 100,
    PROFILE_VIEW: 1,
    GET_SUPER_LIKED: 15,
    GIVE_COMPLIMENT: 2,
    COMPLETE_QUEST: 20,
  };

  constructor(private prisma: PrismaService) {}

  /**
   * Award XP to user and check for level up
   */
  async awardXp(
    userId: string,
    amount: number,
    source: string,
    description: string,
  ): Promise<{ leveledUp: boolean; newLevel?: number; xpAwarded: number }> {
    try {
      // Get or create user level
      let userLevel = await this.prisma.userLevel.findUnique({
        where: { userId },
      });

      if (!userLevel) {
        userLevel = await this.prisma.userLevel.create({
          data: { userId, xp: 0, totalXpEarned: 0, level: 1, tier: 'Newbie' },
        });
      }

      const newXp = userLevel.xp + amount;
      const newTotalXp = userLevel.totalXpEarned + amount;

      // Calculate new level
      const newLevelInfo = this.calculateLevel(newXp);
      const leveledUp = newLevelInfo.level > userLevel.level;

      // Update user level
      await this.prisma.userLevel.update({
        where: { userId },
        data: {
          xp: newXp,
          totalXpEarned: newTotalXp,
          level: newLevelInfo.level,
          tier: newLevelInfo.tier,
        },
      });

      // Log XP transaction
      await this.prisma.xpTransaction.create({
        data: {
          userId,
          amount,
          type: 'earned',
          source,
          description,
        },
      });

      // If leveled up, check for achievements
      if (leveledUp) {
        await this.checkLevelAchievements(userId, newLevelInfo.level);
      }

      return {
        leveledUp,
        newLevel: leveledUp ? newLevelInfo.level : undefined,
        xpAwarded: amount,
      };
    } catch (error) {
      this.logger.error(`Failed to award XP to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate level and tier based on XP
   */
  private calculateLevel(xp: number): LevelInfo {
    let currentLevel = this.LEVEL_THRESHOLDS[0];

    for (const threshold of this.LEVEL_THRESHOLDS) {
      if (xp >= threshold.xp) {
        currentLevel = threshold;
      } else {
        break;
      }
    }

    const nextThreshold = this.LEVEL_THRESHOLDS.find(
      (t) => t.level === currentLevel.level + 1,
    );

    return {
      level: currentLevel.level,
      tier: currentLevel.tier,
      xpRequired: currentLevel.xp,
      xpForNext: nextThreshold ? nextThreshold.xp : currentLevel.xp,
    };
  }

  /**
   * Get user's current level information
   */
  async getUserLevel(userId: string) {
    let userLevel = await this.prisma.userLevel.findUnique({
      where: { userId },
    });

    if (!userLevel) {
      userLevel = await this.prisma.userLevel.create({
        data: { userId },
      });
    }

    const levelInfo = this.calculateLevel(userLevel.xp);

    return {
      ...userLevel,
      ...levelInfo,
      progress: this.calculateLevelProgress(userLevel.xp),
    };
  }

  /**
   * Calculate progress percentage to next level
   */
  private calculateLevelProgress(xp: number): number {
    const levelInfo = this.calculateLevel(xp);
    const currentLevelXp = levelInfo.xpRequired;
    const nextLevelXp = levelInfo.xpForNext;

    if (nextLevelXp === currentLevelXp) return 100; // Max level

    const progress =
      ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  /**
   * Handle daily streak
   */
  async updateStreak(userId: string): Promise<{
    streakUpdated: boolean;
    currentStreak: number;
    xpAwarded: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await this.prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
          totalDaysActive: 1,
        },
      });

      await this.awardXp(
        userId,
        this.XP_REWARDS.DAILY_LOGIN,
        'daily_login',
        'Daily login bonus',
      );

      return { streakUpdated: true, currentStreak: 1, xpAwarded: 5 };
    }

    const lastActive = new Date(streak.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
    );

    let xpAwarded = 0;

    if (daysDiff === 0) {
      // Already logged in today
      return { streakUpdated: false, currentStreak: streak.currentStreak, xpAwarded: 0 };
    } else if (daysDiff === 1 || streak.streakFrozen) {
      // Continue streak
      const newStreak = streak.currentStreak + 1;
      const newLongest = Math.max(newStreak, streak.longestStreak);

      await this.prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActiveDate: today,
          totalDaysActive: streak.totalDaysActive + 1,
          streakFrozen: false,
        },
      });

      xpAwarded = this.XP_REWARDS.DAILY_LOGIN;

      // Bonus XP for milestones
      if (newStreak === 7) {
        xpAwarded += this.XP_REWARDS.STREAK_7_DAYS;
        await this.checkAchievement(userId, 'seven_day_streak');
      } else if (newStreak === 30) {
        xpAwarded += this.XP_REWARDS.STREAK_30_DAYS;
        await this.checkAchievement(userId, 'thirty_day_streak');
      }

      await this.awardXp(
        userId,
        xpAwarded,
        'daily_login',
        `Day ${newStreak} streak bonus`,
      );

      return { streakUpdated: true, currentStreak: newStreak, xpAwarded };
    } else {
      // Streak broken
      await this.prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          lastActiveDate: today,
          totalDaysActive: streak.totalDaysActive + 1,
        },
      });

      xpAwarded = this.XP_REWARDS.DAILY_LOGIN;
      await this.awardXp(userId, xpAwarded, 'daily_login', 'Daily login bonus');

      return { streakUpdated: true, currentStreak: 1, xpAwarded };
    }
  }

  /**
   * Check and award achievements
   */
  async checkAchievement(userId: string, achievementKey: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { key: achievementKey },
    });

    if (!achievement) return;

    const existing = await this.prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
    });

    if (!existing || !existing.isCompleted) {
      await this.prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
        create: {
          userId,
          achievementId: achievement.id,
          progress: 100,
          isCompleted: true,
          completedAt: new Date(),
        },
        update: {
          progress: 100,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      // Award XP for achievement
      if (achievement.xpReward > 0) {
        await this.awardXp(
          userId,
          achievement.xpReward,
          'achievement',
          `Achievement: ${achievement.name}`,
        );
      }

      return { awarded: true, achievement };
    }

    return { awarded: false };
  }

  /**
   * Check level-based achievements
   */
  private async checkLevelAchievements(userId: string, level: number) {
    const achievementMap = {
      3: 'level_3_charmer',
      5: 'level_5_legend',
      8: 'level_8_superstar',
      10: 'level_10_vip',
    };

    if (achievementMap[level]) {
      await this.checkAchievement(userId, achievementMap[level]);
    }
  }

  /**
   * Get user's achievements
   */
  async getUserAchievements(userId: string) {
    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
    });

    return achievements;
  }

  /**
   * Get XP rewards configuration
   */
  getXpRewards() {
    return this.XP_REWARDS;
  }

  /**
   * Get level thresholds
   */
  getLevelThresholds() {
    return this.LEVEL_THRESHOLDS;
  }
}
