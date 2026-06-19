import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import type { ScheduleSlot } from '@/features/bookings/types/resource';

const MAX_SHOWN = 5;

function extractTime(iso: string): string {
  const match = iso.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : iso;
}

interface Props {
  schedule: ScheduleSlot[];
}

export const ResourceSchedulePreview = React.memo<Props>(({ schedule }) => {
  const slots = schedule.slice(0, MAX_SHOWN);

  if (slots.length === 0) {
    return <Text style={styles.emptyText}>Нет бронирований на сегодня</Text>;
  }

  return (
    <View style={styles.container}>
      {slots.map((slot, index) => (
        <View key={slot.booking_id} style={styles.row}>
          <View style={styles.timelineColumn}>
            <View style={styles.dot} />
            {index < slots.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.content}>
            <Text style={styles.timeRange}>
              {extractTime(slot.start)}–{extractTime(slot.end)}
            </Text>
            {slot.user_name ? (
              <Text style={styles.userName} numberOfLines={1}>
                {slot.user_name}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
});

ResourceSchedulePreview.displayName = 'ResourceSchedulePreview';

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 44,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 16,
    paddingTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
    marginLeft: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: -4,
    marginLeft: 7,
  },
  content: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 0,
  },
  timeRange: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  userName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
