import {
  validateAvailabilityInterval,
  toAlmatyISO,
  getAlmatyDateOptions,
  getDefaultTimeRange,
} from '@/features/bookings/lib/bookingTimeRules';

const iso = (date: string, h: number, m: number) =>
  `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00+06:00`;

describe('validateAvailabilityInterval', () => {
  describe('general', () => {
    it('rejects when end is before start', () => {
      const result = validateAvailabilityInterval(
        iso('2024-06-15', 10, 0),
        iso('2024-06-15', 9, 0),
        null,
      );
      expect(result.valid).toBe(false);
    });

    it('rejects when end equals start', () => {
      const result = validateAvailabilityInterval(
        iso('2024-06-15', 9, 0),
        iso('2024-06-15', 9, 0),
        null,
      );
      expect(result.valid).toBe(false);
    });

    it('accepts valid interval with null resourceType', () => {
      const result = validateAvailabilityInterval(
        iso('2024-06-15', 9, 0),
        iso('2024-06-15', 10, 0),
        null,
      );
      expect(result.valid).toBe(true);
    });

    it('rejects invalid ISO string', () => {
      const result = validateAvailabilityInterval('not-a-date', iso('2024-06-15', 10, 0), null);
      expect(result.valid).toBe(false);
    });
  });

  describe('desk', () => {
    it('accepts a 30-minute interval', () => {
      expect(
        validateAvailabilityInterval(iso('2024-06-15', 9, 0), iso('2024-06-15', 9, 30), 'desk'),
      ).toMatchObject({ valid: true });
    });

    it('accepts an 8-hour interval', () => {
      expect(
        validateAvailabilityInterval(iso('2024-06-15', 9, 0), iso('2024-06-15', 17, 0), 'desk'),
      ).toMatchObject({ valid: true });
    });

    it('rejects zero-duration interval', () => {
      expect(
        validateAvailabilityInterval(iso('2024-06-15', 9, 0), iso('2024-06-15', 9, 0), 'desk'),
      ).toMatchObject({ valid: false });
    });
  });

  describe('meeting_room', () => {
    it('rejects less than 30 minutes', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 9, 15),
          'meeting_room',
        ),
      ).toMatchObject({ valid: false });
    });

    it('accepts exactly 30 minutes', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 9, 30),
          'meeting_room',
        ),
      ).toMatchObject({ valid: true });
    });

    it('accepts 2 hours', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 11, 0),
          'meeting_room',
        ),
      ).toMatchObject({ valid: true });
    });

    it('accepts exactly 4 hours', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 13, 0),
          'meeting_room',
        ),
      ).toMatchObject({ valid: true });
    });

    it('rejects more than 4 hours', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 14, 0),
          'meeting_room',
        ),
      ).toMatchObject({ valid: false });
    });

    it('error message mentions Минимальная длительность for short intervals', () => {
      const result = validateAvailabilityInterval(
        iso('2024-06-15', 9, 0),
        iso('2024-06-15', 9, 10),
        'meeting_room',
      );
      expect(result.error).toContain('Минимальная длительность');
    });

    it('error message mentions Максимальная длительность for long intervals', () => {
      const result = validateAvailabilityInterval(
        iso('2024-06-15', 8, 0),
        iso('2024-06-15', 14, 0),
        'meeting_room',
      );
      expect(result.error).toContain('Максимальная длительность');
    });
  });

  describe('parking', () => {
    it('accepts whole-day booking (00:00–23:59)', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 0, 0),
          iso('2024-06-15', 23, 59),
          'parking',
        ),
      ).toMatchObject({ valid: true });
    });

    it('rejects non-midnight start time', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 23, 59),
          'parking',
        ),
      ).toMatchObject({ valid: false });
    });

    it('rejects non-23:59 end time', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 0, 0),
          iso('2024-06-15', 18, 0),
          'parking',
        ),
      ).toMatchObject({ valid: false });
    });

    it('error message mentions целый день', () => {
      const result = validateAvailabilityInterval(
        iso('2024-06-15', 9, 0),
        iso('2024-06-15', 23, 59),
        'parking',
      );
      expect(result.error).toContain('целый день');
    });
  });

  describe('capsule', () => {
    it('rejects less than 1 hour', () => {
      expect(
        validateAvailabilityInterval(iso('2024-06-15', 9, 0), iso('2024-06-15', 9, 30), 'capsule'),
      ).toMatchObject({ valid: false });
    });

    it('accepts exactly 1 hour', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 10, 0),
          'capsule',
        ),
      ).toMatchObject({ valid: true });
    });

    it('accepts 4 hours', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 13, 0),
          'capsule',
        ),
      ).toMatchObject({ valid: true });
    });

    it('accepts exactly 8 hours', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 17, 0),
          'capsule',
        ),
      ).toMatchObject({ valid: true });
    });

    it('rejects more than 8 hours', () => {
      expect(
        validateAvailabilityInterval(
          iso('2024-06-15', 9, 0),
          iso('2024-06-15', 18, 0),
          'capsule',
        ),
      ).toMatchObject({ valid: false });
    });
  });
});

