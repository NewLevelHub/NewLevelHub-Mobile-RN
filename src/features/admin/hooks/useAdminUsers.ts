import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import { useDebounce } from '@/shared/lib/useDebounce';
import type { User, PaginatedResponse } from '@/shared/types';
import type { UserRole } from '@/shared/config/constants';

export type IsActiveFilter = 'all' | 'active' | 'inactive';

export interface AdminUsersFilters {
  search: string;
  role: UserRole | 'all';
  isActive: IsActiveFilter;
}

export interface UseAdminUsersResult {
  users: User[];
  filters: AdminUsersFilters;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  setSearch: (v: string) => void;
  setRole: (v: UserRole | 'all') => void;
  setIsActive: (v: IsActiveFilter) => void;
  fetchNextPage: () => void;
}

export function useAdminUsers(): UseAdminUsersResult {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole | 'all'>('all');
  const [isActive, setIsActive] = useState<IsActiveFilter>('all');

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetchingNextPage, hasNextPage, isError, fetchNextPage } =
    useInfiniteQuery<PaginatedResponse<User>, Error>({
      queryKey: ['admin', 'users', { search: debouncedSearch, role, isActive }],
      queryFn: ({ pageParam }) => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (role !== 'all') params.set('role', role);
        if (isActive === 'active') params.set('is_active', 'true');
        if (isActive === 'inactive') params.set('is_active', 'false');
        params.set('page', String(pageParam ?? 1));
        const query = params.toString();
        return apiClient
          .get<PaginatedResponse<User>>(`${API.admin.users}${query ? `?${query}` : ''}`)
          .then((r) => r.data);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.next ? allPages.length + 1 : undefined,
    });

  const users = data?.pages.flatMap((p) => p.results) ?? [];

  return {
    users,
    filters: { search, role, isActive },
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    isError,
    setSearch,
    setRole,
    setIsActive,
    fetchNextPage,
  };
}
