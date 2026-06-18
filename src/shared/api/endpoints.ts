export const API = {
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    registerInvite: '/auth/register/invite/',
    logout: '/auth/logout/',
    me: '/auth/me/',
    refreshToken: '/auth/token/refresh/',
    forgotPassword: '/auth/password/reset/',
    resetPassword: '/auth/password/reset/confirm/',
    changePassword: '/auth/me/password/',
    updateMe: '/auth/me/update/',
    deleteAvatar: '/auth/me/avatar/',
    verifyEmail: '/auth/email/verify/',
    resendVerification: '/auth/email/resend/',
    roles: '/auth/roles/',
  },
  admin: {
    users: '/auth/users/',
    userDetail: (id: number) => `/auth/users/${id}/`,
    userBlock: (id: number) => `/auth/users/${id}/block/`,
    userUnblock: (id: number) => `/auth/users/${id}/unblock/`,
  },
  activity: {
    feed: '/auth/me/activity/',
  },
  core: {
    ping: '/ping/',
    health: '/health/',
  },
} as const;
