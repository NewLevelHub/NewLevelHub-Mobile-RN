import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchProfile } from '@/features/users/api/profileApi';
import type { User } from '@/shared/types';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export interface UseProfileResult {
  profile: User | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  refetch: () => Promise<unknown>;
}

export function useProfile(): UseProfileResult {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<User, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
  });

  function refreshProfile() {
    return queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
  }

  return { profile: data ?? null, isLoading, isError, error: error ?? null, refreshProfile, refetch };
}
