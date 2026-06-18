import { useQuery } from '@tanstack/react-query';

import { fetchDashboard } from '@/features/core/api/dashboardApi';
import { parseApiError } from '@/core/network/errorParser';
import type { ApiException } from '@/core/network/apiException';
import type { DashboardResponse } from '@/features/core/types/dashboard';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

const STALE_TIME = 2 * 60 * 1000;

export interface UseDashboardResult {
  data: DashboardResponse | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  error: ApiException | null;
  refetch: () => Promise<unknown>;
}

export function useDashboard(): UseDashboardResult {
  const { data, isLoading, isRefetching, error, refetch } = useQuery<DashboardResponse, ApiException>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      try {
        return await fetchDashboard();
      } catch (e) {
        throw parseApiError(e);
      }
    },
    staleTime: STALE_TIME,
    refetchOnWindowFocus: true,
  });

  return {
    data,
    isLoading,
    isRefetching,
    error: error ?? null,
    refetch,
  };
}
