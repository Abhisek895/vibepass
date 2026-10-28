import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GamificationService } from './gamification.service';

@Injectable()
export class QuestService {
  private readonly logger = new Logger(QuestService.name);

  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  /**
   * Get daily quests for user
   */
  async getDailyQuests(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get active daily quests
    const quests = await this.prisma.dailyQuest.findMany({
      where: {
        type: 'daily',
        isActive: true,
      },
    });

    // Get user's progress for today
    const userQuests = await this.prisma.userQuest.findMany({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
      include: {
        quest: true,
      },
    });

    // Create user quest instances if they don't exist
    const questsWithProgress = await Promise.all(
      quests.map(async (quest) => {
        let userQuest = userQuests.find((uq) => uq.questId === quest.id);

        if (!userQuest) {
          userQuest = await this.prisma.userQuest.create({
            data: {
              userId,
              questId: quest.id,
              date: today,
              progress: 0,
            },
            include: {
              quest: true,
            },
          });
        }

        return {
          ...quest,
          progress: userQuest.progress,
          isCompleted: userQuest.isCompleted,
          completedAt: userQuest.completedAt,
          canClaim: userQuest.progress >= quest.target && !userQuest.isCompleted,
        };
      }),
    );

    return questsWithProgress;
  }

  /**
   * Get weekly quests for user
   */
  async getWeeklyQuests(userId: string) {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const quests = await this.prisma.dailyQuest.findMany({
      where: {
        type: 'weekly',
        isActive: true,
      },
    });

    const userQuests = await this.prisma.userQuest.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
        },
      },
      include: {
        quest: true,
      },
    });

    const questsWithProgress = await Promise.all(
      quests.map(async (quest) => {
        let userQuest = userQuests.find((uq) => uq.questId === quest.id);

        if (!userQuest) {
          userQuest = await this.prisma.userQuest.create({
            data: {
              userId,
              questId: quest.id,
              date: startOfWeek,
              progress: 0,
            },
            include: {
              quest: true,
            },
          });
        }

        return {
          ...quest,
          progress: userQuest.progress,
          isCompleted: userQuest.isCompleted,
          completedAt: userQuest.completedAt,
          canClaim: userQuest.progress >= quest.target && !userQuest.isCompleted,
        };
      }),
    );

    return questsWithProgress;
  }

  /**
   * Update quest progress
   */
  async updateQuestProgress(
    userId: string,
    questKey: string,
    increment: number = 1,
  ) {
    try {
      const quest = await this.prisma.dailyQuest.findUnique({
        where: { key: questKey },
      });

      if (!quest) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const userQuest = await this.prisma.userQuest.findFirst({
        where: {
          userId,
          questId: quest.id,
          date: {
            gte: today,
          },
        },
      });

      if (!userQuest) {
        await this.prisma.userQuest.create({
          data: {
            userId,
            questId: quest.id,
            date: today,
            progress: increment,
          },
        });
      } else if (!userQuest.isCompleted) {
        const newProgress = Math.min(
          userQuest.progress + increment,
          quest.target,
        );

        await this.prisma.userQuest.update({
          where: { id: userQuest.id },
          data: { progress: newProgress },
        });

        // Auto-complete if target reached
        if (newProgress >= quest.target) {
          await this.claimQuestReward(userId, quest.id);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to update quest progress: ${error}`);
    }
  }

  /**
   * Claim quest reward
   */
  async claimQuestReward(userId: string, questId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userQuest = await this.prisma.userQuest.findFirst({
      where: {
        userId,
        questId,
        date: {
          gte: today,
        },
      },
      include: {
        quest: true,
      },
    });

    if (!userQuest || userQuest.isCompleted) {
      throw new Error('Quest not found or already completed');
    }

    if (userQuest.progress < userQuest.quest.target) {
      throw new Error('Quest not completed yet');
    }

    // Mark as completed
    await this.prisma.userQuest.update({
      where: { id: userQuest.id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Award XP
    const xpResult = await this.gamificationService.awardXp(
      userId,
      userQuest.quest.xpReward,
      'quest',
      `Completed quest: ${userQuest.quest.name}`,
    );

    // Award item rewards if any
    let itemReward = null;
    if (userQuest.quest.itemReward) {
      try {
        itemReward = JSON.parse(userQuest.quest.itemReward);
        // Process item reward (boost, super likes, etc.)
        await this.processItemReward(userId, itemReward);
      } catch (error) {
        this.logger.error(`Failed to parse item reward: ${error}`);
      }
    }

    return {
      quest: userQuest.quest,
      xpAwarded: xpResult.xpAwarded,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      itemReward,
    };
  }

  /**
   * Process item rewards
   */
  private async processItemReward(userId: string, reward: any) {
    if (reward.type === 'boost') {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour boost

      await this.prisma.userBoost.create({
        data: {
          userId,
          type: 'profile',
          expiresAt,
          source: 'quest',
        },
      });
    } else if (reward.type === 'super_likes') {
      // Add super likes to user's account (implement in subscription/credits system)
      this.logger.log(
        `Awarded ${reward.count} super likes to user ${userId}`,
      );
    }
  }

  /**
   * Get user's streak information
   */
  async getUserStreak(userId: string) {
    let streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await this.prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: new Date(),
          totalDaysActive: 0,
        },
      });
    }

    return streak;
  }

  /**
   * Track user event and update related quests
   */
  async trackEvent(userId: string, eventType: string, targetId?: string) {
    // Log the event
    await this.prisma.userEvent.create({
      data: {
        userId,
        eventType,
        targetId,
      },
    });

    // Map events to quests
    const questMap = {
      swipe_right: 'swipe_20',
      match: 'match_3',
      message_sent: 'send_5_messages',
      profile_complete: 'complete_profile',
      photo_added: 'add_photo',
      bio_updated: 'update_bio',
      active_30min: 'active_30min',
    };

    if (questMap[eventType]) {
      await this.updateQuestProgress(userId, questMap[eventType]);
    }
  }
}
