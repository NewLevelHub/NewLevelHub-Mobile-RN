import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/core/theme/colors';

interface AppLoaderProps {
  size?: 'small' | 'large';
  fullscreen?: boolean;
}

export function AppLoader({ size = 'large', fullscreen = false }: AppLoaderProps) {
  return (
    <View style={[styles.container, fullscreen && styles.fullscreen]}>
      <ActivityIndicator color={colors.brand} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreen: {
    flex: 1,
    backgroundColor: colors.page,
  },
});
