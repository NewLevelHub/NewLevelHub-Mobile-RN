import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { AdminUserItem } from '@/features/admin/components/AdminUserItem';
import { AdminUserSkeleton } from '@/features/admin/components/AdminUserSkeleton';
import { AdminUsersEmptyState } from '@/features/admin/components/AdminUsersEmptyState';
import { AdminUsersFilters } from '@/features/admin/components/AdminUsersFilters';
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers';
import type { User } from '@/shared/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function UsersListScreen() {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== USER_ROLES.SUPERADMIN) {
    return (
      <SafeAreaView style={styles.guard}>
        <Text style={styles.guardText}>Доступ запрещён</Text>
      </SafeAreaView>
    );
  }

  return <UsersListContent />;
}

function UsersListContent() {
  const navigation = useNavigation<Nav>();
  const {
    users,
    filters,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    setSearch,
    setRole,
    setIsActive,
    fetchNextPage,
  } = useAdminUsers();

  const hasActiveFilters =
    filters.search.length > 0 || filters.role !== 'all' || filters.isActive !== 'all';

  const renderItem = ({ item }: { item: User }) => (
    <AdminUserItem
      user={item}
      onPress={() => navigation.navigate(Routes.AdminUserDetail, { userId: item.id })}
    />
  );
  const keyExtractor = (item: User) => String(item.id);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <AdminUsersFilters
        search={filters.search}
        role={filters.role}
        isActive={filters.isActive}
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onIsActiveChange={setIsActive}
      />

      {isLoading ? (
        <View style={styles.skeletonWrap}>
          <AdminUserSkeleton count={8} />
        </View>
      ) : isError ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Не удалось загрузить пользователей</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={<AdminUsersEmptyState hasFilters={hasActiveFilters} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={colors.brand}
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
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
  skeletonWrap: {
    marginTop: 8,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  errorWrap: {
    flex: 1,
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
  footerLoader: {
    marginVertical: 16,
  },
});
