import { ApiException } from '@/core/network/apiException';
import { apiClient } from '@/core/network/apiClient';
import { parseApiError } from '@/core/network/errorParser';
import { API } from '@/shared/api/endpoints';

export async function validateSession(): Promise<boolean> {
  try {
    const response = await apiClient.get(API.auth.me);
    return response.status === 200;
  } catch (error) {
    const apiError = error instanceof ApiException ? error : parseApiError(error);
    if (apiError.statusCode === 401) return false;
    throw apiError;
  }
}
