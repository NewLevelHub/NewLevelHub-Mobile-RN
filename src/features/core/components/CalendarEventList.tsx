import React, { memo } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import { LEAVE_TYPE_LABELS } from '@/shared/lib/labels';
import type { CalendarLeaveEvent } from '@/features/core/types/calendar';

const LEAVE_TYPE_COLORS: Record<CalendarLeaveEvent['leave_type'], string> = {
  vacation: colors.info,
  sick_leave: colors.error,
  remote: colors.brand,
  day_off: colors.textMuted,
};

const EventItem = memo(function EventItem({ item }: { item: CalendarLeaveEvent }) {
  const dotColor = LEAVE_TYPE_COLORS[item.leave_type] ?? colors.textMuted;

  const handlePress = () => {
    Alert.alert(
      'Детали заявки',
      `Детали будут доступны в разделе HR (Epic 6)\n\nЗаявка #${item.source_id}`,
    );
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.typeBar, { backgroundColor: dotColor }]} />
      <View style={styles.body}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.user_name}
        </Text>
        <Text style={styles.leaveType}>
          {LEAVE_TYPE_LABELS[item.leave_type] ?? item.leave_type}
        </Text>
        <Text style={styles.dates}>
          {item.start} — {item.end}
        </Text>
        {item.comment ? (
          <Text style={styles.comment} numberOfLines={2}>
            {item.comment}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});

interface CalendarEventListProps {
  date: string | null;
  events: CalendarLeaveEvent[];
}

export function CalendarEventList({ date, events }: CalendarEventListProps) {
  if (!date) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Выберите день для просмотра событий</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.listTitle}>
        {date}
        {events.length > 0 ? ` · ${events.length} событий` : ''}
      </Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventItem item={item} />}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>В этот день нет отсутствий</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  listTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBar: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  leaveType: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecondary,
  },
  dates: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 2,
  },
  comment: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSubtle,
    fontStyle: 'italic',
    marginTop: 4,
  },
  separator: {
    height: 6,
  },
  placeholder: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSubtle,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSubtle,
    textAlign: 'center',
    paddingVertical: 16,
  },
});
