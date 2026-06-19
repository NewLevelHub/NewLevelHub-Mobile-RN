import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Routes } from '@/app/navigation/routes';
import type { MainTabParamList } from '@/app/navigation/routes';
import { HomeStack } from '@/app/navigation/HomeStack';
import { ProfileStack } from '@/app/navigation/ProfileStack';
import { BookingsScreen } from '@/features/bookings/screens/BookingsScreen';
import { CrmScreen } from '@/features/crm/screens/CrmScreen';
import { useAuthStore } from '@/core/auth/authStore';
import { USER_ROLES } from '@/shared/config/constants';
import { colors } from '@/core/theme/colors';
import { useDashboard } from '@/features/core/hooks/useDashboard';
import type { EmployeeDashboard } from '@/features/core/types/dashboard';

const Tab = createBottomTabNavigator<MainTabParamList>();

function useHomeBadge(): number | undefined {
  const { data } = useDashboard();
  if (data?.role === 'employee') {
    const count = (data as EmployeeDashboard).unread_notifications_count;
    return count > 0 ? count : undefined;
  }
  return undefined;
}

export function MainTabNavigator() {
  const user = useAuthStore((state) => state.user);
  const badge = useHomeBadge();

  const hideCrm =
    user?.role === USER_ROLES.GUEST ||
    user?.role === USER_ROLES.RECEPTION ||
    user?.role === USER_ROLES.SERVICE_MANAGER;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Главная',
          tabBarBadge: badge,
          tabBarBadgeStyle: { backgroundColor: colors.brand },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{
          title: 'Бронирования',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />
      {!hideCrm && (
        <Tab.Screen
          name="CrmTab"
          component={CrmScreen}
          options={{
            title: 'Задачи',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkmark-circle-outline" color={color} size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
