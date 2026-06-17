import * as SecureStore from 'expo-secure-store';

export interface KeyValueStore {
  write(key: string, value: string | null): Promise<void>;
  read(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
}

export class SecureKeyValueStore implements KeyValueStore {
  async write(key: string, value: string | null): Promise<void> {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  }

  async read(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}

const ACCESS_KEY = 'auth.access_token';
const REFRESH_KEY = 'auth.refresh_token';

export class TokenStorage {
  constructor(private readonly store: KeyValueStore = new SecureKeyValueStore()) {}

  async saveTokens(access: string, refresh: string): Promise<void> {
    await Promise.all([
      this.store.write(ACCESS_KEY, access),
      this.store.write(REFRESH_KEY, refresh),
    ]);
  }

  async getAccessToken(): Promise<string | null> {
    return this.store.read(ACCESS_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.store.read(REFRESH_KEY);
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      this.store.delete(ACCESS_KEY),
      this.store.delete(REFRESH_KEY),
    ]);
  }

  async hasTokens(): Promise<boolean> {
    const [access, refresh] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
    ]);
    return Boolean(access && refresh);
  }
}

export const tokenStorage = new TokenStorage();
