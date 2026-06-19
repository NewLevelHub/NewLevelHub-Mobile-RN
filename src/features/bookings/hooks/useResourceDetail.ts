import { useQuery } from '@tanstack/react-query';
import { fetchResource } from '@/features/bookings/api/resourcesApi';
import type { Resource } from '@/features/bookings/types/resource';

export interface UseResourceDetailResult {
  resource: Resource | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export function useResourceDetail(resourceId: number): UseResourceDetailResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resource', resourceId],
    queryFn: () => fetchResource(resourceId),
    enabled: resourceId > 0,
  });

  return {
    resource: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}
