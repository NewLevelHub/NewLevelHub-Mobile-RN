import { apiConfig, resolveMediaUrl } from '@/core/config/apiConfig';

describe('resolveMediaUrl', () => {
  it('returns empty string for null', () => {
    expect(resolveMediaUrl(null)).toBe('');
  });

  it('prefixes relative path with mediaOrigin', () => {
    expect(resolveMediaUrl('/media/x.jpg')).toBe(`${apiConfig.mediaOrigin}/media/x.jpg`);
  });

  it('returns absolute URL unchanged', () => {
    const url = 'https://cdn.example.com/media/x.jpg';
    expect(resolveMediaUrl(url)).toBe(url);
  });
});
