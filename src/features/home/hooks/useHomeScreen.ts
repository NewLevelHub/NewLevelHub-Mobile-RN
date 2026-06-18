import { useCallback, useState } from 'react';

import { useAuthStore } from '@/core/auth/authStore';
import { useDashboard } from '@/features/core/hooks/useDashboard';
import type { CompanyAdminDashboard, EmployeeDashboard } from '@/features/core/types/dashboard';

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

  const employeeData: EmployeeDashboard | null =
    dashboard?.role === 'employee' ? (dashboard as EmployeeDashboard) : null;

  const companyAdminData: CompanyAdminDashboard | null =
    dashboard?.role === 'company_admin' ? (dashboard as CompanyAdminDashboard) : null;

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
    employeeData,
    companyAdminData,
    isRefreshing,
    handleRefresh,
  };
}
