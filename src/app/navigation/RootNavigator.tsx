import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LinkingOptions } from '@react-navigation/native';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { useAuthStore } from '@/core/auth/authStore';
import { SplashScreen } from '@/features/auth/screens/SplashScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { AuthPlaceholderScreen } from '@/features/auth/screens/AuthPlaceholderScreen';
import { EmailVerifyDeepLinkScreen } from '@/features/auth/screens/EmailVerifyDeepLinkScreen';
import { VerifyEmailScreen } from '@/features/auth/screens/VerifyEmailScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
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
              component={AuthPlaceholderScreen}
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
              component={AuthPlaceholderScreen}
              options={{ title: 'Регистрация по приглашению' }}
            />
            <Stack.Screen
              name={Routes.ForgotPassword}
              component={AuthPlaceholderScreen}
              options={{ title: 'Сброс пароля' }}
            />
            <Stack.Screen
              name={Routes.ResetPassword}
              component={AuthPlaceholderScreen}
              options={{ title: 'Новый пароль' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
