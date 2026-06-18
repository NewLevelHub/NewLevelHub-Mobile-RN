import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { FloorLoad } from '@/features/core/types/dashboard';

function barColor(pct: number): string {
  if (pct >= 80) return colors.error;
  if (pct >= 50) return colors.warning;
  return colors.success;
}

interface Props {
  item: FloorLoad;
}

function FloorLoadBarComponent({ item }: Props) {
  const pct = Math.min(100, Math.max(0, item.occupancy_pct));
  const fill = barColor(pct);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {item.floor_name || `Этаж ${item.floor_number}`}
        </Text>
        <Text style={[styles.pct, { color: fill }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fill }]} />
      </View>
      <Text style={styles.sub}>
        {item.occupied} / {item.total} мест занято
      </Text>
    </View>
  );
}

export const FloorLoadBar = React.memo(FloorLoadBarComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    flex: 1,
  },
  pct: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    flexShrink: 0,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.raised,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  sub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
});
