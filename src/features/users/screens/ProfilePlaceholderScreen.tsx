import { StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';

export function ProfilePlaceholderScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.subtitle}>Экран профиля в разработке</Text>
      {user ? (
        <View style={styles.card}>
          <Text style={styles.label}>{user.full_name}</Text>
          <Text style={styles.meta}>{user.email}</Text>
          <Text style={styles.meta}>Роль: {user.role}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
