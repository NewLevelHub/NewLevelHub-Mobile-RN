import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import { mapApiUser } from '@/shared/lib/mapUser';
import type { User } from '@/shared/types';

export async function fetchProfile(): Promise<User> {
  const response = await apiClient.get<Record<string, unknown>>(API.auth.me);
  return mapApiUser(response.data);
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  position?: string | null;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const response = await apiClient.patch<Record<string, unknown>>(API.auth.updateMe, payload);
  return mapApiUser(response.data);
}
