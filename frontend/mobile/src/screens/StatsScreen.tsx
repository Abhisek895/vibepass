import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useGamificationStore } from '@/store/gamification';
import { LevelProgressBar } from '@/components/LevelProgressBar';
import { theme } from '@/theme';

export default function StatsScreen() {
  const navigation = useNavigation();
  const { level, stats, insights, refreshing, fetchAll } = useGamificationStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return 'trending-up';
    if (trend === 'down') return 'trending-down';
    return 'minus';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return theme.colors.success;
    if (trend === 'down') return theme.colors.error;
    return theme.colors.textSecondary;
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
        <Text style={styles.headerTitle}>Your Stats</Text>
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

        {/* Ranking Card */}
        {insights && (
          <LinearGradient
            colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
            style={styles.rankingCard}>
            <Text style={styles.rankingTitle}>Your Ranking</Text>
            <Text style={styles.rankingPercentile}>
              Top {100 - Math.round(insights.ranking.attractiveness)}%
            </Text>
            <Text style={styles.rankingSubtitle}>
              You're more attractive than {Math.round(insights.ranking.attractiveness)}% of users
            </Text>
          </LinearGradient>
        )}

        {/* Profile Views */}
        {insights && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="eye" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Profile Views</Text>
              <Icon
                name={getTrendIcon(insights.profileViews.trend)}
                size={20}
                color={getTrendColor(insights.profileViews.trend)}
              />
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.profileViews.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.profileViews.today}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.profileViews.thisWeek}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
          </View>
        )}

        {/* Likes */}
        {insights && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="heart" size={24} color={theme.colors.like} />
              <Text style={styles.sectionTitle}>Likes</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.likes.received}</Text>
                <Text style={styles.statLabel}>Received</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.likes.receivedToday}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.likes.superLikes}</Text>
                <Text style={styles.statLabel}>Super Likes</Text>
              </View>
            </View>
          </View>
        )}

        {/* Matches */}
        {insights && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="star-four-points" size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Matches</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.matches.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.matches.today}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{Math.round(insights.matches.matchRate)}%</Text>
                <Text style={styles.statLabel}>Match Rate</Text>
              </View>
            </View>
            <View style={styles.rateLevel}>
              <Text style={styles.rateLevelText}>{insights.matches.rateLevel}</Text>
            </View>
          </View>
        )}

        {/* Engagement */}
        {insights && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="message-text" size={24} color={theme.colors.secondary} />
              <Text style={styles.sectionTitle}>Engagement</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.engagement.messages}</Text>
                <Text style={styles.statLabel}>Messages</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {Math.round(insights.engagement.replyRate)}%
                </Text>
                <Text style={styles.statLabel}>Reply Rate</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{insights.engagement.responsiveness}</Text>
                <Text style={styles.statLabel}>Speed</Text>
              </View>
            </View>
          </View>
        )}

        {/* Tips */}
        {insights && insights.tips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="lightbulb" size={24} color={theme.colors.accent} />
              <Text style={styles.sectionTitle}>Tips for You</Text>
            </View>
            {insights.tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
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
  rankingCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  rankingTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.sm,
  },
  rankingPercentile: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.xs,
  },
  rankingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textInverse,
    opacity: 0.9,
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
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -4,
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
  statValue: {
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
  rateLevel: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  rateLevelText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.success,
  },
  tipCard: {
    backgroundColor: `${theme.colors.accent}20`,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
  },
});
