import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import type { ActivityFeedResponse } from '@/features/users/types/activity';

export const ACTIVITY_FEED_QUERY_KEY = ['activity-feed'] as const;

const EMPTY: ActivityFeedResponse = { bookings: [], tasks: [], passes: [] };

export interface UseActivityFeedResult {
  data: ActivityFeedResponse;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
}

export function useActivityFeed(): UseActivityFeedResult {
  const { data, isLoading, isError, refetch } = useQuery<ActivityFeedResponse>({
    queryKey: ACTIVITY_FEED_QUERY_KEY,
    queryFn: () => apiClient.get(API.activity.feed).then((r) => r.data),
  });

  return { data: data ?? EMPTY, isLoading, isError, refetch };
}
