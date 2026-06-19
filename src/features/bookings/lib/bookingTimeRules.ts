import type { ResourceType } from '@/features/bookings/types/resource';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface AlmatyDate {
  year: number;
  month: number; // 1-based
  day: number;
  label: string;
}

// Duration limits per resource type (in minutes)
const MIN_DURATION_MINUTES: Record<ResourceType, number> = {
  desk: 1,
  meeting_room: 30,
  // Parking must occupy the full day: 23h 59m
  parking: 23 * 60 + 59,
  capsule: 60,
};

const MAX_DURATION_MINUTES: Record<ResourceType, number> = {
  desk: 24 * 60,
  meeting_room: 4 * 60,
  parking: 24 * 60,
  capsule: 8 * 60,
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} ч` : `${h} ч ${m} мин`;
}

function extractHHMM(iso: string): string {
  const match = /T(\d{2}):(\d{2})/.exec(iso);
  return match ? `${match[1]}:${match[2]}` : '';
}

/**
 * Validates an availability interval for the given resource type.
 * Returns { valid: true } or { valid: false, error: '...' }.
 */
export function validateAvailabilityInterval(
  fromISO: string,
  toISO: string,
  resourceType: ResourceType | null,
): ValidationResult {
  const fromMs = new Date(fromISO).getTime();
  const toMs = new Date(toISO).getTime();

  if (isNaN(fromMs) || isNaN(toMs)) {
    return { valid: false, error: 'Неверный формат даты/времени' };
  }

  if (toMs <= fromMs) {
    return { valid: false, error: 'Время окончания должно быть позже начала' };
  }

  const durationMinutes = (toMs - fromMs) / 60_000;

  if (resourceType === 'parking') {
    const fromTime = extractHHMM(fromISO);
    const toTime = extractHHMM(toISO);
    if (fromTime !== '00:00' || toTime !== '23:59') {
      return {
        valid: false,
        error: 'Парковка бронируется только на целый день (00:00–23:59)',
      };
    }
    return { valid: true };
  }

  if (resourceType) {
    const minDur = MIN_DURATION_MINUTES[resourceType];
    const maxDur = MAX_DURATION_MINUTES[resourceType];

    if (durationMinutes < minDur) {
      return {
        valid: false,
        error: `Минимальная длительность: ${formatDuration(minDur)}`,
      };
    }
    if (durationMinutes > maxDur) {
      return {
        valid: false,
        error: `Максимальная длительность: ${formatDuration(maxDur)}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Serializes year/month/day/hours/minutes to ISO 8601 with Asia/Almaty offset (+06:00).
 */
export function toAlmatyISO(
  year: number,
  month: number, // 1-based
  day: number,
  hours: number,
  minutes: number,
): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${year}-${p(month)}-${p(day)}T${p(hours)}:${p(minutes)}:00+06:00`;
}

/**
 * Returns an array of calendar-date options for the date picker chips,
 * computed from the current Almaty time (UTC+6).
 */
export function getAlmatyDateOptions(count: number = 14): AlmatyDate[] {
  // Shift to UTC+6 to determine today's date in Almaty
  const nowAlmatyMs = Date.now() + 6 * 60 * 60 * 1000;
  const result: AlmatyDate[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(nowAlmatyMs + i * 24 * 60 * 60 * 1000);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();

    let label: string;
    if (i === 0) label = 'Сегодня';
    else if (i === 1) label = 'Завтра';
    else label = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}`;

    result.push({ year, month, day, label });
  }

  return result;
}

/** Returns sensible default time range for the given resource type. */
export function getDefaultTimeRange(resourceType: ResourceType | null): {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
} {
  if (resourceType === 'parking') {
    return { startHour: 0, startMinute: 0, endHour: 23, endMinute: 59 };
  }
  return { startHour: 9, startMinute: 0, endHour: 10, endMinute: 0 };
}

// ─── Duration-based helpers ────────────────────────────────────────────────────

export interface DurationPreset {
  label: string;
  minutes: number;
}

/** Duration preset chips per resource type. */
export function getDurationPresets(resourceType: ResourceType | null): DurationPreset[] {
  if (resourceType === 'meeting_room') {
    return [
      { label: '30 мин', minutes: 30 },
      { label: '1 ч', minutes: 60 },
      { label: '2 ч', minutes: 120 },
      { label: '3 ч', minutes: 180 },
      { label: '4 ч', minutes: 240 },
    ];
  }
  if (resourceType === 'capsule') {
    return [
      { label: '1 ч', minutes: 60 },
      { label: '2 ч', minutes: 120 },
      { label: '4 ч', minutes: 240 },
      { label: '6 ч', minutes: 360 },
      { label: '8 ч', minutes: 480 },
    ];
  }
  // desk / null (all types)
  return [
    { label: '30 мин', minutes: 30 },
    { label: '1 ч', minutes: 60 },
    { label: '2 ч', minutes: 120 },
    { label: '4 ч', minutes: 240 },
    { label: '8 ч', minutes: 480 },
  ];
}

/** Default duration (minutes) to pre-select for the given resource type. */
export function getDefaultDuration(resourceType: ResourceType | null): number {
  if (resourceType === 'capsule') return 120;
  return 60;
}

/**
 * Adds `minutes` to an Almaty ISO string and returns the result as an Almaty ISO string.
 * Correctly handles midnight crossover (e.g. 23:00 + 90 min → next day 00:30).
 */
export function addMinutesToISO(fromISO: string, minutes: number): string {
  const endMs = new Date(fromISO).getTime() + minutes * 60_000;
  // Shift UTC timestamp to Almaty (UTC+6) to extract calendar components
  const d = new Date(endMs + 6 * 60 * 60 * 1000);
  return toAlmatyISO(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  );
}
