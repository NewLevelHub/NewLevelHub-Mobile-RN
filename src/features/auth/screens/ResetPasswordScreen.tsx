import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppTextField } from '@/shared/ui/AppTextField';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.ResetPassword>;

export function ResetPasswordScreen({ route, navigation }: Props) {
  const token = route.params?.token;
  const [devToken, setDevToken] = useState('');

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    status,
    passwordErrors,
    errorMessage,
    submit,
  } = useResetPassword(token);

  const handleGoToLogin = () => {
    navigation.reset({ index: 0, routes: [{ name: Routes.Login }] });
  };

  const handleGoToForgotPassword = () => {
    navigation.navigate(Routes.ForgotPassword);
  };

  if (__DEV__ && !token) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.debugTitle}>Debug: токен сброса пароля</Text>
        <AppTextField
          autoCapitalize="none"
          autoCorrect={false}
          label="Token"
          onChangeText={setDevToken}
          placeholder="UUID из письма"
          value={devToken}
        />
        <AppButton
          disabled={!devToken.trim()}
          onPress={() => {
            if (devToken.trim()) {
              navigation.replace(Routes.ResetPassword, { token: devToken.trim() });
            }
          }}
          title="Открыть экран"
        />
        <AppButton
          onPress={handleGoToLogin}
          title="Вернуться ко входу"
          variant="text"
        />
      </ScrollView>
      </SafeAreaView>
    );
  }

  if (status === 'success') {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, styles.iconSuccess]}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <Text style={styles.title}>Пароль изменён</Text>
          <Text style={styles.body}>
            Ваш пароль успешно обновлён. Войдите в аккаунт с новым паролем.
          </Text>
          <AppButton onPress={handleGoToLogin} title="Войти" />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'token_invalid' || !token) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, styles.iconError]}>
            <Text style={styles.iconText}>✕</Text>
          </View>
          <Text style={styles.title}>Ссылка недействительна</Text>
          <Text style={styles.body}>
            Ссылка для сброса пароля недействительна. Запросите новую ссылку.
          </Text>
          <AppButton onPress={handleGoToForgotPassword} title="Сбросить пароль" />
          <AppButton onPress={handleGoToLogin} title="Вернуться ко входу" variant="text" />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'token_expired') {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, styles.iconWarning]}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={styles.title}>Ссылка устарела</Text>
          <Text style={styles.body}>
            Срок действия ссылки истёк. Запросите сброс пароля заново.
          </Text>
          <AppButton onPress={handleGoToForgotPassword} title="Запросить снова" />
          <AppButton onPress={handleGoToLogin} title="Вернуться ко входу" variant="text" />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'token_used') {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, styles.iconInfo]}>
            <Text style={styles.iconText}>i</Text>
          </View>
          <Text style={styles.title}>Ссылка уже использована</Text>
          <Text style={styles.body}>
            Эта ссылка уже была использована. Запросите новый сброс пароля.
          </Text>
          <AppButton onPress={handleGoToForgotPassword} title="Запросить снова" />
          <AppButton onPress={handleGoToLogin} title="Вернуться ко входу" variant="text" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>Придумайте новый пароль для вашего аккаунта.</Text>

        {errorMessage ? <AppErrorBanner message={errorMessage} /> : null}

        {passwordErrors.length > 0 ? (
          <View style={styles.passwordErrorsBox}>
            {passwordErrors.map((msg, index) => (
              <Text key={index} style={styles.passwordErrorItem}>
                • {msg}
              </Text>
            ))}
          </View>
        ) : null}

        <AppTextField
          label="Новый пароль"
          onChangeText={setNewPassword}
          secureToggle
          textContentType="newPassword"
          value={newPassword}
        />

        <AppTextField
          label="Подтвердите пароль"
          onChangeText={setConfirmPassword}
          onSubmitEditing={() => void submit()}
          secureToggle
          textContentType="newPassword"
          value={confirmPassword}
        />

        <AppButton
          loading={status === 'loading'}
          onPress={() => void submit()}
          title="Сохранить пароль"
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page,
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: 24,
    gap: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.page,
    padding: 24,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  debugTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 8,
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
  iconWarning: {
    backgroundColor: colors.warningBackground,
  },
  iconError: {
    backgroundColor: colors.errorBackground,
  },
  iconInfo: {
    backgroundColor: colors.brandSubtle,
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
  body: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  passwordErrorsBox: {
    backgroundColor: colors.errorBackground,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  passwordErrorItem: {
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
});
