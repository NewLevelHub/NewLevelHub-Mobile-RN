import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const SENSITIVE_PATHS = new Set([
  '/auth/login/',
  '/auth/register/',
  '/auth/register/invite/',
  '/auth/token/refresh/',
  '/auth/logout/',
  '/auth/password/reset/confirm/',
  '/auth/me/password/',
]);

function normalizePath(path: string): string {
  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

export function isSensitivePath(path: string): boolean {
  const normalized = normalizePath(path);
  return [...SENSITIVE_PATHS].some(
    (sensitivePath) => normalized === sensitivePath || normalized.endsWith(sensitivePath),
  );
}

function logRequest(
  log: (message: string) => void,
  config: InternalAxiosRequestConfig,
): void {
  const path = config.url ?? '';
  const sensitive = isSensitivePath(path);
  const method = (config.method ?? 'GET').toUpperCase();
  log(`[API] → ${method} ${path}${sensitive ? ' (body redacted)' : ''}`);
}

function logResponse(
  log: (message: string) => void,
  method: string,
  path: string,
  status: number | string,
): void {
  const sensitive = isSensitivePath(path);
  log(
    `[API] ← ${method.toUpperCase()} ${path} ${status}${sensitive ? ' (body redacted)' : ''}`,
  );
}

/** Logs HTTP method, path, and status code in development builds only. */
export function attachDebugLogInterceptor(
  client: AxiosInstance,
  log: (message: string) => void = console.log,
): void {
  client.interceptors.request.use((config) => {
    logRequest(log, config);
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      const path = response.config.url ?? '';
      const method = response.config.method ?? 'GET';
      logResponse(log, method, path, response.status);
      return response;
    },
    (error: AxiosError) => {
      const path = error.config?.url ?? '';
      const method = error.config?.method ?? 'GET';
      const status = error.response?.status ?? '—';
      logResponse(log, method, path, status);
      return Promise.reject(error);
    },
  );
}
