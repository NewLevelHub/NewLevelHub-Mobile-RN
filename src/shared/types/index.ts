import type { UserRole } from '@/shared/config/constants';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  company_id: number | null;
  company_name: string | null;
  company: {
    id: number;
    name: string;
    onboarding_completed?: boolean;
    logo?: string | null;
    plan?: string | null;
  } | null;
  avatar: string | null;
  is_active?: boolean;
  is_email_verified: boolean;
  position: string | null;
  date_joined?: string;
  last_login?: string | null;
}

export interface AdminUserDetail extends User {
  is_active: boolean;
  bookings_count: number;
  tasks_count: number;
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  created_at: string;
}

export interface InviteInfo {
  company_name: string | null;
  email: string;
  role: string;
  is_guest_upgrade: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
