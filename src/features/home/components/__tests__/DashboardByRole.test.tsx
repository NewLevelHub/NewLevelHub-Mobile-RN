/**
 * Unit tests for DashboardByRole role router.
 *
 * The real sub-dashboard components are mocked so that each test only verifies
 * the routing logic — not the internal rendering of each dashboard variant.
 * Mocks render a single <Text> with a testID so assertions are fast and stable.
 *
 * Note: jest.mock() factories run before module scope so they cannot reference
 * variables declared outside them (including `React` and `Text`).
 * We require both inside each factory.
 *
 * Note: @testing-library/react-native v14 returns a Promise from render().
 * All tests must await render().
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { DashboardByRole } from '@/features/home/components/DashboardByRole';
import { USER_ROLES } from '@/shared/config/constants';
import type { DashboardResponse } from '@/features/core/types/dashboard';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/features/home/components/SuperadminDashboard', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactInner = require('react') as typeof import('react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Text } = require('react-native') as typeof import('react-native');
  return {
    SuperadminDashboard: () => ReactInner.createElement(Text, { testID: 'superadmin-dashboard' }, 'SuperadminDashboard'),
  };
});

jest.mock('@/features/home/components/CompanyAdminDashboard', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactInner = require('react') as typeof import('react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Text } = require('react-native') as typeof import('react-native');
  return {
    CompanyAdminDashboard: () => ReactInner.createElement(Text, { testID: 'company-admin-dashboard' }, 'CompanyAdminDashboard'),
  };
});

jest.mock('@/features/home/components/EmployeeDashboard', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactInner = require('react') as typeof import('react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Text } = require('react-native') as typeof import('react-native');
  return {
    EmployeeDashboard: () => ReactInner.createElement(Text, { testID: 'employee-dashboard' }, 'EmployeeDashboard'),
  };
});

jest.mock('@/features/home/components/GuestDashboard', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactInner = require('react') as typeof import('react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Text } = require('react-native') as typeof import('react-native');
  return {
    GuestDashboard: () => ReactInner.createElement(Text, { testID: 'guest-dashboard' }, 'GuestDashboard'),
  };
});

jest.mock('@/shared/ui/AppErrorView', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactInner = require('react') as typeof import('react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Text } = require('react-native') as typeof import('react-native');
  return {
    AppErrorView: ({ message }: { message: string }) =>
      ReactInner.createElement(Text, { testID: 'app-error-view' }, message),
  };
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_USER = { id: 1, full_name: 'Тест Тестов', avatar: null };

const SUPERADMIN_DATA: DashboardResponse = {
  role: USER_ROLES.SUPERADMIN,
  user: BASE_USER,
  total_companies: 5,
  total_users: 42,
  bookings_today: 7,
  bookings_week_delta: 2,
  space_load_pct: 65,
  open_service_requests: 3,
  service_requests_closed_today: 1,
  new_companies_last_7d: 1,
  recent_events: [],
  quick_actions: [],
  bookings_recent: [],
  announcements_recent: [],
  floor_load: [],
};

const COMPANY_ADMIN_DATA: DashboardResponse = {
  role: USER_ROLES.COMPANY_ADMIN,
  user: BASE_USER,
  employee_count: 10,
  active_tasks: 4,
  bookings_today: 2,
  free_resources_now: 8,
  announcement_feed: [],
  pending_approvals: { leaves: [], guest_passes: [] },
  bookings_recent: [],
  team_bookings_today: [],
  my_tasks: [],
};

const EMPLOYEE_DATA: DashboardResponse = {
  role: USER_ROLES.EMPLOYEE,
  user: BASE_USER,
  my_tasks_today: 2,
  my_bookings_today: 1,
  unread_notifications_count: 3,
  announcement_feed: [],
  bookings_recent: [],
  my_upcoming_bookings: [],
  my_tasks: [],
  my_tasks_boards_count: 1,
};

const GUEST_DATA: DashboardResponse = {
  role: USER_ROLES.GUEST,
  user: BASE_USER,
  my_bookings_today: 0,
  quick_booking: { available_desks: 5, available_rooms: 2 },
  bc_announcements: [],
};

const RECEPTION_DATA: DashboardResponse = {
  role: USER_ROLES.RECEPTION,
  user: BASE_USER,
  my_bookings_today: 1,
  quick_booking: { available_desks: 3, available_rooms: 1 },
  bc_announcements: [],
};

const SERVICE_MANAGER_DATA: DashboardResponse = {
  role: USER_ROLES.SERVICE_MANAGER,
  user: BASE_USER,
  my_bookings_today: 0,
  quick_booking: { available_desks: 10, available_rooms: 4 },
  bc_announcements: [],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DashboardByRole', () => {
  it('renders SuperadminDashboard for SUPERADMIN role', async () => {
    const { getByTestId } = await render(<DashboardByRole data={SUPERADMIN_DATA} />);
    expect(getByTestId('superadmin-dashboard')).toBeTruthy();
  });

  it('renders CompanyAdminDashboard for COMPANY_ADMIN role', async () => {
    const { getByTestId } = await render(<DashboardByRole data={COMPANY_ADMIN_DATA} />);
    expect(getByTestId('company-admin-dashboard')).toBeTruthy();
  });

  it('renders EmployeeDashboard for EMPLOYEE role', async () => {
    const { getByTestId } = await render(<DashboardByRole data={EMPLOYEE_DATA} />);
    expect(getByTestId('employee-dashboard')).toBeTruthy();
  });

  it('renders GuestDashboard for GUEST role', async () => {
    const { getByTestId } = await render(<DashboardByRole data={GUEST_DATA} />);
    expect(getByTestId('guest-dashboard')).toBeTruthy();
  });

  it('renders GuestDashboard for RECEPTION role', async () => {
    const { getByTestId } = await render(<DashboardByRole data={RECEPTION_DATA} />);
    expect(getByTestId('guest-dashboard')).toBeTruthy();
  });

  it('renders GuestDashboard for SERVICE_MANAGER role', async () => {
    const { getByTestId } = await render(<DashboardByRole data={SERVICE_MANAGER_DATA} />);
    expect(getByTestId('guest-dashboard')).toBeTruthy();
  });

  it('renders AppErrorView fallback for unknown role without throwing', async () => {
    // We force an unknown role by casting — this simulates a future API value
    // that hasn't been added to USER_ROLES yet.
    const unknownData = {
      ...EMPLOYEE_DATA,
      role: 'unknown_future_role',
    } as unknown as DashboardResponse;
    const { getByTestId, getByText } = await render(<DashboardByRole data={unknownData} />);
    expect(getByTestId('app-error-view')).toBeTruthy();
    expect(getByText('Неизвестная роль')).toBeTruthy();
  });
});
