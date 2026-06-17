import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';

type PlaceholderRoute =
  | typeof Routes.Register
  | typeof Routes.VerifyEmail
  | typeof Routes.Invite
  | typeof Routes.ForgotPassword
  | typeof Routes.ResetPassword;

type Props = NativeStackScreenProps<RootStackParamList, PlaceholderRoute>;

const DEFAULT_COPY: Record<PlaceholderRoute, { title: string; subtitle: string }> = {
  [Routes.Register]: {
    title: 'Регистрация',
    subtitle: 'Регистрация гостя в разработке',
  },
  [Routes.VerifyEmail]: {
    title: 'Подтверждение email',
    subtitle: 'Ожидание подтверждения email',
  },
  [Routes.Invite]: {
    title: 'Регистрация по приглашению',
    subtitle: 'Регистрация по приглашению в разработке',
  },
  [Routes.ForgotPassword]: {
    title: 'Сброс пароля',
    subtitle: 'Запрос сброса пароля в разработке',
  },
  [Routes.ResetPassword]: {
    title: 'Новый пароль',
    subtitle: 'Установка нового пароля в разработке',
  },
};

export function AuthPlaceholderScreen({ route }: Props) {
  const defaults = DEFAULT_COPY[route.name];
  const params = route.params ?? {};
  const title = 'title' in params && params.title ? params.title : defaults.title;
  const subtitle =
    'subtitle' in params && params.subtitle ? params.subtitle : defaults.subtitle;
  const email = 'email' in params ? (params.email as string | undefined) : undefined;
  const token = 'token' in params ? (params.token as string | undefined) : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {email ? <Text style={styles.meta}>Email: {email}</Text> : null}
      {token ? <Text style={styles.meta}>Token: {token}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
