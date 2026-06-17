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
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { UiKitDemoScreen } from '@/features/dev/screens/UiKitDemoScreen';
import { ProfilePlaceholderScreen } from '@/features/users/screens/ProfilePlaceholderScreen';

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
  const { isLoading, isAuthenticated, bootstrap } = useAuthStore();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (isLoading) {
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
              component={ProfilePlaceholderScreen}
              options={{ title: 'Профиль' }}
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
