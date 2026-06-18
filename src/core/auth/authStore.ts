import { create } from 'zustand';

import { setSessionExpiredHandler } from '@/core/network/apiClient';
import { parseApiError } from '@/core/network/errorParser';
import { ApiException, EmailNotVerifiedException, InvalidCredentialsException } from '@/core/network/apiException';
import { apiClient } from '@/core/network/apiClient';
import { tokenStorage } from '@/core/auth/tokenStorage';
import { runConnectivityPreFlight } from '@/core/bootstrap/appBootstrap';
import { mapApiUser } from '@/shared/lib/mapUser';
import { API } from '@/shared/api/endpoints';
import type { User } from '@/shared/types';

export type BootstrapStatus = 'idle' | 'checking' | 'ok' | 'health_unavailable' | 'ping_failed';

interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  password_confirm: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  bootstrapStatus: BootstrapStatus;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  logoutLocal: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setAuthenticatedUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  bootstrapStatus: 'idle',

  setAuthenticatedUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  register: async (payload) => {
    try {
      const { data } = await apiClient.post(API.auth.register, payload);
      const tokens = data.tokens as { access: string; refresh: string };
      await tokenStorage.saveTokens(tokens.access, tokens.refresh);
      return mapApiUser(data.user as Record<string, unknown>);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  login: async (email, password, rememberMe = false) => {
    try {
      const { data } = await apiClient.post(API.auth.login, {
        email,
        password,
        remember_me: rememberMe,
      });

      const tokens = data.tokens as { access: string; refresh: string };
      await tokenStorage.saveTokens(tokens.access, tokens.refresh);
      set({
        user: mapApiUser(data.user as Record<string, unknown>),
        isAuthenticated: true,
      });
    } catch (error) {
      const parsed = parseApiError(error);
      if (parsed.statusCode === 400) throw new InvalidCredentialsException();
      throw parsed;
    }
  },

  logout: async () => {
    const refresh = await tokenStorage.getRefreshToken();
    try {
      if (refresh) {
        await apiClient.post(API.auth.logout, { refresh });
      }
    } finally {
      await get().logoutLocal();
    }
  },

  logoutLocal: async () => {
    await tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    const { data } = await apiClient.get(API.auth.me);
    set({
      user: mapApiUser(data as Record<string, unknown>),
      isAuthenticated: true,
    });
  },

  bootstrap: async () => {
    set({ isLoading: true, bootstrapStatus: 'checking' });

    // --- Pre-flight connectivity check ---
    const connectivityStatus = await runConnectivityPreFlight();
    if (connectivityStatus !== 'ok') {
      set({ isLoading: false, bootstrapStatus: connectivityStatus });
      return;
    }

    // --- Connectivity confirmed — proceed with auth ---
    try {
      const hasTokens = await tokenStorage.hasTokens();
      if (!hasTokens) {
        set({ user: null, isAuthenticated: false, bootstrapStatus: 'ok' });
        return;
      }

      // Single GET /auth/me/ — if access token is expired the auth interceptor
      // refreshes it and retries automatically. If refresh also fails,
      // handleSessionExpired fires logoutLocal via setSessionExpiredHandler.
      await get().fetchMe();
      set({ bootstrapStatus: 'ok' });
    } catch (error) {
      const apiError = error instanceof ApiException ? error : parseApiError(error);
      if (apiError.statusCode === 401 || apiError.statusCode === 403) {
        // Tokens are definitively rejected by the server — clear them.
        await get().logoutLocal();
      }
      // Network error / 5xx: tokens may still be valid, keep isAuthenticated
      // as false (initial state) so the user sees the login screen but tokens
      // are preserved for the next attempt.
      set({ bootstrapStatus: 'ok' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

setSessionExpiredHandler(() => {
  void useAuthStore.getState().logoutLocal();
});

export { EmailNotVerifiedException, InvalidCredentialsException };
