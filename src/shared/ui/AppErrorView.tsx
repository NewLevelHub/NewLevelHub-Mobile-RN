import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { AppButton } from './AppButton';

interface AppErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function AppErrorView({
  message = 'Что-то пошло не так',
  onRetry,
}: AppErrorViewProps) {
  return (
    <View style={styles.container}>
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
