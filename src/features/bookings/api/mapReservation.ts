import { resolveMediaUrl } from '@/core/config/apiConfig';
import type {
  Reservation,
  BookedBy,
  ReservationParticipant,
} from '@/features/bookings/types/reservation';

interface RawBookedBy {
  id: number;
  full_name: string;
  avatar: string | null;
}

interface RawParticipant {
  id: number;
  email: string;
  full_name: string;
  avatar?: string | null;
  position?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapReservation(raw: Record<string, any>): Reservation {
  const rawBookedBy = raw.booked_by as RawBookedBy | null | undefined;

  const bookedBy: BookedBy = rawBookedBy
    ? {
        id: rawBookedBy.id,
        full_name: rawBookedBy.full_name,
        avatar: rawBookedBy.avatar ? resolveMediaUrl(rawBookedBy.avatar) || null : null,
      }
    : {
        id: raw.user as number,
        full_name: raw.user_name as string,
        avatar: null,
      };

  const participants: ReservationParticipant[] = Array.isArray(raw.participants)
    ? (raw.participants as RawParticipant[]).map(
        (p): ReservationParticipant => ({
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          avatar: p.avatar ? resolveMediaUrl(p.avatar) || null : null,
          position: p.position ?? null,
        }),
      )
    : [];

  const rawQrImage = raw.qr_image as string | null | undefined;

  return {
    id: raw.id as number,
    resource: raw.resource as number,
    resourceName: raw.resource_name as string,
    resourceType: raw.resource_type as string,
    capsuleZone: (raw.capsule_zone as string) ?? '',
    user: raw.user as number,
    userName: raw.user_name as string,
    bookedBy,
    company: raw.company as number,
    startTime: raw.start_time as string,
    endTime: raw.end_time as string,
    status: raw.status,
    description: (raw.description as string) ?? '',
    cancelledBy: (raw.cancelled_by as number | null) ?? null,
    cancelReason: (raw.cancel_reason as string | null) ?? null,
    participants,
    recurringBookingId: (raw.recurring_booking_id as number | null) ?? null,
    checkedInAt: (raw.checked_in_at as string | null) ?? null,
    qrCode: (raw.qr_code as string | null) ?? null,
    qrImageUrl: rawQrImage ? resolveMediaUrl(rawQrImage) || rawQrImage : null,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}
