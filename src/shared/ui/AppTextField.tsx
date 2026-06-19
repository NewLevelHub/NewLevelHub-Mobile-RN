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
  onFocus,
  onBlur,
  ...props
}: AppTextFieldProps) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputFocused,
          errorText ? styles.inputError : null,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Показать пароль' : 'Скрыть пароль'}
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
  inputFocused: {
    borderColor: colors.brand,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 10,
  },
  toggle: {
    paddingLeft: 8,
    paddingVertical: 10,
    paddingRight: 4,
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
