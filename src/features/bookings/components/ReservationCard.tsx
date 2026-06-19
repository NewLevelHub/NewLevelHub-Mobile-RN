import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/core/theme/colors';
import { TimeRangeLabel } from '@/features/bookings/components/TimeRangeLabel';
import { RESERVATION_STATUS_LABELS, RESOURCE_TYPE_LABELS } from '@/shared/lib/labels';
import type { Reservation } from '@/features/bookings/types/reservation';

interface Props {
  reservation: Reservation;
  onPress?: () => void;
}

const STATUS_PALETTE: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: colors.successBackground, text: colors.success },
  cancelled: { bg: colors.errorBackground, text: colors.error },
  completed: { bg: colors.raised, text: colors.textMuted },
  no_show: { bg: colors.warningBackground, text: colors.warning },
};

export const ReservationCard = React.memo<Props>(({ reservation, onPress }) => {
  const palette = STATUS_PALETTE[reservation.status] ?? STATUS_PALETTE.completed;
  const statusLabel = RESERVATION_STATUS_LABELS[reservation.status] ?? reservation.status;
  const typeLabel = reservation.resourceType
    ? RESOURCE_TYPE_LABELS[reservation.resourceType] ?? reservation.resourceType
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {reservation.resourceName}
        </Text>
        <View style={[styles.badge, { backgroundColor: palette.bg }]}>
          <Text style={[styles.badgeText, { color: palette.text }]}>{statusLabel}</Text>
        </View>
      </View>
      <TimeRangeLabel start={reservation.startTime} end={reservation.endTime} />
      {typeLabel ? <Text style={styles.type}>{typeLabel}</Text> : null}
    </TouchableOpacity>
  );
});

ReservationCard.displayName = 'ReservationCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  type: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.textSubtle,
  },
});
