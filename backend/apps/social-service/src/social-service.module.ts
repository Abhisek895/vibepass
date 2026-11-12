import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../../src/database/database.module';
import { PostsModule } from '../../../src/modules/posts/posts.module';
import { RoomsModule } from '../../../src/modules/rooms/rooms.module';
import { AuthModule } from '../../../src/modules/auth/auth.module';
import { EventBusService } from '../../../libs/contracts/src/event-bus.service';

@Controller('health')
class SocialHealthController {
  @Get()
  check() {
    return { status: 'UP', service: 'social-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    RoomsModule,
  ],
  controllers: [SocialHealthController],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class SocialServiceModule {}

