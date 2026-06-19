import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { RESOURCE_STATUS_LABELS } from '@/shared/lib/labels';
import type { ResourceStatus } from '@/features/bookings/types/resource';

interface Props {
  status: ResourceStatus | null;
  reason?: string | null;
  availableAt?: string | null;
}

const STATUS_PALETTE: Record<ResourceStatus, { bg: string; text: string }> = {
  free: { bg: colors.successBackground, text: colors.success },
  occupied: { bg: colors.errorBackground, text: colors.error },
  soon_available: { bg: colors.warningBackground, text: colors.warning },
  blocked: { bg: colors.raised, text: colors.textMuted },
};

function extractTime(iso: string): string {
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : '';
}

export const ResourceStatusBadge = React.memo<Props>(({ status, availableAt }) => {
  if (status == null) return null;
  const palette = STATUS_PALETTE[status] ?? STATUS_PALETTE.blocked;
  const label = RESOURCE_STATUS_LABELS[status] ?? status;
  const suffix =
    status === 'soon_available' && availableAt ? ` с ${extractTime(availableAt)}` : '';

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.text }]}>
        {label}
        {suffix}
      </Text>
    </View>
  );
});

ResourceStatusBadge.displayName = 'ResourceStatusBadge';

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
});
