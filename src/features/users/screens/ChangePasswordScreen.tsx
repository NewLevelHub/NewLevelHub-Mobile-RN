import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppTextField } from '@/shared/ui/AppTextField';
import { useChangePassword } from '@/features/users/hooks/useChangePassword';

export function ChangePasswordScreen() {
  const { fields, fieldErrors, generalError, isLoading, setField, submit } = useChangePassword();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.hint}>
          После смены пароля вы будете перенаправлены на экран входа.
        </Text>

        {generalError ? <AppErrorBanner message={generalError} /> : null}

        <AppTextField
          autoCapitalize="none"
          autoCorrect={false}
          errorText={fieldErrors.currentPassword}
          label="Текущий пароль"
          onChangeText={(v) => setField('currentPassword', v)}
          secureTextEntry
          secureToggle
          textContentType="password"
          value={fields.currentPassword}
        />

        <AppTextField
          autoCapitalize="none"
          autoCorrect={false}
          errorText={fieldErrors.newPassword}
          label="Новый пароль"
          onChangeText={(v) => setField('newPassword', v)}
          secureTextEntry
          secureToggle
          textContentType="newPassword"
          value={fields.newPassword}
        />

        <AppTextField
          autoCapitalize="none"
          autoCorrect={false}
          errorText={fieldErrors.confirmPassword}
          label="Подтвердите новый пароль"
          onChangeText={(v) => setField('confirmPassword', v)}
          onSubmitEditing={submit}
          returnKeyType="done"
          secureTextEntry
          secureToggle
          textContentType="newPassword"
          value={fields.confirmPassword}
        />

        <AppButton
          loading={isLoading}
          onPress={submit}
          title="Сменить пароль"
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
  hint: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
});
