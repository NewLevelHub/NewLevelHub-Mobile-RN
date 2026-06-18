import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { DashboardTask } from '@/features/core/types/dashboard';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

const PRIORITY_COLORS: Record<string, { text: string; bg: string }> = {
  low: { text: colors.textMuted, bg: colors.raised },
  medium: { text: colors.warning, bg: colors.warningBackground },
  high: { text: colors.error, bg: colors.errorBackground },
};

function formatDueDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(
    new Date(iso),
  );
}

interface Props {
  item: DashboardTask;
  onPress?: () => void;
}

function TaskCardComponent({ item, onPress }: Props) {
  const priorityKey = item.priority in PRIORITY_LABELS ? item.priority : 'low';
  const priorityLabel = PRIORITY_LABELS[priorityKey] ?? item.priority;
  const priorityColor = PRIORITY_COLORS[priorityKey] ?? PRIORITY_COLORS.low;
  const dueDate = formatDueDate(item.due_date);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        item.is_overdue && styles.cardOverdue,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.board} numberOfLines={1}>
            {item.board_name}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {dueDate ? (
            <Text style={[styles.due, item.is_overdue && styles.dueOverdue]}>
              {item.is_overdue ? '⚠ ' : ''}{dueDate}
            </Text>
          ) : null}
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColor.bg }]}>
          <Text style={[styles.priorityText, { color: priorityColor.text }]}>
            {priorityLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export const TaskCard = React.memo(TaskCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  cardOverdue: {
    borderColor: colors.error,
    borderLeftWidth: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  board: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  due: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  dueOverdue: {
    color: colors.error,
    fontFamily: 'Inter_500Medium',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
});
