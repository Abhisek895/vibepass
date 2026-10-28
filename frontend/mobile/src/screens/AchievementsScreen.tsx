import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useGamificationStore } from '@/store/gamification';
import { Achievement } from '@/services/gamification';
import { theme } from '@/theme';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const isLocked = !achievement.isCompleted;
  const tierColor = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
  }[achievement.tier] || theme.colors.textSecondary;

  return (
    <View style={styles.achievementCard}>
      <LinearGradient
        colors={
          isLocked
            ? ['#F0F0F0', '#E0E0E0']
            : [theme.colors.gradientStart, theme.colors.gradientEnd]
        }
        style={styles.achievementGradient}>
        <View style={[styles.iconContainer, isLocked && styles.iconLocked]}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        </View>
      </LinearGradient>

      <Text
        style={[styles.achievementName, isLocked && styles.achievementNameLocked]}
        numberOfLines={2}>
        {achievement.name}
      </Text>

      <Text
        style={[styles.achievementDesc, isLocked && styles.achievementDescLocked]}
        numberOfLines={2}>
        {achievement.description}
      </Text>

      <View style={styles.achievementFooter}>
        <View style={[styles.tierBadge, { backgroundColor: `${tierColor}20` }]}>
          <Text style={[styles.tierText, { color: tierColor }]}>
            {achievement.tier.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.xpReward}>+{achievement.xpReward} XP</Text>
      </View>

      {isLocked && (
        <View style={styles.lockedOverlay}>
          <Icon name="lock" size={24} color={theme.colors.textLight} />
        </View>
      )}

      {achievement.isCompleted && achievement.completedAt && (
        <View style={styles.completedBadge}>
          <Icon name="check-circle" size={16} color={theme.colors.success} />
        </View>
      )}
    </View>
  );
};

export default function AchievementsScreen() {
  const navigation = useNavigation();
  const { achievements, refreshing, fetchAll } = useGamificationStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const categories = ['profile', 'matching', 'social', 'special', 'level'];
  const completedCount = achievements.filter((a) => a.isCompleted).length;

  const getAchievementsByCategory = (category: string) => {
    return achievements.filter((a) => a.category === category);
  };

  const renderCategorySection = (category: string) => {
    const categoryAchievements = getAchievementsByCategory(category);
    if (categoryAchievements.length === 0) return null;

    const categoryIcons = {
      profile: 'account-circle',
      matching: 'heart',
      social: 'forum',
      special: 'star',
      level: 'trophy',
    };

    return (
      <View key={category} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Icon
            name={categoryIcons[category]}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.categoryTitle}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          <Text style={styles.categoryCount}>
            {categoryAchievements.filter((a) => a.isCompleted).length}/
            {categoryAchievements.length}
          </Text>
        </View>

        <View style={styles.achievementGrid}>
          {categoryAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Header */}
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        style={styles.statsHeader}>
        <View style={styles.statsContent}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{achievements.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {achievements.length > 0
                ? Math.round((completedCount / achievements.length) * 100)
                : 0}
              %
            </Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Achievements List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderCategorySection(item)}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchAll} />
        }
      />
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
  statsHeader: {
    padding: theme.spacing.lg,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textInverse,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  categorySection: {
    marginBottom: theme.spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  categoryCount: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  achievementCard: {
    width: '50%',
    padding: 4,
  },
  achievementGradient: {
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  achievementIcon: {
    fontSize: 48,
  },
  achievementName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    minHeight: 40,
  },
  achievementNameLocked: {
    color: theme.colors.textLight,
  },
  achievementDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    minHeight: 32,
  },
  achievementDescLocked: {
    color: theme.colors.textLight,
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  tierText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  xpReward: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.accent,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 4,
    ...theme.shadows.sm,
  },
});
