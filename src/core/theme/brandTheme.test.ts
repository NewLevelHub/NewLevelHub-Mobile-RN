import { brandPaletteFromHex, defaultBrandPalette } from '@/core/theme/brandTheme';
import { colors } from '@/core/theme/colors';

describe('brandPaletteFromHex', () => {
  it('returns defaults for invalid hex', () => {
    const palette = brandPaletteFromHex('invalid');
    expect(palette.brand).toBe(colors.brand);
  });

  it('derives palette from valid hex', () => {
    const palette = brandPaletteFromHex('#059669');
    expect(palette.brand).toBe('#059669');
    expect(palette.brandHover).not.toBe(palette.brand);
    expect(palette.brandSubtle).toBeTruthy();
    expect(defaultBrandPalette.brand).toBe(colors.brand);
  });
});
