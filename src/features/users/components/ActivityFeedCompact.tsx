import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { ActivityItem } from '@/shared/types';

interface Props {
  items: ActivityItem[];
  isLoading: boolean;
}

const PREVIEW_COUNT = 5;

function ActivityFeedItemRow({ item }: { item: ActivityItem }) {
  const date = new Date(item.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
  return (
    <View style={styles.item}>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const MemoActivityFeedItemRow = React.memo(ActivityFeedItemRow);

function ActivityFeedSkeleton() {
  return (
    <View style={styles.skeleton}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.skeletonItem} />
      ))}
    </View>
  );
}

function ActivityFeedEmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Активности пока нет</Text>
    </View>
  );
}

export function ActivityFeedCompact({ items, isLoading }: Props) {
  if (isLoading) return <ActivityFeedSkeleton />;
  if (items.length === 0) return <ActivityFeedEmptyState />;

  return (
    <View style={styles.list}>
      {items.slice(0, PREVIEW_COUNT).map((item) => (
        <MemoActivityFeedItemRow key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  description: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginLeft: 8,
  },
  skeleton: { gap: 8 },
  skeletonItem: {
    height: 42,
    backgroundColor: colors.raised,
    borderRadius: 8,
  },
  empty: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
});
