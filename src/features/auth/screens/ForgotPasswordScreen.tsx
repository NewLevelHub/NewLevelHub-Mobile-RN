import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppTextField } from '@/shared/ui/AppTextField';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.ForgotPassword>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { email, setEmail, status, errorMessage, rateLimit, submit } = useForgotPassword();

  if (status === 'success') {
    return (
      <View style={styles.centered}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, styles.iconSuccess]}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <Text style={styles.title}>Письмо отправлено</Text>
          <Text style={styles.body}>
            Если аккаунт с таким адресом существует, мы отправили инструкции по сбросу пароля.
            Проверьте папку «Спам», если письмо не пришло.
          </Text>
          <AppButton
            onPress={() => navigation.navigate(Routes.Login)}
            title="Вернуться ко входу"
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Укажите email, привязанный к аккаунту — мы отправим ссылку для сброса пароля.
        </Text>

        {rateLimit ? (
          <View style={styles.rateLimitBanner}>
            <Text style={styles.rateLimitText}>
              Слишком много запросов. Подождите несколько минут и попробуйте снова.
            </Text>
          </View>
        ) : null}

        {errorMessage && !rateLimit ? (
          <AppErrorBanner message={errorMessage} />
        ) : null}

        <AppTextField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          onSubmitEditing={() => void submit()}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />

        <AppButton
          disabled={rateLimit}
          loading={status === 'loading'}
          onPress={() => void submit()}
          title="Отправить ссылку"
        />

        <AppButton
          onPress={() => navigation.navigate(Routes.Login)}
          title="Вернуться ко входу"
          variant="text"
        />
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
  rateLimitBanner: {
    backgroundColor: colors.warningBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  rateLimitText: {
    color: colors.warning,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
});
