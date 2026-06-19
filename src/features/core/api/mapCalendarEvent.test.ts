import { mapCalendarEvent, mapCalendarEvents } from './mapCalendarEvent';

// ─── Fixtures (from API docs) ─────────────────────────────────────────────────

const LEAVE_FIXTURE = {
  id: 'leave-15',
  event_type: 'leave',
  source_id: 15,
  title: 'Отсутствие: Айгуль Серикова',
  start: '2024-06-10',
  end: '2024-06-14',
  all_day: true,
  status: 'approved',
  user_id: 42,
  user_name: 'Айгуль Серикова',
  leave_type: 'vacation',
  comment: 'Семейный отпуск',
};

// ─── mapCalendarEvent ─────────────────────────────────────────────────────────

describe('mapCalendarEvent', () => {
  it('maps all fields from doc fixture', () => {
    const result = mapCalendarEvent(LEAVE_FIXTURE);
    expect(result.id).toBe('leave-15');
    expect(result.event_type).toBe('leave');
    expect(result.source_id).toBe(15);
    expect(result.title).toBe('Отсутствие: Айгуль Серикова');
    expect(result.start).toBe('2024-06-10');
    expect(result.end).toBe('2024-06-14');
    expect(result.all_day).toBe(true);
    expect(result.status).toBe('approved');
    expect(result.user_id).toBe(42);
    expect(result.user_name).toBe('Айгуль Серикова');
    expect(result.leave_type).toBe('vacation');
    expect(result.comment).toBe('Семейный отпуск');
  });

  it('normalises null comment to null', () => {
    const result = mapCalendarEvent({ ...LEAVE_FIXTURE, comment: null });
    expect(result.comment).toBeNull();
  });

  it('hardcodes event_type to leave regardless of raw value', () => {
    const result = mapCalendarEvent({ ...LEAVE_FIXTURE, event_type: 'unknown' });
    expect(result.event_type).toBe('leave');
  });

  it('hardcodes status to approved regardless of raw value', () => {
    const result = mapCalendarEvent({ ...LEAVE_FIXTURE, status: 'pending' });
    expect(result.status).toBe('approved');
  });

  it('passes through leave_type values', () => {
    const types = ['vacation', 'day_off', 'sick_leave', 'remote'] as const;
    for (const type of types) {
      expect(mapCalendarEvent({ ...LEAVE_FIXTURE, leave_type: type }).leave_type).toBe(type);
    }
  });
});

// ─── mapCalendarEvents ────────────────────────────────────────────────────────

describe('mapCalendarEvents', () => {
  it('maps an array of two events', () => {
    const raw = [
      LEAVE_FIXTURE,
      { ...LEAVE_FIXTURE, id: 'leave-16', leave_type: 'remote', comment: null },
    ];
    const result = mapCalendarEvents(raw);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('leave-15');
    expect(result[1].leave_type).toBe('remote');
    expect(result[1].comment).toBeNull();
  });

  it('returns empty array for empty array input', () => {
    expect(mapCalendarEvents([])).toEqual([]);
  });

  it('returns empty array for null (not array)', () => {
    expect(mapCalendarEvents(null)).toEqual([]);
  });

  it('returns empty array for object wrapper (wrong shape)', () => {
    expect(mapCalendarEvents({ results: [LEAVE_FIXTURE] })).toEqual([]);
  });
});
