import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppTextField } from '@/shared/ui/AppTextField';
import { useEmailVerifyDeepLink } from '@/features/auth/hooks/useEmailVerifyDeepLink';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof Routes.EmailVerifyDeepLink
>;

export function EmailVerifyDeepLinkScreen({ navigation, route }: Props) {
  const { token } = route.params ?? {};
  const { status, errorMessage, verify } = useEmailVerifyDeepLink(token);

  const [devToken, setDevToken] = useState('');

  const handleGoToLogin = () => {
    navigation.navigate(Routes.Login);
  };

  if (!token && __DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Debug: ввод токена</Text>
        <AppTextField
          label="Token"
          value={devToken}
          onChangeText={setDevToken}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="UUID токена из письма"
        />
        <AppButton
          title="Проверить"
          onPress={() => {
            if (devToken.trim()) void verify(devToken.trim());
          }}
        />
        {status !== 'idle' && <StatusCard status={status} errorMessage={errorMessage} onLogin={handleGoToLogin} />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusCard status={status} errorMessage={errorMessage} onLogin={handleGoToLogin} />
    </View>
  );
}

interface StatusCardProps {
  status: ReturnType<typeof useEmailVerifyDeepLink>['status'];
  errorMessage: string | undefined;
  onLogin: () => void;
}

function StatusCard({ status, errorMessage, onLogin }: StatusCardProps) {
  if (status === 'loading' || status === 'idle') {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.bodyText}>Проверяем ссылку…</Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={styles.card}>
        <View style={[styles.iconCircle, styles.iconSuccess]}>
          <Text style={styles.iconText}>✓</Text>
        </View>
        <Text style={styles.title}>Email подтверждён</Text>
        <Text style={styles.bodyText}>
          Ваш адрес электронной почты успешно подтверждён. Теперь можно войти в аккаунт.
        </Text>
        <AppButton title="Войти" onPress={onLogin} />
      </View>
    );
  }

  if (status === 'already_used') {
    return (
      <View style={styles.card}>
        <View style={[styles.iconCircle, styles.iconInfo]}>
          <Text style={styles.iconText}>i</Text>
        </View>
        <Text style={styles.title}>Email уже подтверждён</Text>
        <Text style={styles.bodyText}>
          Этот адрес уже был подтверждён ранее. Просто войдите в аккаунт.
        </Text>
        <AppButton title="Войти" onPress={onLogin} />
      </View>
    );
  }

  if (status === 'expired') {
    return (
      <View style={styles.card}>
        <View style={[styles.iconCircle, styles.iconWarning]}>
          <Text style={styles.iconText}>!</Text>
        </View>
        <Text style={styles.title}>Ссылка истекла</Text>
        <Text style={styles.bodyText}>
          Срок действия ссылки истёк. Войдите в аккаунт и запросите новое письмо с подтверждением.
        </Text>
        <AppButton title="Войти" onPress={onLogin} />
      </View>
    );
  }

  if (status === 'not_found') {
    return (
      <View style={styles.card}>
        <View style={[styles.iconCircle, styles.iconError]}>
          <Text style={styles.iconText}>✕</Text>
        </View>
        <Text style={styles.title}>Ссылка недействительна</Text>
        <Text style={styles.bodyText}>
          Не удалось найти ссылку подтверждения. Проверьте письмо или запросите новое.
        </Text>
        <AppButton title="Войти" onPress={onLogin} />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, styles.iconError]}>
        <Text style={styles.iconText}>✕</Text>
      </View>
      <Text style={styles.title}>Что-то пошло не так</Text>
      <Text style={styles.bodyText}>
        {errorMessage ?? 'Не удалось подтвердить email. Попробуйте ещё раз позже.'}
      </Text>
      <AppButton title="Войти" onPress={onLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSuccess: {
    backgroundColor: colors.successBackground,
  },
  iconInfo: {
    backgroundColor: colors.brandSubtle,
  },
  iconWarning: {
    backgroundColor: colors.warningBackground,
  },
  iconError: {
    backgroundColor: colors.errorBackground,
  },
  iconText: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
