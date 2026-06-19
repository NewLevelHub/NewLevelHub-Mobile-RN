import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { useProfile } from '@/features/users/hooks/useProfile';
import { useAvatarActions } from '@/features/users/hooks/useAvatarActions';
import { AvatarPicker } from '@/features/users/components/AvatarPicker';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { Routes, type ProfileStackParamList } from '@/app/navigation/routes';

export function ProfilePlaceholderScreen() {
  const logout = useAuthStore((state) => state.logout);
  const { profile } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const { showActionSheet, isBusy, avatarCacheKey, error } = useAvatarActions();

  const handleLogout = () => {
    Alert.alert(
      'Выйти',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await logout();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Профиль</Text>

      {error ? <AppErrorBanner message={error} /> : null}

      <View style={styles.avatarSection}>
        <AvatarPicker
          avatarUrl={profile?.avatar ?? null}
          fullName={profile?.full_name ?? ''}
          onPress={() => showActionSheet(!!profile?.avatar)}
          isLoading={isBusy}
          cacheKey={avatarCacheKey}
          size={96}
        />
      </View>

      {profile ? (
        <View style={styles.card}>
          <Text style={styles.label}>{profile.full_name}</Text>
          <Text style={styles.meta}>{profile.email}</Text>
          {profile.position ? <Text style={styles.meta}>{profile.position}</Text> : null}
          <Text style={styles.meta}>Роль: {profile.role}</Text>
          {profile.company ? <Text style={styles.meta}>Компания: {profile.company.name}</Text> : null}
        </View>
      ) : null}

      <AppButton
        onPress={() => navigation.navigate(Routes.ProfileEdit)}
        title="Редактировать профиль"
        variant="secondary"
      />
      <AppButton
        onPress={() => navigation.navigate(Routes.ChangePassword)}
        title="Сменить пароль"
        variant="secondary"
      />
      <AppButton
        onPress={handleLogout}
        title={isLoggingOut ? 'Выход...' : 'Выйти'}
        variant="text"
        disabled={isLoggingOut}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 4,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
});
