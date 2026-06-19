import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { BOOKING_STATUS_LABELS, RESOURCE_TYPE_LABELS } from '@/shared/lib/labels';
import type { UpcomingBooking } from '@/features/core/types/dashboard';

interface Props {
  item: UpcomingBooking;
  onPress: () => void;
}

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  confirmed:  { bg: colors.successBackground, text: colors.success },
  completed:  { bg: colors.successBackground, text: colors.success },
  pending:    { bg: colors.warningBackground, text: colors.warning },
  cancelled:  { bg: colors.errorBackground,   text: colors.error },
  no_show:    { bg: colors.errorBackground,   text: colors.error },
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export const UpcomingBookingItem = React.memo(function UpcomingBookingItem({ item, onPress }: Props) {
  const timeRange = item.is_all_day
    ? 'Весь день'
    : `${formatTime(item.start_time)} – ${formatTime(item.end_time)}`;
  const typeLabel = RESOURCE_TYPE_LABELS[item.resource_type] ?? item.resource_type;
  const badge = STATUS_BADGE[item.status] ?? { bg: colors.raised, text: colors.textMuted };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{item.resource_name}</Text>
        <Text style={styles.meta}>{typeLabel} · {timeRange}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>
          {BOOKING_STATUS_LABELS[item.status] ?? item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
});
