import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth/authStore';
import { ApiException } from '@/core/network/apiException';
import { updateProfile } from '@/features/users/api/profileApi';
import type { UpdateProfilePayload } from '@/features/users/api/profileApi';
import { PROFILE_QUERY_KEY } from '@/features/users/hooks/useProfile';
import type { RootStackParamList } from '@/app/navigation/routes';

type EditableFields = {
  first_name: string;
  last_name: string;
  phone: string;
  position: string;
};

type FieldErrors = Partial<Record<keyof EditableFields, string>>;

export function useProfileEdit() {
  const user = useAuthStore((state) => state.user);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const queryClient = useQueryClient();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [initialFields] = useState<EditableFields>({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone: user?.phone ?? '',
    position: user?.position ?? '',
  });

  const [fields, setFieldsState] = useState<EditableFields>(initialFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const isDirty =
    fields.first_name !== initialFields.first_name ||
    fields.last_name !== initialFields.last_name ||
    fields.phone !== initialFields.phone ||
    fields.position !== initialFields.position;

  function buildPayload(): UpdateProfilePayload {
    const payload: UpdateProfilePayload = {};
    if (fields.first_name !== initialFields.first_name) payload.first_name = fields.first_name;
    if (fields.last_name !== initialFields.last_name) payload.last_name = fields.last_name;
    if (fields.phone !== initialFields.phone) payload.phone = fields.phone.trim() || null;
    if (fields.position !== initialFields.position) payload.position = fields.position.trim() || null;
    return payload;
  }

  const mutation = useMutation({
    mutationFn: () => updateProfile(buildPayload()),
    onSuccess: (updatedUser) => {
      setAuthenticatedUser(updatedUser);
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser);
      Alert.alert('Готово', 'Профиль обновлён', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiException) {
        const hasFieldErrors =
          error.fieldErrors != null && Object.keys(error.fieldErrors).length > 0;
        if (hasFieldErrors) {
          const errors: FieldErrors = {};
          for (const field of ['first_name', 'last_name', 'phone', 'position'] as const) {
            const msg = error.fieldError(field);
            if (msg) errors[field] = msg;
          }
          setFieldErrors(errors);
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError('Произошла ошибка. Попробуйте ещё раз.');
      }
    },
  });

  function setField(key: keyof EditableFields, value: string) {
    setFieldsState((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setGeneralError(null);
  }

  return {
    user,
    fields,
    fieldErrors,
    generalError,
    isDirty,
    isSaving: mutation.isPending,
    isSaved: mutation.isSuccess,
    setField,
    save: () => mutation.mutate(),
  };
}
