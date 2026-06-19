import type { CalendarLeaveEvent } from '../types/calendar';

export function mapCalendarEvent(raw: unknown): CalendarLeaveEvent {
  const data = raw as Record<string, unknown>;
  return {
    id: data.id as string,
    event_type: 'leave',
    source_id: data.source_id as number,
    title: data.title as string,
    start: data.start as string,
    end: data.end as string,
    all_day: data.all_day as boolean,
    status: 'approved',
    user_id: data.user_id as number,
    user_name: data.user_name as string,
    leave_type: data.leave_type as CalendarLeaveEvent['leave_type'],
    comment: (data.comment as string | null) ?? null,
  };
}

export function mapCalendarEvents(raw: unknown): CalendarLeaveEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapCalendarEvent);
}
