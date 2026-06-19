import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/core/theme/colors';
import type { QuickAction } from '@/features/core/types/dashboard';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface ActionMeta {
  label: string;
  icon: IoniconsName;
}

const ACTION_META: Record<QuickAction, ActionMeta> = {
  invite_user: { label: 'Пригласить', icon: 'person-add-outline' },
  create_announcement: { label: 'Объявление', icon: 'megaphone-outline' },
  manage_bookings: { label: 'Брони', icon: 'calendar-outline' },
  view_analytics: { label: 'Аналитика', icon: 'bar-chart-outline' },
  manage_companies: { label: 'Компании', icon: 'business-outline' },
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
      <Ionicons name={meta.icon} size={16} color={colors.textSecondary} />
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
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
});
