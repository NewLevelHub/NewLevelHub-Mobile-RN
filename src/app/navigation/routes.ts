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
} as const;

export type RootStackParamList = {
  [Routes.Splash]: undefined;
  [Routes.Login]: undefined;
  [Routes.Register]: { title?: string; subtitle?: string } | undefined;
  [Routes.VerifyEmail]: { email?: string; title?: string; subtitle?: string };
  [Routes.EmailVerifyDeepLink]: { token?: string };
  [Routes.Invite]: { token?: string; title?: string; subtitle?: string };
  [Routes.ForgotPassword]: { title?: string; subtitle?: string } | undefined;
  [Routes.ResetPassword]: { token?: string; title?: string; subtitle?: string };
  [Routes.Home]: undefined;
  [Routes.Profile]: undefined;
  [Routes.ProfileEdit]: undefined;
  [Routes.ChangePassword]: undefined;
  [Routes.UiKit]: undefined;
  [Routes.AdminUsers]: undefined;
  [Routes.AdminUserDetail]: { userId: number };
};

export const authRequiredRoutes = new Set<string>([Routes.Home, Routes.Profile, Routes.ProfileEdit, Routes.ChangePassword, Routes.AdminUsers, Routes.AdminUserDetail]);
