import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, usePreventRemove } from '@react-navigation/native';

import { colors } from '@/core/theme/colors';
import { useProfileEdit } from '@/features/users/hooks/useProfileEdit';
import { AppButton } from '@/shared/ui/AppButton';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppTextField } from '@/shared/ui/AppTextField';

export function ProfileEditScreen() {
  const navigation = useNavigation();
  const { user, fields, fieldErrors, generalError, isDirty, isSaving, isSaved, setField, save } =
    useProfileEdit();

  usePreventRemove(isDirty && !isSaving && !isSaved, ({ data }) => {
    Alert.alert('Несохранённые изменения', 'Выйти без сохранения?', [
      { text: 'Остаться', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Личные данные</Text>

        <AppTextField
          label="Имя"
          value={fields.first_name}
          onChangeText={(v) => setField('first_name', v)}
          errorText={fieldErrors.first_name}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <AppTextField
          label="Фамилия"
          value={fields.last_name}
          onChangeText={(v) => setField('last_name', v)}
          errorText={fieldErrors.last_name}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <AppTextField
          label="Телефон"
          value={fields.phone}
          onChangeText={(v) => setField('phone', v)}
          errorText={fieldErrors.phone}
          keyboardType="phone-pad"
          returnKeyType="next"
        />
        <AppTextField
          label="Должность"
          value={fields.position}
          onChangeText={(v) => setField('position', v)}
          errorText={fieldErrors.position}
          returnKeyType="done"
        />

        <Text style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>Аккаунт</Text>

        <View style={styles.readOnlyGroup}>
          <ReadOnlyRow label="Email" value={user?.email ?? ''} />
          <ReadOnlyRow label="Роль" value={user?.role ?? ''} />
          {user?.company != null ? (
            <ReadOnlyRow label="Компания" value={user.company.name} last />
          ) : null}
        </View>

        {generalError != null ? <AppErrorBanner message={generalError} /> : null}

        <AppButton
          title="Сохранить"
          onPress={save}
          loading={isSaving}
          disabled={!isDirty || isSaving}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ReadOnlyRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.readOnlyRow, last ? null : styles.readOnlyRowBorder]}>
      <Text style={styles.readOnlyLabel}>{label}</Text>
      <Text style={styles.readOnlyValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scroll: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  sectionHeaderSpaced: {
    marginTop: 8,
  },
  readOnlyGroup: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  readOnlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  readOnlyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderFaint,
  },
  readOnlyLabel: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  readOnlyValue: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  saveButton: {
    marginTop: 8,
  },
});
