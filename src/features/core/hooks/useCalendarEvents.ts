import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchCalendarEvents } from '@/features/core/api/calendarApi';
import { CalendarForbiddenError } from '@/features/core/types/calendar';
import { parseApiError } from '@/core/network/errorParser';
import type { ApiException } from '@/core/network/apiException';
import type { CalendarLeaveEvent } from '@/features/core/types/calendar';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function monthBounds(year: number, month: number): { dateFrom: string; dateTo: string } {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    dateFrom: `${year}-${pad(month + 1)}-01`,
    dateTo: `${year}-${pad(month + 1)}-${pad(lastDay)}`,
  };
}

export interface UseCalendarEventsResult {
  year: number;
  month: number;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  events: CalendarLeaveEvent[];
  eventsByDate: Record<string, CalendarLeaveEvent[]>;
  selectedEvents: CalendarLeaveEvent[];
  isLoading: boolean;
  isRefetching: boolean;
  error: ApiException | null;
  isForbidden: boolean;
  refetch: () => Promise<unknown>;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

export function useCalendarEvents(): UseCalendarEventsResult {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { dateFrom, dateTo } = monthBounds(year, month);

  const { data, isLoading, isRefetching, error, refetch } = useQuery<CalendarLeaveEvent[], ApiException>({
    queryKey: ['calendar', 'events', year, month],
    queryFn: async () => {
      try {
        return await fetchCalendarEvents({ dateFrom, dateTo });
      } catch (e) {
        throw parseApiError(e);
      }
    },
    staleTime: 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof CalendarForbiddenError) return false;
      return failureCount < 2;
    },
  });

  const events = data ?? [];

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarLeaveEvent[]> = {};
    for (const ev of events) {
      const start = new Date(ev.start + 'T00:00:00');
      const end = new Date(ev.end + 'T00:00:00');
      const cur = new Date(start);
      while (cur <= end) {
        const key = `${cur.getFullYear()}-${pad(cur.getMonth() + 1)}-${pad(cur.getDate())}`;
        if (!map[key]) map[key] = [];
        map[key].push(ev);
        cur.setDate(cur.getDate() + 1);
      }
    }
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];

  const isForbidden = error instanceof CalendarForbiddenError;

  const goToPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  return {
    year,
    month,
    selectedDate,
    setSelectedDate,
    events,
    eventsByDate,
    selectedEvents,
    isLoading,
    isRefetching,
    error: isForbidden ? null : (error ?? null),
    isForbidden,
    refetch,
    goToPrevMonth,
    goToNextMonth,
  };
}
