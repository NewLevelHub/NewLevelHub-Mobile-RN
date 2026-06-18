import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LinkingOptions } from '@react-navigation/native';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { useAuthStore } from '@/core/auth/authStore';
import { SplashScreen } from '@/features/auth/screens/SplashScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { InviteRegisterScreen } from '@/features/auth/screens/InviteRegisterScreen';
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen';
import { EmailVerifyDeepLinkScreen } from '@/features/auth/screens/EmailVerifyDeepLinkScreen';
import { VerifyEmailScreen } from '@/features/auth/screens/VerifyEmailScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/features/auth/screens/ResetPasswordScreen';
import { UiKitDemoScreen } from '@/features/dev/screens/UiKitDemoScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { UsersListScreen } from '@/features/admin/screens/UsersListScreen';
import { UserDetailScreen } from '@/features/admin/screens/UserDetailScreen';
import { ProfileScreen } from '@/features/users/screens/ProfileScreen';
import { ProfileEditScreen } from '@/features/users/screens/ProfileEditScreen';
import { ChangePasswordScreen } from '@/features/users/screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['newlevelhub://', 'https://newlevelhub.kz'],
  config: {
    screens: {
      [Routes.EmailVerifyDeepLink]: {
        path: 'verify-email',
        parse: { token: (token: string) => token },
      },
      [Routes.Invite]: {
        path: 'invite',
        parse: { token: (token: string) => token },
      },
      [Routes.ResetPassword]: {
        path: 'reset-password',
        parse: { token: (token: string) => token },
      },
    },
  },
};

export function RootNavigator() {
  const { isLoading, isAuthenticated, bootstrapStatus, bootstrap } = useAuthStore();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  // Show SplashScreen while loading OR when there is a connectivity error
  // (SplashScreen renders the appropriate error UI for those states)
  if (isLoading || bootstrapStatus === 'idle' || bootstrapStatus === 'checking' || bootstrapStatus === 'health_unavailable' || bootstrapStatus === 'ping_failed') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name={Routes.Home}
              component={HomeScreen}
              options={{ title: 'NewLevelHub' }}
            />
            <Stack.Screen
              name={Routes.Profile}
              component={ProfileScreen}
              options={{ title: 'Профиль' }}
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
            <Stack.Screen
              name={Routes.VerifyEmail}
              component={VerifyEmailScreen}
              options={{ title: 'Подтверждение email' }}
            />
            <Stack.Screen
              name={Routes.EmailVerifyDeepLink}
              component={EmailVerifyDeepLinkScreen}
              options={{ title: 'Подтверждение email' }}
            />
            <Stack.Screen
              name={Routes.UiKit}
              component={UiKitDemoScreen}
              options={{ title: 'UI Kit' }}
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
          </>
        ) : (
          <>
            <Stack.Screen
              name={Routes.Login}
              component={LoginScreen}
              options={{ title: 'Вход' }}
            />
            <Stack.Screen
              name={Routes.Register}
              component={RegisterScreen}
              options={{ title: 'Регистрация' }}
            />
            <Stack.Screen
              name={Routes.VerifyEmail}
              component={VerifyEmailScreen}
              options={{ title: 'Подтверждение email' }}
            />
            <Stack.Screen
              name={Routes.EmailVerifyDeepLink}
              component={EmailVerifyDeepLinkScreen}
              options={{ title: 'Подтверждение email' }}
            />
            <Stack.Screen
              name={Routes.Invite}
              component={InviteRegisterScreen}
              options={{ title: 'Регистрация по приглашению' }}
            />
            <Stack.Screen
              name={Routes.ForgotPassword}
              component={ForgotPasswordScreen}
              options={{ title: 'Сброс пароля' }}
            />
            <Stack.Screen
              name={Routes.ResetPassword}
              component={ResetPasswordScreen}
              options={{ title: 'Новый пароль' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
