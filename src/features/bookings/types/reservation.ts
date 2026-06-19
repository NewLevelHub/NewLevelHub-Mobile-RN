export type ReservationStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type MyBookingFilterStatus = 'upcoming' | 'past' | 'cancelled';

export interface BookedBy {
  id: number;
  full_name: string;
  avatar: string | null;
}

export interface ReservationParticipant {
  id: number;
  email: string;
  full_name: string;
  avatar: string | null;
  position: string | null;
}

export interface Reservation {
  id: number;
  resource: number;
  resourceName: string;
  resourceType: string;
  capsuleZone: string;
  user: number;
  userName: string;
  bookedBy: BookedBy;
  company: number;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  description: string;
  cancelledBy: number | null;
  cancelReason: string | null;
  participants: ReservationParticipant[];
  recurringBookingId: number | null;
  checkedInAt: string | null;
  qrCode: string | null;
  qrImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationBody {
  resource_id: number;
  start_time: string;
  end_time: string;
  description?: string;
  participant_ids?: number[];
}

export interface CancelReservationBody {
  reason?: string;
}

export interface MyReservationsParams {
  status?: MyBookingFilterStatus;
  resource_type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export interface ReservationsParams extends MyReservationsParams {
  resource?: number;
  user?: number;
  company?: number;
  ordering?: string;
}

export interface BulkCancelBody {
  booking_ids: number[];
  reason?: string;
}

export interface BulkCancelResponse {
  cancelled: number;
  skipped: number;
  skipped_ids: number[];
}

export interface MemberPickerItem {
  id: number;
  email: string;
  full_name: string;
  avatar: string | null;
  position: string | null;
}
