import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get or create user stats
   */
  async getUserStats(userId: string) {
    let stats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await this.prisma.userStats.create({
        data: { userId },
      });
    }

    // Reset daily stats if needed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = new Date(stats.lastResetDate);
    lastReset.setHours(0, 0, 0, 0);

    if (today.getTime() > lastReset.getTime()) {
      stats = await this.prisma.userStats.update({
        where: { userId },
        data: {
          profileViewsToday: 0,
          likesReceivedToday: 0,
          matchesToday: 0,
          messagesToday: 0,
          lastResetDate: today,
        },
      });
    }

    return stats;
  }

  /**
   * Update profile views
   */
  async incrementProfileViews(userId: string, count: number = 1) {
    await this.prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        profileViews: count,
        profileViewsToday: count,
        profileViewsThisWeek: count,
      },
      update: {
        profileViews: { increment: count },
        profileViewsToday: { increment: count },
        profileViewsThisWeek: { increment: count },
      },
    });
  }

  /**
   * Increment likes received
   */
  async incrementLikesReceived(userId: string, isSuperLike: boolean = false) {
    const updateData: any = {
      likesReceived: { increment: 1 },
      likesReceivedToday: { increment: 1 },
    };

    if (isSuperLike) {
      updateData.superLikesReceived = { increment: 1 };
    }

    await this.prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        likesReceived: 1,
        likesReceivedToday: 1,
        superLikesReceived: isSuperLike ? 1 : 0,
      },
      update: updateData,
    });
  }

  /**
   * Increment matches
   */
  async incrementMatches(userId: string) {
    await this.prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        matchesCount: 1,
        matchesToday: 1,
      },
      update: {
        matchesCount: { increment: 1 },
        matchesToday: { increment: 1 },
      },
    });
  }

  /**
   * Increment messages
   */
  async incrementMessages(userId: string, isFirstMessage: boolean = false) {
    const updateData: any = {
      messagesCount: { increment: 1 },
      messagesToday: { increment: 1 },
    };

    if (isFirstMessage) {
      updateData.firstMessagesSent = { increment: 1 };
    }

    await this.prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        messagesCount: 1,
        messagesToday: 1,
        firstMessagesSent: isFirstMessage ? 1 : 0,
      },
      update: updateData,
    });
  }

  /**
   * Calculate match rate
   */
  async updateMatchRate(userId: string) {
    const stats = await this.getUserStats(userId);
    const likesSent = stats.likesSent;
    const matchesCount = stats.matchesCount;

    if (likesSent > 0) {
      const matchRate = (matchesCount / likesSent) * 100;
      await this.prisma.userStats.update({
        where: { userId },
        data: { matchRate },
      });
    }
  }

  /**
   * Calculate reply rate
   */
  async updateReplyRate(userId: string) {
    const stats = await this.getUserStats(userId);
    const firstMessagesSent = stats.firstMessagesSent;
    const repliesReceived = stats.repliesReceived;

    if (firstMessagesSent > 0) {
      const replyRate = (repliesReceived / firstMessagesSent) * 100;
      await this.prisma.userStats.update({
        where: { userId },
        data: { replyRate },
      });
    }
  }

  /**
   * Get user insights and recommendations
   */
  async getUserInsights(userId: string) {
    const stats = await this.getUserStats(userId);
    const userElo = await this.prisma.userElo.findUnique({
      where: { userId },
    });

    // Calculate trends
    const insights = {
      profileViews: {
        total: stats.profileViews,
        today: stats.profileViewsToday,
        thisWeek: stats.profileViewsThisWeek,
        trend: this.calculateTrend(stats.profileViewsToday, stats.profileViewsThisWeek / 7),
      },
      likes: {
        received: stats.likesReceived,
        receivedToday: stats.likesReceivedToday,
        sent: stats.likesSent,
        superLikes: stats.superLikesReceived,
      },
      matches: {
        total: stats.matchesCount,
        today: stats.matchesToday,
        matchRate: stats.matchRate,
        rateLevel: this.getRateLevel(stats.matchRate),
      },
      engagement: {
        messages: stats.messagesCount,
        replyRate: stats.replyRate,
        averageResponseTime: stats.averageResponseTime,
        responsiveness: this.getResponsivenessLevel(stats.averageResponseTime),
      },
      ranking: {
        attractiveness: userElo?.attractiveness || 50,
        popularity: userElo?.popularity || 0,
        percentile: Math.round(userElo?.attractiveness || 50),
      },
      tips: this.generateTips(stats, userElo),
    };

    return insights;
  }

  /**
   * Calculate trend (positive/negative/neutral)
   */
  private calculateTrend(current: number, average: number): string {
    if (current > average * 1.2) return 'up';
    if (current < average * 0.8) return 'down';
    return 'neutral';
  }

  /**
   * Get rate level description
   */
  private getRateLevel(rate: number): string {
    if (rate >= 70) return 'Excellent';
    if (rate >= 50) return 'Good';
    if (rate >= 30) return 'Average';
    return 'Below Average';
  }

  /**
   * Get responsiveness level
   */
  private getResponsivenessLevel(avgResponseTime: number | null): string {
    if (!avgResponseTime) return 'No data';
    if (avgResponseTime < 60) return 'Very Fast';
    if (avgResponseTime < 180) return 'Fast';
    if (avgResponseTime < 360) return 'Average';
    return 'Slow';
  }

  /**
   * Generate personalized tips
   */
  private generateTips(stats: any, elo: any): string[] {
    const tips: string[] = [];

    // Profile views tip
    if (stats.profileViewsToday < 10) {
      tips.push('💡 Boost your profile to get 10x more views!');
    }

    // Match rate tip
    if (stats.matchRate < 30) {
      tips.push('📸 Add more high-quality photos to increase your match rate');
    }

    // Reply rate tip
    if (stats.replyRate < 50) {
      tips.push('✉️ Try using icebreaker templates for better responses');
    }

    // Activity tip
    if (stats.messagesToday === 0) {
      tips.push('🔥 Send some messages today to stay active!');
    }

    // Timing tip
    tips.push('⏰ Best time to swipe: 8-10 PM for maximum matches');

    // Profile optimization
    if (elo && elo.qualityScore < 70) {
      tips.push('⭐ Complete your profile for better visibility');
    }

    return tips.slice(0, 3); // Return top 3 tips
  }

  /**
   * Get leaderboard (optional feature)
   */
  async getLeaderboard(userId: string, limit: number = 10) {
    const topUsers = await this.prisma.userElo.findMany({
      take: limit,
      orderBy: { eloScore: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePhotoUrl: true,
              },
            },
          },
        },
      },
    });

    const userRank = await this.prisma.userElo.findUnique({
      where: { userId },
    });

    const userPosition = await this.prisma.userElo.count({
      where: {
        eloScore: {
          gt: userRank?.eloScore || 0,
        },
      },
    });

    return {
      topUsers: topUsers.map((u, index) => ({
        rank: index + 1,
        userId: u.user.id,
        username: u.user.username,
        photo: u.user.profile?.profilePhotoUrl,
        score: u.eloScore,
        attractiveness: u.attractiveness,
      })),
      currentUser: {
        rank: userPosition + 1,
        score: userRank?.eloScore || 1500,
        attractiveness: userRank?.attractiveness || 50,
      },
    };
  }

  /**
   * Record profile view
   */
  async recordProfileView(viewerId: string, viewedId: string, durationSec?: number) {
    await this.prisma.profileView.create({
      data: {
        viewerId,
        viewedId,
        durationSec,
      },
    });

    await this.incrementProfileViews(viewedId);
  }
}
