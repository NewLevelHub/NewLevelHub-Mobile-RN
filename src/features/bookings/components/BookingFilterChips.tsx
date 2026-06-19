import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { RESOURCE_TYPE_LABELS } from '@/shared/lib/labels';
import type { ResourceType } from '@/features/bookings/types/resource';
import type { MyBookingFilterStatus } from '@/features/bookings/types/reservation';

interface FloorOption {
  id: number;
  label: string;
}

interface Props {
  // Resource type filter
  selectedType?: ResourceType | null;
  onTypeChange?: (type: ResourceType | null) => void;
  // Floor filter
  floors?: FloorOption[];
  selectedFloor?: number | null;
  onFloorChange?: (floorId: number | null) => void;
  // Reservation status filter
  selectedStatus?: MyBookingFilterStatus | null;
  onStatusChange?: (status: MyBookingFilterStatus | null) => void;
}

const RESOURCE_TYPES: ResourceType[] = ['desk', 'meeting_room', 'parking', 'capsule'];

const STATUS_OPTIONS: { value: MyBookingFilterStatus; label: string }[] = [
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'past', label: 'Прошедшие' },
  { value: 'cancelled', label: 'Отменённые' },
];

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterChip({ label, selected, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export const BookingFilterChips = React.memo<Props>(({
  selectedType,
  onTypeChange,
  floors,
  selectedFloor,
  onFloorChange,
  selectedStatus,
  onStatusChange,
}) => {
  const hasTypeFilter = onTypeChange !== undefined;
  const hasFloorFilter = onFloorChange !== undefined && floors && floors.length > 0;
  const hasStatusFilter = onStatusChange !== undefined;

  if (!hasTypeFilter && !hasFloorFilter && !hasStatusFilter) return null;

  return (
    <View style={styles.container}>
      {hasTypeFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          <FilterChip
            label="Все типы"
            selected={selectedType == null}
            onPress={() => onTypeChange(null)}
          />
          {RESOURCE_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={RESOURCE_TYPE_LABELS[type] ?? type}
              selected={selectedType === type}
              onPress={() => onTypeChange(type)}
            />
          ))}
        </ScrollView>
      )}

      {hasFloorFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          <FilterChip
            label="Все этажи"
            selected={selectedFloor == null}
            onPress={() => onFloorChange!(null)}
          />
          {floors!.map((floor) => (
            <FilterChip
              key={floor.id}
              label={floor.label}
              selected={selectedFloor === floor.id}
              onPress={() => onFloorChange!(floor.id)}
            />
          ))}
        </ScrollView>
      )}

      {hasStatusFilter && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {STATUS_OPTIONS.map(({ value, label }) => (
            <FilterChip
              key={value}
              label={label}
              selected={selectedStatus === value}
              onPress={() => onStatusChange!(selectedStatus === value ? null : value)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
});

BookingFilterChips.displayName = 'BookingFilterChips';

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    backgroundColor: colors.raised,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.brandSubtle,
    borderColor: colors.brand,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.brandText,
  },
});
