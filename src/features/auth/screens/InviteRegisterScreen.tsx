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
import { colors } from '@/core/theme/colors';
import { useInviteRegister } from '@/features/auth/hooks/useInviteRegister';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppLoader } from '@/shared/ui/AppLoader';
import { AppTextField } from '@/shared/ui/AppTextField';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Invite>;

export function InviteRegisterScreen({ route, navigation }: Props) {
  const token = route.params?.token;

  const {
    inviteInfo,
    isLoadingInvite,
    inviteError,
    firstName,
    lastName,
    phone,
    password,
    firstNameError,
    lastNameError,
    passwordError,
    errorMessage,
    isSubmitting,
    onFirstNameChange,
    onLastNameChange,
    onPhoneChange,
    onPasswordChange,
    handleSubmit,
  } = useInviteRegister(token, navigation);

  if (isLoadingInvite) {
    return (
      <View style={styles.centered}>
        <AppLoader />
      </View>
    );
  }

  if (inviteError) {
    return (
      <View style={styles.centered}>
        <AppErrorBanner message={inviteError} />
        <Pressable onPress={() => navigation.navigate(Routes.Login)} style={styles.backLink}>
          <Text style={styles.backLinkText}>Вернуться ко входу</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {inviteInfo?.company_name ? (
          <Text style={styles.subtitle}>
            Вы приглашены в{' '}
            <Text style={styles.companyName}>{inviteInfo.company_name}</Text>
          </Text>
        ) : (
          <Text style={styles.subtitle}>Регистрация по приглашению</Text>
        )}

        {errorMessage ? <AppErrorBanner message={errorMessage} /> : null}

        <AppTextField
          label="Имя"
          errorText={firstNameError}
          value={firstName}
          onChangeText={onFirstNameChange}
          placeholder="Иван"
          textContentType="givenName"
        />

        <AppTextField
          label="Фамилия"
          errorText={lastNameError}
          value={lastName}
          onChangeText={onLastNameChange}
          placeholder="Петров"
          textContentType="familyName"
        />

        <AppTextField
          label="Email"
          value={inviteInfo?.email ?? ''}
          editable={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          style={styles.disabledInput}
        />

        <AppTextField
          label="Телефон (необязательно)"
          value={phone}
          onChangeText={onPhoneChange}
          placeholder="+7 700 123 45 67"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />

        <AppTextField
          label="Пароль"
          errorText={passwordError}
          value={password}
          onChangeText={onPasswordChange}
          onSubmitEditing={() => void handleSubmit()}
          secureToggle
          textContentType="newPassword"
        />

        <AppButton
          loading={isSubmitting}
          onPress={() => void handleSubmit()}
          title="Зарегистрироваться"
        />

        <Pressable onPress={() => navigation.navigate(Routes.Login)}>
          <Text style={styles.loginLink}>Уже есть аккаунт? Войти</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.page,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.page,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
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
  companyName: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  disabledInput: {
    color: colors.textMuted,
  },
  loginLink: {
    color: colors.brand,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backLinkText: {
    color: colors.brand,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});
