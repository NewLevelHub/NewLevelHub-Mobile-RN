import { StyleSheet, Text, View } from 'react-native';

import {
  DashboardHeader,
  KpiRow,
  SectionHeader,
  AnnouncementCard,
} from '@/features/core/components';
import type { EmployeeDashboard as EmployeeDashboardData } from '@/features/core/types/dashboard';
import { colors } from '@/core/theme/colors';

import { UpcomingBookingItem } from './UpcomingBookingItem';
import { DashboardTaskItem } from './DashboardTaskItem';

interface Props {
  data: EmployeeDashboardData;
}

export function EmployeeDashboard({ data }: Props) {
  const kpiItems = [
    { label: 'Задач сегодня', value: data.my_tasks_today },
    { label: 'Мои брони', value: data.my_bookings_today },
    { label: 'Уведомлений', value: data.unread_notifications_count },
  ];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.bleed}>
        <DashboardHeader user={data.user} />
      </View>

      {/* KPI row */}
      <View style={styles.bleed}>
        <KpiRow items={kpiItems} />
      </View>

      {/* Upcoming bookings */}
      {data.my_upcoming_bookings.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Предстоящие бронирования" />
          {data.my_upcoming_bookings.map((b) => (
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            <UpcomingBookingItem key={b.id} item={b} onPress={() => {}} />
          ))}
        </View>
      )}

      {/* My tasks */}
      {data.my_tasks.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Мои задачи" />
          {data.my_tasks.map((t) => (
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            <DashboardTaskItem key={t.id} item={t} onPress={() => {}} />
          ))}
        </View>
      )}

      {/* Announcements */}
      {data.announcement_feed.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Объявления" />
          {data.announcement_feed.map((a) => (
            <AnnouncementCard key={a.id} item={a} />
          ))}
        </View>
      )}

      {data.my_upcoming_bookings.length === 0 &&
        data.my_tasks.length === 0 &&
        data.announcement_feed.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Нет активных задач и бронирований</Text>
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
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
  },
});
