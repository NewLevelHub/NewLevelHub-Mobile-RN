import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/core/theme/colors';

interface Props {
  fullName: string;
  unreadCount: number;
  onNotificationPress: () => void;
}

export const DashboardHeader = React.memo(function DashboardHeader({
  fullName,
  unreadCount,
  onNotificationPress,
}: Props) {
  const firstName = fullName.split(' ')[0] ?? fullName;
  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.greeting}>Привет, {firstName}!</Text>
        <Text style={styles.subtitle}>Что запланировано на сегодня?</Text>
      </View>
      <TouchableOpacity style={styles.notifBtn} onPress={onNotificationPress} activeOpacity={0.7}>
        <View style={[styles.notifCircle, unreadCount > 0 && styles.notifCircleActive]}>
          <Text style={[styles.notifText, unreadCount > 0 && styles.notifTextActive]}>
            {unreadCount > 0 ? (unreadCount > 99 ? '99+' : String(unreadCount)) : '—'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
  },
  notifBtn: {
    padding: 4,
  },
  notifCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifCircleActive: {
    backgroundColor: colors.errorBackground,
    borderColor: colors.error,
  },
  notifText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
  },
  notifTextActive: {
    color: colors.error,
  },
});
