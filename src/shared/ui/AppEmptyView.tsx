import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.iconContainer}>
        <Ionicons name="file-tray-outline" size={32} color={colors.textSubtle} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    padding: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  hint: {
    color: colors.textSubtle,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});
