import { mapResource } from './mapResource';

import RESOURCE_FIXTURE from '../__fixtures__/resource.json';

describe('mapResource', () => {
  const result = mapResource(RESOURCE_FIXTURE as Record<string, unknown>);

  it('maps id, type, name', () => {
    expect(result.id).toBe(42);
    expect(result.type).toBe('meeting_room');
    expect(result.name).toBe('Переговорная A-201');
  });

  it('maps floor fields', () => {
    expect(result.floor_id).toBe(3);
    expect(result.floor_number).toBe(3);
    expect(result.floor_name).toBe('Этаж 3');
  });

  it('resolves photo_url (absolute URL stays as-is)', () => {
    expect(result.photoUrl).toBe('https://your-domain.com/media/resources/room.jpg');
  });

  it('maps photos array with resolved image_url', () => {
    expect(result.photos).toHaveLength(1);
    expect(result.photos[0].id).toBe(1);
    expect(result.photos[0].image_url).toBe('https://your-domain.com/media/resource_photos/1.jpg');
  });

  it('maps equipment', () => {
    expect(result.equipment).not.toBeNull();
    expect(result.equipment?.projector).toBe(true);
    expect(result.equipment?.tv).toBe(false);
  });

  it('maps boolean flags with camelCase', () => {
    expect(result.isActive).toBe(true);
    expect(result.isHotDesk).toBe(false);
  });

  it('maps availability_days', () => {
    expect(result.availabilityDays).toEqual([0, 1, 2, 3, 4]);
  });

  it('maps status', () => {
    expect(result.status).toBe('free');
  });

  it('maps nullable fields as null', () => {
    expect(result.reason).toBeNull();
    expect(result.availableAt).toBeNull();
    expect(result.assignedCompany).toBeNull();
    expect(result.assignedCompanyName).toBeNull();
    expect(result.parkingType).toBeNull();
  });

  it('maps inline schedule slots', () => {
    expect(result.schedule).toHaveLength(1);
    expect(result.schedule![0].booking_id).toBe(101);
    expect(result.schedule![0].start).toBe('2024-06-15T09:00:00+06:00');
    expect(result.schedule![0].user_name).toBe('Иван Петров');
  });

  it('returns undefined schedule when raw.schedule is absent', () => {
    const withoutSchedule = { ...RESOURCE_FIXTURE, schedule: undefined };
    const r = mapResource(withoutSchedule as Record<string, unknown>);
    expect(r.schedule).toBeUndefined();
  });

  it('returns null photoUrl when photo_url is null', () => {
    const withoutPhoto = { ...RESOURCE_FIXTURE, photo_url: null };
    const r = mapResource(withoutPhoto as Record<string, unknown>);
    expect(r.photoUrl).toBeNull();
  });
});
