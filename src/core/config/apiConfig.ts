import { env } from '@/core/config/env';

export const apiConfig = {
  baseUrl: env.API_BASE_URL.replace(/\/$/, ''),
  mediaOrigin: env.MEDIA_BASE_URL.replace(/\/$/, ''),
  defaultLanguage: env.DEFAULT_LANGUAGE,
  timeoutMs: env.REQUEST_TIMEOUT_MS,
} as const;

/** Resolves a media path to a full URL. */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${apiConfig.mediaOrigin}${path}`;
}
