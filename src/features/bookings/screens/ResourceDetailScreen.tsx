import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { colors } from '@/core/theme/colors';
import { Routes } from '@/app/navigation/routes';
import type { BookingsStackParamList } from '@/app/navigation/routes';
import { AppButton } from '@/shared/ui/AppButton';
import { AppLoader } from '@/shared/ui/AppLoader';
import { AppErrorView } from '@/shared/ui/AppErrorView';
import { RESOURCE_TYPE_LABELS } from '@/shared/lib/labels';
import { useResourceDetail } from '@/features/bookings/hooks/useResourceDetail';
import { ResourceStatusBadge } from '@/features/bookings/components/ResourceStatusBadge';
import { EquipmentChips } from '@/features/bookings/components/EquipmentChips';
import { ResourcePhotoGallery } from '@/features/bookings/components/ResourcePhotoGallery';
import { ResourceSchedulePreview } from '@/features/bookings/components/ResourceSchedulePreview';

type Nav = NativeStackNavigationProp<BookingsStackParamList>;
type RouteT = RouteProp<BookingsStackParamList, typeof Routes.ResourceDetail>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function MetaPill({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={13} color={colors.textSecondary} />
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ResourceDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteT>();
  const { resourceId } = route.params;

  const { resource, isLoading, isError, refetch } = useResourceDetail(resourceId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AppLoader fullscreen />
      </SafeAreaView>
    );
  }

  if (isError || !resource) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <AppErrorView
          icon="🔍"
          title="Ресурс не найден"
          message="Не удалось загрузить данные о ресурсе. Попробуйте снова."
          onRetry={refetch}
        />
        <AppButton
          title="Назад"
          variant="text"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </SafeAreaView>
    );
  }

  const hasEquipment =
    resource.equipment != null &&
    Object.values(resource.equipment).some((v) => v === true);

  const showEquipment = resource.type === 'meeting_room' || hasEquipment;

  const locationLabel = [
    resource.floor_name ?? `Этаж ${resource.floor_number}`,
    resource.zone,
  ]
    .filter(Boolean)
    .join(' · ');

  const hasPhotos = resource.photos.length > 0 || !!resource.photoUrl;

  const handleBook = () => {
    // TODO: MOB-407 — navigate to CreateReservation when that route exists
    console.warn('[ResourceDetailScreen] CreateReservation route not yet registered');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Hero gallery ─────────────────────────────────────────────── */}
        {hasPhotos && (
          <ResourcePhotoGallery
            photos={resource.photos}
            photoUrl={resource.photoUrl}
          />
        )}

        {/* ── 2. Name + type ──────────────────────────────────────────────── */}
        <View style={[styles.section, !hasPhotos && styles.sectionTop]}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {RESOURCE_TYPE_LABELS[resource.type] ?? resource.type}
            </Text>
          </View>
          <Text style={styles.resourceName}>{resource.name}</Text>

          <View style={styles.pillsRow}>
            {!!locationLabel && (
              <MetaPill icon="location-outline" label={locationLabel} />
            )}
            {resource.capacity != null && (
              <MetaPill icon="people-outline" label={`${resource.capacity} чел.`} />
            )}
            {resource.isHotDesk && (
              <MetaPill icon="shuffle-outline" label="Hot desk" />
            )}
          </View>
        </View>

        {/* ── 3. Status (only available from list endpoint, may be null on detail) ── */}
        {resource.status != null && (
          <>
            <Divider />
            <View style={styles.section}>
              <SectionTitle title="Статус" />
              <ResourceStatusBadge
                status={resource.status}
                reason={resource.reason}
                availableAt={resource.availableAt}
              />
              {resource.status === 'blocked' && resource.reason ? (
                <View style={styles.reasonBox}>
                  <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
                  <Text style={styles.reasonText}>{resource.reason}</Text>
                </View>
              ) : null}
            </View>
          </>
        )}

        {/* ── 4. Equipment ────────────────────────────────────────────────── */}
        {showEquipment && resource.equipment && hasEquipment && (
          <>
            <Divider />
            <View style={styles.section}>
              <SectionTitle title="Оборудование" />
              <EquipmentChips equipment={resource.equipment} />
            </View>
          </>
        )}

        {/* ── 5. Assigned company ─────────────────────────────────────────── */}
        {!!resource.assignedCompanyName && (
          <>
            <Divider />
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={16} color={colors.textMuted} />
                <Text style={styles.infoLabel}>Компания</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {resource.assignedCompanyName}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* ── 6. Schedule ─────────────────────────────────────────────────── */}
        <Divider />
        <View style={styles.section}>
          <SectionTitle title="Расписание на сегодня" />
          <ResourceSchedulePreview schedule={resource.schedule ?? []} />
        </View>

        <View style={styles.ctaPlaceholder} />
      </ScrollView>

      {/* ── Sticky CTA ────────────────────────────────────────────────────── */}
      <View style={styles.ctaContainer}>
        <AppButton
          title={resource.status === 'blocked' ? 'Ресурс заблокирован' : 'Забронировать'}
          variant="primary"
          disabled={resource.status === 'blocked' || false}
          onPress={handleBook}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 8,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.page,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 8,
  },
  // ─── Sections ──────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: colors.surface,
  },
  sectionTop: {
    paddingTop: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  // ─── Name / type ───────────────────────────────────────────────────────────
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.raised,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  resourceName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.textPrimary,
    lineHeight: 30,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.raised,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  // ─── Section title ─────────────────────────────────────────────────────────
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ─── Blocked reason ────────────────────────────────────────────────────────
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.raised,
    borderRadius: 8,
    padding: 12,
  },
  reasonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 18,
  },
  // ─── Info row ──────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  // ─── Sticky CTA ────────────────────────────────────────────────────────────
  ctaPlaceholder: {
    height: 16,
    backgroundColor: colors.surface,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
