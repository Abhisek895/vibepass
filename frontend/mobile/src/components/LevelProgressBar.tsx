import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@/theme';

interface LevelProgressBarProps {
  level: number;
  tier: string;
  currentXp: number;
  nextLevelXp: number;
  style?: ViewStyle;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  level,
  tier,
  currentXp,
  nextLevelXp,
  style,
}) => {
  const progress = nextLevelXp > 0 ? (currentXp / nextLevelXp) * 100 : 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <LinearGradient
            colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
            style={styles.levelGradient}>
            <Text style={styles.levelNumber}>{level}</Text>
          </LinearGradient>
        </View>
        <View style={styles.tierInfo}>
          <Text style={styles.tierText}>{tier}</Text>
          <Text style={styles.xpText}>
            {currentXp} / {nextLevelXp} XP
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]}
        />
      </View>

      <Text style={styles.progressText}>{Math.round(progress)}% to next level</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  levelBadge: {
    width: 60,
    height: 60,
    marginRight: theme.spacing.md,
  },
  levelGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  levelNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  tierInfo: {
    flex: 1,
  },
  tierText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  xpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
