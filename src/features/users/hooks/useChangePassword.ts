import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { apiClient } from '@/core/network/apiClient';
import { API } from '@/shared/api/endpoints';
import { ApiException } from '@/core/network/apiException';
import { tokenStorage } from '@/core/auth/tokenStorage';
import { useAuthStore } from '@/core/auth/authStore';
import { Routes, type RootStackParamList } from '@/app/navigation/routes';

type Fields = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

export function useChangePassword() {
  const logoutLocal = useAuthStore((state) => state.logoutLocal);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fields, setFieldsState] = useState<Fields>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  function setField(key: keyof Fields, value: string) {
    setFieldsState((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setGeneralError(null);
  }

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!fields.currentPassword) errors.currentPassword = 'Введите текущий пароль';
    if (!fields.newPassword) errors.newPassword = 'Введите новый пароль';
    if (fields.newPassword && fields.newPassword.length < 8) {
      errors.newPassword = 'Пароль должен содержать минимум 8 символов';
    }
    if (!fields.confirmPassword) {
      errors.confirmPassword = 'Подтвердите новый пароль';
    } else if (fields.newPassword !== fields.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.post(API.auth.changePassword, {
        current_password: fields.currentPassword,
        new_password: fields.newPassword,
      }),
    onSuccess: async () => {
      await tokenStorage.clearTokens();
      Alert.alert('Готово', 'Пароль изменён. Войдите снова.', [
        {
          text: 'OK',
          onPress: async () => {
            await logoutLocal();
            navigation.reset({ index: 0, routes: [{ name: Routes.Login }] });
          },
        },
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiException) {
        const currentPasswordMsg = error.fieldError('current_password');
        const newPasswordMsg = error.fieldError('new_password');
        if (currentPasswordMsg || newPasswordMsg) {
          setFieldErrors({
            currentPassword: currentPasswordMsg ?? undefined,
            newPassword: newPasswordMsg ?? undefined,
          });
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError('Произошла ошибка. Попробуйте ещё раз.');
      }
    },
  });

  function submit() {
    if (!validate()) return;
    mutation.mutate();
  }

  return {
    fields,
    fieldErrors,
    generalError,
    isLoading: mutation.isPending,
    setField,
    submit,
  };
}
