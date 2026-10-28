import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useDiscoveryStore } from '@/store';
import { User } from '@/types';
import { theme } from '@/theme';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

export default function DiscoveryScreen() {
  const swiperRef = useRef<any>(null);
  const { users, currentIndex, loading, fetchUsers, swipeLeft, swipeRight, superLike } = useDiscoveryStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSwipeLeft = (cardIndex: number) => {
    const user = users[cardIndex];
    if (user) {
      ReactNativeHapticFeedback.trigger('impactLight');
      swipeLeft(user.id);
    }
  };

  const handleSwipeRight = (cardIndex: number) => {
    const user = users[cardIndex];
    if (user) {
      ReactNativeHapticFeedback.trigger('impactMedium');
      swipeRight(user.id);
    }
  };

  const handleSuperLike = () => {
    const user = users[currentIndex];
    if (user) {
      ReactNativeHapticFeedback.trigger('notificationSuccess');
      superLike(user.id);
      swiperRef.current?.swipeTop();
    }
  };

  const renderCard = (user: User) => {
    if (!user) return null;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: user.photos[0] || 'https://via.placeholder.com/400' }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {user.name}, {user.age}
              </Text>
              {user.verified && (
                <Icon name="check-decagram" size={24} color={theme.colors.info} />
              )}
            </View>

            {user.location && (
              <View style={styles.locationRow}>
                <Icon name="map-marker" size={16} color={theme.colors.textInverse} />
                <Text style={styles.location}>
                  {user.location.distance ? `${user.location.distance} km away` : user.location.city}
                </Text>
              </View>
            )}
          </View>

          {user.occupation && (
            <View style={styles.infoRow}>
              <Icon name="briefcase" size={16} color={theme.colors.textInverse} />
              <Text style={styles.infoText}>{user.occupation}</Text>
            </View>
          )}

          <Text style={styles.bio} numberOfLines={3}>
            {user.bio}
          </Text>

          {user.interests && user.interests.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.interestsContainer}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Swipe indicators */}
        <View style={styles.overlayContainer}>
          <View style={[styles.overlay, styles.likeOverlay]}>
            <Text style={styles.overlayText}>LIKE</Text>
          </View>
          <View style={[styles.overlay, styles.nopeOverlay]}>
            <Text style={styles.overlayText}>NOPE</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyCard = () => (
    <View style={[styles.card, styles.emptyCard]}>
      <Icon name="magnify" size={80} color={theme.colors.textLight} />
      <Text style={styles.emptyText}>No more profiles</Text>
      <TouchableOpacity style={styles.reloadButton} onPress={fetchUsers}>
        <Text style={styles.reloadButtonText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoContainer}>
          <Text style={styles.logo}>VibePass</Text>
        </LinearGradient>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="tune" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        {users.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={users}
            renderCard={renderCard}
            onSwipedLeft={handleSwipeLeft}
            onSwipedRight={handleSwipeRight}
            onSwipedTop={(cardIndex) => {
              const user = users[cardIndex];
              if (user) superLike(user.id);
            }}
            cardIndex={0}
            backgroundColor="transparent"
            stackSize={3}
            stackSeparation={15}
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: theme.colors.nope,
                    color: theme.colors.textInverse,
                    fontSize: 24,
                    fontWeight: 'bold',
                    padding: 10,
                    borderRadius: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: theme.colors.like,
                    color: theme.colors.textInverse,
                    fontSize: 24,
                    fontWeight: 'bold',
                    padding: 10,
                    borderRadius: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
              top: {
                title: 'SUPER LIKE',
                style: {
                  label: {
                    backgroundColor: theme.colors.superLike,
                    color: theme.colors.textInverse,
                    fontSize: 24,
                    fontWeight: 'bold',
                    padding: 10,
                    borderRadius: 8,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                },
              },
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
          />
        ) : (
          renderEmptyCard()
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.nopeButton]}
          onPress={() => swiperRef.current?.swipeLeft()}>
          <Icon name="close" size={32} color={theme.colors.nope} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={handleSuperLike}>
          <Icon name="star" size={28} color={theme.colors.superLike} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => swiperRef.current?.swipeRight()}>
          <Icon name="heart" size={32} color={theme.colors.like} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  logoContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  logo: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  swiperContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
  },
  cardHeader: {
    marginBottom: theme.spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    marginRight: theme.spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textInverse,
    marginLeft: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textInverse,
    marginLeft: theme.spacing.sm,
  },
  bio: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textInverse,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
  },
  interestsContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  interestText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 4,
  },
  likeOverlay: {
    top: 50,
    left: 30,
    borderColor: theme.colors.like,
    transform: [{ rotate: '-15deg' }],
  },
  nopeOverlay: {
    top: 50,
    right: 30,
    borderColor: theme.colors.nope,
    transform: [{ rotate: '15deg' }],
  },
  overlayText: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  emptyCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  reloadButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  reloadButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.md,
  },
  nopeButton: {
    borderWidth: 2,
    borderColor: theme.colors.nope,
  },
  superLikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.superLike,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: theme.colors.like,
  },
});
