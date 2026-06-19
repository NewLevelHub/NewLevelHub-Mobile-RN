import { ApiException } from '@/core/network/apiException';
import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import { CalendarForbiddenError } from '../types/calendar';
import { mapCalendarEvents } from './mapCalendarEvent';
import type { CalendarLeaveEvent } from '../types/calendar';

export interface CalendarEventsParams {
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchCalendarEvents(
  params: CalendarEventsParams,
): Promise<CalendarLeaveEvent[]> {
  try {
    const response = await apiClient.get<unknown>(API.core.calendarEvents, {
      params: {
        ...(params.dateFrom && { date_from: params.dateFrom }),
        ...(params.dateTo && { date_to: params.dateTo }),
      },
    });
    return mapCalendarEvents(response.data);
  } catch (error) {
    if (error instanceof ApiException && error.statusCode === 403) {
      throw new CalendarForbiddenError();
    }
    throw error;
  }
}
