import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Routes } from '@/app/navigation/routes';
import type { HomeStackParamList } from '@/app/navigation/routes';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { TeamCalendarScreen } from '@/features/core/screens/TeamCalendarScreen';
import { UsersListScreen } from '@/features/admin/screens/UsersListScreen';
import { UserDetailScreen } from '@/features/admin/screens/UserDetailScreen';
import { NotificationsScreen } from '@/features/notifications/screens/NotificationsScreen';
import { UiKitDemoScreen } from '@/features/dev/screens/UiKitDemoScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.Home}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.TeamCalendar}
        component={TeamCalendarScreen}
        options={{ title: 'Календарь команды' }}
      />
      <Stack.Screen
        name={Routes.AdminUsers}
        component={UsersListScreen}
        options={{ title: 'Пользователи' }}
      />
      <Stack.Screen
        name={Routes.AdminUserDetail}
        component={UserDetailScreen}
        options={{ title: 'Карточка пользователя' }}
      />
      <Stack.Screen
        name={Routes.Notifications}
        component={NotificationsScreen}
        options={{ title: 'Уведомления' }}
      />
      <Stack.Screen
        name={Routes.UiKit}
        component={UiKitDemoScreen}
        options={{ title: 'UI Kit' }}
      />
    </Stack.Navigator>
  );
}
