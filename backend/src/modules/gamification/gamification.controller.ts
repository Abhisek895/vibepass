import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { QuestService } from './quest.service';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(
    private readonly gamificationService: GamificationService,
    private readonly questService: QuestService,
    private readonly statsService: StatsService,
  ) {}

  @Get('level')
  async getUserLevel(@Req() req) {
    return this.gamificationService.getUserLevel(req.user.id);
  }

  @Get('achievements')
  async getAchievements(@Req() req) {
    return this.gamificationService.getUserAchievements(req.user.id);
  }

  @Get('streak')
  async getStreak(@Req() req) {
    return this.questService.getUserStreak(req.user.id);
  }

  @Post('streak/check-in')
  async checkIn(@Req() req) {
    return this.gamificationService.updateStreak(req.user.id);
  }

  @Get('quests/daily')
  async getDailyQuests(@Req() req) {
    return this.questService.getDailyQuests(req.user.id);
  }

  @Get('quests/weekly')
  async getWeeklyQuests(@Req() req) {
    return this.questService.getWeeklyQuests(req.user.id);
  }

  @Post('quests/:questId/claim')
  async claimQuest(@Req() req, @Param('questId') questId: string) {
    return this.questService.claimQuestReward(req.user.id, questId);
  }

  @Get('stats')
  async getStats(@Req() req) {
    return this.statsService.getUserStats(req.user.id);
  }

  @Get('stats/insights')
  async getInsights(@Req() req) {
    return this.statsService.getUserInsights(req.user.id);
  }

  @Get('leaderboard')
  async getLeaderboard(@Req() req) {
    return this.statsService.getLeaderboard(req.user.id);
  }

  @Get('xp-rewards')
  async getXpRewards() {
    return this.gamificationService.getXpRewards();
  }

  @Get('level-thresholds')
  async getLevelThresholds() {
    return this.gamificationService.getLevelThresholds();
  }
}
