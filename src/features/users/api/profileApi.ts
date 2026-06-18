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

export async function uploadAvatar(
  uri: string,
  mimeType: string,
  fileName: string,
): Promise<User> {
  const formData = new FormData();
  formData.append('avatar', { uri, type: mimeType, name: fileName } as unknown as Blob);
  // `transformRequest` bypasses Axios JSON serialization so FormData is sent as-is.
  // `Content-Type: undefined` removes the default application/json header so that
  // React Native's XHR can set multipart/form-data with the correct boundary.
  const response = await apiClient.patch<Record<string, unknown>>(API.auth.updateMe, formData, {
    transformRequest: [(data: unknown) => data],
    headers: { 'Content-Type': undefined },
  });
  return mapApiUser(response.data);
}

export async function deleteAvatar(): Promise<User> {
  const response = await apiClient.delete<Record<string, unknown>>(API.auth.deleteAvatar);
  return mapApiUser(response.data);
}
