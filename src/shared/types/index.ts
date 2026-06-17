import type { UserRole } from '@/shared/config/constants';

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
  is_email_verified: boolean;
  position: string | null;
  date_joined?: string;
  last_login?: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
