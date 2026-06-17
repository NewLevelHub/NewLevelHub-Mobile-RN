import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { apiConfig } from '@/core/config/apiConfig';
import { tokenStorage } from '@/core/auth/tokenStorage';
import { attachDebugLogInterceptor } from '@/core/network/debugLogInterceptor';
import { parseApiError } from '@/core/network/errorParser';
import { API } from '@/shared/api/endpoints';

const SESSION_EXPIRED_CODES = new Set(['SESSION_IDLE_TIMEOUT', 'SESSION_ABSOLUTE_TIMEOUT']);

export const PUBLIC_PATHS = new Set([
  '/auth/login/',
  '/auth/register/',
  '/auth/token/refresh/',
  '/auth/logout/',
  '/auth/password/reset/',
  '/auth/password/reset/confirm/',
  '/auth/register/invite/',
  '/auth/email/verify/',
  '/ping/',
  '/health/',
]);

export function normalizePath(path: string): string {
  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

export function isPublicPath(path: string): boolean {
  const normalized = normalizePath(path);
  return [...PUBLIC_PATHS].some(
    (publicPath) => normalized === publicPath || normalized.endsWith(publicPath),
  );
}

type RetryConfig = InternalAxiosRequestConfig & { _authRetried?: boolean };

let refreshPromise: Promise<string | null> | null = null;
let onSessionExpired: () => void = () => {};

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

async function handleSessionExpired(): Promise<void> {
  await tokenStorage.clearTokens();
  onSessionExpired();
}

async function performRefresh(refreshClient: ReturnType<typeof axios.create>): Promise<string | null> {
  const refresh = await tokenStorage.getRefreshToken();
  if (!refresh) return null;

  try {
    const { data } = await refreshClient.post<{
      access?: string;
      refresh?: string;
    }>(API.auth.refreshToken, { refresh });

    const access = data.access;
    const newRefresh = data.refresh;
    if (!access || !newRefresh) return null;

    await tokenStorage.saveTokens(access, newRefresh);
    return access;
  } catch (error) {
    const apiError = parseApiError(error);
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) return null;
    if (apiError.code && SESSION_EXPIRED_CODES.has(apiError.code)) return null;
    throw error;
  }
}

async function obtainFreshAccessToken(
  refreshClient: ReturnType<typeof axios.create>,
): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh(refreshClient).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export function createApiClient() {
  const client = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeoutMs,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': apiConfig.defaultLanguage,
    },
  });

  const refreshClient = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeoutMs,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': apiConfig.defaultLanguage,
    },
  });

  client.interceptors.request.use(async (config) => {
    const path = config.url ?? '';
    if (isPublicPath(path)) {
      return config;
    }

    const access = await tokenStorage.getAccessToken();
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const statusCode = error.response?.status;
      const originalRequest = error.config as RetryConfig | undefined;
      const path = originalRequest?.url ?? '';

      if (statusCode !== 401 || !originalRequest || isPublicPath(path)) {
        return Promise.reject(parseApiError(error));
      }

      if (originalRequest._authRetried) {
        await handleSessionExpired();
        return Promise.reject(parseApiError(error));
      }

      try {
        const newAccess = await obtainFreshAccessToken(refreshClient);
        if (!newAccess) {
          await handleSessionExpired();
          return Promise.reject(parseApiError(error));
        }

        originalRequest._authRetried = true;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return client.request(originalRequest);
      } catch (refreshError) {
        await handleSessionExpired();
        return Promise.reject(parseApiError(refreshError));
      }
    },
  );

  if (__DEV__) {
    attachDebugLogInterceptor(client);
  }

  return client;
}

export const apiClient = createApiClient();
