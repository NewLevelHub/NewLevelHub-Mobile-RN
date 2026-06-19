import { mapDashboard, resolveMediaUrl } from './mapDashboard';
import type {
  SuperadminDashboard,
  CompanyAdminDashboard,
  EmployeeDashboard,
  GuestDashboard,
} from '../types/dashboard';

import SUPERADMIN_FIXTURE from '../__fixtures__/superadmin.json';
import COMPANY_ADMIN_FIXTURE from '../__fixtures__/company_admin.json';
import EMPLOYEE_FIXTURE from '../__fixtures__/employee.json';
import GUEST_FIXTURE from '../__fixtures__/guest.json';

// ─── resolveMediaUrl ──────────────────────────────────────────────────────────

describe('resolveMediaUrl', () => {
  it('returns null for null input', () => {
    expect(resolveMediaUrl(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(resolveMediaUrl(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(resolveMediaUrl('')).toBeNull();
  });

  it('prepends MEDIA_BASE_URL for relative paths', () => {
    const result = resolveMediaUrl('/media/avatars/42/photo.jpg');
    expect(result).toMatch(/\/media\/avatars\/42\/photo\.jpg$/);
    expect(result).toMatch(/^https?:\/\//);
  });

  it('returns absolute URLs unchanged', () => {
    const url = 'https://cdn.example.com/media/avatars/42/photo.jpg';
    expect(resolveMediaUrl(url)).toBe(url);
  });
});

// ─── mapDashboard — superadmin ────────────────────────────────────────────────

describe('mapDashboard — superadmin', () => {
  const result = mapDashboard(SUPERADMIN_FIXTURE) as SuperadminDashboard;

  it('sets role to superadmin', () => {
    expect(result.role).toBe('superadmin');
  });

  it('resolves user avatar', () => {
    expect(result.user.avatar).toMatch(/^https?:\/\//);
    expect(result.user.avatar).toContain('/media/avatars/1/photo.jpg');
  });

  it('preserves KPI fields', () => {
    expect(result.total_companies).toBe(24);
    expect(result.total_users).toBe(318);
    expect(result.space_load_pct).toBe(62);
  });

  it('preserves recent_events', () => {
    expect(result.recent_events).toHaveLength(1);
    expect(result.recent_events[0].id).toBe(101);
  });

  it('preserves quick_actions', () => {
    expect(result.quick_actions).toContain('invite_user');
  });

  it('preserves floor_load', () => {
    expect(result.floor_load[0].occupancy_pct).toBe(70);
  });
});

// ─── mapDashboard — company_admin ─────────────────────────────────────────────

describe('mapDashboard — company_admin', () => {
  const result = mapDashboard(COMPANY_ADMIN_FIXTURE) as CompanyAdminDashboard;

  it('sets role to company_admin', () => {
    expect(result.role).toBe('company_admin');
  });

  it('handles null user avatar', () => {
    expect(result.user.avatar).toBeNull();
  });

  it('resolves nested employee avatar in pending_approvals.leaves', () => {
    const leave = result.pending_approvals.leaves[0];
    expect(leave.employee.avatar).toMatch(/^https?:\/\//);
    expect(leave.employee.avatar).toContain('/media/avatars/42/photo.jpg');
  });

  it('handles null host avatar in pending_approvals.guest_passes', () => {
    const pass = result.pending_approvals.guest_passes[0];
    expect(pass.host.avatar).toBeNull();
  });

  it('preserves pending leave fields', () => {
    const leave = result.pending_approvals.leaves[0];
    expect(leave.id).toBe(8);
    expect(leave.leave_type).toBe('vacation');
    expect(leave.start_date).toBe('2024-06-20');
  });

  it('preserves guest pass fields', () => {
    const pass = result.pending_approvals.guest_passes[0];
    expect(pass.guest_email).toBe('askhat@example.com');
  });

  it('preserves my_tasks', () => {
    expect(result.my_tasks[0].priority).toBe('high');
  });
});

// ─── mapDashboard — employee ──────────────────────────────────────────────────

describe('mapDashboard — employee', () => {
  const result = mapDashboard(EMPLOYEE_FIXTURE) as EmployeeDashboard;

  it('sets role to employee', () => {
    expect(result.role).toBe('employee');
  });

  it('resolves user avatar', () => {
    expect(result.user.avatar).toMatch(/^https?:\/\//);
  });

  it('preserves counters', () => {
    expect(result.my_tasks_today).toBe(2);
    expect(result.unread_notifications_count).toBe(4);
    expect(result.my_tasks_boards_count).toBe(2);
  });

  it('preserves my_upcoming_bookings', () => {
    const booking = result.my_upcoming_bookings[0];
    expect(booking.resource_type).toBe('meeting_room');
    expect(booking.resource_capacity).toBe(8);
    expect(booking.is_all_day).toBe(false);
  });

  it('preserves my_tasks', () => {
    expect(result.my_tasks[0].board_name).toBe('Маркетинг');
  });
});

// ─── mapDashboard — guest ─────────────────────────────────────────────────────

describe('mapDashboard — guest', () => {
  const result = mapDashboard(GUEST_FIXTURE) as GuestDashboard;

  it('sets role to guest', () => {
    expect(result.role).toBe('guest');
  });

  it('handles null user avatar', () => {
    expect(result.user.avatar).toBeNull();
  });

  it('preserves quick_booking', () => {
    expect(result.quick_booking.available_desks).toBe(45);
    expect(result.quick_booking.available_rooms).toBe(12);
  });

  it('preserves bc_announcements', () => {
    expect(result.bc_announcements[0].scope).toBe('building');
  });
});

// ─── reception and service_manager fall into GuestDashboard ──────────────────

describe('mapDashboard — reception role', () => {
  it('maps reception to GuestDashboard shape', () => {
    const result = mapDashboard({ ...GUEST_FIXTURE, role: 'reception' }) as GuestDashboard;
    expect(result.role).toBe('reception');
    expect(result.quick_booking.available_desks).toBe(45);
  });
});

describe('mapDashboard — service_manager role', () => {
  it('maps service_manager to GuestDashboard shape', () => {
    const result = mapDashboard({ ...GUEST_FIXTURE, role: 'service_manager' }) as GuestDashboard;
    expect(result.role).toBe('service_manager');
  });
});
