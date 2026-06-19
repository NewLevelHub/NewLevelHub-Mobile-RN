import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import type { ScheduleSlot } from '@/features/bookings/types/resource';

interface Props {
  slots: ScheduleSlot[];
  /** Start of visible range in hours (default 8) */
  startHour?: number;
  /** End of visible range in hours (default 22) */
  endHour?: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function isoToMinutes(iso: string): number {
  const m = iso.match(/T(\d{2}):(\d{2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

export const ScheduleSlotBar = React.memo<Props>(({
  slots,
  startHour = 8,
  endHour = 22,
}) => {
  const rangeMinutes = (endHour - startHour) * 60;

  const segments = useMemo(() => {
    return slots
      .map((slot) => {
        const slotStart = Math.max(isoToMinutes(slot.start), startHour * 60);
        const slotEnd = Math.min(isoToMinutes(slot.end), endHour * 60);
        const leftPct = ((slotStart - startHour * 60) / rangeMinutes) * 100;
        const widthPct = Math.max(0, ((slotEnd - slotStart) / rangeMinutes) * 100);
        return { key: String(slot.booking_id), leftPct, widthPct };
      })
      .filter((s) => s.widthPct > 0);
  }, [slots, startHour, endHour, rangeMinutes]);

  return (
    <View>
      <View style={styles.track}>
        {segments.map((seg) => (
          <View
            key={seg.key}
            style={[
              styles.slot,
              { left: `${seg.leftPct}%`, width: `${seg.widthPct}%` },
            ]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.tick}>{pad(startHour)}:00</Text>
        <Text style={styles.tick}>{pad(endHour)}:00</Text>
      </View>
    </View>
  );
});

ScheduleSlotBar.displayName = 'ScheduleSlotBar';

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  slot: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: colors.error,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  tick: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: colors.textMuted,
  },
});
