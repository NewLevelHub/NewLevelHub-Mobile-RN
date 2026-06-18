import { useState } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/core/auth/authStore';
import { uploadAvatar, deleteAvatar } from '@/features/users/api/profileApi';
import { PROFILE_QUERY_KEY } from '@/features/users/hooks/useProfile';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Android reports image/jpg; iOS editing converts HEIC→JPEG but may still report image/heic.
function normalizeMimeType(raw: string | undefined): string {
  if (!raw) return 'image/jpeg';
  if (raw === 'image/jpg' || raw === 'image/heic' || raw === 'image/heif') return 'image/jpeg';
  return raw;
}

export interface UseAvatarActionsResult {
  showActionSheet: (hasAvatar: boolean) => void;
  isUploading: boolean;
  isDeleting: boolean;
  isBusy: boolean;
  avatarCacheKey: number;
  error: string | null;
  clearError: () => void;
}

export function useAvatarActions(): UseAvatarActionsResult {
  const setAuthenticatedUser = useAuthStore((s) => s.setAuthenticatedUser);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [avatarCacheKey, setAvatarCacheKey] = useState(() => Date.now());

  const uploadMutation = useMutation({
    mutationFn: (vars: { uri: string; mimeType: string; fileName: string }) =>
      uploadAvatar(vars.uri, vars.mimeType, vars.fileName),
    onSuccess: (updatedUser) => {
      setAuthenticatedUser(updatedUser);
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      setAvatarCacheKey(Date.now());
    },
    onError: () => {
      setError('Ошибка загрузки фото. Попробуйте ещё раз.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAvatar,
    onSuccess: (updatedUser) => {
      setAuthenticatedUser(updatedUser);
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      setAvatarCacheKey(Date.now());
    },
    onError: () => {
      setError('Ошибка удаления фото. Попробуйте ещё раз.');
    },
  });

  async function processPickedAsset(asset: ImagePicker.ImagePickerAsset) {
    setError(null);

    console.log('[Avatar] asset picked:', JSON.stringify({
      uri: asset.uri,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      width: asset.width,
      height: asset.height,
      fileName: asset.fileName,
    }));

    if (asset.fileSize != null && asset.fileSize > MAX_SIZE_BYTES) {
      console.warn('[Avatar] rejected: file too large', asset.fileSize);
      setError('Файл слишком большой. Максимальный размер: 5 МБ.');
      return;
    }

    const mimeType = normalizeMimeType(asset.mimeType);
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      console.warn('[Avatar] rejected: unsupported mime type', asset.mimeType, '→', mimeType);
      setError('Поддерживаются только JPEG, PNG и WebP.');
      return;
    }

    const ext = mimeType === 'image/webp' ? 'webp' : mimeType === 'image/png' ? 'png' : 'jpg';
    const fileName = asset.fileName ?? `avatar_${Date.now()}.${ext}`;
    console.log('[Avatar] uploading:', { mimeType, fileName });
    uploadMutation.mutate({ uri: asset.uri, mimeType, fileName });
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Разрешение', 'Нет доступа к галерее. Разрешите доступ в настройках.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as ImagePicker.MediaType[],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) {
      await processPickedAsset(result.assets[0]);
    }
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Разрешение', 'Нет доступа к камере. Разрешите доступ в настройках.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) {
      await processPickedAsset(result.assets[0]);
    }
  }

  function confirmDelete() {
    Alert.alert('Удалить фото', 'Вы уверены, что хотите удалить фото профиля?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => deleteMutation.mutate() },
    ]);
  }

  function showActionSheet(hasAvatar: boolean) {
    setError(null);
    const options = ['Камера', 'Галерея', ...(hasAvatar ? ['Удалить фото'] : []), 'Отмена'];
    const cancelIndex = options.length - 1;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: cancelIndex,
          destructiveButtonIndex: hasAvatar ? cancelIndex - 1 : undefined,
        },
        (idx) => {
          if (idx === 0) pickFromCamera();
          else if (idx === 1) pickFromGallery();
          else if (hasAvatar && idx === 2) confirmDelete();
        },
      );
    } else {
      const buttons: Parameters<typeof Alert.alert>[2] = [
        { text: 'Камера', onPress: () => pickFromCamera() },
        { text: 'Галерея', onPress: () => pickFromGallery() },
        ...(hasAvatar
          ? [{ text: 'Удалить фото', style: 'destructive' as const, onPress: confirmDelete }]
          : []),
        { text: 'Отмена', style: 'cancel' as const },
      ];
      Alert.alert('Фото профиля', undefined, buttons);
    }
  }

  return {
    showActionSheet,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBusy: uploadMutation.isPending || deleteMutation.isPending,
    avatarCacheKey,
    error,
    clearError: () => setError(null),
  };
}
