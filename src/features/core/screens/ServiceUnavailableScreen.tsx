import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore, type BootstrapStatus } from '@/core/auth/authStore';
import { colors } from '@/core/theme/colors';
import { AppErrorView } from '@/shared/ui/AppErrorView';

type ServiceUnavailableType = Extract<BootstrapStatus, 'health_unavailable' | 'ping_failed'>;

interface ServiceUnavailableScreenProps {
  type: ServiceUnavailableType;
}

const CONFIG: Record<ServiceUnavailableType, { icon: string; title: string; message: string }> = {
  health_unavailable: {
    icon: '⚠️',
    title: 'Сервис недоступен',
    message: 'На серверной стороне ведутся работы.\nПожалуйста, попробуйте позже.',
  },
  ping_failed: {
    icon: '📡',
    title: 'Нет подключения',
    message: 'Проверьте интернет-соединение\nи попробуйте снова.',
  },
};

export function ServiceUnavailableScreen({ type }: ServiceUnavailableScreenProps) {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const config = CONFIG[type];

  return (
    <SafeAreaView style={styles.container}>
      <AppErrorView
        icon={config.icon}
        title={config.title}
        message={config.message}
        onRetry={() => void bootstrap()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.page,
  },
});
