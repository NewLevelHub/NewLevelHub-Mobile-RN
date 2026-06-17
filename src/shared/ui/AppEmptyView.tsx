import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';

interface AppEmptyViewProps {
  message?: string;
  hint?: string;
}

export function AppEmptyView({
  message = 'Пусто',
  hint,
}: AppEmptyViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    padding: 32,
  },
  message: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  hint: {
    color: colors.textSubtle,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
