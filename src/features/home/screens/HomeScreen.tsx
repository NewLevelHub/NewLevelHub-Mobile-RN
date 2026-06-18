import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorView } from '@/shared/ui/AppErrorView';
import type {
  DashboardResponse,
  EmployeeDashboard,
  SuperadminDashboard,
  CompanyAdminDashboard as CompanyAdminDashboardData,
  GuestDashboard,
} from '@/features/core/types/dashboard';

import { useHomeScreen } from '@/features/home/hooks/useHomeScreen';
import { HomeSkeleton } from '@/features/home/components/HomeSkeleton';
import { DashboardHeader } from '@/features/home/components/DashboardHeader';
import { UpcomingBookingItem } from '@/features/home/components/UpcomingBookingItem';
import { DashboardTaskItem } from '@/features/home/components/DashboardTaskItem';
import { AnnouncementItem } from '@/features/home/components/AnnouncementItem';
import { CompanyAdminDashboard } from '@/features/home/components/CompanyAdminDashboard';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Home>;

// ─── Shared sub-components ────────────────────────────────────────────────────

function HomeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionItems}>{children}</View>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Employee layout ──────────────────────────────────────────────────────────

function EmployeeLayout({
  data,
  onNotificationPress,
  onBookingPress,
  onTaskPress,
}: {
  data: EmployeeDashboard;
  onNotificationPress: () => void;
  onBookingPress: () => void;
  onTaskPress: () => void;
}) {
  return (
    <>
      <DashboardHeader
        fullName={data.user.full_name}
        unreadCount={data.unread_notifications_count}
        onNotificationPress={onNotificationPress}
      />

      <View style={styles.kpiRow}>
        <StatCard label="Задач сегодня" value={data.my_tasks_today} />
        <StatCard label="Мои брони" value={data.my_bookings_today} />
      </View>

      {data.my_upcoming_bookings.length > 0 && (
        <HomeSection title="Предстоящие бронирования">
          {data.my_upcoming_bookings.map((b) => (
            <UpcomingBookingItem key={b.id} item={b} onPress={onBookingPress} />
          ))}
        </HomeSection>
      )}

      {data.my_tasks.length > 0 && (
        <HomeSection title="Мои задачи">
          {data.my_tasks.map((t) => (
            <DashboardTaskItem key={t.id} item={t} onPress={onTaskPress} />
          ))}
        </HomeSection>
      )}

      {data.announcement_feed.length > 0 && (
        <HomeSection title="Объявления">
          {data.announcement_feed.map((a) => (
            <AnnouncementItem key={a.id} item={a} />
          ))}
        </HomeSection>
      )}
    </>
  );
}

// ─── Generic role fallback ────────────────────────────────────────────────────

function GenericDashboard({ dashboard }: { dashboard: DashboardResponse }) {
  return (
    <>
      <Text style={styles.title}>Добро пожаловать, {dashboard.user.full_name}</Text>
      <View style={styles.card}>
        <View style={styles.statsRow}>
          {dashboard.role === 'superadmin' && (
            <>
              <StatCard label="Компании" value={(dashboard as SuperadminDashboard).total_companies} />
              <StatCard label="Пользователи" value={(dashboard as SuperadminDashboard).total_users} />
              <StatCard label="Брони сегодня" value={(dashboard as SuperadminDashboard).bookings_today} />
            </>
          )}
          {dashboard.role === 'company_admin' && (
            <>
              <StatCard label="Сотрудники" value={(dashboard as CompanyAdminDashboardData).employee_count} />
              <StatCard label="Активные задачи" value={(dashboard as CompanyAdminDashboardData).active_tasks} />
              <StatCard label="Брони сегодня" value={(dashboard as CompanyAdminDashboardData).bookings_today} />
            </>
          )}
          {(dashboard.role === 'guest' || dashboard.role === 'reception' || dashboard.role === 'service_manager') && (
            <>
              <StatCard label="Мои брони" value={(dashboard as GuestDashboard).my_bookings_today} />
              <StatCard label="Свободных столов" value={(dashboard as GuestDashboard).quick_booking.available_desks} />
              <StatCard label="Свободных комнат" value={(dashboard as GuestDashboard).quick_booking.available_rooms} />
            </>
          )}
        </View>
      </View>
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function HomeScreen({ navigation }: Props) {
  const {
    user,
    logout,
    dashboard,
    dashboardLoading,
    dashboardError,
    refetchDashboard,
    employeeData,
    companyAdminData,
    isRefreshing,
    handleRefresh,
  } = useHomeScreen();

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

  const renderMain = () => {
    if (dashboardLoading) return <HomeSkeleton />;

    if (dashboardError || !dashboard) {
      return (
        <AppErrorView
          message={dashboardError?.message ?? 'Не удалось загрузить данные'}
          onRetry={() => void refetchDashboard()}
        />
      );
    }

    if (employeeData) {
      return (
        <EmployeeLayout
          data={employeeData}
          onNotificationPress={() => navigation.navigate(Routes.Notifications)}
          onBookingPress={() => navigation.navigate(Routes.Bookings)}
          onTaskPress={() => navigation.navigate(Routes.Crm)}
        />
      );
    }

    if (companyAdminData) {
      return (
        <CompanyAdminDashboard
          data={companyAdminData}
          onTaskPress={() => navigation.navigate(Routes.Crm)}
        />
      );
    }

    return <GenericDashboard dashboard={dashboard} />;
  };

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
      {renderMain()}

      <View style={styles.navActions}>
        <AppButton onPress={() => navigation.navigate(Routes.Profile)} title="Профиль" variant="secondary" />
        {user?.role === USER_ROLES.SUPERADMIN && (
          <AppButton onPress={() => navigation.navigate(Routes.AdminUsers)} title="Пользователи (Admin)" variant="secondary" />
        )}
        <AppButton onPress={() => navigation.navigate(Routes.UiKit)} title="UI Kit" variant="secondary" />
        <AppButton onPress={handleLogout} title="Выйти" variant="text" />
      </View>
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
    fontSize: 22,
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
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  sectionItems: {
    gap: 6,
  },
  navActions: {
    gap: 8,
    marginTop: 8,
  },
});
