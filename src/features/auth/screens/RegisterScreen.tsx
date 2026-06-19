import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { colors } from '@/core/theme/colors';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppTextField } from '@/shared/ui/AppTextField';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Register>;

export function RegisterScreen({ navigation }: Props) {
  const {
    email,
    firstName,
    lastName,
    phone,
    password,
    passwordConfirm,
    emailError,
    firstNameError,
    lastNameError,
    passwordError,
    passwordConfirmError,
    errorMessage,
    isLoading,
    onEmailChange,
    onFirstNameChange,
    onLastNameChange,
    onPhoneChange,
    onPasswordChange,
    onPasswordConfirmChange,
    handleSubmit,
  } = useRegister(navigation);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>Создайте аккаунт NewLevelHub</Text>

        {errorMessage ? <AppErrorBanner message={errorMessage} /> : null}

        <AppTextField
          errorText={firstNameError}
          label="Имя"
          onChangeText={onFirstNameChange}
          placeholder="Иван"
          textContentType="givenName"
          value={firstName}
        />

        <AppTextField
          errorText={lastNameError}
          label="Фамилия"
          onChangeText={onLastNameChange}
          placeholder="Петров"
          textContentType="familyName"
          value={lastName}
        />

        <AppTextField
          autoCapitalize="none"
          autoCorrect={false}
          errorText={emailError}
          keyboardType="email-address"
          label="Email"
          onChangeText={onEmailChange}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={email}
        />

        <AppTextField
          keyboardType="phone-pad"
          label="Телефон (необязательно)"
          onChangeText={onPhoneChange}
          placeholder="+7 700 123 45 67"
          textContentType="telephoneNumber"
          value={phone}
        />

        <AppTextField
          errorText={passwordError}
          label="Пароль"
          onChangeText={onPasswordChange}
          secureToggle
          textContentType="newPassword"
          value={password}
        />

        <AppTextField
          errorText={passwordConfirmError}
          label="Подтверждение пароля"
          onChangeText={onPasswordConfirmChange}
          onSubmitEditing={() => void handleSubmit()}
          secureToggle
          textContentType="newPassword"
          value={passwordConfirm}
        />

        <AppButton loading={isLoading} onPress={() => void handleSubmit()} title="Зарегистрироваться" />

        <Pressable onPress={() => navigation.navigate(Routes.Login)}>
          <Text style={styles.loginLink}>Уже есть аккаунт? Войти</Text>
        </Pressable>
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
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  loginLink: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
