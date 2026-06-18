import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { DashboardTask } from '@/features/core/types/dashboard';

interface Props {
  item: DashboardTask;
  onPress: () => void;
}

interface PriorityStyle {
  bg: string;
  text: string;
  label: string;
}

const PRIORITY_STYLES: Record<string, PriorityStyle> = {
  low:    { bg: colors.raised,             text: colors.textMuted, label: 'Низкий' },
  medium: { bg: colors.brandSubtle,        text: colors.brandText, label: 'Средний' },
  high:   { bg: colors.warningBackground,  text: colors.warning,   label: 'Высокий' },
  urgent: { bg: colors.errorBackground,    text: colors.error,     label: 'Срочный' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export const DashboardTaskItem = React.memo(function DashboardTaskItem({ item, onPress }: Props) {
  const priority = PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.low;
  const dueDateStr = item.due_date ? formatDate(item.due_date) : '';
  const metaParts = [item.board_name, dueDateStr, item.is_overdue ? 'Просрочено' : ''].filter(Boolean);

  return (
    <TouchableOpacity
      style={[styles.container, item.is_overdue && styles.containerOverdue]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.meta, item.is_overdue && styles.metaOverdue]}>
          {metaParts.join(' · ')}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: priority.bg }]}>
        <Text style={[styles.badgeText, { color: priority.text }]}>{priority.label}</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  containerOverdue: {
    borderColor: colors.error,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  metaOverdue: {
    color: colors.error,
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
});
