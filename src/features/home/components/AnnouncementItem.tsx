import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { AnnouncementFeedItem } from '@/features/core/types/dashboard';

interface Props {
  item: AnnouncementFeedItem;
}

interface CategoryStyle {
  bg: string;
  text: string;
  label: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  info:    { bg: colors.raised,            text: colors.textMuted, label: 'Инфо' },
  event:   { bg: colors.brandSubtle,       text: colors.brandText, label: 'Событие' },
  warning: { bg: colors.warningBackground, text: colors.warning,   label: 'Важно' },
  urgent:  { bg: colors.errorBackground,   text: colors.error,     label: 'Срочно' },
};

export const AnnouncementItem = React.memo(function AnnouncementItem({ item }: Props) {
  const style = CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES.info;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.badge, { backgroundColor: style.bg }]}>
          <Text style={[styles.badgeText, { color: style.text }]}>{style.label}</Text>
        </View>
      </View>
      {item.body ? (
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  body: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
});
