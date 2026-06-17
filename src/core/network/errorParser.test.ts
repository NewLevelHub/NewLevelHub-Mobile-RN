import axios from 'axios';

import {
  EmailNotVerifiedException,
  ApiException,
} from '@/core/network/apiException';
import { parseApiError } from '@/core/network/errorParser';

describe('parseApiError', () => {
  it('parses Django error envelope', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Некорректные данные',
            details: { email: ['Обязательное поле.'] },
          },
        },
      },
      message: 'Request failed',
    };

    const parsed = parseApiError(error);
    expect(parsed).toBeInstanceOf(ApiException);
    expect(parsed.code).toBe('VALIDATION_ERROR');
    expect(parsed.message).toBe('Некорректные данные');
    expect(parsed.fieldErrors?.email).toEqual(['Обязательное поле.']);
  });

  it('maps EMAIL_NOT_VERIFIED to dedicated exception', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 403,
        data: {
          error: {
            code: 'EMAIL_NOT_VERIFIED',
            message: 'Подтвердите email',
          },
        },
      },
      message: 'Forbidden',
    };

    const parsed = parseApiError(error);
    expect(parsed).toBeInstanceOf(EmailNotVerifiedException);
    expect(parsed.message).toBe('Подтвердите email');
  });

  it('returns friendly message for 5xx', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 503,
        data: {
          error: {
            code: 'SERVER_ERROR',
            message: 'Internal',
          },
        },
      },
      message: 'Service unavailable',
    };

    const parsed = parseApiError(error);
    expect(parsed.message).toBe('Сервис временно недоступен');
    expect(parsed.statusCode).toBe(503);
  });

  it('parses DRF detail payload for 400', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          detail: 'Неверные учётные данные',
        },
      },
      message: 'Bad Request',
    };

    const parsed = parseApiError(error);
    expect(parsed).toBeInstanceOf(ApiException);
    expect(parsed.statusCode).toBe(400);
    expect(parsed.message).toBe('Неверные учётные данные');
  });

  it('sets unauthorized state for 401', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 401,
      },
      message: 'Unauthorized',
    };

    const parsed = parseApiError(error);
    expect(parsed).toBeInstanceOf(ApiException);
    expect(parsed.statusCode).toBe(401);
    expect(parsed.isUnauthorized).toBe(true);
    expect(parsed.code).toBe('UNAUTHENTICATED');
  });

  it('returns friendly message for explicit 500', () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          detail: 'Internal Server Error',
        },
      },
      message: 'Internal Server Error',
    };

    const parsed = parseApiError(error);
    expect(parsed).toBeInstanceOf(ApiException);
    expect(parsed.statusCode).toBe(500);
    expect(parsed.code).toBe('SERVER_ERROR');
    expect(parsed.message).toBe('Сервис временно недоступен');
  });

  it('falls back for network errors', () => {
    const parsed = parseApiError(new axios.AxiosError('Network Error'));
    expect(parsed.message).toBe('Network Error');
  });
});
