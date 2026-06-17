import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { useAuthStore } from '@/core/auth/authStore';
import { apiClient } from '@/core/network/apiClient';
import { colors } from '@/core/theme/colors';
import { API } from '@/shared/api/endpoints';
import { AppButton } from '@/shared/ui/AppButton';
import { AppLoader } from '@/shared/ui/AppLoader';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.Home>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [pingStatus, setPingStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [pingMessage, setPingMessage] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      setPingStatus('loading');
      try {
        const [ping, health] = await Promise.all([
          apiClient.get(API.core.ping),
          apiClient.get(API.core.health),
        ]);
        if (cancelled) return;
        setPingStatus('ok');
        setPingMessage(`API OK · ping ${ping.status} · health ${health.status}`);
      } catch {
        if (cancelled) return;
        setPingStatus('error');
        setPingMessage('Не удалось проверить API');
      }
    };

    void probe();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать{user ? `, ${user.full_name}` : ''}</Text>
      <Text style={styles.subtitle}>Главный экран в разработке</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Проверка API</Text>
        {pingStatus === 'loading' ? <AppLoader size="small" /> : null}
        {pingMessage ? <Text style={styles.cardText}>{pingMessage}</Text> : null}
      </View>

      <AppButton onPress={() => navigation.navigate(Routes.Profile)} title="Профиль" variant="secondary" />
      <AppButton onPress={() => void logout()} title="Выйти" variant="text" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
