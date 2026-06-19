import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import { Routes, type HomeStackParamList } from '@/app/navigation/routes';
import { AppButton } from '@/shared/ui/AppButton';
import { AppLoader } from '@/shared/ui/AppLoader';
import { useAdminUserDetail } from '@/features/admin/hooks/useAdminUserDetail';
import type { AdminUserDetail } from '@/shared/types';

type Nav = NativeStackNavigationProp<HomeStackParamList>;
type RouteT = RouteProp<HomeStackParamList, typeof Routes.AdminUserDetail>;

const ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.SUPERADMIN]: 'Суперадмин',
  [USER_ROLES.COMPANY_ADMIN]: 'Админ компании',
  [USER_ROLES.EMPLOYEE]: 'Сотрудник',
  [USER_ROLES.GUEST]: 'Гость',
  [USER_ROLES.RECEPTION]: 'Ресепшн',
  [USER_ROLES.SERVICE_MANAGER]: 'Менеджер',
};

const ROLE_COLORS: Record<string, string> = {
  [USER_ROLES.SUPERADMIN]: colors.brand,
  [USER_ROLES.COMPANY_ADMIN]: colors.info,
  [USER_ROLES.EMPLOYEE]: colors.textMuted,
  [USER_ROLES.GUEST]: colors.textSubtle,
  [USER_ROLES.RECEPTION]: colors.warning,
  [USER_ROLES.SERVICE_MANAGER]: colors.success,
};

function getInitials(user: AdminUserDetail): string {
  const first = user.first_name?.[0] ?? '';
  const last = user.last_name?.[0] ?? '';
  return (first + last).toUpperCase() || user.email[0].toUpperCase();
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function parseApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as { response?: { data?: { detail?: string } } }).response;
    if (resp?.data?.detail) return resp.data.detail;
  }
  return 'Произошла ошибка. Попробуйте снова.';
}

export function UserDetailScreen() {
  const currentUser = useAuthStore((state) => state.user);

  if (currentUser?.role !== USER_ROLES.SUPERADMIN) {
    return (
      <SafeAreaView style={styles.guard}>
        <Text style={styles.guardText}>Доступ запрещён</Text>
      </SafeAreaView>
    );
  }

  return <UserDetailContent />;
}

function UserDetailContent() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { userId } = route.params;

  const { user, isLoading, isError, blockMutation, unblockMutation, deleteMutation } =
    useAdminUserDetail(userId);

  const isActioning =
    blockMutation.isPending || unblockMutation.isPending || deleteMutation.isPending;

  const handleBlock = () => {
    Alert.alert(
      'Заблокировать пользователя',
      `Заблокировать ${user?.full_name || user?.email}? Все активные сессии будут инвалидированы.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Заблокировать',
          style: 'destructive',
          onPress: () =>
            blockMutation.mutate(undefined, {
              onError: (err) => Alert.alert('Ошибка', parseApiError(err)),
            }),
        },
      ],
    );
  };

  const handleUnblock = () => {
    Alert.alert(
      'Разблокировать пользователя',
      `Разблокировать ${user?.full_name || user?.email}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Разблокировать',
          onPress: () =>
            unblockMutation.mutate(undefined, {
              onError: (err) => Alert.alert('Ошибка', parseApiError(err)),
            }),
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить пользователя',
      `Безвозвратно удалить ${user?.full_name || user?.email}? Это действие нельзя отменить.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () =>
            deleteMutation.mutate(undefined, {
              onSuccess: () => navigation.goBack(),
              onError: (err) => Alert.alert('Ошибка', parseApiError(err)),
            }),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered} edges={[]}>
        <AppLoader />
      </SafeAreaView>
    );
  }

  if (isError || !user) {
    return (
      <SafeAreaView style={styles.centered} edges={[]}>
        <Text style={styles.errorText}>Не удалось загрузить пользователя</Text>
      </SafeAreaView>
    );
  }

  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const roleBadgeColor = ROLE_COLORS[user.role] ?? colors.textMuted;
  const initials = getInitials(user);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.fullName} numberOfLines={2}>
            {user.full_name || `${user.first_name} ${user.last_name}`.trim() || '—'}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.roleBadge, { backgroundColor: roleBadgeColor + '1A' }]}>
              <Text style={[styles.roleBadgeText, { color: roleBadgeColor }]}>{roleLabel}</Text>
            </View>
            <View style={[styles.statusBadge, user.is_active ? styles.statusActive : styles.statusBlocked]}>
              <Text style={[styles.statusBadgeText, user.is_active ? styles.statusActiveText : styles.statusBlockedText]}>
                {user.is_active ? 'Активен' : 'Заблокирован'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.bookings_count}</Text>
          <Text style={styles.statLabel}>Бронирований</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.tasks_count}</Text>
          <Text style={styles.statLabel}>Задач</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailsCard}>
        <DetailRow label="Компания" value={user.company?.name ?? '—'} />
        <View style={styles.rowDivider} />
        <DetailRow label="Должность" value={user.position ?? '—'} />
        <View style={styles.rowDivider} />
        <DetailRow label="Телефон" value={user.phone ?? '—'} />
        <View style={styles.rowDivider} />
        <DetailRow label="Email подтверждён" value={user.is_email_verified ? 'Да' : 'Нет'} />
        <View style={styles.rowDivider} />
        <DetailRow label="Дата регистрации" value={formatDate(user.date_joined)} />
        <View style={styles.rowDivider} />
        <DetailRow label="Последний вход" value={formatDate(user.last_login)} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {user.is_active ? (
          <AppButton
            title="Заблокировать"
            variant="secondary"
            loading={blockMutation.isPending}
            disabled={isActioning}
            onPress={handleBlock}
            style={styles.blockButton}
          />
        ) : (
          <AppButton
            title="Разблокировать"
            variant="secondary"
            loading={unblockMutation.isPending}
            disabled={isActioning}
            onPress={handleUnblock}
          />
        )}
        <AppButton
          title="Удалить пользователя"
          variant="secondary"
          loading={deleteMutation.isPending}
          disabled={isActioning}
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  guard: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecondary,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.error,
    textAlign: 'center',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  fullName: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: colors.successBackground,
  },
  statusBlocked: {
    backgroundColor: colors.errorBackground,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  statusActiveText: {
    color: colors.success,
  },
  statusBlockedText: {
    color: colors.error,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderFaint,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
  blockButton: {
    borderColor: colors.warning,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});
