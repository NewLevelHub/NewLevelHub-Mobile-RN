import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import {
  validateAvailabilityInterval,
  toAlmatyISO,
  getAlmatyDateOptions,
  getDurationPresets,
  getDefaultDuration,
  addMinutesToISO,
} from '@/features/bookings/lib/bookingTimeRules';
import type { ResourceType } from '@/features/bookings/types/resource';

interface Props {
  resourceType: ResourceType | null;
  availableFrom: string | null;
  availableTo: string | null;
  onApply: (from: string, to: string) => void;
  onReset: () => void;
}

// 06:00 – 22:00 — типичный диапазон для коворкинга
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

// ─── Мелкий хелпер ────────────────────────────────────────────────────────────

function hhmm(iso: string): string {
  return iso.length >= 16 ? iso.substring(11, 16) : '';
}

// ─── Chip (переиспользуется для дат, часов, минут, длительности) ──────────────

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  wide?: boolean;   // для часовых чипов — фиксированная ширина
}

const Chip = React.memo<ChipProps>(({ label, selected, onPress, wide }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipOn, wide && styles.chipWide]}
    onPress={onPress}
    activeOpacity={0.72}
  >
    <Text style={[styles.chipTxt, selected && styles.chipTxtOn]}>{label}</Text>
  </TouchableOpacity>
));

Chip.displayName = 'Chip';

