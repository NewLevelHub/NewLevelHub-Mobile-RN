import { useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';
import { AppLoader } from '@/shared/ui/AppLoader';
import { AppErrorView } from '@/shared/ui/AppErrorView';
import { useCalendarEvents } from '@/features/core/hooks/useCalendarEvents';
import { CalendarEventList } from '@/features/core/components/CalendarEventList';
import type { CalendarLeaveEvent } from '@/features/core/types/calendar';

// ─── Constants ─────────────────────────────────────────────────────────────────

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const WEEKDAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const LEAVE_TYPE_COLORS: Record<CalendarLeaveEvent['leave_type'], string> = {
  vacation: colors.info,
  sick_leave: colors.error,
  remote: colors.brand,
  day_off: colors.textMuted,
};

// ─── Month grid helpers ────────────────────────────────────────────────────────

function buildGridDays(year: number, month: number): Array<number | null> {
  const firstDay = new Date(year, month, 1).getDay();
  // Monday-first offset: Sun=0 → 6, Mon=1 → 0, ..., Sat=6 → 5
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to full rows of 7
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function MonthHeader({
  year,
  month,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.monthHeader}>
      <TouchableOpacity onPress={onPrev} style={styles.arrowBtn} hitSlop={12}>
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.monthTitle}>
        {MONTHS_RU[month]} {year}
      </Text>
      <TouchableOpacity onPress={onNext} style={styles.arrowBtn} hitSlop={12}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

function WeekdayRow() {
  return (
    <View style={styles.weekdayRow}>
      {WEEKDAYS_RU.map((d) => (
        <Text key={d} style={styles.weekdayLabel}>
          {d}
        </Text>
      ))}
    </View>
  );
}

function DayCell({
  day,
  dateStr,
  dots,
  isSelected,
  isToday,
  onPress,
}: {
  day: number | null;
  dateStr: string | null;
  dots: string[];
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
}) {
  if (day === null) {
    return <View style={styles.dayCell} />;
  }

  return (
    <TouchableOpacity
      style={[styles.dayCell, isSelected && styles.dayCellSelected, isToday && !isSelected && styles.dayCellToday]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected, isToday && !isSelected && styles.dayNumberToday]}>
        {day}
      </Text>
      {dots.length > 0 && (
        <View style={styles.dotsRow}>
          {dots.slice(0, 3).map((color, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Legend ────────────────────────────────────────────────────────────────────

function CalendarLegend() {
  const entries: Array<{ label: string; color: string }> = [
    { label: 'Отпуск', color: colors.info },
    { label: 'Больничный', color: colors.error },
    { label: 'Удалённо', color: colors.brand },
    { label: 'Отгул', color: colors.textMuted },
  ];

  return (
    <View style={styles.legend}>
      {entries.map((e) => (
        <View key={e.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: e.color }]} />
          <Text style={styles.legendLabel}>{e.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Calendar grid ─────────────────────────────────────────────────────────────

function MonthGrid({
  year,
  month,
  eventsByDate,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  eventsByDate: Record<string, CalendarLeaveEvent[]>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  }, []);

  const cells = useMemo(() => buildGridDays(year, month), [year, month]);

  const rows: Array<Array<number | null>> = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.gridRow}>
          {row.map((day, ci) => {
            const dateStr = day !== null ? toDateStr(year, month, day) : null;
            const evs = dateStr ? (eventsByDate[dateStr] ?? []) : [];
            const dotColors = Array.from(
              new Set(evs.map((e) => LEAVE_TYPE_COLORS[e.leave_type] ?? colors.textMuted)),
            );
            return (
              <DayCell
                key={ci}
                day={day}
                dateStr={dateStr}
                dots={dotColors}
                isSelected={dateStr === selectedDate}
                isToday={dateStr === todayStr}
                onPress={() => {
                  if (dateStr) onSelectDate(dateStr);
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ─── Access guard ──────────────────────────────────────────────────────────────

const FORBIDDEN_ROLES = new Set<string>([
  USER_ROLES.GUEST,
  USER_ROLES.RECEPTION,
  USER_ROLES.SERVICE_MANAGER,
]);

// ─── Screen ───────────────────────────────────────────────────────────────────

export function TeamCalendarScreen() {
  const user = useAuthStore((state) => state.user);

  if (!user || FORBIDDEN_ROLES.has(user.role)) {
    return (
      <SafeAreaView style={styles.guardContainer} edges={[]}>
        <Text style={styles.guardText}>Нет доступа к командному календарю</Text>
      </SafeAreaView>
    );
  }

  return <TeamCalendarContent />;
}

function TeamCalendarContent() {
  const {
    year,
    month,
    selectedDate,
    setSelectedDate,
    eventsByDate,
    selectedEvents,
    isLoading,
    isRefetching,
    isForbidden,
    error,
    refetch,
    goToPrevMonth,
    goToNextMonth,
  } = useCalendarEvents();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered} edges={[]}>
        <AppLoader />
      </SafeAreaView>
    );
  }

  if (isForbidden) {
    return (
      <SafeAreaView style={styles.guardContainer} edges={[]}>
        <Text style={styles.guardText}>Нет доступа к командному календарю</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered} edges={[]}>
        <AppErrorView
          message={error.message ?? 'Не удалось загрузить календарь'}
          onRetry={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor={colors.brand}
          />
        }
      >
        <View style={styles.calendarCard}>
          <MonthHeader
            year={year}
            month={month}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
          />
          <WeekdayRow />
          <MonthGrid
            year={year}
            month={month}
            eventsByDate={eventsByDate}
            selectedDate={selectedDate}
            onSelectDate={(date) =>
              setSelectedDate(date === selectedDate ? null : date)
            }
          />
          <CalendarLegend />
        </View>

        <CalendarEventList date={selectedDate} events={selectedEvents} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardContainer: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  guardText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Calendar card
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },

  // Month header
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 24,
    color: colors.textSecondary,
    lineHeight: 28,
  },
  monthTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },

  // Weekdays
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },

  // Grid
  grid: {
    gap: 2,
  },
  gridRow: {
    flexDirection: 'row',
  },

  // Day cell
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 2,
  },
  dayCellSelected: {
    backgroundColor: colors.brand,
  },
  dayCellToday: {
    backgroundColor: colors.brandSubtle,
  },
  dayNumber: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  dayNumberSelected: {
    color: colors.textOnBrand,
    fontFamily: 'Inter_700Bold',
  },
  dayNumberToday: {
    color: colors.brandText,
    fontFamily: 'Inter_700Bold',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
});
