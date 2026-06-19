import { mapReservation } from './mapReservation';

import RESERVATION_FIXTURE from '../__fixtures__/reservation.json';
import CAPSULE_FIXTURE from '../__fixtures__/reservation_capsule.json';

describe('mapReservation — meeting room', () => {
  const result = mapReservation(RESERVATION_FIXTURE as Record<string, unknown>);

  it('maps id, resource, status', () => {
    expect(result.id).toBe(101);
    expect(result.resource).toBe(42);
    expect(result.status).toBe('confirmed');
  });

  it('maps resourceName and resourceType', () => {
    expect(result.resourceName).toBe('Переговорная A-201');
    expect(result.resourceType).toBe('meeting_room');
  });

  it('maps bookedBy from booked_by object', () => {
    expect(result.bookedBy.id).toBe(42);
    expect(result.bookedBy.full_name).toBe('Иван Петров');
    expect(result.bookedBy.avatar).toBeNull();
  });

  it('maps start/end times', () => {
    expect(result.startTime).toBe('2024-06-15T09:00:00+06:00');
    expect(result.endTime).toBe('2024-06-15T10:00:00+06:00');
  });

  it('maps participants array', () => {
    expect(result.participants).toHaveLength(1);
    expect(result.participants[0].id).toBe(55);
    expect(result.participants[0].full_name).toBe('Айгуль Серикова');
    expect(result.participants[0].position).toBe('Дизайнер');
    expect(result.participants[0].avatar).toBeNull();
  });

  it('maps nullable fields as null', () => {
    expect(result.cancelledBy).toBeNull();
    expect(result.cancelReason).toBeNull();
    expect(result.recurringBookingId).toBeNull();
    expect(result.checkedInAt).toBeNull();
    expect(result.qrCode).toBeNull();
    expect(result.qrImageUrl).toBeNull();
  });

  it('maps timestamps', () => {
    expect(result.createdAt).toBe('2024-06-14T12:00:00Z');
    expect(result.updatedAt).toBe('2024-06-14T12:00:00Z');
  });
});

describe('mapReservation — capsule (with QR)', () => {
  const result = mapReservation(CAPSULE_FIXTURE as Record<string, unknown>);

  it('maps capsuleZone', () => {
    expect(result.capsuleZone).toBe('quiet');
  });

  it('maps qrCode UUID', () => {
    expect(result.qrCode).toBe('7c9e6679-7425-40de-944b-e07fc1f90ae7');
  });

  it('maps qrImageUrl (absolute URL stays as-is)', () => {
    expect(result.qrImageUrl).toBe(
      'https://your-domain.com/api/v1/bookings/reservations/qr/7c9e6679-7425-40de-944b-e07fc1f90ae7/image/',
    );
  });

  it('resolves bookedBy avatar (relative path gets base URL prepended)', () => {
    // avatar is /media/avatars/42/photo.jpg — resolveMediaUrl from apiConfig prepends mediaOrigin
    expect(result.bookedBy.avatar).toContain('/media/avatars/42/photo.jpg');
  });

  it('participants is empty array', () => {
    expect(result.participants).toEqual([]);
  });
});

describe('mapReservation — fallback bookedBy when booked_by absent', () => {
  it('constructs bookedBy from user/user_name fields', () => {
    const raw = {
      ...RESERVATION_FIXTURE,
      booked_by: null,
    };
    const result = mapReservation(raw as Record<string, unknown>);
    expect(result.bookedBy.id).toBe(42);
    expect(result.bookedBy.full_name).toBe('Иван Петров');
    expect(result.bookedBy.avatar).toBeNull();
  });
});
