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
import {
  DashboardHeader,
  KpiRow,
  SectionHeader,
  AnnouncementCard,
  BookingCard,
  TaskCard,
  PendingApprovalCard,
  FloorLoadBar,
  QuickActionRow,
} from '@/features/core/components';

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

        {/* ── Dashboard UI-kit ───────────────────────────────────────── */}

        <Section title="DashboardHeader">
          <DashboardHeader
            user={{ id: 1, full_name: 'Иван Петров', avatar: null }}
            unreadCount={5}
          />
          <DashboardHeader
            user={{ id: 2, full_name: 'А', avatar: null }}
            unreadCount={0}
          />
        </Section>

        <Section title="KpiRow">
          <KpiRow
            items={[
              { label: 'Брони сегодня', value: 12 },
              { label: 'Сотрудников', value: 47, accent: colors.brand },
              { label: 'Нагрузка', value: 74, suffix: '%' },
              { label: 'Компании', value: 8 },
            ]}
          />
        </Section>

        <Section title="SectionHeader">
          <SectionHeader title="Мои задачи" onSeeAll={() => {}} />
          <SectionHeader title="Ближайшие брони" />
        </Section>

        <Section title="AnnouncementCard">
          <AnnouncementCard
            item={{
              id: 1,
              title: 'Техническое обслуживание 20 июня',
              body: 'В пятницу с 22:00 до 02:00 будет проводиться плановое техническое обслуживание серверов. Возможны кратковременные перебои в работе.',
              category: 'maintenance',
              scope: 'all',
              created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
            }}
          />
          <AnnouncementCard
            item={{
              id: 2,
              title: 'Новые переговорные комнаты открыты',
              body: 'На 3-м этаже открылись 4 новые переговорные комнаты с современным оборудованием.',
              category: 'news',
              scope: 'all',
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            }}
          />
        </Section>

        <Section title="BookingCard">
          <BookingCard
            item={{
              id: 1,
              resource_name: 'Переговорная A',
              user_name: 'Иван Петров',
              company_name: 'Acme Corp',
              start_time: new Date(Date.now() + 3600000).toISOString(),
              end_time: new Date(Date.now() + 7200000).toISOString(),
              status: 'confirmed',
            }}
          />
          <BookingCard
            item={{
              id: 2,
              resource_name: 'Рабочее место 12',
              user_name: 'Анна Сидорова',
              start_time: new Date(Date.now() - 7200000).toISOString(),
              end_time: new Date(Date.now() - 3600000).toISOString(),
              status: 'cancelled',
            }}
          />
          <BookingCard
            item={{
              id: 3,
              resource_name: 'Конференц-зал B',
              user_name: 'Михаил Козлов',
              company_name: 'TechStart',
              start_time: new Date(Date.now() + 86400000).toISOString(),
              end_time: new Date(Date.now() + 90000000).toISOString(),
              status: 'pending',
            }}
          />
        </Section>

        <Section title="TaskCard">
          <TaskCard
            item={{
              id: 1,
              title: 'Подготовить отчёт за квартал',
              board_name: 'Маркетинг',
              due_date: new Date(Date.now() + 2 * 86400000).toISOString(),
              priority: 'high',
              is_overdue: false,
            }}
          />
          <TaskCard
            item={{
              id: 2,
              title: 'Обновить базу клиентов',
              board_name: 'CRM',
              due_date: new Date(Date.now() - 86400000).toISOString(),
              priority: 'medium',
              is_overdue: true,
            }}
          />
          <TaskCard
            item={{
              id: 3,
              title: 'Заказать канцелярию',
              board_name: 'Офис',
              due_date: null,
              priority: 'low',
              is_overdue: false,
            }}
          />
        </Section>

        <Section title="PendingApprovalCard — leave">
          <PendingApprovalCard
            kind="leave"
            item={{
              id: 1,
              employee: { id: 10, full_name: 'Алина Новикова', avatar: null },
              leave_type: 'vacation',
              start_date: '2025-07-01',
              end_date: '2025-07-14',
              created_at: new Date().toISOString(),
            }}
            onApprove={() => {}}
            onReject={() => {}}
          />
          <PendingApprovalCard
            kind="leave"
            item={{
              id: 2,
              employee: { id: 11, full_name: 'Дмитрий Орлов', avatar: null },
              leave_type: 'sick_leave',
              start_date: '2025-06-18',
              end_date: '2025-06-20',
              created_at: new Date().toISOString(),
            }}
          />
        </Section>

        <Section title="PendingApprovalCard — guest_pass">
          <PendingApprovalCard
            kind="guest_pass"
            item={{
              id: 10,
              guest_name: 'Сергей Клиент',
              guest_email: 'sergey@client.com',
              host: { id: 5, full_name: 'Мария Менеджер', avatar: null },
              visit_date: '2025-06-20',
              valid_from: '2025-06-20T09:00:00Z',
              valid_until: '2025-06-20T18:00:00Z',
              created_at: new Date().toISOString(),
            }}
            onApprove={() => {}}
            onReject={() => {}}
          />
        </Section>

        <Section title="FloorLoadBar">
          <FloorLoadBar
            item={{ floor_id: 1, floor_number: 1, floor_name: 'Первый этаж', total: 40, occupied: 12, occupancy_pct: 30 }}
          />
          <FloorLoadBar
            item={{ floor_id: 2, floor_number: 2, floor_name: 'Второй этаж', total: 40, occupied: 26, occupancy_pct: 65 }}
          />
          <FloorLoadBar
            item={{ floor_id: 3, floor_number: 3, floor_name: 'Третий этаж', total: 30, occupied: 28, occupancy_pct: 93 }}
          />
        </Section>

        <Section title="QuickActionRow">
          <QuickActionRow
            actions={['invite_user', 'create_announcement', 'manage_bookings', 'view_analytics', 'manage_companies']}
            onPress={(action) => { void action; }}
          />
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
