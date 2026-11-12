export interface BaseDomainEvent {
  eventId: string;
  eventType: string;
  occurredAt: string;
  correlationId?: string;
}

export interface UserRegisteredEvent extends BaseDomainEvent {
  eventType: 'user.registered';
  payload: {
    userId: string;
    email: string;
    username?: string;
    age?: number;
  };
}

export interface UserUpdatedEvent extends BaseDomainEvent {
  eventType: 'user.updated';
  payload: {
    userId: string;
    username?: string;
    bio?: string;
    genderPreference?: string;
  };
}

export interface MatchFormedEvent extends BaseDomainEvent {
  eventType: 'match.formed';
  payload: {
    matchId: string;
    userAId: string;
    userBId: string;
    compatibilityScore: number;
    matchedAt: string;
  };
}

export interface MessageSentEvent extends BaseDomainEvent {
  eventType: 'chat.message_sent';
  payload: {
    chatId: string;
    messageId: string;
    senderId: string;
    recipientId: string;
    content: string;
    sentAt: string;
  };
}

export interface UserBannedEvent extends BaseDomainEvent {
  eventType: 'user.banned';
  payload: {
    userId: string;
    reason: string;
    bannedBy: string;
    bannedAt: string;
  };
}

export interface UserBlockedEvent extends BaseDomainEvent {
  eventType: 'user.blocked';
  payload: {
    blockerId: string;
    blockedUserId: string;
    blockedAt: string;
  };
}

export type DomainEvent =
  | UserRegisteredEvent
  | UserUpdatedEvent
  | MatchFormedEvent
  | MessageSentEvent
  | UserBannedEvent
  | UserBlockedEvent;

