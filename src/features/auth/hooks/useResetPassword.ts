import { useCallback, useState } from 'react';

import { API } from '@/shared/api/endpoints';
import { apiClient } from '@/core/network/apiClient';
import { tokenStorage } from '@/core/auth/tokenStorage';
import { parseApiError } from '@/core/network/errorParser';

export type ResetPasswordStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'token_invalid'
  | 'token_expired'
  | 'token_used'
  | 'error';

export interface UseResetPasswordResult {
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  status: ResetPasswordStatus;
  passwordErrors: string[];
  errorMessage: string | undefined;
  submit: () => Promise<void>;
}

export function useResetPassword(token: string | undefined): UseResetPasswordResult {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<ResetPasswordStatus>('idle');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const submit = useCallback(async () => {
    if (!token) {
      setStatus('token_invalid');
      return;
    }

    if (!newPassword) {
      setErrorMessage('Укажите новый пароль');
      setStatus('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage(undefined);
    setPasswordErrors([]);

    try {
      await apiClient.post(API.auth.resetPassword, {
        token,
        new_password: newPassword,
      });

      await tokenStorage.clearTokens();
      setStatus('success');
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      const code = parsed.code;

      if (code === 'TOKEN_INVALID') {
        setStatus('token_invalid');
        return;
      }

      if (code === 'TOKEN_EXPIRED') {
        setStatus('token_expired');
        return;
      }

      if (code === 'TOKEN_ALREADY_USED') {
        setStatus('token_used');
        return;
      }

      const detailErrors = parsed.fieldErrors?.new_password;
      if (detailErrors?.length) {
        setPasswordErrors(detailErrors);
        setStatus('error');
        return;
      }

      setErrorMessage(parsed.message);
      setStatus('error');
    }
  }, [token, newPassword, confirmPassword]);

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    status,
    passwordErrors,
    errorMessage,
    submit,
  };
}
