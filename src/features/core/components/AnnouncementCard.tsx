import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { ANNOUNCEMENT_CATEGORY_LABELS } from '@/shared/lib/labels';
import type { AnnouncementFeedItem } from '@/features/core/types/dashboard';

const CATEGORY_COLORS: Record<string, string> = {
  info:    colors.info,
  event:   colors.brand,
  warning: colors.warning,
  urgent:  colors.error,
};

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} д назад`;
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(
    new Date(iso),
  );
}

interface Props {
  item: AnnouncementFeedItem;
  onPress?: () => void;
}

function AnnouncementCardComponent({ item, onPress }: Props) {
  const chipColor = CATEGORY_COLORS[item.category] ?? colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.chip, { backgroundColor: chipColor + '1A' }]}>
          <Text style={[styles.chipText, { color: chipColor }]}>
            {ANNOUNCEMENT_CATEGORY_LABELS[item.category] ?? item.category}
          </Text>
        </View>
        <Text style={styles.date}>{relativeDate(item.created_at)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.body} numberOfLines={3}>
        {item.body}
      </Text>
    </Pressable>
  );
}

export const AnnouncementCard = React.memo(AnnouncementCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSubtle,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
