import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import type { PaginatedResponse } from '@/shared/types';
import { mapResource } from '@/features/bookings/api/mapResource';
import type {
  Resource,
  ResourcesParams,
  ResourceScheduleParams,
  ScheduleSlot,
} from '@/features/bookings/types/resource';

export async function fetchResources(
  params?: ResourcesParams,
): Promise<PaginatedResponse<Resource>> {
  const { data } = await apiClient.get(API.bookings.resources, { params });
  return {
    count: data.count as number,
    next: data.next as string | null,
    previous: data.previous as string | null,
    results: (data.results as unknown[]).map((r) => mapResource(r as Record<string, unknown>)),
  };
}

export async function fetchResource(id: number): Promise<Resource> {
  const { data } = await apiClient.get(API.bookings.resource(id));
  return mapResource(data as Record<string, unknown>);
}

export async function fetchResourceSchedule(
  id: number,
  params?: ResourceScheduleParams,
): Promise<ScheduleSlot[]> {
  const { data } = await apiClient.get(API.bookings.resourceSchedule(id), { params });
  return data as ScheduleSlot[];
}
