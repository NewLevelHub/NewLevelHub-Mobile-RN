import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import type { UserRole } from '@/shared/config/constants';
import type { IsActiveFilter } from '@/features/admin/hooks/useAdminUsers';

const ROLE_OPTIONS: Array<{ label: string; value: UserRole | 'all' }> = [
  { label: 'Все роли', value: 'all' },
  { label: 'Суперадмин', value: USER_ROLES.SUPERADMIN },
  { label: 'Админ компании', value: USER_ROLES.COMPANY_ADMIN },
  { label: 'Сотрудник', value: USER_ROLES.EMPLOYEE },
  { label: 'Гость', value: USER_ROLES.GUEST },
  { label: 'Ресепшн', value: USER_ROLES.RECEPTION },
  { label: 'Менеджер', value: USER_ROLES.SERVICE_MANAGER },
];

const ACTIVE_OPTIONS: Array<{ label: string; value: IsActiveFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Неактивные', value: 'inactive' },
];

interface Props {
  search: string;
  role: UserRole | 'all';
  isActive: IsActiveFilter;
  onSearchChange: (v: string) => void;
  onRoleChange: (v: UserRole | 'all') => void;
  onIsActiveChange: (v: IsActiveFilter) => void;
}

function Chip<T extends string>({
  label,
  value,
  selected,
  onPress,
}: {
  label: string;
  value: T;
  selected: boolean;
  onPress: (v: T) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      style={[styles.chip, selected && styles.chipActive]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function AdminUsersFilters({
  search,
  role,
  isActive,
  onSearchChange,
  onRoleChange,
  onIsActiveChange,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по имени или email..."
          placeholderTextColor={colors.textSubtle}
          value={search}
          onChangeText={onSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {ROLE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            value={opt.value}
            selected={role === opt.value}
            onPress={onRoleChange}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {ACTIVE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            value={opt.value}
            selected={isActive === opt.value}
            onPress={onIsActiveChange}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: colors.page,
  },
  searchWrap: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  chipRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.brandSubtle,
    borderColor: colors.brand,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.brandText,
  },
});
