import { mapDashboard, resolveMediaUrl } from './mapDashboard';
import type {
  SuperadminDashboard,
  CompanyAdminDashboard,
  EmployeeDashboard,
  GuestDashboard,
} from '../types/dashboard';

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

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SUPERADMIN_FIXTURE = {
  role: 'superadmin',
  user: { id: 1, full_name: 'Супер Админ', avatar: '/media/avatars/1/photo.jpg' },
  total_companies: 24,
  total_users: 318,
  bookings_today: 47,
  bookings_week_delta: 5,
  space_load_pct: 62,
  open_service_requests: 8,
  service_requests_closed_today: 3,
  new_companies_last_7d: 2,
  recent_events: [
    { event_type: 'booking', id: 101, title: 'Переговорная A-201 — Иван Петров', start_time: '2024-06-15T09:00:00Z', status: 'confirmed' },
  ],
  quick_actions: ['invite_user', 'manage_bookings'],
  bookings_recent: [
    { id: 101, resource_name: 'Переговорная A-201', user_name: 'Иван Петров', company_name: 'ТОО Астана Бизнес', start_time: '2024-06-15T09:00:00Z', end_time: '2024-06-15T10:00:00Z', status: 'confirmed' },
  ],
  announcements_recent: [
    { id: 7, title: 'Плановое отключение лифтов', text: 'Завтра с 10:00 до 12:00...', created_at: '2024-06-14T08:00:00Z' },
  ],
  floor_load: [
    { floor_id: 3, floor_number: 3, floor_name: 'Этаж 3', total: 40, occupied: 28, occupancy_pct: 70 },
  ],
};

const COMPANY_ADMIN_FIXTURE = {
  role: 'company_admin',
  user: { id: 5, full_name: 'Айгуль Серикова', avatar: null },
  employee_count: 18,
  active_tasks: 34,
  bookings_today: 6,
  free_resources_now: 12,
  announcement_feed: [
    { id: 12, title: 'Собрание отдела', body: 'Пятница в 15:00', category: 'event', scope: 'company', created_at: '2024-06-14T10:00:00Z' },
  ],
  pending_approvals: {
    leaves: [
      {
        id: 8,
        employee: { id: 42, full_name: 'Иван Петров', avatar: '/media/avatars/42/photo.jpg' },
        leave_type: 'vacation',
        start_date: '2024-06-20',
        end_date: '2024-06-27',
        created_at: '2024-06-14T09:00:00Z',
      },
    ],
    guest_passes: [
      {
        id: 3,
        guest_name: 'Асхат Нурланов',
        guest_email: 'askhat@example.com',
        host: { id: 5, full_name: 'Айгуль Серикова', avatar: null },
        visit_date: '2024-06-15T08:00:00Z',
        valid_from: '2024-06-15T08:00:00Z',
        valid_until: '2024-06-15T20:00:00Z',
        created_at: '2024-06-14T16:00:00Z',
      },
    ],
  },
  bookings_recent: [],
  team_bookings_today: [
    { user_full_name: 'Иван Петров', user_initials: 'ИП', resource_name: 'Стол B-14', start_time: '2024-06-15T09:00:00Z', end_time: '2024-06-15T18:00:00Z', status: 'confirmed' },
  ],
  my_tasks: [
    { id: 55, title: 'Согласовать бюджет', board_name: 'Финансы', due_date: '2024-06-15', priority: 'high', is_overdue: false },
  ],
};

const EMPLOYEE_FIXTURE = {
  role: 'employee',
  user: { id: 42, full_name: 'Иван Петров', avatar: '/media/avatars/42/photo.jpg' },
  my_tasks_today: 2,
  my_bookings_today: 1,
  unread_notifications_count: 4,
  announcement_feed: [
    { id: 12, title: 'Собрание отдела', body: 'Пятница в 15:00', category: 'event', scope: 'company', created_at: '2024-06-14T10:00:00Z' },
  ],
  bookings_recent: [],
  my_upcoming_bookings: [
    { id: 101, resource_name: 'Переговорная A-201', resource_type: 'meeting_room', resource_capacity: 8, resource_row: null, start_time: '2024-06-15T14:00:00Z', end_time: '2024-06-15T15:00:00Z', is_all_day: false, status: 'confirmed' },
  ],
  my_tasks: [
    { id: 55, title: 'Подготовить отчёт', board_name: 'Маркетинг', due_date: '2024-06-15', priority: 'medium', is_overdue: false },
  ],
  my_tasks_boards_count: 2,
};

const GUEST_FIXTURE = {
  role: 'guest',
  user: { id: 99, full_name: 'Гость Тестов', avatar: null },
  my_bookings_today: 1,
  quick_booking: { available_desks: 45, available_rooms: 12 },
  bc_announcements: [
    { id: 7, title: 'Добро пожаловать в New Level Hub', body: 'Инструкция для гостей...', category: 'info', scope: 'building', created_at: '2024-06-01T08:00:00Z' },
  ],
};

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
