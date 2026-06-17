import { useState, useEffect, useCallback } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { apiClient } from '@/core/network/apiClient';
import { ApiException } from '@/core/network/apiException';
import { API } from '@/shared/api/endpoints';
import type { InviteInfo } from '@/shared/types';

export interface UseInviteRegisterResult {
  inviteInfo: InviteInfo | null;
  isLoadingInvite: boolean;
  inviteError: string | undefined;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  passwordError: string | undefined;
  errorMessage: string | undefined;
  isSubmitting: boolean;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  handleSubmit: () => Promise<void>;
}

export function useInviteRegister(
  token: string | undefined,
  navigation: NativeStackNavigationProp<RootStackParamList>,
): UseInviteRegisterResult {
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [isLoadingInvite, setIsLoadingInvite] = useState(true);
  const [inviteError, setInviteError] = useState<string | undefined>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadInvite = useCallback(async () => {
    if (!token) {
      setInviteError('Ссылка приглашения недействительна');
      setIsLoadingInvite(false);
      return;
    }

    setIsLoadingInvite(true);
    setInviteError(undefined);

    try {
      const response = await apiClient.get<InviteInfo>(API.auth.registerInvite, {
        params: { token },
      });
      setInviteInfo(response.data);
    } catch (error) {
      if (error instanceof ApiException) {
        setInviteError(error.message ?? 'Ссылка приглашения недействительна');
      } else {
        setInviteError('Ссылка приглашения недействительна');
      }
    } finally {
      setIsLoadingInvite(false);
    }
  }, [token]);

  useEffect(() => {
    void loadInvite();
  }, [loadInvite]);

  const validate = (): boolean => {
    const nextFirstNameError = !firstName.trim() ? 'Укажите имя' : undefined;
    const nextLastNameError = !lastName.trim() ? 'Укажите фамилию' : undefined;
    const nextPasswordError = !password
      ? 'Укажите пароль'
      : password.length < 8
        ? 'Минимум 8 символов'
        : undefined;

    setFirstNameError(nextFirstNameError);
    setLastNameError(nextLastNameError);
    setPasswordError(nextPasswordError);

    return !nextFirstNameError && !nextLastNameError && !nextPasswordError;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      await apiClient.post(API.auth.registerInvite, {
        token,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
        password,
      });
      navigation.navigate(Routes.VerifyEmail, { email: inviteInfo?.email });
    } catch (error) {
      if (error instanceof ApiException) {
        const fieldFirstNameError = error.fieldError('first_name');
        const fieldLastNameError = error.fieldError('last_name');
        const fieldPasswordError = error.fieldError('password');
        const fieldTokenError = error.fieldError('token');

        if (fieldFirstNameError) setFirstNameError(fieldFirstNameError);
        if (fieldLastNameError) setLastNameError(fieldLastNameError);
        if (fieldPasswordError) setPasswordError(fieldPasswordError);

        const hasFieldError =
          fieldFirstNameError ?? fieldLastNameError ?? fieldPasswordError ?? fieldTokenError;

        if (hasFieldError) {
          if (fieldTokenError) setErrorMessage('Ссылка приглашения недействительна');
        } else if (error.message.toLowerCase().includes('лимит')) {
          setErrorMessage('Достигнут лимит участников');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Ошибка сети');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFirstNameChange = (v: string) => {
    setFirstName(v);
    setFirstNameError(undefined);
  };
  const onLastNameChange = (v: string) => {
    setLastName(v);
    setLastNameError(undefined);
  };
  const onPhoneChange = (v: string) => setPhone(v);
  const onPasswordChange = (v: string) => {
    setPassword(v);
    setPasswordError(undefined);
  };

  return {
    inviteInfo,
    isLoadingInvite,
    inviteError,
    firstName,
    lastName,
    phone,
    password,
    firstNameError,
    lastNameError,
    passwordError,
    errorMessage,
    isSubmitting,
    onFirstNameChange,
    onLastNameChange,
    onPhoneChange,
    onPasswordChange,
    handleSubmit,
  };
}
