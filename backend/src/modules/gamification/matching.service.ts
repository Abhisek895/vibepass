import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GamificationService } from './gamification.service';
import { StatsService } from './stats.service';

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
    private statsService: StatsService,
  ) {}

  /**
   * Calculate ELO score change
   */
  private calculateEloChange(
    winnerElo: number,
    loserElo: number,
    k: number = 32,
  ): number {
    const expectedScore = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    return Math.round(k * (1 - expectedScore));
  }

  /**
   * Update user ELO based on swipe outcome
   */
  async updateElo(userId: string, targetId: string, liked: boolean) {
    // Get or create ELO records
    let userElo = await this.prisma.userElo.findUnique({
      where: { userId },
    });

    let targetElo = await this.prisma.userElo.findUnique({
      where: { userId: targetId },
    });

    if (!userElo) {
      userElo = await this.prisma.userElo.create({
        data: { userId },
      });
    }

    if (!targetElo) {
      targetElo = await this.prisma.userElo.create({
        data: { userId: targetId },
      });
    }

    if (liked) {
      // User liked target - target's ELO increases
      const eloChange = this.calculateEloChange(
        targetElo.eloScore,
        userElo.eloScore,
      );

      await this.prisma.userElo.update({
        where: { userId: targetId },
        data: {
          eloScore: { increment: eloChange },
          popularity: { increment: 1 },
        },
      });

      // Update attractiveness percentile
      await this.updateAttractiveness(targetId);
    }
  }

  /**
   * Update attractiveness percentile
   */
  async updateAttractiveness(userId: string) {
    const userElo = await this.prisma.userElo.findUnique({
      where: { userId },
    });

    if (!userElo) return;

    // Count users with lower ELO
    const lowerCount = await this.prisma.userElo.count({
      where: {
        eloScore: {
          lt: userElo.eloScore,
        },
      },
    });

    // Total users
    const totalCount = await this.prisma.userElo.count();

    if (totalCount > 0) {
      const percentile = (lowerCount / totalCount) * 100;

      await this.prisma.userElo.update({
        where: { userId },
        data: { attractiveness: percentile },
      });
    }
  }

  /**
   * Handle like action
   */
  async handleLike(
    senderId: string,
    targetId: string,
    type: 'like' | 'super_like' = 'like',
    message?: string,
  ) {
    // Check if already liked
    const existingLike = await this.prisma.matchLike.findUnique({
      where: {
        senderId_targetId: {
          senderId,
          targetId,
        },
      },
    });

    if (existingLike) {
      return { alreadyLiked: true, match: existingLike.isMatch };
    }

    // Check if target liked sender
    const reciprocalLike = await this.prisma.matchLike.findUnique({
      where: {
        senderId_targetId: {
          senderId: targetId,
          targetId: senderId,
        },
      },
    });

    const isMatch = !!reciprocalLike;

    // Create like record
    const like = await this.prisma.matchLike.create({
      data: {
        senderId,
        targetId,
        type,
        message,
        isMatch,
        matchedAt: isMatch ? new Date() : null,
      },
    });

    // Update reciprocal like if match
    if (isMatch && reciprocalLike) {
      await this.prisma.matchLike.update({
        where: { id: reciprocalLike.id },
        data: {
          isMatch: true,
          matchedAt: new Date(),
        },
      });

      // Create chat
      await this.createMatchChat(senderId, targetId);

      // Award XP for match
      await this.gamificationService.awardXp(
        senderId,
        10,
        'match',
        'Got a match!',
      );

      await this.gamificationService.awardXp(
        targetId,
        10,
        'match',
        'Got a match!',
      );

      // Update stats
      await this.statsService.incrementMatches(senderId);
      await this.statsService.incrementMatches(targetId);

      // Check for achievements
      await this.checkMatchAchievements(senderId);
      await this.checkMatchAchievements(targetId);
    }

    // Update ELO
    await this.updateElo(senderId, targetId, true);

    // Update stats
    await this.statsService.incrementLikesReceived(
      targetId,
      type === 'super_like',
    );

    await this.prisma.userStats.update({
      where: { userId: senderId },
      data: {
        likesSent: { increment: 1 },
        superLikesSent: type === 'super_like' ? { increment: 1 } : undefined,
      },
    });

    // Award XP for super like
    if (type === 'super_like') {
      await this.gamificationService.awardXp(
        targetId,
        15,
        'super_like',
        'Received a Super Like!',
      );
    }

    return {
      liked: true,
      match: isMatch,
      like,
    };
  }

  /**
   * Handle pass action
   */
  async handlePass(senderId: string, targetId: string) {
    // Create pass record
    await this.prisma.matchPass.create({
      data: {
        senderId,
        targetId,
      },
    });

    // Update ELO (slight decrease for target)
    await this.updateElo(senderId, targetId, false);
  }

  /**
   * Create chat for matched users
   */
  private async createMatchChat(user1Id: string, user2Id: string) {
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    if (!existingChat) {
      await this.prisma.chat.create({
        data: {
          user1Id,
          user2Id,
          status: 'active',
        },
      });
    }
  }

  /**
   * Check match-related achievements
   */
  private async checkMatchAchievements(userId: string) {
    const stats = await this.statsService.getUserStats(userId);

    // First match
    if (stats.matchesCount === 1) {
      await this.gamificationService.checkAchievement(userId, 'first_match');
    }

    // Hot streak (10 matches in one day)
    if (stats.matchesToday >= 10) {
      await this.gamificationService.checkAchievement(userId, 'hot_streak');
    }

    // Century club (100 total matches)
    if (stats.matchesCount >= 100) {
      await this.gamificationService.checkAchievement(userId, 'century_club');
    }

    // Royalty (1000 total matches)
    if (stats.matchesCount >= 1000) {
      await this.gamificationService.checkAchievement(userId, 'royalty');
    }
  }

  /**
   * Get discovery users with smart matching
   */
  async getDiscoveryUsers(
    userId: string,
    limit: number = 20,
  ) {
    // Get user's preferences
    const preferences = await this.prisma.datingPreferences.findUnique({
      where: { userId },
    });

    const userElo = await this.prisma.userElo.findUnique({
      where: { userId },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    // Build filters
    const filters: any = {
      id: { not: userId },
      isBanned: false,
      isSuspended: false,
    };

    // Age filter
    if (preferences?.ageMin && preferences?.ageMax) {
      filters.age = {
        gte: preferences.ageMin,
        lte: preferences.ageMax,
      };
    }

    // Gender filter
    if (preferences?.showMe && preferences.showMe !== 'everyone') {
      filters.profile = {
        gender: preferences.showMe,
      };
    }

    // Already liked/passed users
    const likedUsers = await this.prisma.matchLike.findMany({
      where: { senderId: userId },
      select: { targetId: true },
    });

    const passedUsers = await this.prisma.matchPass.findMany({
      where: { senderId: userId },
      select: { targetId: true },
    });

    const excludedIds = [
      ...likedUsers.map((l) => l.targetId),
      ...passedUsers.map((p) => p.targetId),
    ];

    if (excludedIds.length > 0) {
      filters.id = { not: userId, notIn: excludedIds };
    }

    // Get candidates
    let candidates = await this.prisma.user.findMany({
      where: filters,
      include: {
        profile: true,
        aiInsights: true,
      },
      take: limit * 2, // Get more for scoring
    });

    // Score and sort candidates
    const scoredCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const score = await this.calculateCompatibilityScore(
          user,
          candidate,
          userElo,
          preferences,
        );

        return {
          ...candidate,
          compatibilityScore: score,
        };
      }),
    );

    // Sort by score and apply ELO-based filtering
    const eloRange = 200; // Show users within ±200 ELO
    const filtered = scoredCandidates
      .filter(async (c) => {
        const candidateElo = await this.prisma.userElo.findUnique({
          where: { userId: c.id },
        });

        if (!candidateElo || !userElo) return true;

        return Math.abs(candidateElo.eloScore - userElo.eloScore) <= eloRange;
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    return filtered;
  }

  /**
   * Calculate compatibility score between users
   */
  private async calculateCompatibilityScore(
    user: any,
    candidate: any,
    userElo: any,
    preferences: any,
  ): Promise<number> {
    let score = 0;

    // Shared interests (30%)
    if (user.interests && candidate.interests) {
      const userInterests = user.interests.split(',');
      const candidateInterests = candidate.interests.split(',');
      const shared = userInterests.filter((i: string) =>
        candidateInterests.includes(i),
      );
      score += (shared.length / Math.max(userInterests.length, 1)) * 30;
    }

    // Location proximity (15%) - would need coordinates
    score += 15; // Placeholder

    // Activity level (10%)
    const candidateElo = await this.prisma.userElo.findUnique({
      where: { userId: candidate.id },
    });

    if (userElo && candidateElo) {
      const activityDiff = Math.abs(
        userElo.activityScore - candidateElo.activityScore,
      );
      score += Math.max(0, 10 - activityDiff / 10);
    }

    // Profile completeness (10%)
    if (candidate.profile?.bio && candidate.profile?.profilePhotoUrl) {
      score += 10;
    }

    // Random factor (5%) for diversity
    score += Math.random() * 5;

    return Math.min(100, score);
  }
}
