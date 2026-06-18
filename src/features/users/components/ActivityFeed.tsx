import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type {
  ActivityBooking,
  ActivityFeedResponse,
  ActivityPass,
  ActivityTask,
  BookingStatus,
  PassStatus,
  TaskPriority,
} from '@/features/users/types/activity';

interface Props {
  data: ActivityFeedResponse;
  isLoading: boolean;
  isError: boolean;
}

// ─── Localized label maps ──────────────────────────────────────────────────────

const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  completed: 'Завершено',
  no_show: 'Не явился',
};

const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный',
};

const PASS_STATUS_LABELS: Record<PassStatus, string> = {
  active: 'Активен',
  used: 'Использован',
  expired: 'Истёк',
  revoked: 'Отозван',
};

// ─── Badge color maps ──────────────────────────────────────────────────────────

interface BadgeStyle { bg: string; text: string }

const BOOKING_STATUS_BADGE: Record<BookingStatus, BadgeStyle> = {
  confirmed:  { bg: colors.successBackground, text: colors.success },
  cancelled:  { bg: colors.errorBackground,   text: colors.error },
  completed:  { bg: colors.brandSubtle,        text: colors.brandText },
  no_show:    { bg: colors.warningBackground,  text: colors.warning },
};

const TASK_PRIORITY_BADGE: Record<TaskPriority, BadgeStyle> = {
  low:    { bg: colors.raised,            text: colors.textMuted },
  medium: { bg: colors.brandSubtle,       text: colors.brandText },
  high:   { bg: colors.warningBackground, text: colors.warning },
  urgent: { bg: colors.errorBackground,   text: colors.error },
};

const PASS_STATUS_BADGE: Record<PassStatus, BadgeStyle> = {
  active:  { bg: colors.successBackground, text: colors.success },
  used:    { bg: colors.raised,            text: colors.textMuted },
  expired: { bg: colors.raised,            text: colors.textMuted },
  revoked: { bg: colors.errorBackground,   text: colors.error },
};

// ─── Date helpers ──────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

// ─── Badge ─────────────────────────────────────────────────────────────────────

function StatusBadge({ label, style }: { label: string; style: BadgeStyle }) {
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.badgeText, { color: style.text }]}>{label}</Text>
    </View>
  );
}

// ─── Item rows ─────────────────────────────────────────────────────────────────

function BookingItemRow({ item }: { item: ActivityBooking }) {
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => {}}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.resource_name}</Text>
        <Text style={styles.itemSub}>{formatDateTime(item.start_time)}</Text>
      </View>
      <StatusBadge label={BOOKING_STATUS_LABELS[item.status]} style={BOOKING_STATUS_BADGE[item.status]} />
    </TouchableOpacity>
  );
}

function TaskItemRow({ item }: { item: ActivityTask }) {
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => {}}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemSub}>{item.board_name} · {formatDate(item.deadline)}</Text>
      </View>
      <StatusBadge label={TASK_PRIORITY_LABELS[item.priority]} style={TASK_PRIORITY_BADGE[item.priority]} />
    </TouchableOpacity>
  );
}

function PassItemRow({ item }: { item: ActivityPass }) {
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => {}}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.guest_name}</Text>
        <Text style={styles.itemSub}>до {formatDateTime(item.valid_until)}</Text>
      </View>
      <StatusBadge label={PASS_STATUS_LABELS[item.status]} style={PASS_STATUS_BADGE[item.status]} />
    </TouchableOpacity>
  );
}

const MemoBookingItem = React.memo(BookingItemRow);
const MemoTaskItem = React.memo(TaskItemRow);
const MemoPassItem = React.memo(PassItemRow);

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function ActivityFeedSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.skeletonItem} />
      ))}
    </View>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionItems}>{children}</View>
    </View>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function ActivityFeed({ data, isLoading, isError }: Props) {
  if (isLoading) return <ActivityFeedSkeleton />;

  if (isError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorText}>Не удалось загрузить активность</Text>
      </View>
    );
  }

  const { bookings, tasks, passes } = data;
  const hasAny = bookings.length > 0 || tasks.length > 0 || passes.length > 0;

  if (!hasAny) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.emptyText}>Активности пока нет</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.length > 0 && (
        <Section title="Бронирования">
          {bookings.map((b) => <MemoBookingItem key={b.id} item={b} />)}
        </Section>
      )}
      {tasks.length > 0 && (
        <Section title="Задачи">
          {tasks.map((t) => <MemoTaskItem key={t.id} item={t} />)}
        </Section>
      )}
      {passes.length > 0 && (
        <Section title="Пропуска">
          {passes.map((p) => <MemoPassItem key={p.id} item={p} />)}
        </Section>
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionItems: {
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  itemSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  badge: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  skeletonContainer: {
    gap: 6,
  },
  skeletonItem: {
    height: 44,
    backgroundColor: colors.raised,
    borderRadius: 8,
  },
  stateContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.error,
  },
});
