import type { UserRole } from '@/shared/config/constants';

export interface DashboardUser {
  id: number;
  full_name: string;
  avatar: string | null;
}

interface DashboardBase {
  role: UserRole;
  user: DashboardUser;
}

// ─── Shared sub-types ────────────────────────────────────────────────────────

export type LeaveType = 'vacation' | 'day_off' | 'sick_leave' | 'remote';

export type QuickAction =
  | 'invite_user'
  | 'create_announcement'
  | 'manage_bookings'
  | 'view_analytics'
  | 'manage_companies';

export interface BookingRecent {
  id: number;
  resource_name: string;
  user_name: string;
  company_name?: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface AnnouncementFeedItem {
  id: number;
  title: string;
  body: string;
  category: string;
  scope: string;
  created_at: string;
}

export interface DashboardTask {
  id: number;
  title: string;
  board_name: string;
  due_date: string | null;
  priority: string;
  is_overdue: boolean;
}

// ─── Superadmin ───────────────────────────────────────────────────────────────

export interface RecentEvent {
  event_type: string;
  id: number;
  title: string;
  start_time: string;
  status: string;
}

export interface AnnouncementRecent {
  id: number;
  title: string;
  text: string;
  created_at: string;
}

export interface FloorLoad {
  floor_id: number;
  floor_number: number;
  floor_name: string;
  total: number;
  occupied: number;
  occupancy_pct: number;
}

export interface SuperadminDashboard extends DashboardBase {
  role: 'superadmin';
  total_companies: number;
  total_users: number;
  bookings_today: number;
  bookings_week_delta: number;
  space_load_pct: number;
  open_service_requests: number;
  service_requests_closed_today: number;
  new_companies_last_7d: number;
  recent_events: RecentEvent[];
  quick_actions: QuickAction[];
  bookings_recent: BookingRecent[];
  announcements_recent: AnnouncementRecent[];
  floor_load: FloorLoad[];
}

// ─── Company Admin ────────────────────────────────────────────────────────────

export interface PendingLeave {
  id: number;
  employee: DashboardUser;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface GuestPass {
  id: number;
  guest_name: string;
  guest_email: string;
  host: DashboardUser;
  visit_date: string;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

export interface TeamBookingToday {
  user_full_name: string;
  user_initials: string;
  resource_name: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface CompanyAdminDashboard extends DashboardBase {
  role: 'company_admin';
  employee_count: number;
  active_tasks: number;
  bookings_today: number;
  free_resources_now: number;
  announcement_feed: AnnouncementFeedItem[];
  pending_approvals: {
    leaves: PendingLeave[];
    guest_passes: GuestPass[];
  };
  bookings_recent: BookingRecent[];
  team_bookings_today: TeamBookingToday[];
  my_tasks: DashboardTask[];
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface UpcomingBooking {
  id: number;
  resource_name: string;
  resource_type: string;
  resource_capacity: number | null;
  resource_row: string | null;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  status: string;
}

export interface EmployeeDashboard extends DashboardBase {
  role: 'employee';
  my_tasks_today: number;
  my_bookings_today: number;
  unread_notifications_count: number;
  announcement_feed: AnnouncementFeedItem[];
  bookings_recent: BookingRecent[];
  my_upcoming_bookings: UpcomingBooking[];
  my_tasks: DashboardTask[];
  my_tasks_boards_count: number;
}

// ─── Guest / Reception / Service Manager ─────────────────────────────────────

export interface QuickBookingInfo {
  available_desks: number;
  available_rooms: number;
}

export interface BcAnnouncement {
  id: number;
  title: string;
  body: string;
  category: string;
  scope: string;
  created_at: string;
}

export interface GuestDashboard extends DashboardBase {
  role: 'guest' | 'reception' | 'service_manager';
  my_bookings_today: number;
  quick_booking: QuickBookingInfo;
  bc_announcements: BcAnnouncement[];
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type DashboardResponse =
  | SuperadminDashboard
  | CompanyAdminDashboard
  | EmployeeDashboard
  | GuestDashboard;
