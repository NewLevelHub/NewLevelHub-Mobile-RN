import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { BookingsStackParamList } from '@/app/navigation/routes';
import { Routes } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';

type RouteT = RouteProp<BookingsStackParamList, typeof Routes.ResourceDetail>;

export function ResourceDetailScreen() {
  const route = useRoute<RouteT>();
  const { resourceId } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.inner}>
        <Text style={styles.text}>Ресурс #{resourceId}</Text>
        <Text style={styles.sub}>Детальная карточка — MOB-405</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textMuted,
  },
});
