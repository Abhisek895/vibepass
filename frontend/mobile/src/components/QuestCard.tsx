import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Quest } from '@/services/gamification';
import { theme } from '@/theme';

interface QuestCardProps {
  quest: Quest;
  onClaim: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim }) => {
  const progressPercentage = (quest.progress / quest.target) * 100;
  const difficultyColor = {
    easy: theme.colors.success,
    medium: theme.colors.warning,
    hard: theme.colors.error,
  }[quest.difficulty] || theme.colors.textSecondary;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{quest.name}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: `${difficultyColor}20` }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {quest.difficulty}
            </Text>
          </View>
        </View>
        <View style={styles.rewardBadge}>
          <Icon name="lightning-bolt" size={16} color={theme.colors.accent} />
          <Text style={styles.rewardText}>{quest.xpReward} XP</Text>
        </View>
      </View>

      <Text style={styles.description}>{quest.description}</Text>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={
              quest.isCompleted
                ? [theme.colors.success, theme.colors.success]
                : [theme.colors.gradientStart, theme.colors.gradientEnd]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBar,
              { width: `${Math.min(progressPercentage, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {quest.progress} / {quest.target}
        </Text>
      </View>

      {/* Item Reward */}
      {quest.itemReward && (
        <View style={styles.itemReward}>
          <Icon name="gift" size={16} color={theme.colors.primary} />
          <Text style={styles.itemRewardText}>
            Bonus: {quest.itemReward.type === 'boost' && '1 Boost'}
            {quest.itemReward.type === 'super_likes' && `${quest.itemReward.count} Super Likes`}
            {quest.itemReward.type === 'premium_trial' && `${quest.itemReward.hours}h Premium`}
          </Text>
        </View>
      )}

      {/* Claim Button */}
      {quest.canClaim && !quest.isCompleted && (
        <TouchableOpacity onPress={onClaim} style={styles.claimButton}>
          <LinearGradient
            colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
            style={styles.claimGradient}>
            <Text style={styles.claimText}>Claim Reward</Text>
            <Icon name="chevron-right" size={20} color={theme.colors.textInverse} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {quest.isCompleted && (
        <View style={styles.completedBadge}>
          <Icon name="check-circle" size={20} color={theme.colors.success} />
          <Text style={styles.completedText}>Completed!</Text>
        </View>
      )}
    </View>
  );
};

interface QuestListProps {
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  onClaimQuest: (questId: string) => void;
}

export const QuestList: React.FC<QuestListProps> = ({
  dailyQuests,
  weeklyQuests,
  onClaimQuest,
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Daily Quests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="calendar-today" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Daily Quests</Text>
          <Text style={styles.sectionSubtitle}>Resets in 12h</Text>
        </View>
        {dailyQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClaim={() => onClaimQuest(quest.id)}
          />
        ))}
      </View>

      {/* Weekly Quests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="calendar-week" size={24} color={theme.colors.secondary} />
          <Text style={styles.sectionTitle}>Weekly Quests</Text>
          <Text style={styles.sectionSubtitle}>Resets in 3d</Text>
        </View>
        {weeklyQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClaim={() => onClaimQuest(quest.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  difficultyText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.accent}20`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  rewardText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent,
    marginLeft: 4,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    minWidth: 50,
    textAlign: 'right',
  },
  itemReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}10`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  itemRewardText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  claimButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginTop: theme.spacing.sm,
  },
  claimGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  claimText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    marginRight: theme.spacing.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    backgroundColor: `${theme.colors.success}20`,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  completedText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
  },
});
