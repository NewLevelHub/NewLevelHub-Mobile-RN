import React from 'react';
import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { colors } from '@/core/theme/colors';

interface Props {
  start: string;
  end: string;
  style?: StyleProp<TextStyle>;
}

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

// Reads wall-clock time directly from the ISO string without converting to device timezone.
// "2026-06-19T09:00:00+06:00" → { day: 19, month: 5, hh: '09', mm: '00' }
function parseWallClock(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  return {
    day: parseInt(m[3], 10),
    monthIndex: parseInt(m[2], 10) - 1,
    hh: m[4],
    mm: m[5],
  };
}

export const TimeRangeLabel = React.memo<Props>(({ start, end, style }) => {
  const s = parseWallClock(start);
  const e = parseWallClock(end);
  if (!s || !e) return null;

  const dateStr = `${s.day} ${MONTHS[s.monthIndex] ?? ''}`;
  const timeStr = `${s.hh}:${s.mm}–${e.hh}:${e.mm}`;

  return <Text style={[styles.text, style]}>{dateStr}, {timeStr}</Text>;
});

TimeRangeLabel.displayName = 'TimeRangeLabel';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
});
