import { useCallback, useEffect, useState } from 'react';

import { API } from '@/shared/api/endpoints';
import { apiClient } from '@/core/network/apiClient';
import { parseApiError } from '@/core/network/errorParser';

export type VerifyEmailStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'already_used'
  | 'expired'
  | 'not_found'
  | 'error';

export interface UseEmailVerifyDeepLinkResult {
  status: VerifyEmailStatus;
  errorMessage: string | undefined;
  verify: (token: string) => Promise<void>;
}

export function useEmailVerifyDeepLink(
  token: string | undefined,
): UseEmailVerifyDeepLinkResult {
  const [status, setStatus] = useState<VerifyEmailStatus>(
    token ? 'loading' : 'idle',
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const verify = useCallback(async (t: string) => {
    setStatus('loading');
    setErrorMessage(undefined);
    try {
      await apiClient.get(API.auth.verifyEmail, { params: { token: t } });
      setStatus('success');
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      if (parsed.code === 'TOKEN_ALREADY_USED') {
        setStatus('already_used');
      } else if (parsed.code === 'TOKEN_EXPIRED') {
        setStatus('expired');
      } else if (parsed.statusCode === 404) {
        setStatus('not_found');
      } else {
        setStatus('error');
        setErrorMessage(parsed.message);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      void verify(token);
    }
  }, [token, verify]);

  return { status, errorMessage, verify };
}
