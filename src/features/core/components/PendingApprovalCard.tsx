import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/core/theme/colors';
import type { GuestPass, PendingLeave } from '@/features/core/types/dashboard';

const LEAVE_TYPE_LABELS: Record<string, string> = {
  vacation: 'Отпуск',
  day_off: 'Отгул',
  sick_leave: 'Больничный',
  remote: 'Удалённая работа',
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(
    new Date(iso),
  );
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase() || '?';
}

// ─── Leave variant ────────────────────────────────────────────────────────────

interface LeaveProps {
  kind: 'leave';
  item: PendingLeave;
  onApprove?: () => void;
  onReject?: () => void;
  disabled?: boolean;
}

// ─── Guest pass variant ───────────────────────────────────────────────────────

interface GuestPassProps {
  kind: 'guest_pass';
  item: GuestPass;
  onApprove?: () => void;
  onReject?: () => void;
  disabled?: boolean;
}

type Props = LeaveProps | GuestPassProps;

function PendingApprovalCardComponent(props: Props) {
  const { kind, onApprove, onReject, disabled } = props;

  if (kind === 'leave') {
    const { item } = props;
    const leaveLabel = LEAVE_TYPE_LABELS[item.leave_type] ?? item.leave_type;
    const initials = getInitials(item.employee.full_name);
    const dateRange = `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`;

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {item.employee.full_name}
            </Text>
            <Text style={styles.sub}>{leaveLabel}</Text>
            <Text style={styles.date}>{dateRange}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: colors.warningBackground }]}>
            <Text style={[styles.chipText, { color: colors.warning }]}>Отпуск</Text>
          </View>
        </View>
        <Actions onApprove={onApprove} onReject={onReject} disabled={disabled} />
      </View>
    );
  }

  const { item } = props;
  const visitDate = formatDate(item.visit_date);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.avatar, styles.avatarGuest]}>
          <Text style={[styles.avatarText, styles.avatarGuestText]}>
            {item.guest_name.slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.guest_name}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {item.guest_email}
          </Text>
          <Text style={styles.date}>
            Визит {visitDate} · Хост: {item.host.full_name}
          </Text>
        </View>
        <View style={[styles.chip, { backgroundColor: colors.brandSubtle }]}>
          <Text style={[styles.chipText, { color: colors.brandText }]}>Пропуск</Text>
        </View>
      </View>
      <Actions onApprove={onApprove} onReject={onReject} disabled={disabled} />
    </View>
  );
}

function Actions({
  onApprove,
  onReject,
  disabled,
}: {
  onApprove?: () => void;
  onReject?: () => void;
  disabled?: boolean;
}) {
  if (!onApprove && !onReject) return null;
  return (
    <View style={[styles.actions, disabled && styles.actionsDisabled]}>
      {onReject && (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.rejectBtn, pressed && !disabled && styles.pressed]}
          onPress={onReject}
        >
          <Text style={styles.rejectText}>Отклонить</Text>
        </Pressable>
      )}
      {onApprove && (
        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.approveBtn, pressed && !disabled && styles.pressed]}
          onPress={onApprove}
        >
          <Text style={styles.approveText}>Одобрить</Text>
        </Pressable>
      )}
    </View>
  );
}

export const PendingApprovalCard = React.memo(PendingApprovalCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarGuest: {
    backgroundColor: colors.raised,
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.brandText,
  },
  avatarGuestText: {
    color: colors.textSecondary,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionsDisabled: {
    opacity: 0.45,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: colors.errorBackground,
  },
  approveBtn: {
    backgroundColor: colors.brandSubtle,
  },
  rejectText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.error,
  },
  approveText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.brandText,
  },
  pressed: {
    opacity: 0.7,
  },
});
