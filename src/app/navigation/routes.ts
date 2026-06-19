import type { NavigatorScreenParams } from '@react-navigation/native';

export const Routes = {
  Splash: 'Splash',
  Login: 'Login',
  Register: 'Register',
  VerifyEmail: 'VerifyEmail',
  EmailVerifyDeepLink: 'EmailVerifyDeepLink',
  Invite: 'Invite',
  ForgotPassword: 'ForgotPassword',
  ResetPassword: 'ResetPassword',
  Home: 'Home',
  Profile: 'Profile',
  ProfileEdit: 'ProfileEdit',
  ChangePassword: 'ChangePassword',
  UiKit: 'UiKit',
  AdminUsers: 'AdminUsers',
  AdminUserDetail: 'AdminUserDetail',
  Bookings: 'Bookings',
  ResourceCatalog: 'ResourceCatalog',
  ResourceDetail: 'ResourceDetail',
  Crm: 'Crm',
  Notifications: 'Notifications',
  TeamCalendar: 'TeamCalendar',
  MainTabs: 'MainTabs',
} as const;

// ─── Nested stack param lists ─────────────────────────────────────────────────

export type HomeStackParamList = {
  [Routes.Home]: undefined;
  [Routes.TeamCalendar]: undefined;
  [Routes.AdminUsers]: undefined;
  [Routes.AdminUserDetail]: { userId: number };
  [Routes.Notifications]: undefined;
  [Routes.UiKit]: undefined;
};

export type ProfileStackParamList = {
  [Routes.Profile]: undefined;
  [Routes.ProfileEdit]: undefined;
  [Routes.ChangePassword]: undefined;
};

export type BookingsStackParamList = {
  [Routes.ResourceCatalog]: undefined;
  [Routes.ResourceDetail]: { resourceId: number };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList>;
  CrmTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root stack ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  [Routes.Splash]: undefined;
  [Routes.Login]: undefined;
  [Routes.Register]: { title?: string; subtitle?: string } | undefined;
  [Routes.VerifyEmail]: { email?: string; title?: string; subtitle?: string };
  [Routes.EmailVerifyDeepLink]: { token?: string };
  [Routes.Invite]: { token?: string; title?: string; subtitle?: string };
  [Routes.ForgotPassword]: { title?: string; subtitle?: string } | undefined;
  [Routes.ResetPassword]: { token?: string; title?: string; subtitle?: string };
  [Routes.MainTabs]: NavigatorScreenParams<MainTabParamList> | undefined;
};

export const authRequiredRoutes = new Set<string>([
  Routes.MainTabs,
]);
