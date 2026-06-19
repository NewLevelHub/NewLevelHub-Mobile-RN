import { useCallback, useState } from 'react';

import { useAuthStore } from '@/core/auth/authStore';
import { useDashboard } from '@/features/core/hooks/useDashboard';
import type {
  CompanyAdminDashboard,
  EmployeeDashboard,
  GuestDashboard,
  SuperadminDashboard,
} from '@/features/core/types/dashboard';

export function useHomeScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useDashboard();

  const superadminData: SuperadminDashboard | null =
    dashboard?.role === 'superadmin' ? (dashboard as SuperadminDashboard) : null;

  const employeeData: EmployeeDashboard | null =
    dashboard?.role === 'employee' ? (dashboard as EmployeeDashboard) : null;

  const companyAdminData: CompanyAdminDashboard | null =
    dashboard?.role === 'company_admin' ? (dashboard as CompanyAdminDashboard) : null;

  const guestData: GuestDashboard | null =
    dashboard?.role === 'guest' ||
    dashboard?.role === 'reception' ||
    dashboard?.role === 'service_manager'
      ? (dashboard as GuestDashboard)
      : null;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetchDashboard();
    setIsRefreshing(false);
  }, [refetchDashboard]);

  return {
    user,
    logout,
    dashboard,
    dashboardLoading,
    dashboardError,
    refetchDashboard,
    superadminData,
    employeeData,
    companyAdminData,
    guestData,
    isRefreshing,
    handleRefresh,
  };
}
