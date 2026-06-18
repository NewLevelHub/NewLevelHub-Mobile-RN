import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { colors } from '@/core/theme/colors';
import type { DashboardUser } from '@/features/core/types/dashboard';

interface Props {
  user: DashboardUser;
  unreadCount?: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Доброе утро';
  if (hour >= 12 && hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase() || '?';
}

export function DashboardHeader({ user, unreadCount }: Props) {
  const greeting = getGreeting();
  const initials = getInitials(user.full_name);
  const showBadge = unreadCount != null && unreadCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {user.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount! > 99 ? '99+' : String(unreadCount)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.name} numberOfLines={1}>
          {user.full_name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.raised,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: colors.onError,
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  greeting: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
});
