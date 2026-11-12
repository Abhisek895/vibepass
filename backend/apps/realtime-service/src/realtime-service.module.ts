import { Controller, Get, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../../src/database/database.module';
import { ChatModule } from '../../../src/modules/chat/chat.module';
import { VoiceModule } from '../../../src/modules/voice/voice.module';
import { MessagesModule } from '../../../src/modules/messages/messages.module';
import { NotificationsModule } from '../../../src/modules/notifications/notifications.module';
import { EventBusService } from '../../../libs/contracts/src/event-bus.service';
import { DomainEvent, MatchFormedEvent } from '../../../libs/contracts/src/events';

@Controller('health')
class RealtimeHealthController {
  @Get()
  check() {
    return { status: 'UP', service: 'realtime-service', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ChatModule,
    VoiceModule,
    MessagesModule,
    NotificationsModule,
  ],
  controllers: [RealtimeHealthController],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class RealtimeServiceModule implements OnModuleInit {
  constructor(private readonly eventBus: EventBusService) {}

  async onModuleInit() {
    // Listen for cross-service match formed events to notify connected clients in real-time
    await this.eventBus.subscribe('match.formed', (event: DomainEvent) => {
      const matchEvent = event as MatchFormedEvent;
      console.log(
        `⚡ [Realtime Service] Match formed event received for User A: ${matchEvent.payload.userAId} and User B: ${matchEvent.payload.userBId}`,
      );
    });
  }
}

