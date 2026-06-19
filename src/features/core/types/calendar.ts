import { ApiException } from '@/core/network/apiException';

export interface CalendarLeaveEvent {
  id: string;
  event_type: 'leave';
  source_id: number;
  title: string;
  start: string;
  end: string;
  all_day: boolean;
  status: 'approved';
  user_id: number;
  user_name: string;
  leave_type: 'vacation' | 'day_off' | 'sick_leave' | 'remote';
  comment: string | null;
}

export class CalendarForbiddenError extends ApiException {
  constructor() {
    super({
      code: 'CALENDAR_FORBIDDEN',
      message: 'Нет доступа к командному календарю',
      statusCode: 403,
    });
    this.name = 'CalendarForbiddenError';
  }
}
