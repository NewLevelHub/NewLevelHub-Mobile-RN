import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import { AppButton } from './AppButton';

interface AppErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function AppErrorView({
  title,
  message = 'Что-то пошло не так',
  onRetry,
}: AppErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSubtle} />
      </View>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
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
