export interface DepthLayer {
  name: string;
  depthZ: number;
  opacity: number;
  scale: number;
  colorFilter?: string;
}

export interface Artwork {
  id: string;
  titleAr: string;
  titleEn: string;
  artistAr: string;
  artistEn: string;
  year: string;
  movementAr: string;
  movementEn: string;
  descriptionAr: string;
  descriptionEn: string;
  palette: string[]; // 5-6 hex colors
  brushTechniqueAr: string;
  textureRelief: number; // 0 to 1 bump scale
  aspectRatio: number; // width / height
  recommendedLightTemp: number; // in Kelvin, e.g. 2700, 3200, 4500
  recommendedWallStyle: string;
  historicalContextAr: string;
  curatorCritiqueAr: string;
  imageUrl?: string;
  generatorStyle: 'starry' | 'wave' | 'lilies' | 'kiss' | 'clocks' | 'abstract' | 'islamic' | 'sfumato' | 'custom';
  ambientSoundType: 'breeze' | 'ocean' | 'ripples' | 'crystal' | 'silence' | 'mystic';
  isPersonal?: boolean;
  dateSaved?: string;
  dataUrl?: string;
}

export interface SavedArtwork {
  id: string;
  titleAr: string;
  titleEn: string;
  artistAr: string;
  year: string;
  movementAr: string;
  descriptionAr: string;
  palette: string[];
  brushTechniqueAr: string;
  textureRelief: number;
  aspectRatio: number;
  recommendedLightTemp: number;
  recommendedWallStyle: string;
  historicalContextAr: string;
  curatorCritiqueAr: string;
  dataUrl: string;
  dateSaved: string;
  ambientSoundType: 'breeze' | 'ocean' | 'ripples' | 'crystal' | 'silence' | 'mystic';
}

export type DisplayMode = 'wall' | 'table' | 'spatial3d' | 'derive';

export type FrameStyle = 
  | 'ornate-gold' 
  | 'minimal-black' 
  | 'natural-oak' 
  | 'floating-canvas' 
  | 'acrylic-block' 
  | 'frameless-glass';

export type MattingStyle = 'none' | 'thin' | 'wide' | 'deep-bevel';

export type WallTexture = 
  | 'gallery-white' 
  | 'warm-plaster' 
  | 'industrial-concrete' 
  | 'luxury-walnut' 
  | 'classic-molding' 
  | 'dark-obsidian';

export type TableSurface = 
  | 'marble-white' 
  | 'natural-wood' 
  | 'smoked-glass' 
  | 'matte-slate';

export type StandType = 
  | 'wooden-easel' 
  | 'acrylic-dock' 
  | 'brass-minimal';

export type LightingPreset = 
  | 'museum-spot' 
  | 'daylight' 
  | 'golden-hour' 
  | 'dramatic-ambient' 
  | 'cyber-modern';

export interface SceneConfig {
  displayMode: DisplayMode;
  frameStyle: FrameStyle;
  matting: MattingStyle;
  scale: number; // 0.6 to 1.8
  wallTexture: WallTexture;
  tableSurface: TableSurface;
  standType: StandType;
  lightingPreset: LightingPreset;
  lightIntensity: number; // 0.2 to 2.5
  lightAngle: number; // degrees
  depthSeparation: number; // 0 to 2 for 3D spatial layer explosion
  showShadows: boolean;
  showProps: boolean; // museum bench / plants / sculpture
  autoRotate: boolean;
}
