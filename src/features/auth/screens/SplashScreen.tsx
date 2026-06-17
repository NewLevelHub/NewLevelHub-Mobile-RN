import { StyleSheet, Text, View } from 'react-native';

import { env } from '@/core/config/env';
import { colors } from '@/core/theme/colors';
import { AppLoader } from '@/shared/ui/AppLoader';

export function SplashScreen() {
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
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
