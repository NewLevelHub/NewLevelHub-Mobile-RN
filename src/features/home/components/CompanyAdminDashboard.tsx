import { Alert, StyleSheet, View } from 'react-native';

import {
  DashboardHeader,
  KpiRow,
  SectionHeader,
  PendingApprovalCard,
  TaskCard,
  AnnouncementCard,
} from '@/features/core/components';
import type { CompanyAdminDashboard as CompanyAdminDashboardData } from '@/features/core/types/dashboard';

import { TeamBookingItem } from './TeamBookingItem';

// Buttons visible but disabled — approve/reject wired in Epic 6
const comingSoon = () =>
  Alert.alert('Скоро', 'Функция будет доступна в следующем обновлении');

interface Props {
  data: CompanyAdminDashboardData;
  onTaskPress?: () => void;
}

export function CompanyAdminDashboard({ data, onTaskPress }: Props) {
  const { pending_approvals } = data;
  const hasLeaves = pending_approvals.leaves.length > 0;
  const hasGuestPasses = pending_approvals.guest_passes.length > 0;
  const hasPendingApprovals = hasLeaves || hasGuestPasses;

  const kpiItems = [
    { label: 'Сотрудников', value: data.employee_count },
    { label: 'Активных задач', value: data.active_tasks },
    { label: 'Брони сегодня', value: data.bookings_today },
    { label: 'Свободных мест', value: data.free_resources_now },
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

      {/* Pending approvals — hidden when both arrays are empty */}
      {hasPendingApprovals && (
        <View style={styles.bleed}>
          <SectionHeader title="На согласование" />
          {pending_approvals.leaves.map((leave) => (
            <PendingApprovalCard
              key={`leave-${leave.id}`}
              kind="leave"
              item={leave}
              onApprove={comingSoon}
              onReject={comingSoon}
              disabled
            />
          ))}
          {pending_approvals.guest_passes.map((pass) => (
            <PendingApprovalCard
              key={`pass-${pass.id}`}
              kind="guest_pass"
              item={pass}
              onApprove={comingSoon}
              onReject={comingSoon}
              disabled
            />
          ))}
        </View>
      )}

      {/* Team bookings today */}
      {data.team_bookings_today.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Команда сегодня" />
          {data.team_bookings_today.map((booking, i) => (
            <TeamBookingItem key={i} item={booking} />
          ))}
        </View>
      )}

      {/* My tasks */}
      {data.my_tasks.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Мои задачи" />
          {data.my_tasks.map((task) => (
            <TaskCard key={task.id} item={task} onPress={onTaskPress} />
          ))}
        </View>
      )}

      {/* Announcement feed */}
      {data.announcement_feed.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Объявления" />
          {data.announcement_feed.map((ann) => (
            <AnnouncementCard key={ann.id} item={ann} />
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
  // Breaks out of the parent ScrollView's padding: 24 so core components
  // (which carry their own paddingHorizontal/marginHorizontal: 16) align at
  // 16px from the screen edge rather than 40px.
  bleed: {
    marginHorizontal: -24,
  },
});
