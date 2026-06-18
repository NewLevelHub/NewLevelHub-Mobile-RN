import { env } from '@/core/config/env';
import { USER_ROLES } from '@/shared/config/constants';
import type {
  DashboardResponse,
  DashboardUser,
  GuestPass,
  PendingLeave,
  SuperadminDashboard,
  CompanyAdminDashboard,
  EmployeeDashboard,
  GuestDashboard,
} from '../types/dashboard';

export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${env.MEDIA_BASE_URL}${path}`;
  return path;
}

function mapDashboardUser(raw: Record<string, unknown>): DashboardUser {
  return {
    id: raw.id as number,
    full_name: (raw.full_name as string) ?? '',
    avatar: resolveMediaUrl(raw.avatar as string | null),
  };
}

function mapPendingLeave(raw: Record<string, unknown>): PendingLeave {
  return {
    id: raw.id as number,
    employee: mapDashboardUser(raw.employee as Record<string, unknown>),
    leave_type: raw.leave_type as PendingLeave['leave_type'],
    start_date: raw.start_date as string,
    end_date: raw.end_date as string,
    created_at: raw.created_at as string,
  };
}

function mapGuestPass(raw: Record<string, unknown>): GuestPass {
  return {
    id: raw.id as number,
    guest_name: raw.guest_name as string,
    guest_email: raw.guest_email as string,
    host: mapDashboardUser(raw.host as Record<string, unknown>),
    visit_date: raw.visit_date as string,
    valid_from: raw.valid_from as string,
    valid_until: raw.valid_until as string,
    created_at: raw.created_at as string,
  };
}

export function mapDashboard(raw: unknown): DashboardResponse {
  const data = raw as Record<string, unknown>;
  const role = data.role as string;
  const user = mapDashboardUser(data.user as Record<string, unknown>);

  switch (role) {
    case USER_ROLES.SUPERADMIN:
      return { ...(data as unknown as SuperadminDashboard), user };

    case USER_ROLES.COMPANY_ADMIN: {
      const approvals = data.pending_approvals as {
        leaves: Record<string, unknown>[];
        guest_passes: Record<string, unknown>[];
      };
      return {
        ...(data as unknown as CompanyAdminDashboard),
        user,
        pending_approvals: {
          leaves: approvals.leaves.map(mapPendingLeave),
          guest_passes: approvals.guest_passes.map(mapGuestPass),
        },
      };
    }

    case USER_ROLES.EMPLOYEE:
      return { ...(data as unknown as EmployeeDashboard), user };

    default:
      return { ...(data as unknown as GuestDashboard), user };
  }
}
