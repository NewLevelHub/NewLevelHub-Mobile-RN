import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';

function SkeletonBox({ style }: { style?: object }) {
  return <View style={[styles.skeleton, style]} />;
}

const ResourceCardSkeleton = React.memo(function ResourceCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox style={styles.photo} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <SkeletonBox style={styles.titleLine} />
          <SkeletonBox style={styles.chip} />
        </View>
        <SkeletonBox style={styles.subtitleLine} />
        <SkeletonBox style={styles.badge} />
      </View>
    </View>
  );
});

export function ResourceCatalogSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((i) => (
        <ResourceCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  skeleton: {
    backgroundColor: colors.raised,
    borderRadius: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: {
    height: 140,
    width: '100%',
    borderRadius: 0,
    backgroundColor: colors.raised,
  },
  body: {
    padding: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  titleLine: {
    flex: 1,
    height: 16,
  },
  chip: {
    width: 72,
    height: 22,
    borderRadius: 20,
  },
  subtitleLine: {
    height: 12,
    width: '60%',
  },
  badge: {
    height: 22,
    width: 96,
    borderRadius: 6,
  },
});
