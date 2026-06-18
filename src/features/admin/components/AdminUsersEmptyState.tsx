import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';

interface Props {
  hasFilters: boolean;
}

export function AdminUsersEmptyState({ hasFilters }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👥</Text>
      <Text style={styles.title}>
        {hasFilters ? 'Пользователи не найдены' : 'Нет пользователей'}
      </Text>
      <Text style={styles.subtitle}>
        {hasFilters
          ? 'Попробуйте изменить фильтры или поисковый запрос'
          : 'В системе ещё нет зарегистрированных пользователей'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
    gap: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
