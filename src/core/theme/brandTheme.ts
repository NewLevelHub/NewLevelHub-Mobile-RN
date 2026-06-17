import { colors } from '@/core/theme/colors';

export interface BrandPalette {
  brand: string;
  brandHover: string;
  brandSubtle: string;
  brandText: string;
}

export const defaultBrandPalette: BrandPalette = {
  brand: colors.brand,
  brandHover: colors.brandHover,
  brandSubtle: colors.brandSubtle,
  brandText: colors.brandText,
};

function parseHex(hex: string): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return colors.brand;
  return `#${normalized}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (channel: number) =>
    Math.round(channel * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function darkenHex(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount),
  );
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }

  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = h / 360;

  function hue2rgb(p: number, q: number, t: number): number {
    let tVal = t;
    if (tVal < 0) tVal += 1;
    if (tVal > 1) tVal -= 1;
    if (tVal < 1 / 6) return p + (q - p) * 6 * tVal;
    if (tVal < 1 / 2) return q;
    if (tVal < 2 / 3) return p + (q - p) * (2 / 3 - tVal) * 6;
    return p;
  }

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return rgbToHex(r, g, b);
}

export function brandPaletteFromHex(hex: string): BrandPalette {
  const brand = parseHex(hex);
  const hsl = hexToHsl(brand);

  return {
    brand,
    brandHover: darkenHex(brand, 0.08),
    brandSubtle: hslToHex(hsl.h, 0.3, 0.95),
    brandText: darkenHex(brand, 0.08),
  };
}
