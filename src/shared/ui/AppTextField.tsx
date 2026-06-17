import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { colors } from '@/core/theme/colors';

interface AppTextFieldProps extends TextInputProps {
  label: string;
  errorText?: string;
  secureToggle?: boolean;
}

export function AppTextField({
  label,
  errorText,
  secureToggle = false,
  secureTextEntry,
  style,
  ...props
}: AppTextFieldProps) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, errorText ? styles.inputError : null]}>
        <TextInput
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          style={[styles.input, style]}
          {...props}
        />
        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setHidden((value) => !value)}
            style={styles.toggle}
          >
            <Text style={styles.toggleText}>{hidden ? 'Показать' : 'Скрыть'}</Text>
          </Pressable>
        ) : null}
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  inputWrap: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 10,
  },
  toggle: {
    paddingLeft: 8,
  },
  toggleText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '500',
  },
  error: {
    color: colors.error,
    fontSize: 13,
  },
});
