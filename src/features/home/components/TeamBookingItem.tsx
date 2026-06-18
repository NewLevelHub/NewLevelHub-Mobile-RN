import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { TeamBookingToday } from '@/features/core/types/dashboard';

const STATUS_MAP: Record<string, { label: string; style: 'confirmed' | 'warning' | 'error' | 'default' }> = {
  confirmed:  { label: 'Подтв.',     style: 'confirmed' },
  completed:  { label: 'Завершено',  style: 'confirmed' },
  pending:    { label: 'Ожидание',   style: 'warning' },
  cancelled:  { label: 'Отменено',   style: 'error' },
  no_show:    { label: 'Не пришёл',  style: 'error' },
};

function formatTimeRange(start: string, end: string): string {
  const fmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${fmt.format(new Date(start))} – ${fmt.format(new Date(end))}`;
}

interface Props {
  item: TeamBookingToday;
}

function TeamBookingItemComponent({ item }: Props) {
  const timeRange = formatTimeRange(item.start_time, item.end_time);
  const { label, style } = STATUS_MAP[item.status] ?? { label: item.status, style: 'default' as const };

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{item.user_initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.user_full_name}
        </Text>
        <Text style={styles.resource} numberOfLines={1}>
          {item.resource_name}
        </Text>
        <Text style={styles.time}>{timeRange}</Text>
      </View>
      <View style={[styles.badge, styles[`badge_${style}`]]}>
        <Text style={[styles.badgeText, styles[`badgeText_${style}`]]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

export const TeamBookingItem = React.memo(TeamBookingItemComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  resource: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  badge_confirmed: { backgroundColor: colors.successBackground },
  badge_warning:   { backgroundColor: colors.warningBackground },
  badge_error:     { backgroundColor: colors.errorBackground },
  badge_default:   { backgroundColor: colors.raised },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  badgeText_confirmed: { color: colors.success },
  badgeText_warning:   { color: colors.warning },
  badgeText_error:     { color: colors.error },
  badgeText_default:   { color: colors.textMuted },
});
