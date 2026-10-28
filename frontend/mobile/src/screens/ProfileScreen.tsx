import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuthStore } from '@/store';
import { theme } from '@/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const mockUser = {
    id: '1',
    name: 'Alex',
    age: 25,
    bio: 'Adventure seeker 🏔️ | Coffee enthusiast ☕ | Dog lover 🐕',
    photos: [
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/women/45.jpg',
    ],
    location: { city: 'New York', distance: 0 },
    interests: ['Travel', 'Photography', 'Hiking', 'Coffee', 'Music'],
    occupation: 'Product Designer',
    education: 'Bachelor of Arts',
    height: 170,
    verified: true,
  };

  const currentUser = user || mockUser;

  const settingsSections = [
    {
      title: 'Account Settings',
      items: [
        { icon: 'cog', label: 'Settings', badge: null },
        { icon: 'shield-check', label: 'Safety & Privacy', badge: null },
        { icon: 'bell', label: 'Notifications', badge: '3' },
        { icon: 'email', label: 'Email Preferences', badge: null },
      ],
    },
    {
      title: 'Discovery',
      items: [
        { icon: 'map-marker-radius', label: 'Location', badge: currentUser.location?.city },
        { icon: 'account-search', label: 'Discovery Preferences', badge: null },
      ],
    },
    {
      title: 'Premium',
      items: [
        { icon: 'star', label: 'Get VibePass Premium', badge: null, highlight: true },
        { icon: 'gift', label: 'Promo Codes', badge: null },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="pencil" size={20} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Profile Photo */}
      <View style={styles.profilePhotoContainer}>
        <View style={styles.photoWrapper}>
          <Image
            source={{ uri: currentUser.photos[0] || 'https://via.placeholder.com/200' }}
            style={styles.profilePhoto}
          />
          {currentUser.verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="check-decagram" size={24} color={theme.colors.info} />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.addPhotoButton}>
          <Icon name="camera-plus" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Text style={styles.name}>
          {currentUser.name}, {currentUser.age}
        </Text>
        <Text style={styles.occupation}>{currentUser.occupation}</Text>
        <Text style={styles.bio}>{currentUser.bio}</Text>
      </View>

      {/* Interests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <TouchableOpacity>
            <Icon name="pencil" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.interestsGrid}>
          {currentUser.interests?.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="heart" size={24} color={theme.colors.like} />
          <Text style={styles.statNumber}>127</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="star-four-points" size={24} color={theme.colors.primary} />
          <Text style={styles.statNumber}>43</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="lightning-bolt" size={24} color={theme.colors.superLike} />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Super Likes</Text>
        </View>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>{section.title}</Text>
          <View style={styles.settingsCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingsItem,
                  itemIndex !== section.items.length - 1 && styles.settingsItemBorder,
                ]}
                activeOpacity={0.7}>
                <View style={styles.settingsItemLeft}>
                  <View
                    style={[
                      styles.settingsIcon,
                      item.highlight && styles.settingsIconHighlight,
                    ]}>
                    <Icon
                      name={item.icon}
                      size={20}
                      color={item.highlight ? theme.colors.primary : theme.colors.text}
                    />
                  </View>
                  <Text
                    style={[
                      styles.settingsLabel,
                      item.highlight && styles.settingsLabelHighlight,
                    ]}>
                    {item.label}
                  </Text>
                </View>
                <View style={styles.settingsItemRight}>
                  {item.badge && (
                    <View
                      style={[
                        styles.badge,
                        !isNaN(Number(item.badge)) && styles.badgeNumber,
                      ]}>
                      <Text
                        style={[
                          styles.badgeText,
                          !isNaN(Number(item.badge)) && styles.badgeTextNumber,
                        ]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 200,
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
  },
  editButton: {
    position: 'absolute',
    top: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: theme.spacing.lg,
  },
  photoWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.surface,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 4,
  },
  addPhotoButton: {
    position: 'absolute',
    right: -10,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  name: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  occupation: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  bio: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  interestTag: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    margin: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  interestText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  settingsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  settingsSectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceLight,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsIconHighlight: {
    backgroundColor: `${theme.colors.primary}20`,
  },
  settingsLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
  settingsLabelHighlight: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  badgeNumber: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  badgeTextNumber: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.bold,
  },
  logoutButton: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
});
