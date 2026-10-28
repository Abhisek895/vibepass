import { Module } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';
import { QuestService } from './quest.service';
import { MatchingService } from './matching.service';
import { StatsService } from './stats.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [
    GamificationService,
    QuestService,
    MatchingService,
    StatsService,
    PrismaService,
  ],
  controllers: [GamificationController],
  exports: [GamificationService, QuestService, MatchingService, StatsService],
})
export class GamificationModule {}
