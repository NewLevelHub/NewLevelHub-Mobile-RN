import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';

export function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Уведомления — скоро</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
});
