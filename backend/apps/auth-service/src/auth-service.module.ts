import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../../src/database/database.module';
import { AuthModule } from '../../../src/modules/auth/auth.module';
import { UsersModule } from '../../../src/modules/users/users.module';
import { EventBusService } from '../../../libs/contracts/src/event-bus.service';

@Controller('health')
class AuthHealthController {
  @Get()
  check() {
    return { status: 'UP', service: 'auth-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AuthHealthController],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class AuthServiceModule {}