// ─── Лейбл секции ─────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export const AvailabilityFilterSheet = React.memo<Props>(function AvailabilityFilterSheet({
  resourceType,
  availableFrom,
  availableTo,
  onApply,
  onReset,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(() => getDefaultDuration(resourceType));
  const [activeSummary, setActiveSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dateOptions = useMemo(() => getAlmatyDateOptions(14), []);
  const durationPresets = useMemo(() => getDurationPresets(resourceType), [resourceType]);

  const isParkingMode = resourceType === 'parking';
  const isFilterActive = availableFrom !== null && availableTo !== null;

  // Вычисляем ISO-строки на лету
  const { fromISO, toISO } = useMemo(() => {
    const d = dateOptions[selectedDateIdx];
    const from = isParkingMode
      ? toAlmatyISO(d.year, d.month, d.day, 0, 0)
      : toAlmatyISO(d.year, d.month, d.day, startHour, startMinute);
    const to = isParkingMode
      ? toAlmatyISO(d.year, d.month, d.day, 23, 59)
      : addMinutesToISO(from, durationMinutes);
    return { fromISO: from, toISO: to };
  }, [dateOptions, selectedDateIdx, isParkingMode, startHour, startMinute, durationMinutes]);

  const endPreviewLabel = useMemo(() => `до ${hhmm(toISO)}`, [toISO]);

  // При смене типа ресурса сбрасываем длительность на дефолтную
  useEffect(() => {
    setDurationMinutes(getDefaultDuration(resourceType));
    setError(null);
  }, [resourceType]);

  const handleApply = useCallback(() => {
    const result = validateAvailabilityInterval(fromISO, toISO, resourceType);
    if (!result.valid) {
      setError(result.error ?? 'Неверный интервал');
      return;
    }
    const dateLabel = dateOptions[selectedDateIdx].label;
    setActiveSummary(`${dateLabel}  ·  ${hhmm(fromISO)} – ${hhmm(toISO)}`);
    setError(null);
    setIsExpanded(false);
    onApply(fromISO, toISO);
  }, [fromISO, toISO, resourceType, dateOptions, selectedDateIdx, onApply]);

  const handleReset = useCallback(() => {
    setIsExpanded(false);
    setActiveSummary(null);
    setError(null);
    onReset();
  }, [onReset]);

  // Активное состояние полосы — только когда фильтр применён И панель закрыта
  const showActive = isFilterActive && !isExpanded;

  return (
    <View style={styles.root}>
      {/* ── Toggle-полоса ────────────────────────────────────────── */}
      <View
        style={[
          styles.bar,
          showActive && styles.barActive,
          isExpanded && styles.barOpen,
        ]}
      >
        <TouchableOpacity
          style={styles.barMain}
          onPress={() => setIsExpanded((v) => !v)}
          activeOpacity={0.75}
        >
          <Ionicons
            name={showActive ? 'checkmark-circle' : 'time-outline'}
            size={18}
            color={showActive ? colors.brand : colors.textMuted}
          />
          <Text
            style={[styles.barLabel, showActive && styles.barLabelActive]}
            numberOfLines={1}
          >
            {showActive && activeSummary ? activeSummary : 'Свободно в интервале…'}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={showActive ? colors.brand : colors.textMuted}
          />
        </TouchableOpacity>

        {isFilterActive && (
          <TouchableOpacity
            style={[styles.clearBtn, showActive && styles.clearBtnActive]}
            onPress={handleReset}
            activeOpacity={0.7}
            hitSlop={6}
          >
            <Ionicons
              name="close"
              size={17}
              color={showActive ? colors.brandText : colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Раскрытая панель ─────────────────────────────────────── */}
      {isExpanded && (
        <View style={styles.panel}>
          {/* ДАТА */}
          <SectionLabel text="Дата" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
          >
            {dateOptions.map((d, idx) => (
              <Chip
                key={idx}
                label={d.label}
                selected={selectedDateIdx === idx}
                onPress={() => setSelectedDateIdx(idx)}
              />
            ))}
          </ScrollView>

          {isParkingMode ? (
            /* ПАРКОВКА: целый день */
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={15} color={colors.info} />
              <Text style={styles.infoText}>Бронируется на целый день (00:00 – 23:59)</Text>
            </View>
          ) : (
            <>
              {/* НАЧАЛО */}
              <SectionLabel text="Начало" />

              {/* Часы */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
              >
                {HOURS.map((h) => (
                  <Chip
                    key={h}
                    label={String(h).padStart(2, '0')}
                    selected={startHour === h}
                    onPress={() => setStartHour(h)}
                    wide
                  />
                ))}
              </ScrollView>

              {/* Минуты */}
              <View style={styles.minuteRow}>
                <Text style={styles.minuteHint}>Минуты:</Text>
                {[0, 30].map((m) => (
                  <Chip
                    key={m}
                    label={`:${String(m).padStart(2, '0')}`}
                    selected={startMinute === m}
                    onPress={() => setStartMinute(m)}
                  />
                ))}
              </View>

              {/* ДЛИТЕЛЬНОСТЬ */}
              <View style={styles.durationHeader}>
                <SectionLabel text="Длительность" />
                <Text style={styles.endPreview}>{endPreviewLabel}</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
              >
                {durationPresets.map(({ label, minutes }) => (
                  <Chip
                    key={minutes}
                    label={label}
                    selected={durationMinutes === minutes}
                    onPress={() => setDurationMinutes(minutes)}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* ОШИБКА */}
          {error !== null && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* КНОПКА ПРИМЕНИТЬ */}
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
            <Text style={styles.applyBtnTxt}>Показать свободные</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

AvailabilityFilterSheet.displayName = 'AvailabilityFilterSheet';

// ─── Стили ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: 0,
  },

  // Toggle-полоса
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.raised,
    overflow: 'hidden',
  },
  barActive: {
    backgroundColor: colors.brandSubtle,
    borderColor: colors.brand,
  },
  barOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  barMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  barLabel: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.textMuted,
  },
  barLabelActive: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },
  clearBtn: {
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  clearBtnActive: {
    borderLeftColor: colors.brand,
  },

  // Раскрытая панель
  panel: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: colors.surface,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 10,
    overflow: 'hidden',
  },

  // Секции
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
  },

  // Чипы
  chip: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.raised,
  },
  chipOn: {
    backgroundColor: colors.brandSubtle,
    borderColor: colors.brand,
  },
  chipWide: {
    width: 46,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  chipTxt: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTxtOn: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },

  // Минуты
  minuteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
  },
  minuteHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
    marginRight: 2,
  },

  // Длительность хедер
  durationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 14,
  },
  endPreview: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.brand,
  },

  // Парковка
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    paddingHorizontal: 14,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.info,
    flex: 1,
  },

  // Ошибка
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 0,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: colors.errorBackground,
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.error,
    flex: 1,
  },

  // Кнопка применить
  applyBtn: {
    backgroundColor: colors.brand,
    borderRadius: 8,
    marginHorizontal: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  applyBtnTxt: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.textOnBrand,
  },
});
