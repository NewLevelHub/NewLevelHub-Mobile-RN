import { isPublicPath, normalizePath } from '@/core/network/apiClient';

describe('auth path helpers', () => {
  it('normalizes paths with trailing slash', () => {
    expect(normalizePath('auth/login')).toBe('/auth/login/');
    expect(normalizePath('/auth/login/')).toBe('/auth/login/');
  });

  it('detects public paths', () => {
    expect(isPublicPath('/auth/login/')).toBe(true);
    expect(isPublicPath('auth/token/refresh')).toBe(true);
    expect(isPublicPath('/auth/me/')).toBe(false);
  });
});
