import type { AxiosError } from 'axios';

import { ApiException, EmailNotVerifiedException } from '@/core/network/apiException';

const TOO_MANY_REQUESTS_MESSAGE = 'Слишком много запросов';
const SERVER_ERROR_MESSAGE = 'Сервис временно недоступен';

function parseFieldErrors(details: unknown): Record<string, string[]> | undefined {
  if (!details || typeof details !== 'object') return undefined;

  const result: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(details)) {
    const messages = stringList(value);
    if (messages?.length) {
      result[key] = messages;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function stringList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter((s) => s.length > 0);
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }
  return undefined;
}

function parseEnvelope(
  data: Record<string, unknown>,
  statusCode?: number,
): ApiException | null {
  const error = data.error;
  if (!error || typeof error !== 'object') return null;

  const envelope = error as Record<string, unknown>;
  const code = envelope.code != null ? String(envelope.code) : undefined;
  const message = envelope.message != null ? String(envelope.message) : '';
  if (!message) return null;

  return new ApiException({
    code,
    message,
    statusCode,
    fieldErrors: parseFieldErrors(envelope.details),
  });
}

function parseDetail(data: Record<string, unknown>, statusCode?: number): ApiException | null {
  const detail = data.detail;
  let message: string | null = null;

  if (typeof detail === 'string') {
    message = detail;
  } else if (Array.isArray(detail) && detail.length > 0) {
    message = String(detail[0]);
  }

  if (!message) return null;

  return new ApiException({ message, statusCode });
}

function applyStatusDefaults(exception: ApiException): ApiException {
  const status = exception.statusCode;

  if (
    status === 403 &&
    exception.code === EmailNotVerifiedException.emailNotVerifiedCode
  ) {
    return new EmailNotVerifiedException({
      message: exception.message,
      statusCode: status,
      fieldErrors: exception.fieldErrors,
    });
  }

  if (status === 429) {
    return new ApiException({
      code: exception.code,
      message: TOO_MANY_REQUESTS_MESSAGE,
      statusCode: status,
      fieldErrors: exception.fieldErrors,
    });
  }

  if (status != null && status >= 500) {
    return new ApiException({
      code: exception.code ?? 'SERVER_ERROR',
      message: SERVER_ERROR_MESSAGE,
      statusCode: status,
      fieldErrors: exception.fieldErrors,
    });
  }

  return exception;
}

function fallback(error: AxiosError, statusCode?: number): ApiException {
  if (statusCode === 401) {
    return new ApiException({
      code: 'UNAUTHENTICATED',
      message: error.message || 'Требуется авторизация',
      statusCode,
    });
  }

  if (statusCode === 429) {
    return new ApiException({
      message: TOO_MANY_REQUESTS_MESSAGE,
      statusCode: 429,
    });
  }

  if (statusCode != null && statusCode >= 500) {
    return new ApiException({
      code: 'SERVER_ERROR',
      message: SERVER_ERROR_MESSAGE,
      statusCode,
    });
  }

  return new ApiException({
    message: error.message || 'Ошибка сети',
    statusCode,
  });
}

export function parseApiError(error: unknown): ApiException {
  if (error instanceof ApiException) {
    return error;
  }

  const axiosError = error as AxiosError;
  const statusCode = axiosError.response?.status;
  const data = axiosError.response?.data;

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const envelope = parseEnvelope(record, statusCode);
    if (envelope) {
      return applyStatusDefaults(envelope);
    }

    const detail = parseDetail(record, statusCode);
    if (detail) {
      return applyStatusDefaults(detail);
    }
  }

  return fallback(axiosError, statusCode);
}
