import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';

interface Props {
  visible: boolean;
  errorCode?: string | null;
}

const MESSAGES: Record<string, string> = {
  BOOKING_CONFLICT: 'Это время уже занято. Пожалуйста, выберите другой слот.',
  DESK_USER_OVERLAP: 'У вас уже есть бронирование на это время.',
};

const FALLBACK = 'Конфликт бронирования. Пожалуйста, выберите другое время.';

export const ConflictErrorBanner = React.memo<Props>(({ visible, errorCode }) => {
  if (!visible) return null;

  const message = (errorCode && MESSAGES[errorCode]) ?? FALLBACK;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
});

ConflictErrorBanner.displayName = 'ConflictErrorBanner';

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.errorBackground,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    borderRadius: 8,
    padding: 12,
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.error,
  },
});
