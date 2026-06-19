import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { RESOURCE_TYPE_LABELS } from '@/shared/lib/labels';
import type { ResourceType } from '@/features/bookings/types/resource';

interface Props {
  type: ResourceType;
}

export const ResourceTypeChip = React.memo<Props>(({ type }) => {
  const label = RESOURCE_TYPE_LABELS[type] ?? type;

  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

ResourceTypeChip.displayName = 'ResourceTypeChip';

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.raised,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
});
