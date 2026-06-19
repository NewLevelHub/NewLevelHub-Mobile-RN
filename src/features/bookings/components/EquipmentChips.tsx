import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { EQUIPMENT_LABELS } from '@/shared/lib/labels';
import type { ResourceEquipment } from '@/features/bookings/types/resource';

interface Props {
  equipment: ResourceEquipment;
}

export const EquipmentChips = React.memo<Props>(({ equipment }) => {
  const active = (Object.keys(equipment) as (keyof ResourceEquipment)[]).filter(
    (key) => equipment[key] === true,
  );

  if (active.length === 0) return null;

  return (
    <View style={styles.row}>
      {active.map((key) => (
        <View key={key} style={styles.chip}>
          <Text style={styles.label}>{EQUIPMENT_LABELS[key] ?? key}</Text>
        </View>
      ))}
    </View>
  );
});

EquipmentChips.displayName = 'EquipmentChips';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: colors.brandSubtle,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: colors.brandText,
  },
});
