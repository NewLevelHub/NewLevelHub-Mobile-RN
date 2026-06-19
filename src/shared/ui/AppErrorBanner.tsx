import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';

interface AppErrorBannerProps {
  message: string;
}

export function AppErrorBanner({ message }: AppErrorBannerProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={16} color={colors.error} style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.errorBackground,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  icon: {
    marginTop: 1,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
});
