import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { useVerifyEmail } from '@/features/auth/hooks/useVerifyEmail';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.VerifyEmail>;

export function VerifyEmailScreen({ route, navigation }: Props) {
  const {
    email,
    hasAccessToken,
    cooldownSeconds,
    isLoading,
    error,
    successMessage,
    onResend,
    onBackToLogin,
  } = useVerifyEmail({ emailParam: route.params?.email, navigation });

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Подтвердите ваш email</Text>

      <Text style={styles.instruction}>
        Мы отправили письмо со ссылкой для подтверждения на адрес:
      </Text>

      <View style={styles.emailBox}>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <Text style={styles.hint}>
        Перейдите по ссылке в письме, чтобы активировать аккаунт. Если письмо не пришло, проверьте
        папку «Спам».
      </Text>

      {error ? <AppErrorBanner message={error} /> : null}

      {successMessage ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {cooldownSeconds > 0 ? (
        <Text style={styles.cooldownText}>
          Попробуйте позже через {cooldownSeconds} секунд
        </Text>
      ) : null}

      {hasAccessToken ? (
        <AppButton
          disabled={cooldownSeconds > 0 || isLoading}
          loading={isLoading}
          onPress={onResend}
          title="Отправить письмо повторно"
        />
      ) : null}

      <AppButton onPress={onBackToLogin} title="Вернуться ко входу" variant="secondary" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.page,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailBox: {
    backgroundColor: colors.raised,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emailText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  successBanner: {
    backgroundColor: colors.successBackground,
    borderRadius: 8,
    padding: 12,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    lineHeight: 20,
  },
  cooldownText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
