import type { Artwork, SavedArtwork } from '../types/art.ts';
import { rgbToHex } from './artEngine.ts';

export const GALLERY_STORAGE_KEY = 'rawaq_personal_gallery_v1';

/**
 * Loads saved personal artworks from localStorage.
 */
export function loadPersonalGallery(): SavedArtwork[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Failed to parse personal gallery from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new artwork to personal gallery in localStorage.
 * Keeps up to 25 artworks and returns the updated list.
 */
export function saveArtworkToPersonalGallery(artwork: SavedArtwork): SavedArtwork[] {
  const current = loadPersonalGallery();
  // Filter out duplicate if id already exists
  const filtered = current.filter(item => item.id !== artwork.id);
  // Add to front (latest first)
  const updated = [artwork, ...filtered].slice(0, 25);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Storage quota exceeded or unavailable while saving artwork:', err);
      // Attempt saving with fewer older items if quota was hit
      try {
        const compact = updated.slice(0, 10);
        window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(compact));
        return compact;
      } catch {
        // quota hard limit
      }
    }
  }
  return updated;
}

/**
 * Deletes an artwork from personal gallery by ID.
 */
export function deleteArtworkFromPersonalGallery(id: string): SavedArtwork[] {
  const current = loadPersonalGallery();
  const updated = current.filter(item => item.id !== id);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to update gallery after delete:', err);
    }
  }
  return updated;
}

/**
 * Converts a SavedArtwork into the live Artwork runtime model
 */
export function savedArtworkToArtwork(saved: SavedArtwork): Artwork {
  return {
    id: saved.id,
    titleAr: saved.titleAr,
    titleEn: saved.titleEn,
    artistAr: saved.artistAr,
    artistEn: 'Personal Collector',
    year: saved.year || '2026',
    movementAr: saved.movementAr || 'مقتنيات المعرض الشخصي',
    movementEn: 'Personal Collection',
    descriptionAr: saved.descriptionAr,
    descriptionEn: 'Custom artwork from personal collector gallery.',
    palette: saved.palette && saved.palette.length ? saved.palette : ['#1e293b', '#334155', '#cbd5e1', '#0ea5e9', '#f59e0b'],
    brushTechniqueAr: saved.brushTechniqueAr || 'ملمس ناعم متعدد التدرجات مع حساسية للضوء المسلط.',
    textureRelief: saved.textureRelief ?? 0.5,
    aspectRatio: saved.aspectRatio || 1.33,
    recommendedLightTemp: saved.recommendedLightTemp || 3200,
    recommendedWallStyle: saved.recommendedWallStyle || 'gallery-white',
    historicalContextAr: saved.historicalContextAr || 'محفوظة في المعرض الشخصي للاستعراض والتصميم المكاني.',
    curatorCritiqueAr: saved.curatorCritiqueAr || 'تتألق اللوحة بإضاءة متوازنة تبرز تفاصيلها الأصلية.',
    imageUrl: saved.dataUrl,
    dataUrl: saved.dataUrl,
    generatorStyle: 'custom',
    ambientSoundType: saved.ambientSoundType || 'breeze',
    isPersonal: true,
    dateSaved: saved.dateSaved
  };
}

/**
 * Creates an optimized base64 dataUrl from an HTMLImageElement or Canvas (max 800px dimension)
 */
export function createOptimizedImageDataUrl(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  const maxDim = 800;
  let w = img.naturalWidth || img.width || 600;
  let h = img.naturalHeight || img.height || 600;

  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }
  }

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.82);
}

/**
 * Extracts 5 dominant harmonious colors from an image canvas
 */
export function extractColorsFromCanvas(canvas: HTMLCanvasElement): string[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return ['#1e293b', '#334155', '#cbd5e1', '#0ea5e9', '#f59e0b'];

  const sampleW = 64;
  const sampleH = Math.round(64 / (canvas.width / canvas.height || 1));
  const offscreen = document.createElement('canvas');
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return ['#1e293b', '#334155', '#cbd5e1', '#0ea5e9', '#f59e0b'];

  offCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
  const imgData = offCtx.getImageData(0, 0, sampleW, sampleH).data;

  // Simple color quantization bucket
  const buckets: { [key: string]: { r: number; g: number; b: number; count: number } } = {};

  for (let i = 0; i < imgData.length; i += 16) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    const a = imgData[i + 3];
    if (a < 128) continue;

    // Quantize to 32 steps
    const qr = Math.floor(r / 32) * 32;
    const qg = Math.floor(g / 32) * 32;
    const qb = Math.floor(b / 32) * 32;
    const key = `${qr},${qg},${qb}`;

    if (!buckets[key]) {
      buckets[key] = { r, g, b, count: 0 };
    }
    buckets[key].count++;
  }

  // Sort by count
  const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);
  const hexColors: string[] = [];

  for (const item of sorted) {
    const hex = rgbToHex({ r: item.r, g: item.g, b: item.b });
    // Ensure colors are visually distinct
    const isTooClose = hexColors.some(existing => {
      return existing === hex;
    });
    if (!isTooClose) {
      hexColors.push(hex);
    }
    if (hexColors.length >= 5) break;
  }

  // Fallbacks if image is uniform
  while (hexColors.length < 5) {
    const fallbacks = ['#1e293b', '#334155', '#cbd5e1', '#0ea5e9', '#f59e0b'];
    hexColors.push(fallbacks[hexColors.length]);
  }

  return hexColors;
}
