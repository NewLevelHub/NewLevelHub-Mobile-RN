import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { KpiCard, type KpiCardProps } from './KpiCard';

interface Props {
  items: KpiCardProps[];
}

export function KpiRow({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item, i) => (
        <KpiCard key={i} {...item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});
