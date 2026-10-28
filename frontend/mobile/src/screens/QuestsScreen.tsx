import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useGamificationStore } from '@/store/gamification';
import { QuestList } from '@/components/QuestCard';
import { LevelProgressBar } from '@/components/LevelProgressBar';
import { theme } from '@/theme';

export default function QuestsScreen() {
  const navigation = useNavigation();
  const {
    level,
    dailyQuests,
    weeklyQuests,
    streak,
    refreshing,
    fetchAll,
    dailyCheckIn,
    claimQuest,
  } = useGamificationStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDailyCheckIn = async () => {
    try {
      const result = await dailyCheckIn();
      Alert.alert(
        '🔥 Daily Check-in!',
        `Streak: ${result.currentStreak} days\nEarned: ${result.xpAwarded} XP`,
        [{ text: 'Awesome!' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to check in. Please try again.');
    }
  };

  const handleClaimQuest = async (questId: string) => {
    try {
      await claimQuest(questId);
    } catch (error) {
      Alert.alert('Error', 'Failed to claim quest. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quests</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAll} />
        }>
        {/* Level Progress */}
        {level && (
          <LevelProgressBar
            level={level.level}
            tier={level.tier}
            currentXp={level.xp}
            nextLevelXp={level.xpForNext}
            style={styles.levelProgress}
          />
        )}

        {/* Streak Card */}
        {streak && (
          <TouchableOpacity
            style={styles.streakCard}
            onPress={handleDailyCheckIn}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.streakGradient}>
              <View style={styles.streakContent}>
                <View>
                  <Text style={styles.streakEmoji}>🔥</Text>
                  <Text style={styles.streakNumber}>{streak.currentStreak}</Text>
                  <Text style={styles.streakLabel}>Day Streak</Text>
                </View>
                <View style={styles.streakInfo}>
                  <Text style={styles.streakText}>
                    Longest: {streak.longestStreak} days
                  </Text>
                  <Text style={styles.streakText}>
                    Total: {streak.totalDaysActive} days
                  </Text>
                  <View style={styles.checkInButton}>
                    <Icon name="check-circle" size={20} color={theme.colors.textInverse} />
                    <Text style={styles.checkInText}>Check In</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Quest Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {dailyQuests.filter(q => q.isCompleted).length}/{dailyQuests.length}
            </Text>
            <Text style={styles.statLabel}>Daily Complete</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {weeklyQuests.filter(q => q.isCompleted).length}/{weeklyQuests.length}
            </Text>
            <Text style={styles.statLabel}>Weekly Complete</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {[...dailyQuests, ...weeklyQuests].filter(q => q.canClaim).length}
            </Text>
            <Text style={styles.statLabel}>Ready to Claim</Text>
          </View>
        </View>

        {/* Quests List */}
        <QuestList
          dailyQuests={dailyQuests}
          weeklyQuests={weeklyQuests}
          onClaimQuest={handleClaimQuest}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  levelProgress: {
    marginBottom: theme.spacing.md,
  },
  streakCard: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  streakGradient: {
    padding: theme.spacing.lg,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  streakNumber: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    textAlign: 'center',
    marginVertical: theme.spacing.xs,
  },
  streakLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textInverse,
    textAlign: 'center',
  },
  streakInfo: {
    alignItems: 'flex-end',
  },
  streakText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.xs,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.sm,
  },
  checkInText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    marginLeft: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