describe('toAlmatyISO', () => {
  it('formats a typical time with zero-padding', () => {
    expect(toAlmatyISO(2024, 6, 5, 9, 5)).toBe('2024-06-05T09:05:00+06:00');
  });

  it('formats 00:00 midnight', () => {
    expect(toAlmatyISO(2024, 1, 1, 0, 0)).toBe('2024-01-01T00:00:00+06:00');
  });

  it('formats 23:59', () => {
    expect(toAlmatyISO(2024, 12, 31, 23, 59)).toBe('2024-12-31T23:59:00+06:00');
  });

  it('always appends +06:00 suffix', () => {
    expect(toAlmatyISO(2024, 6, 15, 14, 30)).toContain('+06:00');
  });
});

describe('getAlmatyDateOptions', () => {
  it('returns exactly the requested count', () => {
    expect(getAlmatyDateOptions(7)).toHaveLength(7);
    expect(getAlmatyDateOptions(14)).toHaveLength(14);
  });

  it('labels the first entry as Сегодня', () => {
    expect(getAlmatyDateOptions(3)[0].label).toBe('Сегодня');
  });

  it('labels the second entry as Завтра', () => {
    expect(getAlmatyDateOptions(3)[1].label).toBe('Завтра');
  });

  it('labels subsequent entries as DD.MM', () => {
    const opts = getAlmatyDateOptions(5);
    // Third entry onward should not be "Сегодня" or "Завтра"
    expect(opts[2].label).not.toBe('Сегодня');
    expect(opts[2].label).not.toBe('Завтра');
    expect(opts[2].label).toMatch(/^\d{2}\.\d{2}$/);
  });

  it('each entry has valid year/month/day', () => {
    const opts = getAlmatyDateOptions(3);
    for (const d of opts) {
      expect(d.year).toBeGreaterThan(2020);
      expect(d.month).toBeGreaterThanOrEqual(1);
      expect(d.month).toBeLessThanOrEqual(12);
      expect(d.day).toBeGreaterThanOrEqual(1);
      expect(d.day).toBeLessThanOrEqual(31);
    }
  });
});

describe('getDefaultTimeRange', () => {
  it('returns 00:00–23:59 for parking', () => {
    expect(getDefaultTimeRange('parking')).toEqual({
      startHour: 0,
      startMinute: 0,
      endHour: 23,
      endMinute: 59,
    });
  });

  it('returns 09:00–10:00 for desk', () => {
    expect(getDefaultTimeRange('desk')).toEqual({
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
    });
  });

  it('returns 09:00–10:00 for meeting_room', () => {
    expect(getDefaultTimeRange('meeting_room')).toEqual({
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
    });
  });

  it('returns 09:00–10:00 for capsule', () => {
    expect(getDefaultTimeRange('capsule')).toEqual({
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
    });
  });

  it('returns 09:00–10:00 for null resourceType', () => {
    expect(getDefaultTimeRange(null)).toEqual({
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
    });
  });
});
