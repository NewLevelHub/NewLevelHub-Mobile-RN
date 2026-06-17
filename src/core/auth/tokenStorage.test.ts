import { TokenStorage, type KeyValueStore } from '@/core/auth/tokenStorage';

class MemoryStore implements KeyValueStore {
  private readonly data = new Map<string, string>();

  async write(key: string, value: string | null): Promise<void> {
    if (value == null) {
      this.data.delete(key);
      return;
    }
    this.data.set(key, value);
  }

  async read(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }
}

describe('TokenStorage', () => {
  it('saves and reads token pair', async () => {
    const storage = new TokenStorage(new MemoryStore());

    await storage.saveTokens('access-1', 'refresh-1');
    expect(await storage.getAccessToken()).toBe('access-1');
    expect(await storage.getRefreshToken()).toBe('refresh-1');
    expect(await storage.hasTokens()).toBe(true);
  });

  it('clears tokens', async () => {
    const storage = new TokenStorage(new MemoryStore());
    await storage.saveTokens('access-1', 'refresh-1');
    await storage.clearTokens();

    expect(await storage.hasTokens()).toBe(false);
  });
});
