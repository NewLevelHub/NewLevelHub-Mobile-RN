import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Routes } from '@/app/navigation/routes';
import type { BookingsStackParamList } from '@/app/navigation/routes';
import { ResourceCatalogScreen } from '@/features/bookings/screens/ResourceCatalogScreen';
import { ResourceDetailScreen } from '@/features/bookings/screens/ResourceDetailScreen';

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export function BookingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.ResourceCatalog}
        component={ResourceCatalogScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.ResourceDetail}
        component={ResourceDetailScreen}
        options={{ title: 'Ресурс' }}
      />
    </Stack.Navigator>
  );
}
