import { useCallback, useState } from 'react';

import { API } from '@/shared/api/endpoints';
import { apiClient } from '@/core/network/apiClient';
import { parseApiError } from '@/core/network/errorParser';

export type ForgotPasswordStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseForgotPasswordResult {
  email: string;
  setEmail: (value: string) => void;
  status: ForgotPasswordStatus;
  errorMessage: string | undefined;
  rateLimit: boolean;
  submit: () => Promise<void>;
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function useForgotPassword(): UseForgotPasswordResult {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<ForgotPasswordStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [rateLimit, setRateLimit] = useState(false);

  const submit = useCallback(async () => {
    const trimmed = email.trim();

    if (!trimmed || !EMAIL_PATTERN.test(trimmed)) {
      setErrorMessage('Укажите корректный email');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage(undefined);
    setRateLimit(false);

    try {
      await apiClient.post(API.auth.forgotPassword, { email: trimmed });
      setStatus('success');
    } catch (err: unknown) {
      const parsed = parseApiError(err);

      if (parsed.statusCode === 429) {
        setRateLimit(true);
        setStatus('error');
        return;
      }

      setErrorMessage(parsed.message);
      setStatus('error');
    }
  }, [email]);

  return { email, setEmail, status, errorMessage, rateLimit, submit };
}
