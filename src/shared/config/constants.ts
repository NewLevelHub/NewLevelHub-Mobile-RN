export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  RECEPTION: 'reception',
  SERVICE_MANAGER: 'service_manager',
  COMPANY_ADMIN: 'company_admin',
  EMPLOYEE: 'employee',
  GUEST: 'guest',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
