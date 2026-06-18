import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { QuickAction } from '@/features/core/types/dashboard';

interface ActionMeta {
  label: string;
  icon: string;
}

const ACTION_META: Record<QuickAction, ActionMeta> = {
  invite_user: { label: 'Пригласить', icon: '👤' },
  create_announcement: { label: 'Объявление', icon: '📢' },
  manage_bookings: { label: 'Брони', icon: '📅' },
  view_analytics: { label: 'Аналитика', icon: '📊' },
  manage_companies: { label: 'Компании', icon: '🏢' },
};

interface Props {
  action: QuickAction;
  onPress?: (action: QuickAction) => void;
}

function QuickActionChipComponent({ action, onPress }: Props) {
  const meta = ACTION_META[action] ?? { label: action, icon: '•' };

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
      onPress={() => onPress?.(action)}
    >
      <Text style={styles.icon}>{meta.icon}</Text>
      <Text style={styles.label}>{meta.label}</Text>
    </Pressable>
  );
}

export const QuickActionChip = React.memo(QuickActionChipComponent);

interface RowProps {
  actions: QuickAction[];
  onPress?: (action: QuickAction) => void;
}

export function QuickActionRow({ actions, onPress }: RowProps) {
  if (actions.length === 0) return null;

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <QuickActionChip key={action} action={action} onPress={onPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: colors.hover,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
});
