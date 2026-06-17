import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { NavigationProp } from '@react-navigation/native';

import { API } from '@/shared/api/endpoints';
import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { useAuthStore } from '@/core/auth/authStore';
import { apiClient } from '@/core/network/apiClient';
import { ApiException } from '@/core/network/apiException';

const COOLDOWN_SECONDS = 30;

interface UseVerifyEmailOptions {
  emailParam?: string;
  navigation: NavigationProp<RootStackParamList>;
}

export interface UseVerifyEmailResult {
  email: string;
  hasAccessToken: boolean;
  cooldownSeconds: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  onResend: () => void;
  onBackToLogin: () => void;
}

export function useVerifyEmail({
  emailParam,
  navigation,
}: UseVerifyEmailOptions): UseVerifyEmailResult {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const email = emailParam ?? user?.email ?? '';

  // isAuthenticated is the best proxy for having a valid access token in store
  const hasAccessToken = isAuthenticated;

  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = useCallback(() => {
    setCooldownSeconds(COOLDOWN_SECONDS);
  }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cooldownSeconds]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await apiClient.post(API.auth.resendVerification);
    },
    onSuccess: () => {
      setError(null);
      setSuccessMessage('Письмо с подтверждением отправлено на ваш email');
      startCooldown();
    },
    onError: (err: unknown) => {
      setSuccessMessage(null);

      if (err instanceof ApiException) {
        if (err.statusCode === 429) {
          setError(`Попробуйте позже через ${COOLDOWN_SECONDS} секунд`);
          startCooldown();
          return;
        }

        if (err.statusCode === 403) {
          // Already verified — refresh user profile and let navigator redirect
          void fetchMe();
          return;
        }

        setError(err.message);
        return;
      }

      setError('Ошибка сети');
    },
  });

  const onResend = useCallback(() => {
    if (cooldownSeconds > 0 || isPending) return;
    setError(null);
    setSuccessMessage(null);
    mutate();
  }, [cooldownSeconds, isPending, mutate]);

  const onBackToLogin = useCallback(() => {
    void logout().finally(() => {
      navigation.navigate(Routes.Login);
    });
  }, [logout, navigation]);

  return {
    email,
    hasAccessToken,
    cooldownSeconds,
    isLoading: isPending,
    error,
    successMessage,
    onResend,
    onBackToLogin,
  };
}
