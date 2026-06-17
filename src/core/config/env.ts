function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://production.newlevelhub.kz/api/v1',
  MEDIA_BASE_URL:
    process.env.EXPO_PUBLIC_MEDIA_BASE_URL ?? 'https://production.newlevelhub.kz',
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME ?? 'NewLevelHub',
  DEFAULT_LANGUAGE: 'ru' as const,
  REQUEST_TIMEOUT_MS: 30_000,
  IDLE_SESSION_TIMEOUT_MINUTES: parsePositiveInt(
    process.env.EXPO_PUBLIC_IDLE_SESSION_TIMEOUT_MINUTES,
    30,
  ),
  ABSOLUTE_SESSION_TIMEOUT_MINUTES: parsePositiveInt(
    process.env.EXPO_PUBLIC_ABSOLUTE_SESSION_TIMEOUT_MINUTES,
    480,
  ),
} as const;
