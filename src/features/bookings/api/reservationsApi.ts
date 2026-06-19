import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import type { PaginatedResponse } from '@/shared/types';
import { mapReservation } from '@/features/bookings/api/mapReservation';
import type {
  Reservation,
  ReservationsParams,
  MyReservationsParams,
  CreateReservationBody,
  CancelReservationBody,
  BulkCancelBody,
  BulkCancelResponse,
  MemberPickerItem,
} from '@/features/bookings/types/reservation';

export async function fetchReservations(
  params?: ReservationsParams,
): Promise<PaginatedResponse<Reservation>> {
  const { data } = await apiClient.get(API.bookings.reservations, { params });
  return {
    count: data.count as number,
    next: data.next as string | null,
    previous: data.previous as string | null,
    results: (data.results as unknown[]).map((r) =>
      mapReservation(r as Record<string, unknown>),
    ),
  };
}

export async function fetchMyReservations(
  params?: MyReservationsParams,
): Promise<PaginatedResponse<Reservation>> {
  const { data } = await apiClient.get(API.bookings.myReservations, { params });
  return {
    count: data.count as number,
    next: data.next as string | null,
    previous: data.previous as string | null,
    results: (data.results as unknown[]).map((r) =>
      mapReservation(r as Record<string, unknown>),
    ),
  };
}

export async function fetchReservation(id: number): Promise<Reservation> {
  const { data } = await apiClient.get(API.bookings.reservation(id));
  return mapReservation(data as Record<string, unknown>);
}

export async function createReservation(body: CreateReservationBody): Promise<Reservation> {
  const { data } = await apiClient.post(API.bookings.reservations, body);
  return mapReservation(data as Record<string, unknown>);
}

export async function cancelReservation(
  id: number,
  body?: CancelReservationBody,
): Promise<Reservation> {
  const { data } = await apiClient.post(API.bookings.cancelReservation(id), body ?? {});
  return mapReservation(data as Record<string, unknown>);
}

export async function bulkCancelReservations(body: BulkCancelBody): Promise<BulkCancelResponse> {
  const { data } = await apiClient.post(API.bookings.bulkCancelReservations, body);
  return data as BulkCancelResponse;
}

export async function fetchMembers(q: string): Promise<MemberPickerItem[]> {
  const { data } = await apiClient.get(API.bookings.members, { params: { q } });
  return data as MemberPickerItem[];
}
