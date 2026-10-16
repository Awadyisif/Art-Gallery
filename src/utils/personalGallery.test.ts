import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GALLERY_STORAGE_KEY,
  savedArtworkToArtwork
} from './personalGallery.ts';
import type { SavedArtwork } from '../types/art.ts';

test('savedArtworkToArtwork accurately maps SavedArtwork to live Artwork model', () => {
  const mockSaved: SavedArtwork = {
    id: 'custom-12345',
    titleAr: 'حديقة شاطئية',
    titleEn: 'Coastal Garden',
    artistAr: 'مقتني اللوحة',
    year: '2026',
    movementAr: 'مقتنيات خاصة معاصرة',
    descriptionAr: 'لوحة مخصصة مرفوعة',
    palette: ['#0f172a', '#1e3a8a', '#38bdf8', '#f59e0b', '#ffffff'],
    brushTechniqueAr: 'ملمس ناعم',
    textureRelief: 0.6,
    aspectRatio: 1.5,
    recommendedLightTemp: 3500,
    recommendedWallStyle: 'warm-plaster',
    historicalContextAr: 'أضيفت للمعرض الشخصي',
    curatorCritiqueAr: 'تناغم بصري هادئ',
    dataUrl: 'data:image/jpeg;base64,mockdata',
    dateSaved: '2026-10-16',
    ambientSoundType: 'ocean'
  };

  const artwork = savedArtworkToArtwork(mockSaved);

  assert.equal(artwork.id, 'custom-12345');
  assert.equal(artwork.titleAr, 'حديقة شاطئية');
  assert.equal(artwork.isPersonal, true);
  assert.equal(artwork.aspectRatio, 1.5);
  assert.equal(artwork.ambientSoundType, 'ocean');
  assert.equal(artwork.generatorStyle, 'custom');
  assert.equal(artwork.dataUrl, 'data:image/jpeg;base64,mockdata');
  assert.deepEqual(artwork.palette, ['#0f172a', '#1e3a8a', '#38bdf8', '#f59e0b', '#ffffff']);
});

test('GALLERY_STORAGE_KEY is properly defined as constant', () => {
  assert.equal(GALLERY_STORAGE_KEY, 'rawaq_personal_gallery_v1');
});
