import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider, notifyManager } from '@tanstack/react-query';

import { useDashboard, DASHBOARD_QUERY_KEY } from './useDashboard';
import { fetchDashboard } from '@/features/core/api/dashboardApi';
import { ApiException } from '@/core/network/apiException';
import type { EmployeeDashboard, GuestDashboard } from '@/features/core/types/dashboard';

jest.mock('@/features/core/api/dashboardApi');
const mockFetch = fetchDashboard as jest.MockedFunction<typeof fetchDashboard>;

// Make React Query synchronous in tests so updates land inside act()
beforeAll(() => {
  notifyManager.setScheduler((cb) => cb());
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const EMPLOYEE_DATA: EmployeeDashboard = {
  role: 'employee',
  user: { id: 42, full_name: 'Иван Петров', avatar: null },
  my_tasks_today: 2,
  my_bookings_today: 1,
  unread_notifications_count: 4,
  announcement_feed: [],
  bookings_recent: [],
  my_upcoming_bookings: [],
  my_tasks: [],
  my_tasks_boards_count: 1,
};

const GUEST_DATA: GuestDashboard = {
  role: 'guest',
  user: { id: 99, full_name: 'Гость Тестов', avatar: null },
  my_bookings_today: 0,
  quick_booking: { available_desks: 10, available_rooms: 5 },
  bc_announcements: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper(queryClient: QueryClient) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Disable gc so cache survives between renders in the same test
        gcTime: Infinity,
      },
    },
  });
}

afterEach(() => {
  jest.clearAllMocks();
});

// ─── DASHBOARD_QUERY_KEY ──────────────────────────────────────────────────────

describe('DASHBOARD_QUERY_KEY', () => {
  it('is ["dashboard"]', () => {
    expect(DASHBOARD_QUERY_KEY).toEqual(['dashboard']);
  });
});

// ─── useDashboard ─────────────────────────────────────────────────────────────

describe('useDashboard', () => {
  it('starts in loading state with no data', async () => {
    // Never resolves so we can observe the initial loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));
    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('returns data on successful fetch', async () => {
    mockFetch.mockResolvedValue(EMPLOYEE_DATA);
    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(EMPLOYEE_DATA);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('returns data for guest role', async () => {
    mockFetch.mockResolvedValue(GUEST_DATA);
    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.role).toBe('guest');
  });

  it('returns ApiException error when fetch throws ApiException', async () => {
    const serverError = new ApiException({
      code: 'SERVER_ERROR',
      message: 'Сервис временно недоступен',
      statusCode: 503,
    });
    mockFetch.mockRejectedValue(serverError);
    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(ApiException);
    expect(result.current.error?.statusCode).toBe(503);
    expect(result.current.error?.message).toBe('Сервис временно недоступен');
  });

  it('wraps raw axios error into ApiException', async () => {
    const rawAxiosError = {
      isAxiosError: true,
      response: { status: 401, data: { detail: 'Unauthorized' } },
      message: 'Unauthorized',
    };
    mockFetch.mockRejectedValue(rawAxiosError);
    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(ApiException);
    expect(result.current.error?.statusCode).toBe(401);
  });

  it('error is null after successful refetch following an error', async () => {
    const queryClient = makeQueryClient();
    mockFetch
      .mockRejectedValueOnce(new ApiException({ message: 'fail', statusCode: 500 }))
      .mockResolvedValueOnce(EMPLOYEE_DATA);

    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).not.toBeNull();

    await result.current.refetch();

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(EMPLOYEE_DATA);
  });

  it('refetch triggers a new API call', async () => {
    mockFetch.mockResolvedValue(EMPLOYEE_DATA);
    const queryClient = makeQueryClient();

    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetch).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('does not re-fetch when data is fresh (staleTime)', async () => {
    mockFetch.mockResolvedValue(EMPLOYEE_DATA);

    // Shared queryClient simulates the same cache between renders
    const queryClient = makeQueryClient();

    // First mount — populates cache
    const first = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });
    await waitFor(() => expect(first.result.current.isLoading).toBe(false));
    first.unmount();

    // Second mount — data is still fresh, no extra call expected
    const second = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });
    await waitFor(() => expect(second.result.current.isLoading).toBe(false));

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(second.result.current.data).toEqual(EMPLOYEE_DATA);
  });

  it('returns isRefetching true during background refetch', async () => {
    let resolveSecond!: (v: EmployeeDashboard) => void;
    mockFetch
      .mockResolvedValueOnce(EMPLOYEE_DATA)
      .mockImplementationOnce(
        () => new Promise<EmployeeDashboard>((res) => { resolveSecond = res; }),
      );

    const queryClient = makeQueryClient();
    const { result } = renderHook(() => useDashboard(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.refetch();

    await waitFor(() => expect(result.current.isRefetching).toBe(true));

    resolveSecond(EMPLOYEE_DATA);
    await waitFor(() => expect(result.current.isRefetching).toBe(false));
  });
});
