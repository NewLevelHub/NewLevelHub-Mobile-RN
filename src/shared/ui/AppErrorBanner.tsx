import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';

interface AppErrorBannerProps {
  message: string;
}

export function AppErrorBanner({ message }: AppErrorBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.errorBackground,
    borderRadius: 8,
    padding: 12,
  },
  text: {
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
});
