import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import type { AdminUserDetail } from '@/shared/types';

export function useAdminUserDetail(userId: number) {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () =>
      apiClient.get<AdminUserDetail>(API.admin.userDetail(userId)).then((r) => r.data),
  });

  const blockMutation = useMutation({
    mutationFn: () => apiClient.post(API.admin.userBlock(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const unblockMutation = useMutation({
    mutationFn: () => apiClient.post(API.admin.userUnblock(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(API.admin.userDetail(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  return {
    user,
    isLoading,
    isError,
    blockMutation,
    unblockMutation,
    deleteMutation,
  };
}
