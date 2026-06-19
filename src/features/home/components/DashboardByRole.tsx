/**
 * DashboardByRole — единая точка рендера дашборда по роли пользователя.
 *
 * Принимает типизированный DashboardResponse (дискриминированный union),
 * переключается по полю `role` и рендерит нужный компонент.
 * TypeScript проверяет исчерпывающесть через assertNever в ветке default.
 */

import type { DashboardResponse } from '@/features/core/types/dashboard';
import { USER_ROLES } from '@/shared/config/constants';
import { AppErrorView } from '@/shared/ui/AppErrorView';

import { SuperadminDashboard } from './SuperadminDashboard';
import { CompanyAdminDashboard } from './CompanyAdminDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';
import { GuestDashboard } from './GuestDashboard';

/**
 * assertNever обеспечивает исчерпывающую проверку на уровне TypeScript:
 * если в UserRole появится новая роль и она не будет обработана в switch,
 * компилятор укажет на ошибку (тип `never` не может быть присвоен параметру `never`).
 *
 * Возвращает `null` (вместо бросания) чтобы runtime gracefully degraded —
 * вызывающий код рендерит <AppErrorView> поверх этого вызова.
 */
function assertNever(_x: never): null {
  return null;
}

interface Props {
  data: DashboardResponse;
}

export function DashboardByRole({ data }: Props) {
  switch (data.role) {
    case USER_ROLES.SUPERADMIN:
      return (
        <SuperadminDashboard
          data={data}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onQuickAction={() => {}}
        />
      );

    case USER_ROLES.COMPANY_ADMIN:
      return <CompanyAdminDashboard data={data} />;

    case USER_ROLES.EMPLOYEE:
      return <EmployeeDashboard data={data} />;

    case USER_ROLES.GUEST:
    case USER_ROLES.RECEPTION:
    case USER_ROLES.SERVICE_MANAGER:
      return (
        <GuestDashboard
          data={data}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onBookingPress={() => {}}
        />
      );

    default: {
      // assertNever triggers a TypeScript compile error if a new UserRole value
      // is not handled in this switch — ensures exhaustive coverage at build time.
      assertNever(data);
      return <AppErrorView message="Неизвестная роль" />;
    }
  }
}
