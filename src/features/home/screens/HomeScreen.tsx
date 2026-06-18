import { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import { AppButton } from '@/shared/ui/AppButton';
import { useActivityFeed } from '@/features/users/hooks/useActivityFeed';
import { ActivityFeed } from '@/features/users/components/ActivityFeed';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Home>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: activityData, isLoading: activityLoading, isError: activityError, refetch: refetchActivity } =
    useActivityFeed();

  const handleLogout = () => {
    Alert.alert(
      'Выйти',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: () => void logout() },
      ],
    );
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetchActivity();
    setIsRefreshing(false);
  }, [refetchActivity]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.brand}
        />
      }
    >
      <Text style={styles.title}>Добро пожаловать{user ? `, ${user.full_name}` : ''}</Text>
      <Text style={styles.subtitle}>Главный экран в разработке</Text>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Моя активность</Text>
        <ActivityFeed data={activityData} isLoading={activityLoading} isError={activityError} />
      </View>

      <AppButton onPress={() => navigation.navigate(Routes.Profile)} title="Профиль" variant="secondary" />
      {user?.role === USER_ROLES.SUPERADMIN ? (
        <AppButton onPress={() => navigation.navigate(Routes.AdminUsers)} title="Пользователи (Admin)" variant="secondary" />
      ) : null}
      <AppButton onPress={() => navigation.navigate(Routes.UiKit)} title="UI Kit" variant="secondary" />
      <AppButton onPress={handleLogout} title="Выйти" variant="text" />
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
    gap: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  activitySection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
});
