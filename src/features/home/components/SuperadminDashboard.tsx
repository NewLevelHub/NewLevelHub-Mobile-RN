import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  DashboardHeader,
  KpiRow,
  SectionHeader,
  FloorLoadBar,
  BookingCard,
  QuickActionRow,
} from '@/features/core/components';
import { colors } from '@/core/theme/colors';
import { BOOKING_STATUS_LABELS } from '@/shared/lib/labels';
import type {
  SuperadminDashboard as SuperadminDashboardData,
  QuickAction,
  RecentEvent,
  AnnouncementRecent,
} from '@/features/core/types/dashboard';

function deltaLabel(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function deltaColor(delta: number): string {
  if (delta > 0) return colors.success;
  if (delta < 0) return colors.error;
  return colors.textMuted;
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

// ─── RecentEventCard ──────────────────────────────────────────────────────────

interface RecentEventCardProps {
  item: RecentEvent;
}

function RecentEventCard({ item }: RecentEventCardProps) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventRow}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {BOOKING_STATUS_LABELS[item.status] ?? item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.eventTime}>{formatTime(item.start_time)}</Text>
    </View>
  );
}

const RecentEventCardMemo = React.memo(RecentEventCard);

// ─── AnnouncementRecentCard ───────────────────────────────────────────────────

interface AnnouncementRecentCardProps {
  item: AnnouncementRecent;
}

function AnnouncementRecentCard({ item }: AnnouncementRecentCardProps) {
  return (
    <View style={styles.annCard}>
      <Text style={styles.annTitle} numberOfLines={2}>
        {item.title}
      </Text>
      {item.text ? (
        <Text style={styles.annText} numberOfLines={3}>
          {item.text}
        </Text>
      ) : null}
    </View>
  );
}

const AnnouncementRecentCardMemo = React.memo(AnnouncementRecentCard);

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  data: SuperadminDashboardData;
  onQuickAction: (action: QuickAction) => void;
}

export function SuperadminDashboard({ data, onQuickAction }: Props) {
  const kpiItems = [
    { label: 'Компаний', value: data.total_companies },
    { label: 'Пользователей', value: data.total_users },
    { label: 'Брони сегодня', value: data.bookings_today },
    {
      label: 'Динамика (7д)',
      value: deltaLabel(data.bookings_week_delta),
      accent: deltaColor(data.bookings_week_delta),
    },
    { label: 'Загрузка', value: data.space_load_pct, suffix: '%' },
    { label: 'Запросов', value: data.open_service_requests },
    { label: 'Новых компаний', value: data.new_companies_last_7d },
  ];

  const visibleEvents = data.recent_events.slice(0, 10);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.bleed}>
        <DashboardHeader user={data.user} />
      </View>

      {/* Platform KPI */}
      <View style={styles.bleed}>
        <KpiRow items={kpiItems} />
      </View>

      {/* Quick actions */}
      {data.quick_actions.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Быстрые действия" />
          <QuickActionRow actions={data.quick_actions} onPress={onQuickAction} />
        </View>
      )}

      {/* Floor load */}
      {data.floor_load.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Загрузка этажей" />
          {data.floor_load.map((floor) => (
            <FloorLoadBar key={floor.floor_id} item={floor} />
          ))}
        </View>
      )}

      {/* Recent bookings */}
      {data.bookings_recent.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Последние бронирования" />
          {data.bookings_recent.map((booking) => (
            <BookingCard key={booking.id} item={booking} />
          ))}
        </View>
      )}

      {/* Recent announcements */}
      {data.announcements_recent.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Объявления" />
          {data.announcements_recent.map((ann) => (
            <AnnouncementRecentCardMemo key={ann.id} item={ann} />
          ))}
        </View>
      )}

      {/* Recent events */}
      {visibleEvents.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Последние события" />
          {visibleEvents.map((event) => (
            <RecentEventCardMemo key={event.id} item={event} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 4,
  },
  bleed: {
    marginHorizontal: -24,
  },

  // RecentEventCard
  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    gap: 4,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  eventTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: colors.raised,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  eventTime: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },

  // AnnouncementRecentCard
  annCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    gap: 4,
  },
  annTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  annText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
