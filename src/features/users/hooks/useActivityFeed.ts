import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import type { ActivityItem } from '@/shared/types';

export const ACTIVITY_FEED_QUERY_KEY = ['activity-feed'] as const;

export interface UseActivityFeedResult {
  items: ActivityItem[];
  isLoading: boolean;
  refetch: () => Promise<unknown>;
}

export function useActivityFeed(): UseActivityFeedResult {
  const { data, isLoading, refetch } = useQuery<ActivityItem[]>({
    queryKey: ACTIVITY_FEED_QUERY_KEY,
    queryFn: () => apiClient.get(API.activity.feed).then((r) => r.data),
  });

  return { items: data ?? [], isLoading, refetch };
}
