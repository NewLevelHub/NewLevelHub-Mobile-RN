import { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorView } from '@/shared/ui/AppErrorView';
import { AppLoader } from '@/shared/ui/AppLoader';
import { useActivityFeed } from '@/features/users/hooks/useActivityFeed';
import { ActivityFeed } from '@/features/users/components/ActivityFeed';
import { useDashboard } from '@/features/core/hooks/useDashboard';
import type {
  SuperadminDashboard,
  CompanyAdminDashboard,
  EmployeeDashboard,
  GuestDashboard,
} from '@/features/core/types/dashboard';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Home>;

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Role widgets ─────────────────────────────────────────────────────────────

function SuperadminWidget({ data }: { data: SuperadminDashboard }) {
  return (
    <View style={styles.statsRow}>
      <StatCard label="Компании" value={data.total_companies} />
      <StatCard label="Пользователи" value={data.total_users} />
      <StatCard label="Брони сегодня" value={data.bookings_today} />
    </View>
  );
}

function CompanyAdminWidget({ data }: { data: CompanyAdminDashboard }) {
  return (
    <View style={styles.statsRow}>
      <StatCard label="Сотрудники" value={data.employee_count} />
      <StatCard label="Активные задачи" value={data.active_tasks} />
      <StatCard label="Брони сегодня" value={data.bookings_today} />
    </View>
  );
}

function EmployeeWidget({ data }: { data: EmployeeDashboard }) {
  return (
    <View style={styles.statsRow}>
      <StatCard label="Задач сегодня" value={data.my_tasks_today} />
      <StatCard label="Мои брони" value={data.my_bookings_today} />
      <StatCard label="Уведомления" value={data.unread_notifications_count} />
    </View>
  );
}

function GuestWidget({ data }: { data: GuestDashboard }) {
  return (
    <View style={styles.statsRow}>
      <StatCard label="Мои брони" value={data.my_bookings_today} />
      <StatCard label="Свободных столов" value={data.quick_booking.available_desks} />
      <StatCard label="Свободных комнат" value={data.quick_booking.available_rooms} />
    </View>
  );
}

// ─── Dashboard section ────────────────────────────────────────────────────────

function DashboardSection({
  isLoading,
  error,
  data,
  onRetry,
}: {
  isLoading: boolean;
  error: ReturnType<typeof useDashboard>['error'];
  data: ReturnType<typeof useDashboard>['data'];
  onRetry: () => void;
}) {
  if (isLoading) {
    return <AppLoader size="small" />;
  }

  if (error || !data) {
    return (
      <AppErrorView
        message={error?.message ?? 'Не удалось загрузить данные'}
        onRetry={onRetry}
      />
    );
  }

  switch (data.role) {
    case 'superadmin':
      return <SuperadminWidget data={data} />;
    case 'company_admin':
      return <CompanyAdminWidget data={data} />;
    case 'employee':
      return <EmployeeWidget data={data} />;
    default:
      return <GuestWidget data={data as GuestDashboard} />;
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: activityData, isLoading: activityLoading, isError: activityError, refetch: refetchActivity } =
    useActivityFeed();

  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } =
    useDashboard();

  const handleLogout = () => {
    Alert.alert(
      'Выйти',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: () => void logout() },
      ],
    );
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchActivity(), refetchDashboard()]);
    setIsRefreshing(false);
  }, [refetchActivity, refetchDashboard]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.brand}
        />
      }
    >
      <Text style={styles.title}>Добро пожаловать{user ? `, ${user.full_name}` : ''}</Text>

      <View style={styles.card}>
        <DashboardSection
          isLoading={dashboardLoading}
          error={dashboardError}
          data={dashboard}
          onRetry={() => void refetchDashboard()}
        />
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Моя активность</Text>
        <ActivityFeed data={activityData} isLoading={activityLoading} isError={activityError} />
      </View>

      <AppButton onPress={() => navigation.navigate(Routes.Profile)} title="Профиль" variant="secondary" />
      {user?.role === USER_ROLES.SUPERADMIN ? (
        <AppButton onPress={() => navigation.navigate(Routes.AdminUsers)} title="Пользователи (Admin)" variant="secondary" />
      ) : null}
      <AppButton onPress={() => navigation.navigate(Routes.UiKit)} title="UI Kit" variant="secondary" />
      <AppButton onPress={handleLogout} title="Выйти" variant="text" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    padding: 24,
    gap: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.raised,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activitySection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
});
