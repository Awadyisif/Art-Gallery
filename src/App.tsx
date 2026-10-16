import React, { useState, useEffect, useRef } from 'react';
import { Artwork, SavedArtwork, SceneConfig } from './types/art';
import { MASTERPIECES } from './data/artworks';
import { ThreeCanvas } from './components/ThreeCanvas';
import { CollapsibleBottomDock } from './components/CollapsibleBottomDock';
import { ArtSelectorBar } from './components/ArtSelectorBar';
import { ArtCritiqueDrawer } from './components/ArtCritiqueDrawer';
import { DeriveBackgroundStudio } from './components/DeriveBackgroundStudio';
import { AiArtGeneratorModal } from './components/AiArtGeneratorModal';
import { SnapshotModal } from './components/SnapshotModal';
import { PersonalGalleryModal } from './components/PersonalGalleryModal';
import { audioAmbiance } from './utils/audioAmbiance';
import {
  loadPersonalGallery,
  saveArtworkToPersonalGallery,
  deleteArtworkFromPersonalGallery,
  savedArtworkToArtwork,
  createOptimizedImageDataUrl,
  extractColorsFromCanvas
} from './utils/personalGallery';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentArtwork, setCurrentArtwork] = useState<Artwork>(MASTERPIECES[0]);
  const [customImage, setCustomImage] = useState<HTMLImageElement | undefined>(undefined);
  const [savedArtworks, setSavedArtworks] = useState<SavedArtwork[]>([]);

  const [sceneConfig, setSceneConfig] = useState<SceneConfig>({
    displayMode: 'wall',
    frameStyle: 'ornate-gold',
    matting: 'thin',
    scale: 1.0,
    wallTexture: 'industrial-concrete',
    tableSurface: 'marble-white',
    standType: 'wooden-easel',
    lightingPreset: 'museum-spot',
    lightIntensity: 1.2,
    lightAngle: 25,
    depthSeparation: 0.8,
    showShadows: true,
    showProps: true,
    autoRotate: false
  });

  // Modals & Panels
  const [isCritiqueOpen, setIsCritiqueOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPersonalGalleryOpen, setIsPersonalGalleryOpen] = useState(false);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);
  const [snapshotTrigger, setSnapshotTrigger] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputHiddenRef = useRef<HTMLInputElement>(null);

  // Load saved gallery from localStorage on initial render
  useEffect(() => {
    const loaded = loadPersonalGallery();
    setSavedArtworks(loaded);
  }, []);

  // Keyboard shortcut: 'H' for dock collapse, 'C' for critique drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'c' || e.key === 'C' || e.key === 'ؤ') {
        setIsCritiqueOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Update scene config
  const handleConfigChange = (newConfig: Partial<SceneConfig>) => {
    setSceneConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Masterpiece selection
  const handleSelectArtwork = (art: Artwork) => {
    setCurrentArtwork(art);
    setCustomImage(undefined);
    if (isPlayingAudio) {
      audioAmbiance.playAmbiance(art);
    }
  };

  // Select a saved personal artwork from gallery
  const handleSelectSavedArtwork = (art: Artwork) => {
    if (art.dataUrl) {
      const img = new Image();
      img.onload = () => {
        setCustomImage(img);
        setCurrentArtwork(art);
        if (isPlayingAudio) audioAmbiance.playAmbiance(art);
      };
      img.src = art.dataUrl;
    } else {
      setCurrentArtwork(art);
      setCustomImage(undefined);
      if (isPlayingAudio) audioAmbiance.playAmbiance(art);
    }
  };

  // Delete saved artwork from gallery
  const handleDeleteSavedArtwork = (id: string) => {
    const updated = deleteArtworkFromPersonalGallery(id);
    setSavedArtworks(updated);
    showToast('تم حذف اللوحة من معرضك الشخصي');
    if (currentArtwork.id === id) {
      setCurrentArtwork(MASTERPIECES[0]);
      setCustomImage(undefined);
    }
  };

  // User image upload with automatic localStorage saving
  const handleCustomImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const originalSrc = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Optimize image size to safeguard localStorage quota
        const optimizedDataUrl = createOptimizedImageDataUrl(img);

        // Extract 5 dominant harmonious colors
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = img.naturalWidth || 600;
        sampleCanvas.height = img.naturalHeight || 600;
        const sCtx = sampleCanvas.getContext('2d');
        if (sCtx) sCtx.drawImage(img, 0, 0);
        const extractedPalette = extractColorsFromCanvas(sampleCanvas);

        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').trim() || 'لوحة شخصية جديدة';
        const formattedDate = new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        // 1. Construct SavedArtwork for persistent storage
        const savedItem: SavedArtwork = {
          id: `custom-${Date.now()}`,
          titleAr: cleanTitle,
          titleEn: file.name,
          artistAr: 'مقتني اللوحة الخاص',
          year: new Date().getFullYear().toString(),
          movementAr: 'مقتنيات المعرض الشخصي',
          descriptionAr: `عمل فني مخصص تم حفظه في معرضك الشخصي بتاريخ ${formattedDate}.`,
          palette: extractedPalette,
          brushTechniqueAr: 'ملمس ناعم متعدد التدرجات مع حساسية فائقة للضوء المتحفي.',
          textureRelief: 0.55,
          aspectRatio: img.naturalWidth / img.naturalHeight || 1.33,
          recommendedLightTemp: 3200,
          recommendedWallStyle: 'gallery-white',
          historicalContextAr: 'محفوظة في المعرض الشخصي للاستعراض والتصميم المكاني الثلاثي الأبعاد.',
          curatorCritiqueAr: 'يستفيد العمل من زاوية إضاءة متوازنة تبرز الألوان والظلال الطبيعية.',
          dataUrl: optimizedDataUrl,
          dateSaved: formattedDate,
          ambientSoundType: 'breeze'
        };

        // 2. Save into localStorage
        const updatedList = saveArtworkToPersonalGallery(savedItem);
        setSavedArtworks(updatedList);

        // 3. Set into active runtime
        const runtimeArt = savedArtworkToArtwork(savedItem);
        setCustomImage(img);
        setCurrentArtwork(runtimeArt);

        showToast(`تمت إضافة "${cleanTitle}" وحفظها في معرضك الشخصي`);
      };
      img.src = originalSrc;
    };
    reader.readAsDataURL(file);
  };

  // Audio Ambiance toggle
  const handleToggleAudio = () => {
    const active = audioAmbiance.toggle(currentArtwork);
    setIsPlayingAudio(active);
  };

  // Trigger Snapshot
  const handleTakeSnapshot = () => {
    setSnapshotTrigger(prev => prev + 1);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none flex flex-col">
      {/* Hidden file input for global modal upload trigger */}
      <input
        ref={fileInputHiddenRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleCustomImageUpload(file);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 border border-amber-500/50 text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Artwork Ribbon */}
      <ArtSelectorBar
        currentArtwork={currentArtwork}
        onSelectArtwork={handleSelectArtwork}
        onCustomImageUpload={handleCustomImageUpload}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={handleToggleAudio}
        savedArtworks={savedArtworks}
        onOpenPersonalGallery={() => setIsPersonalGalleryOpen(true)}
      />

      {/* Main Spatial Stage or Derivation Studio */}
      <main className="relative flex-1 w-full h-full pt-14">
        {sceneConfig.displayMode === 'derive' ? (
          <DeriveBackgroundStudio artwork={currentArtwork} />
        ) : (
          <ThreeCanvas
            artwork={currentArtwork}
            config={sceneConfig}
            customImage={customImage}
            snapshotTrigger={snapshotTrigger}
            onSnapshotReady={url => setSnapshotDataUrl(url)}
          />
        )}
      </main>

      {/* Ergonomic Collapsible Bottom Dock */}
      <CollapsibleBottomDock
        config={sceneConfig}
        onChangeConfig={handleConfigChange}
        onOpenCritique={() => setIsCritiqueOpen(true)}
        onTakeSnapshot={handleTakeSnapshot}
      />

      {/* Deep Artistic Critique & Description Drawer */}
      <ArtCritiqueDrawer
        artwork={currentArtwork}
        config={sceneConfig}
        isOpen={isCritiqueOpen}
        onClose={() => setIsCritiqueOpen(false)}
        onApplyStagingRecommendation={handleConfigChange}
      />

      {/* Personal Gallery Modal */}
      <PersonalGalleryModal
        isOpen={isPersonalGalleryOpen}
        onClose={() => setIsPersonalGalleryOpen(false)}
        savedArtworks={savedArtworks}
        onSelectSavedArtwork={handleSelectSavedArtwork}
        onDeleteArtwork={handleDeleteSavedArtwork}
        onUploadClick={() => fileInputHiddenRef.current?.click()}
      />

      {/* AI Art Prompt Generator Modal */}
      <AiArtGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyNewArtwork={art => {
          setCurrentArtwork(art);
          setCustomImage(undefined);
          if (isPlayingAudio) audioAmbiance.playAmbiance(art);
        }}
      />

      {/* Snapshot Preview & High-Res Download Modal */}
      <SnapshotModal
        dataUrl={snapshotDataUrl}
        artwork={currentArtwork}
        config={sceneConfig}
        onClose={() => setSnapshotDataUrl(null)}
      />
    </div>
  );
}
