import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb,
  rgbToHex,
  getRelativeLuminance,
  getContrastRatio,
  kelvinToRgb,
  getLightingPresetSpecs,
  getStagingRecommendation,
  generateCssVariables
} from './artEngine.ts';
import type { Artwork } from '../types/art.ts';

test('hexToRgb correctly parses 6-digit and 3-digit hex values', () => {
  const white = hexToRgb('#ffffff');
  assert.deepEqual(white, { r: 255, g: 255, b: 255 });

  const black = hexToRgb('#000000');
  assert.deepEqual(black, { r: 0, g: 0, b: 0 });

  const shortHex = hexToRgb('#f00');
  assert.deepEqual(shortHex, { r: 255, g: 0, b: 0 });

  const invalid = hexToRgb('invalid');
  assert.deepEqual(invalid, { r: 128, g: 128, b: 128 });
});

test('rgbToHex converts RGB values back to valid lowercase hex string', () => {
  assert.equal(rgbToHex({ r: 255, g: 255, b: 255 }), '#ffffff');
  assert.equal(rgbToHex({ r: 0, g: 0, b: 0 }), '#000000');
  assert.equal(rgbToHex({ r: 255, g: 0, b: 0 }), '#ff0000');
});

test('getRelativeLuminance returns standard WCAG luminance values', () => {
  const lumWhite = getRelativeLuminance({ r: 255, g: 255, b: 255 });
  assert.ok(Math.abs(lumWhite - 1.0) < 0.001);

  const lumBlack = getRelativeLuminance({ r: 0, g: 0, b: 0 });
  assert.ok(Math.abs(lumBlack - 0.0) < 0.001);
});

test('getContrastRatio computes WCAG contrast between black and white as 21:1', () => {
  const ratio = getContrastRatio('#ffffff', '#000000');
  assert.equal(ratio, 21);
});

test('kelvinToRgb produces warm reddish light at 2000K and cool bluish at 8000K', () => {
  const warm = kelvinToRgb(2000);
  assert.ok(warm.r > warm.b, '2000K should have more red than blue');

  const cool = kelvinToRgb(8000);
  assert.ok(cool.b > cool.r, '8000K should have more blue than red');
});

test('getLightingPresetSpecs returns correct configuration for presets', () => {
  const museum = getLightingPresetSpecs('museum-spot');
  assert.equal(museum.kelvin, 3000);
  assert.ok(museum.intensity > 1.0);

  const daylight = getLightingPresetSpecs('daylight');
  assert.equal(daylight.kelvin, 5200);
});

test('getStagingRecommendation provides curatorial staging based on artwork style', () => {
  const mockArtwork: Artwork = {
    id: 'test-starry',
    titleAr: 'ليلة النجوم',
    titleEn: 'The Starry Night',
    artistAr: 'فينسنت فان غوخ',
    artistEn: 'Vincent van Gogh',
    year: '1889',
    movementAr: 'ما بعد الانطباعية',
    movementEn: 'Post-Impressionism',
    descriptionAr: 'لوحة زيتية شهيرة',
    descriptionEn: 'Famous oil painting',
    palette: ['#0f172a', '#1e3a8a', '#eab308', '#f59e0b', '#38bdf8'],
    brushTechniqueAr: 'ضربات إمباستو سميكة',
    textureRelief: 0.8,
    aspectRatio: 1.25,
    recommendedLightTemp: 3000,
    recommendedWallStyle: 'raw-concrete',
    historicalContextAr: 'رسمها في مصحة سان ريمي',
    curatorCritiqueAr: 'تعبير درامي عن الروحانية والكون',
    generatorStyle: 'starry',
    ambientSoundType: 'breeze'
  };

  const rec = getStagingRecommendation(mockArtwork);
  assert.ok(rec.wallRecommendationAr.length > 0);
  assert.equal(rec.recommendedKelvin, 3000);
  assert.ok(rec.bestViewingDistanceMeters >= 1.5);

  const css = generateCssVariables(mockArtwork);
  assert.ok(css.includes('--art-color-primary: #0f172a;'));
  assert.ok(css.includes('--art-recommended-kelvin: 3000K;'));
});
