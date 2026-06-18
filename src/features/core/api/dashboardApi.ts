import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import { mapDashboard } from './mapDashboard';
import type { DashboardResponse } from '../types/dashboard';

export async function fetchDashboard(): Promise<DashboardResponse> {
  const response = await apiClient.get<unknown>(API.core.dashboard);
  return mapDashboard(response.data);
}
