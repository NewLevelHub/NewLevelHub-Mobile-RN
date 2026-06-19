import { resolveMediaUrl } from '@/core/config/apiConfig';
import type { Resource, ResourcePhoto, ScheduleSlot } from '@/features/bookings/types/resource';

interface RawPhoto {
  id: number;
  image: string;
  image_url: string;
  created_at: string;
}

interface RawScheduleSlot {
  booking_id: number;
  start: string;
  end: string;
  status?: string;
  user_name?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapResource(raw: Record<string, any>): Resource {
  const resolvedPhotoUrl = resolveMediaUrl(raw.photo_url as string | null);

  return {
    id: raw.id as number,
    type: raw.type,
    name: raw.name as string,
    floor_id: raw.floor_id as number,
    floor_number: raw.floor_number as number,
    floor_name: raw.floor_name as string,
    zone: (raw.zone as string) ?? '',
    photoUrl: resolvedPhotoUrl || null,
    photos: Array.isArray(raw.photos)
      ? (raw.photos as RawPhoto[]).map(
          (p): ResourcePhoto => ({
            id: p.id,
            image: p.image,
            image_url: resolveMediaUrl(p.image_url) || p.image_url,
            created_at: p.created_at,
          }),
        )
      : [],
    capacity: (raw.capacity as number | null) ?? null,
    equipment: raw.equipment ?? null,
    isActive: raw.is_active as boolean,
    isHotDesk: (raw.is_hot_desk as boolean) ?? false,
    availabilityDays: (raw.availability_days as number[]) ?? [],
    parkingType: (raw.parking_type as string | null) ?? null,
    capsuleZone: (raw.capsule_zone as string) ?? '',
    assignedCompany: (raw.assigned_company as number | null) ?? null,
    assignedCompanyName: (raw.assigned_company_name as string | null) ?? null,
    status: raw.status,
    reason: (raw.reason as string | null) ?? null,
    availableAt: (raw.available_at as string | null) ?? null,
    schedule: Array.isArray(raw.schedule)
      ? (raw.schedule as RawScheduleSlot[]).map(
          (s): ScheduleSlot => ({
            booking_id: s.booking_id,
            start: s.start,
            end: s.end,
            status: s.status,
            user_name: s.user_name,
          }),
        )
      : undefined,
  };
}
