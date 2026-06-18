import { StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/core/auth/authStore';
import { env } from '@/core/config/env';
import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppLoader } from '@/shared/ui/AppLoader';

export function SplashScreen() {
  const bootstrapStatus = useAuthStore((state) => state.bootstrapStatus);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  if (bootstrapStatus === 'health_unavailable') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.title}>Сервис недоступен</Text>
        <Text style={styles.subtitle}>
          На серверной стороне ведутся работы. Пожалуйста, попробуйте позже.
        </Text>
      </View>
    );
  }

  if (bootstrapStatus === 'ping_failed') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>📡</Text>
        <Text style={styles.title}>Нет подключения</Text>
        <Text style={styles.subtitle}>
          Проверьте интернет-соединение и попробуйте снова.
        </Text>
        <AppButton
          title="Повторить"
          onPress={() => void bootstrap()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  // 'idle' | 'checking' — show loading spinner
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🏢</Text>
      <Text style={styles.title}>{env.APP_NAME}</Text>
      <AppLoader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.page,
    gap: 24,
    padding: 24,
  },
  icon: {
    fontSize: 72,
  },
  errorIcon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 160,
  },
});
