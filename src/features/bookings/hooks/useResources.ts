import { useState, useMemo, useCallback, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '@/shared/lib/useDebounce';
import { fetchResources } from '@/features/bookings/api/resourcesApi';
import type { ResourceType, ResourcesParams } from '@/features/bookings/types/resource';

export interface ResourceFilters {
  type: ResourceType | null;
  floor: number | null;
  capacityMin: number;
  search: string;
  ordering: string;
  availableFrom: string | null;
  availableTo: string | null;
}

const DEFAULT_FILTERS: ResourceFilters = {
  type: null,
  floor: null,
  capacityMin: 0,
  search: '',
  ordering: 'name',
  availableFrom: null,
  availableTo: null,
};

function extractNextPage(next: string | null): number | undefined {
  if (!next) return undefined;
  try {
    const url = new URL(next);
    const page = url.searchParams.get('page');
    return page ? Number(page) : undefined;
  } catch {
    return undefined;
  }
}

export function useResources() {
  const [filters, setFilters] = useState<ResourceFilters>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 300);

  const queryParams = useMemo((): ResourcesParams => {
    const params: ResourcesParams = { ordering: filters.ordering };
    if (filters.type) params.type = filters.type;
    if (filters.floor != null) params.floor = filters.floor;
    if (filters.type === 'meeting_room' && filters.capacityMin > 0) {
      params.capacity_min = filters.capacityMin;
    }
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.availableFrom && filters.availableTo) {
      params.available_from = filters.availableFrom;
      params.available_to = filters.availableTo;
    }
    return params;
  }, [
    filters.type,
    filters.floor,
    filters.capacityMin,
    debouncedSearch,
    filters.ordering,
    filters.availableFrom,
    filters.availableTo,
  ]);

  const query = useInfiniteQuery({
    queryKey: ['resources', queryParams],
    queryFn: ({ pageParam }) =>
      fetchResources({ ...queryParams, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => extractNextPage(lastPage.next),
  });

  const resources = useMemo(
    () => query.data?.pages.flatMap((p) => p.results) ?? [],
    [query.data],
  );

  const [floorMap, setFloorMap] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (resources.length === 0) return;
    setFloorMap((prev) => {
      const next = new Map(prev);
      let changed = false;
      resources.forEach((r) => {
        if (r.floor_number != null && !next.has(r.floor_number)) {
          next.set(r.floor_number, r.floor_name || `Этаж ${r.floor_number}`);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [resources]);

  const floors = useMemo(
    () =>
      Array.from(floorMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([id, label]) => ({ id, label })),
    [floorMap],
  );

  const onTypeChange = useCallback((type: ResourceType | null) => {
    setFilters((f) => ({ ...f, type, floor: null, capacityMin: 0 }));
  }, []);

  const onFloorChange = useCallback((floor: number | null) => {
    setFilters((f) => ({ ...f, floor }));
  }, []);

  const onCapacityIncrement = useCallback(() => {
    setFilters((f) => ({ ...f, capacityMin: f.capacityMin + 1 }));
  }, []);

  const onCapacityDecrement = useCallback(() => {
    setFilters((f) => ({ ...f, capacityMin: Math.max(0, f.capacityMin - 1) }));
  }, []);

  const onSearchChange = useCallback((search: string) => {
    setFilters((f) => ({ ...f, search }));
  }, []);

  const onAvailabilityChange = useCallback((from: string | null, to: string | null) => {
    setFilters((f) => ({ ...f, availableFrom: from, availableTo: to }));
  }, []);

  const onLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const onRefresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return {
    resources,
    floors,
    filters,
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    isError: query.isError,
    hasNextPage: query.hasNextPage ?? false,
    handlers: {
      onTypeChange,
      onFloorChange,
      onCapacityIncrement,
      onCapacityDecrement,
      onSearchChange,
      onAvailabilityChange,
      onLoadMore,
      onRefresh,
    },
  };
}
