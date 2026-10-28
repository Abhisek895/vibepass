import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useMatchStore } from '@/store';
import { Match } from '@/types';
import { theme } from '@/theme';

export default function MatchesScreen() {
  const navigation = useNavigation<any>();
  const { matches, loading, fetchMatches } = useMatchStore();

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleMatchPress = (match: Match) => {
    navigation.navigate('Chat', { matchId: match.id, user: match.user });
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => handleMatchPress(item)}
      activeOpacity={0.8}>
      <Image
        source={{ uri: item.user.photos[0] || 'https://via.placeholder.com/200' }}
        style={styles.matchImage}
      />

      {item.user.verified && (
        <View style={styles.verifiedBadge}>
          <Icon name="check-decagram" size={16} color={theme.colors.info} />
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.matchGradient}
      />

      <View style={styles.matchInfo}>
        <Text style={styles.matchName} numberOfLines={1}>
          {item.user.name}
        </Text>
        {item.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.text}
          </Text>
        )}
      </View>

      {item.unreadCount && item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="heart-outline" size={80} color={theme.colors.textLight} />
      <Text style={styles.emptyTitle}>No matches yet</Text>
      <Text style={styles.emptySubtitle}>
        Keep swiping to find your perfect match!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={styles.headerRight}>
          <Text style={styles.matchCount}>{matches.length}</Text>
        </View>
      </View>

      {/* New matches section */}
      {matches.length > 0 && (
        <View style={styles.newMatchesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Matches</Text>
            <Icon name="star-four-points" size={20} color={theme.colors.primary} />
          </View>
          <FlatList
            horizontal
            data={matches.slice(0, 5)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.newMatchCard}
                onPress={() => handleMatchPress(item)}>
                <Image
                  source={{ uri: item.user.photos[0] }}
                  style={styles.newMatchImage}
                />
                <LinearGradient
                  colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                  style={styles.newMatchBorder}
                />
                <Text style={styles.newMatchName} numberOfLines={1}>
                  {item.user.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newMatchesList}
          />
        </View>
      )}

      {/* Messages section */}
      <View style={styles.messagesSection}>
        <Text style={styles.sectionTitle}>Messages</Text>
        {matches.length > 0 ? (
          <FlatList
            data={matches}
            renderItem={renderMatch}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.matchesList}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={fetchMatches}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  headerRight: {
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchCount: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  newMatchesSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  newMatchesList: {
    paddingHorizontal: theme.spacing.lg,
  },
  newMatchCard: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  newMatchImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  newMatchBorder: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    top: -3,
    left: -3,
  },
  newMatchName: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    maxWidth: 80,
    textAlign: 'center',
  },
  messagesSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  matchesList: {
    paddingTop: theme.spacing.md,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchGradient: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verifiedBadge: {
    position: 'absolute',
    left: 50,
    top: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 2,
  },
  matchInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  matchName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  lastMessage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
