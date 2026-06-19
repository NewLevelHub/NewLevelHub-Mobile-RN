import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { BOOKING_STATUS_LABELS } from '@/shared/lib/labels';
import type { BookingRecent } from '@/features/core/types/dashboard';

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  confirmed:  { text: colors.success,  bg: colors.successBackground },
  completed:  { text: colors.success,  bg: colors.successBackground },
  pending:    { text: colors.warning,  bg: colors.warningBackground },
  cancelled:  { text: colors.error,    bg: colors.errorBackground },
  no_show:    { text: colors.error,    bg: colors.errorBackground },
};

function formatTimeRange(start: string, end: string): string {
  const fmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${fmt.format(new Date(start))} – ${fmt.format(new Date(end))}`;
}

interface Props {
  item: BookingRecent;
  onPress?: () => void;
}

function BookingCardComponent({ item, onPress }: Props) {
  const statusKey = item.status in STATUS_COLORS ? item.status : 'pending';
  const statusLabel = BOOKING_STATUS_LABELS[item.status] ?? item.status;
  const statusColor = STATUS_COLORS[statusKey] ?? { text: colors.textMuted, bg: colors.raised };
  const timeRange = formatTimeRange(item.start_time, item.end_time);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.resource} numberOfLines={1}>
            {item.resource_name}
          </Text>
          {item.company_name ? (
            <Text style={styles.company} numberOfLines={1}>
              {item.company_name}
            </Text>
          ) : null}
          <Text style={styles.time}>{timeRange}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.badgeText, { color: statusColor.text }]}>{statusLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const BookingCard = React.memo(BookingCardComponent);

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
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  resource: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  company: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  time: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
