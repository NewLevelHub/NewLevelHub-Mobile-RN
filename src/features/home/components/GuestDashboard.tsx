import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  DashboardHeader,
  KpiRow,
  SectionHeader,
  AnnouncementCard,
} from '@/features/core/components';
import type { GuestDashboard as GuestDashboardData, AnnouncementFeedItem } from '@/features/core/types/dashboard';
import { colors } from '@/core/theme/colors';
import { USER_ROLES } from '@/shared/config/constants';

const ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.GUEST]: 'Гость',
  [USER_ROLES.RECEPTION]: 'Ресепшн',
  [USER_ROLES.SERVICE_MANAGER]: 'Сервис',
};

interface Props {
  data: GuestDashboardData;
  onBookingPress: () => void;
}

export function GuestDashboard({ data, onBookingPress }: Props) {
  const roleLabel = ROLE_LABELS[data.role] ?? data.role;

  const kpiItems = [
    { label: 'Мои брони сегодня', value: data.my_bookings_today },
  ];

  return (
    <View style={styles.root}>
      {/* Header with role badge */}
      <View style={styles.bleed}>
        <DashboardHeader user={data.user} />
        <View style={styles.roleBadgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{roleLabel}</Text>
          </View>
        </View>
      </View>

      {/* KPI: my_bookings_today */}
      <View style={styles.bleed}>
        <KpiRow items={kpiItems} />
      </View>

      {/* Quick booking widget */}
      <View style={styles.bleed}>
        <SectionHeader title="Быстрое бронирование" />
        <View style={styles.quickCard}>
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{data.quick_booking.available_desks}</Text>
              <Text style={styles.quickStatLabel}>Столов свободно</Text>
            </View>
            <View style={styles.quickDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{data.quick_booking.available_rooms}</Text>
              <Text style={styles.quickStatLabel}>Комнат свободно</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.cta} onPress={onBookingPress} activeOpacity={0.8}>
            <Text style={styles.ctaText}>Забронировать</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BC Announcements */}
      {data.bc_announcements.length > 0 && (
        <View style={styles.bleed}>
          <SectionHeader title="Объявления" />
          {data.bc_announcements.map((ann) => (
            <AnnouncementCard key={ann.id} item={ann as AnnouncementFeedItem} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 4,
  },
  bleed: {
    marginHorizontal: -24,
  },
  roleBadgeRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandSubtle,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: colors.brandText,
  },
  quickCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  quickStatValue: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  quickStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  cta: {
    backgroundColor: colors.brand,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textOnBrand,
  },
});
