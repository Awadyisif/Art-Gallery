import type { Artwork, LightingPreset } from '../types/art.ts';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorHarmony {
  nameAr: string;
  nameEn: string;
  colors: string[];
}

export interface StagingRecommendation {
  wallRecommendationAr: string;
  wallHex: string;
  frameStyleRecommendation: string;
  frameReasonAr: string;
  recommendedKelvin: number;
  luxTarget: number;
  curatorInsightAr: string;
  bestViewingDistanceMeters: number;
}

/**
 * Converts a hex string to RGB object
 */
export function hexToRgb(hex: string): RGB {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    return { r: 128, g: 128, b: 128 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Converts RGB object to hex string
 */
export function rgbToHex(rgb: RGB): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const r = clamp(rgb.r).toString(16).padStart(2, '0');
  const g = clamp(rgb.g).toString(16).padStart(2, '0');
  const b = clamp(rgb.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * Calculates relative luminance according to WCAG 2.1
 */
export function getRelativeLuminance(rgb: RGB): number {
  const srgb = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Calculates WCAG contrast ratio between two hex colors
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(hex1));
  const lum2 = getRelativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

/**
 * Approximates light color in RGB from Kelvin color temperature (1000K - 12000K)
 * Based on Tanner Helland's algorithm
 */
export function kelvinToRgb(kelvin: number): RGB {
  const temp = Math.max(1000, Math.min(12000, kelvin)) / 100;
  let red = 0;
  let green = 0;
  let blue = 0;

  // Calculate Red
  if (temp <= 66) {
    red = 255;
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    red = Math.max(0, Math.min(255, red));
  }

  // Calculate Green
  if (temp <= 66) {
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    green = Math.max(0, Math.min(255, green));
  } else {
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    green = Math.max(0, Math.min(255, green));
  }

  // Calculate Blue
  if (temp >= 66) {
    blue = 255;
  } else if (temp <= 19) {
    blue = 0;
  } else {
    blue = temp - 10;
    blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    blue = Math.max(0, Math.min(255, blue));
  }

  return {
    r: Math.round(red),
    g: Math.round(green),
    b: Math.round(blue)
  };
}

/**
 * Translates a lighting preset into Kelvin, base intensity, and ambient color
 */
export function getLightingPresetSpecs(preset: LightingPreset): { kelvin: number; intensity: number; ambientRatio: number } {
  switch (preset) {
    case 'museum-spot':
      return { kelvin: 3000, intensity: 1.4, ambientRatio: 0.35 };
    case 'daylight':
      return { kelvin: 5200, intensity: 1.1, ambientRatio: 0.6 };
    case 'golden-hour':
      return { kelvin: 2400, intensity: 1.5, ambientRatio: 0.45 };
    case 'dramatic-ambient':
      return { kelvin: 2800, intensity: 0.8, ambientRatio: 0.2 };
    case 'cyber-modern':
      return { kelvin: 7500, intensity: 1.3, ambientRatio: 0.4 };
    default:
      return { kelvin: 3000, intensity: 1.2, ambientRatio: 0.4 };
  }
}

/**
 * Generates curatorial staging recommendations for an artwork
 */
export function getStagingRecommendation(artwork: Artwork): StagingRecommendation {
  const primaryColor = artwork.palette[0] || '#1e293b';
  const lum = getRelativeLuminance(hexToRgb(primaryColor));
  
  // Decide best wall backdrop
  let wallRecommendationAr = 'جدار أبيض نقي مطفي (Museum Gallery White)';
  let wallHex = '#f5f5f4';
  let frameStyleRecommendation = 'minimal-black';
  let frameReasonAr = 'إطار معدني أسود بسيط لتحديد حواف العمل وإبراز التباين';

  if (lum > 0.4) {
    // Bright painting -> deep or rich wall
    wallRecommendationAr = 'جدار كحلي داكن أو رمادي فحمي مخملي لتعزيز تباين الألوان الفاتحة';
    wallHex = '#1c1917';
    frameStyleRecommendation = 'ornate-gold';
    frameReasonAr = 'إطار ذهبي مزخرف أو خشب داكن لمنح العمل ثقلاً وأبهة كلاسيكية';
  } else if (artwork.generatorStyle === 'starry' || artwork.generatorStyle === 'abstract') {
    wallRecommendationAr = 'جدار خرساني معاصر (Raw Architectural Concrete)';
    wallHex = '#78716c';
    frameStyleRecommendation = 'floating-canvas';
    frameReasonAr = 'كانفاس عائم بدون إطار تقليدي ليمنح المشهد حركة حرة لا متناهية';
  } else if (artwork.generatorStyle === 'kiss' || artwork.generatorStyle === 'islamic') {
    wallRecommendationAr = 'جدار خشب الجوز الفاخر (Warm Dark Walnut)';
    wallHex = '#292524';
    frameStyleRecommendation = 'ornate-gold';
    frameReasonAr = 'إطار ذهبي كلاسيكي يعكس بريق الزخارف والرقائق الذهبية في اللوحة';
  }

  const luxTarget = lum < 0.2 ? 250 : 180; // Museum conservation standard for oils/watercolors
  const bestDistance = Number((artwork.aspectRatio * 1.8).toFixed(1));

  return {
    wallRecommendationAr,
    wallHex,
    frameStyleRecommendation,
    frameReasonAr,
    recommendedKelvin: artwork.recommendedLightTemp,
    luxTarget,
    curatorInsightAr: `يُنصح بتوجيه إضاءة سبوتلايت (Spotlight) مركزة بزاوية 30 إلى 38 درجة لتفادي اللمعان المباشر مع استظهار ملمس ضربات الفرشاة (Impasto relief).`,
    bestViewingDistanceMeters: Math.max(1.5, bestDistance)
  };
}

/**
 * Generates CSS Variables representation for the color palette
 */
export function generateCssVariables(artwork: Artwork): string {
  const vars = artwork.palette.map((color, index) => {
    const role = index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'accent' : `tone-${index}`;
    return `  --art-color-${role}: ${color};`;
  }).join('\n');

  return `:root {\n  /* مستوحى من: ${artwork.titleAr} */\n${vars}\n  --art-recommended-kelvin: ${artwork.recommendedLightTemp}K;\n}`;
}
