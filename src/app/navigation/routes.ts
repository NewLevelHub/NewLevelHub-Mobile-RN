export const Routes = {
  Splash: 'Splash',
  Login: 'Login',
  Register: 'Register',
  VerifyEmail: 'VerifyEmail',
  Invite: 'Invite',
  ForgotPassword: 'ForgotPassword',
  ResetPassword: 'ResetPassword',
  Home: 'Home',
  Profile: 'Profile',
} as const;

export type RootStackParamList = {
  [Routes.Splash]: undefined;
  [Routes.Login]: undefined;
  [Routes.Register]: { title?: string; subtitle?: string } | undefined;
  [Routes.VerifyEmail]: { email?: string; title?: string; subtitle?: string };
  [Routes.Invite]: { token?: string; title?: string; subtitle?: string };
  [Routes.ForgotPassword]: { title?: string; subtitle?: string } | undefined;
  [Routes.ResetPassword]: { token?: string; title?: string; subtitle?: string };
  [Routes.Home]: undefined;
  [Routes.Profile]: undefined;
};

export const authRequiredRoutes = new Set<string>([Routes.Home, Routes.Profile]);
