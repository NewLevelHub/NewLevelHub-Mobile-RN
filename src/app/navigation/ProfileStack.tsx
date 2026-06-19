import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Routes } from '@/app/navigation/routes';
import type { ProfileStackParamList } from '@/app/navigation/routes';
import { ProfileScreen } from '@/features/users/screens/ProfileScreen';
import { ProfileEditScreen } from '@/features/users/screens/ProfileEditScreen';
import { ChangePasswordScreen } from '@/features/users/screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.ProfileEdit}
        component={ProfileEditScreen}
        options={{ title: 'Редактировать профиль' }}
      />
      <Stack.Screen
        name={Routes.ChangePassword}
        component={ChangePasswordScreen}
        options={{ title: 'Смена пароля' }}
      />
    </Stack.Navigator>
  );
}
