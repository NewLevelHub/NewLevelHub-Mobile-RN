import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import type { User } from '@/shared/types';

const ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.SUPERADMIN]: 'Суперадмин',
  [USER_ROLES.COMPANY_ADMIN]: 'Админ компании',
  [USER_ROLES.EMPLOYEE]: 'Сотрудник',
  [USER_ROLES.GUEST]: 'Гость',
  [USER_ROLES.RECEPTION]: 'Ресепшн',
  [USER_ROLES.SERVICE_MANAGER]: 'Менеджер',
};

const ROLE_COLORS: Record<string, string> = {
  [USER_ROLES.SUPERADMIN]: colors.brand,
  [USER_ROLES.COMPANY_ADMIN]: colors.info,
  [USER_ROLES.EMPLOYEE]: colors.textMuted,
  [USER_ROLES.GUEST]: colors.textSubtle,
  [USER_ROLES.RECEPTION]: colors.warning,
  [USER_ROLES.SERVICE_MANAGER]: colors.success,
};

interface Props {
  user: User;
  onPress?: () => void;
}

function getInitials(user: User): string {
  const first = user.first_name?.[0] ?? '';
  const last = user.last_name?.[0] ?? '';
  return (first + last).toUpperCase() || user.email[0].toUpperCase();
}

function AdminUserItemComponent({ user, onPress }: Props) {
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const roleBadgeColor = ROLE_COLORS[user.role] ?? colors.textMuted;
  const initials = getInitials(user);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        {user.avatar ? (
          <Text style={styles.avatarText}>{initials}</Text>
        ) : (
          <Text style={styles.avatarText}>{initials}</Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user.full_name || `${user.first_name} ${user.last_name}`.trim() || '—'}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
        {user.company_name ? (
          <Text style={styles.company} numberOfLines={1}>
            {user.company_name}
          </Text>
        ) : null}
      </View>

      <View style={styles.badges}>
        <View style={[styles.roleBadge, { backgroundColor: roleBadgeColor + '1A' }]}>
          <Text style={[styles.roleBadgeText, { color: roleBadgeColor }]}>{roleLabel}</Text>
        </View>
        <View style={[styles.statusDot, user.is_email_verified ? styles.dotActive : styles.dotInactive]} />
      </View>
    </Pressable>
  );
}

export const AdminUserItem = React.memo(AdminUserItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  company: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.success,
  },
  dotInactive: {
    backgroundColor: colors.textSubtle,
  },
  pressed: {
    opacity: 0.7,
  },
});
