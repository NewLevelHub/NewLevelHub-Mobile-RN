import { create } from 'zustand';

import { validateSession } from '@/core/auth/authApi';
import { setSessionExpiredHandler } from '@/core/network/apiClient';
import { parseApiError } from '@/core/network/errorParser';
import { EmailNotVerifiedException, InvalidCredentialsException } from '@/core/network/apiException';
import { apiClient } from '@/core/network/apiClient';
import { tokenStorage } from '@/core/auth/tokenStorage';
import { mapApiUser } from '@/shared/lib/mapUser';
import { API } from '@/shared/api/endpoints';
import type { User } from '@/shared/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  logoutLocal: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setAuthenticatedUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setAuthenticatedUser: (user) => {
    set({ user, isAuthenticated: true });
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
    set({ isLoading: true });

    try {
      const hasTokens = await tokenStorage.hasTokens();
      if (!hasTokens) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const isValid = await validateSession();
      if (!isValid) {
        await get().logoutLocal();
        return;
      }

      await get().fetchMe();
    } catch {
      await get().logoutLocal();
    } finally {
      set({ isLoading: false });
    }
  },
}));

setSessionExpiredHandler(() => {
  void useAuthStore.getState().logoutLocal();
});

export { EmailNotVerifiedException, InvalidCredentialsException };
