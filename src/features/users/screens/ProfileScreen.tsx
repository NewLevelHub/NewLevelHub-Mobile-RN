import { useCallback, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import { useProfile } from '@/features/users/hooks/useProfile';
import { useAvatarActions } from '@/features/users/hooks/useAvatarActions';
import { useActivityFeed } from '@/features/users/hooks/useActivityFeed';
import { AvatarPicker } from '@/features/users/components/AvatarPicker';
import { ActivityFeedCompact } from '@/features/users/components/ActivityFeedCompact';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { Routes, type RootStackParamList } from '@/app/navigation/routes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.SUPERADMIN]: 'Суперадмин',
  [USER_ROLES.COMPANY_ADMIN]: 'Администратор',
  [USER_ROLES.EMPLOYEE]: 'Сотрудник',
  [USER_ROLES.GUEST]: 'Гость',
  [USER_ROLES.RECEPTION]: 'Ресепшн',
  [USER_ROLES.SERVICE_MANAGER]: 'Менеджер',
};

export function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation<Nav>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { profile, refetch: refetchProfile } = useProfile();
  const { showActionSheet, isBusy, avatarCacheKey, error: avatarError } = useAvatarActions();
  const { items: activityItems, isLoading: activityLoading, refetch: refetchActivity } =
    useActivityFeed();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchProfile(), refetchActivity()]);
    setIsRefreshing(false);
  }, [refetchProfile, refetchActivity]);

  const handleLogout = () => {
    Alert.alert('Выйти', 'Вы уверены, что хотите выйти из аккаунта?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);
          await logout();
        },
      },
    ]);
  };

  const isGuest = profile?.role === USER_ROLES.GUEST;
  const hasCompany = !!profile?.company && !isGuest;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.brand}
        />
      }
    >
      {/* Unverified email banner */}
      {profile && !profile.is_email_verified ? (
        <TouchableOpacity
          style={styles.verifyBanner}
          onPress={() => navigation.navigate(Routes.VerifyEmail, { email: profile.email })}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyBannerText}>
            Email не подтверждён — нажмите для подтверждения
          </Text>
        </TouchableOpacity>
      ) : null}

      {avatarError ? <AppErrorBanner message={avatarError} /> : null}

      {/* Header: avatar + name/position/email/role badge */}
      <View style={styles.header}>
        <AvatarPicker
          avatarUrl={profile?.avatar ?? null}
          fullName={profile?.full_name ?? ''}
          onPress={() => showActionSheet(!!profile?.avatar)}
          isLoading={isBusy}
          cacheKey={avatarCacheKey}
          size={88}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.fullName} numberOfLines={2}>
            {profile?.full_name ?? '—'}
          </Text>
          {profile?.position ? (
            <Text style={styles.position} numberOfLines={1}>
              {profile.position}
            </Text>
          ) : null}
          <Text style={styles.email} numberOfLines={1}>
            {profile?.email ?? ''}
          </Text>
          {profile?.role ? (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {ROLE_LABELS[profile.role] ?? profile.role}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Company card — hidden for guests and when no company */}
      {hasCompany ? (
        <View style={styles.companyCard}>
          <Text style={styles.companyLabel}>КОМПАНИЯ</Text>
          <Text style={styles.companyName}>{profile!.company!.name}</Text>
        </View>
      ) : null}

      {/* Activity feed (compact) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Активность</Text>
        <ActivityFeedCompact items={activityItems} isLoading={activityLoading} />
      </View>

      {/* Menu */}
      <View style={styles.menu}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 32,
  },
  verifyBanner: {
    backgroundColor: colors.warningBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  verifyBannerText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.warning,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  headerInfo: {
    flex: 1,
    gap: 3,
  },
  fullName: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  position: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  email: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandSubtle,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.brandText,
  },
  companyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 4,
  },
  companyLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  companyName: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  menu: {
    gap: 8,
  },
});
