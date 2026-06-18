import { StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/core/auth/authStore';
import { env } from '@/core/config/env';
import { colors } from '@/core/theme/colors';
import { AppLoader } from '@/shared/ui/AppLoader';
import { ServiceUnavailableScreen } from '@/features/core/screens/ServiceUnavailableScreen';

export function SplashScreen() {
  const bootstrapStatus = useAuthStore((state) => state.bootstrapStatus);

  if (bootstrapStatus === 'health_unavailable') {
    return <ServiceUnavailableScreen type="health_unavailable" />;
  }

  if (bootstrapStatus === 'ping_failed') {
    return <ServiceUnavailableScreen type="ping_failed" />;
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
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
