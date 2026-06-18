import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';

export interface KpiCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: string;
}

export function KpiCard({ label, value, suffix, accent }: KpiCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, accent ? { color: accent } : undefined]}>
        {value}
        {suffix ? <Text style={styles.suffix}> {suffix}</Text> : null}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 88,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'flex-start',
    gap: 4,
  },
  value: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    lineHeight: 30,
  },
  suffix: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
});
