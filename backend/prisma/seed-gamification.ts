import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGamification() {
  console.log('🎮 Seeding gamification data...');

  // Seed Achievements
  const achievements = [
    // Profile Achievements
    {
      key: 'first_impression',
      name: 'First Impression',
      description: 'Complete your profile',
      category: 'profile',
      icon: '🌟',
      xpReward: 50,
      tier: 'bronze',
      requirement: JSON.stringify({ profileComplete: true }),
    },
    {
      key: 'picture_perfect',
      name: 'Picture Perfect',
      description: 'Add 6 photos to your profile',
      category: 'profile',
      icon: '📸',
      xpReward: 100,
      tier: 'silver',
      requirement: JSON.stringify({ photoCount: 6 }),
    },
    {
      key: 'verified_user',
      name: 'Verified User',
      description: 'Get your profile verified',
      category: 'profile',
      icon: '✅',
      xpReward: 75,
      tier: 'gold',
      requirement: JSON.stringify({ verified: true }),
    },

    // Matching Achievements
    {
      key: 'first_match',
      name: 'First Match',
      description: 'Get your first match',
      category: 'matching',
      icon: '💘',
      xpReward: 20,
      tier: 'bronze',
      requirement: JSON.stringify({ matchCount: 1 }),
    },
    {
      key: 'hot_streak',
      name: 'Hot Streak',
      description: 'Get 10 matches in one day',
      category: 'matching',
      icon: '🔥',
      xpReward: 100,
      tier: 'gold',
      requirement: JSON.stringify({ matchesInDay: 10 }),
    },
    {
      key: 'century_club',
      name: 'Century Club',
      description: 'Reach 100 total matches',
      category: 'matching',
      icon: '💯',
      xpReward: 500,
      tier: 'platinum',
      requirement: JSON.stringify({ totalMatches: 100 }),
    },
    {
      key: 'royalty',
      name: 'Royalty',
      description: 'Reach 1000 total matches',
      category: 'matching',
      icon: '👑',
      xpReward: 2000,
      tier: 'diamond',
      requirement: JSON.stringify({ totalMatches: 1000 }),
    },

    // Social Achievements
    {
      key: 'ice_breaker',
      name: 'Ice Breaker',
      description: 'Send 100 first messages',
      category: 'social',
      icon: '💬',
      xpReward: 200,
      tier: 'silver',
      requirement: JSON.stringify({ firstMessages: 100 }),
    },
    {
      key: 'charming',
      name: 'Charming',
      description: 'Achieve 50% reply rate',
      category: 'social',
      icon: '🎭',
      xpReward: 150,
      tier: 'gold',
      requirement: JSON.stringify({ replyRate: 50 }),
    },
    {
      key: 'seven_day_streak',
      name: 'Dedicated',
      description: 'Maintain a 7-day login streak',
      category: 'social',
      icon: '📱',
      xpReward: 100,
      tier: 'silver',
      requirement: JSON.stringify({ streak: 7 }),
    },
    {
      key: 'thirty_day_streak',
      name: 'Committed',
      description: 'Maintain a 30-day login streak',
      category: 'social',
      icon: '🏆',
      xpReward: 500,
      tier: 'platinum',
      requirement: JSON.stringify({ streak: 30 }),
    },

    // Special Achievements
    {
      key: 'sniper',
      name: 'Sniper',
      description: 'Achieve 90% match rate',
      category: 'special',
      icon: '🎯',
      xpReward: 300,
      tier: 'platinum',
      requirement: JSON.stringify({ matchRate: 90 }),
    },
    {
      key: 'romantic',
      name: 'Romantic',
      description: 'Send 100 compliments',
      category: 'special',
      icon: '🌹',
      xpReward: 200,
      tier: 'gold',
      requirement: JSON.stringify({ compliments: 100 }),
    },
    {
      key: 'face_time',
      name: 'Face Time',
      description: 'Complete 10 video calls',
      category: 'special',
      icon: '🎥',
      xpReward: 250,
      tier: 'gold',
      requirement: JSON.stringify({ videoCalls: 10 }),
    },

    // Level Achievements
    {
      key: 'level_3_charmer',
      name: 'Charmer',
      description: 'Reach level 3',
      category: 'level',
      icon: '⭐',
      xpReward: 50,
      tier: 'bronze',
      requirement: JSON.stringify({ level: 3 }),
    },
    {
      key: 'level_5_legend',
      name: 'Legend',
      description: 'Reach level 5',
      category: 'level',
      icon: '⭐⭐',
      xpReward: 200,
      tier: 'silver',
      requirement: JSON.stringify({ level: 5 }),
    },
    {
      key: 'level_8_superstar',
      name: 'Superstar',
      description: 'Reach level 8',
      category: 'level',
      icon: '⭐⭐⭐',
      xpReward: 1000,
      tier: 'gold',
      requirement: JSON.stringify({ level: 8 }),
    },
    {
      key: 'level_10_vip',
      name: 'VIP Hall of Fame',
      description: 'Reach level 10',
      category: 'level',
      icon: '⭐⭐⭐⭐',
      xpReward: 5000,
      tier: 'diamond',
      requirement: JSON.stringify({ level: 10 }),
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: achievement,
      create: achievement,
    });
  }

  console.log(`✅ Created ${achievements.length} achievements`);

  // Seed Daily Quests
  const dailyQuests = [
    {
      key: 'swipe_20',
      name: 'Swipe Right',
      description: 'Swipe on 20 profiles',
      type: 'daily',
      target: 20,
      xpReward: 20,
      itemReward: JSON.stringify({ type: 'boost', count: 1 }),
      difficulty: 'easy',
    },
    {
      key: 'match_3',
      name: 'Triple Match',
      description: 'Match with 3 people',
      type: 'daily',
      target: 3,
      xpReward: 30,
      itemReward: JSON.stringify({ type: 'super_likes', count: 5 }),
      difficulty: 'medium',
    },
    {
      key: 'send_5_messages',
      name: 'Conversationalist',
      description: 'Send 5 first messages',
      type: 'daily',
      target: 5,
      xpReward: 25,
      difficulty: 'medium',
    },
    {
      key: 'complete_profile',
      name: 'Polish Your Profile',
      description: 'Update your profile',
      type: 'daily',
      target: 1,
      xpReward: 50,
      difficulty: 'easy',
    },
    {
      key: 'add_photo',
      name: 'Picture Day',
      description: 'Add a new photo',
      type: 'daily',
      target: 1,
      xpReward: 20,
      difficulty: 'easy',
    },
    {
      key: 'active_30min',
      name: 'Active User',
      description: 'Be active for 30 minutes',
      type: 'daily',
      target: 1,
      xpReward: 10,
      difficulty: 'easy',
    },
  ];

  for (const quest of dailyQuests) {
    await prisma.dailyQuest.upsert({
      where: { key: quest.key },
      update: quest,
      create: quest,
    });
  }

  console.log(`✅ Created ${dailyQuests.length} daily quests`);

  // Seed Weekly Quests
  const weeklyQuests = [
    {
      key: 'weekly_matches_10',
      name: 'Match Maker',
      description: 'Get 10 matches this week',
      type: 'weekly',
      target: 10,
      xpReward: 100,
      itemReward: JSON.stringify({ type: 'boost', count: 1 }),
      difficulty: 'medium',
    },
    {
      key: 'weekly_messages_50',
      name: 'Chatty',
      description: 'Send 50 messages this week',
      type: 'weekly',
      target: 50,
      xpReward: 150,
      itemReward: JSON.stringify({ type: 'super_likes', count: 10 }),
      difficulty: 'hard',
    },
    {
      key: 'weekly_streak_7',
      name: 'Consistent',
      description: 'Login 7 days in a row',
      type: 'weekly',
      target: 7,
      xpReward: 200,
      itemReward: JSON.stringify({ type: 'premium_trial', hours: 24 }),
      difficulty: 'medium',
    },
  ];

  for (const quest of weeklyQuests) {
    await prisma.dailyQuest.upsert({
      where: { key: quest.key },
      update: quest,
      create: quest,
    });
  }

  console.log(`✅ Created ${weeklyQuests.length} weekly quests`);

  // Seed Icebreaker Templates
  const icebreakers = [
    {
      category: 'funny',
      text: "If you could have dinner with anyone, dead or alive, who would it be and why? (And please don't say 'dead people don't eat' 😂)",
      tags: JSON.stringify(['humor', 'conversation_starter']),
    },
    {
      category: 'flirty',
      text: "I noticed your smile in your photos - it's absolutely captivating! What's your secret? ☺️",
      tags: JSON.stringify(['compliment', 'flirty']),
    },
    {
      category: 'casual',
      text: "Hey! I saw you're into [interest]. That's awesome! What got you into it?",
      tags: JSON.stringify(['interest_based', 'casual']),
    },
    {
      category: 'question',
      text: "Quick question: Pizza or tacos? Your answer will determine if we can be friends 🍕🌮",
      tags: JSON.stringify(['food', 'playful', 'question']),
    },
    {
      category: 'deep',
      text: "What's something you're passionate about that most people don't know?",
      tags: JSON.stringify(['deep', 'meaningful']),
    },
    {
      category: 'funny',
      text: "I'm doing a survey: Is a hot dog a sandwich? This is very important for our potential friendship 🌭",
      tags: JSON.stringify(['humor', 'debate']),
    },
    {
      category: 'casual',
      text: "Your [photo/bio detail] caught my eye! Tell me more about that!",
      tags: JSON.stringify(['profile_based', 'casual']),
    },
    {
      category: 'flirty',
      text: "I had to swipe right - someone this attractive must have an amazing personality too 😊",
      tags: JSON.stringify(['compliment', 'flirty']),
    },
  ];

  for (const icebreaker of icebreakers) {
    await prisma.icebreakerTemplate.create({
      data: icebreaker,
    });
  }

  console.log(`✅ Created ${icebreakers.length} icebreaker templates`);

  console.log('🎉 Gamification seeding completed!');
}

async function main() {
  try {
    await seedGamification();
  } catch (error) {
    console.error('❌ Error seeding gamification data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
