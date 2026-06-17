import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/core/theme/colors';

interface AppLoaderProps {
  size?: 'small' | 'large';
}

export function AppLoader({ size = 'large' }: AppLoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.brand} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
