import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../../src/database/database.module';
import { SafetyModule } from '../../../src/modules/safety/safety.module';
import { AdminModule } from '../../../src/modules/admin/admin.module';
import { AuthModule } from '../../../src/modules/auth/auth.module';
import { EventBusService } from '../../../libs/contracts/src/event-bus.service';

@Controller('health')
class SafetyHealthController {
  @Get()
  check() {
    return { status: 'UP', service: 'safety-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    SafetyModule,
    AdminModule,
  ],
  controllers: [SafetyHealthController],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class SafetyServiceModule {}

