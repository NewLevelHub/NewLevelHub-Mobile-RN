import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { AppButton } from './AppButton';

interface AppErrorViewProps {
  icon?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function AppErrorView({
  icon,
  title,
  message = 'Что-то пошло не так',
  onRetry,
}: AppErrorViewProps) {
  return (
    <View style={styles.container}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <AppButton
          onPress={onRetry}
          style={styles.button}
          title="Повторить"
          variant="secondary"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    minWidth: 140,
  },
});
