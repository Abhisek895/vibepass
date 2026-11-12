import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../../src/database/database.module';
import { MatchesModule } from '../../../src/modules/matches/matches.module';
import { LookupsModule } from '../../../src/modules/lookups/lookups.module';
import { AuthModule } from '../../../src/modules/auth/auth.module';
import { EventBusService } from '../../../libs/contracts/src/event-bus.service';

@Controller('health')
class MatchingHealthController {
  @Get()
  check() {
    return { status: 'UP', service: 'matching-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    MatchesModule,
    LookupsModule,
  ],
  controllers: [MatchingHealthController],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class MatchingServiceModule {}

