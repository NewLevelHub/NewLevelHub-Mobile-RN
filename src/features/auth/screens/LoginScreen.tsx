import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import {
  EmailNotVerifiedException,
  useAuthStore,
} from '@/core/auth/authStore';
import { ApiException } from '@/core/network/apiException';
import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppTextField } from '@/shared/ui/AppTextField';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Login>;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function LoginScreen({ navigation }: Props) {
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const validate = () => {
    const trimmedEmail = email.trim();
    const nextEmailError = !trimmedEmail
      ? 'Укажите email'
      : !EMAIL_PATTERN.test(trimmedEmail)
        ? 'Некорректный email'
        : undefined;
    const nextPasswordError = !password ? 'Укажите пароль' : undefined;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    return !nextEmailError && !nextPasswordError;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await login(email.trim(), password, rememberMe);
    } catch (error) {
      if (error instanceof EmailNotVerifiedException) {
        navigation.navigate(Routes.VerifyEmail, { email: email.trim() });
        return;
      }

      if (error instanceof ApiException) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Ошибка сети');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>Войдите в аккаунт NewLevelHub</Text>

        {errorMessage ? <AppErrorBanner message={errorMessage} /> : null}

        <AppTextField
          autoCapitalize="none"
          autoCorrect={false}
          errorText={emailError}
          keyboardType="email-address"
          label="Email"
          onChangeText={(value) => {
            setEmail(value);
            setEmailError(undefined);
            setErrorMessage(undefined);
          }}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />

        <AppTextField
          errorText={passwordError}
          label="Пароль"
          onChangeText={(value) => {
            setPassword(value);
            setPasswordError(undefined);
            setErrorMessage(undefined);
          }}
          onSubmitEditing={() => void handleSubmit()}
          secureToggle
          textContentType="password"
          value={password}
        />

        <View style={styles.rememberRow}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
            onPress={() => setRememberMe((value) => !value)}
            style={styles.rememberControl}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe ? <Text style={styles.checkboxMark}>✓</Text> : null}
            </View>
            <Text style={styles.rememberLabel}>Запомнить меня</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate(Routes.ForgotPassword)}>
            <Text style={styles.link}>Забыли пароль?</Text>
          </Pressable>
        </View>

        <AppButton loading={isLoading} onPress={() => void handleSubmit()} title="Войти" />

        <AppButton
          onPress={() => navigation.navigate(Routes.Register)}
          title="Нет аккаунта? Зарегистрироваться"
          variant="text"
        />

        {__DEV__ ? (
          <AppButton
            onPress={() => navigation.navigate(Routes.ResetPassword, {})}
            title="🐞 Debug: токен сброса пароля"
            variant="text"
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.page,
  },
  container: {
    padding: 24,
    gap: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rememberControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  checkboxMark: {
    color: colors.textOnBrand,
    fontSize: 12,
    fontWeight: '700',
  },
  rememberLabel: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  link: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '500',
  },
});
