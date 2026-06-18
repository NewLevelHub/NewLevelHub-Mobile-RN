import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/core/theme/colors';

function Block({ h, w, r = 8 }: { h: number; w?: number | `${number}%`; r?: number }) {
  return <View style={[styles.block, { height: h, width: w, borderRadius: r }]} />;
}

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Block h={24} w="55%" r={6} />
          <Block h={14} w="38%" r={4} />
        </View>
        <Block h={40} w={40} r={20} />
      </View>

      <View style={styles.kpiRow}>
        <Block h={76} w="48%" r={12} />
        <Block h={76} w="48%" r={12} />
      </View>

      <Block h={14} w="45%" r={4} />
      <Block h={52} r={10} />
      <Block h={52} r={10} />

      <Block h={14} w="35%" r={4} />
      <Block h={52} r={10} />
      <Block h={52} r={10} />
      <Block h={52} r={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  block: {
    backgroundColor: colors.raised,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerText: {
    gap: 6,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
