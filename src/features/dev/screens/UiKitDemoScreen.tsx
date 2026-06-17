import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/core/theme/colors';
import { AppButton } from '@/shared/ui/AppButton';
import { AppEmptyView } from '@/shared/ui/AppEmptyView';
import { AppErrorBanner } from '@/shared/ui/AppErrorBanner';
import { AppErrorView } from '@/shared/ui/AppErrorView';
import { AppLoader } from '@/shared/ui/AppLoader';
import { AppTextField } from '@/shared/ui/AppTextField';

export function UiKitDemoScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  function simulateLoad() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="AppButton">
          <AppButton onPress={() => {}} title="Primary" variant="primary" />
          <AppButton onPress={() => {}} title="Secondary" variant="secondary" />
          <AppButton onPress={() => {}} title="Text button" variant="text" />
          <AppButton loading onPress={() => {}} title="Loading..." variant="primary" />
          <AppButton disabled onPress={() => {}} title="Disabled" variant="primary" />
          <AppButton loading={loading} onPress={simulateLoad} title="Симулировать загрузку" variant="secondary" />
        </Section>

        <Section title="AppTextField">
          <AppTextField
            label="Обычное поле"
            onChangeText={setText}
            placeholder="Введите текст"
            value={text}
          />
          <AppTextField
            errorText="Обязательное поле"
            label="Поле с ошибкой"
            onChangeText={() => {}}
            placeholder="Введите email"
            value=""
          />
          <AppTextField
            label="Пароль"
            onChangeText={() => {}}
            placeholder="Введите пароль"
            secureTextEntry
            secureToggle
            value=""
          />
        </Section>

        <Section title="AppLoader">
          <Text style={styles.hint}>Inline (small)</Text>
          <AppLoader size="small" />
          <Text style={styles.hint}>Inline (large)</Text>
          <AppLoader size="large" />
          <Text style={styles.hint}>Fullscreen — используется как AppLoader fullscreen</Text>
          <View style={styles.fullscreenPreview}>
            <AppLoader fullscreen />
          </View>
        </Section>

        <Section title="AppErrorBanner">
          <AppErrorBanner message="Неверный логин или пароль" />
          <AppErrorBanner message="Сервер временно недоступен. Попробуйте позже." />
        </Section>

        <Section title="AppErrorView">
          <AppErrorView message="Не удалось загрузить данные" onRetry={() => {}} />
          <AppErrorView message="Нет подключения к интернету" />
        </Section>

        <Section title="AppEmptyView">
          <AppEmptyView message="Список пуст" hint="Здесь появятся ваши данные" />
          <AppEmptyView message="Ничего не найдено" />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    padding: 20,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  sectionContent: {
    gap: 12,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
  },
  fullscreenPreview: {
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
