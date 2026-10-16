import React, { useRef } from 'react';
import { Artwork, SavedArtwork } from '../types/art';
import { MASTERPIECES } from '../data/artworks';
import { Upload, Sparkles, Image as ImageIcon, FolderHeart, VolumeX, Volume2 } from 'lucide-react';

interface ArtSelectorBarProps {
  currentArtwork: Artwork;
  onSelectArtwork: (artwork: Artwork) => void;
  onCustomImageUpload: (file: File) => void;
  onOpenAiGenerator: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  savedArtworks: SavedArtwork[];
  onOpenPersonalGallery: () => void;
}

export const ArtSelectorBar: React.FC<ArtSelectorBarProps> = ({
  currentArtwork,
  onSelectArtwork,
  onCustomImageUpload,
  onOpenAiGenerator,
  isPlayingAudio,
  onToggleAudio,
  savedArtworks,
  onOpenPersonalGallery
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCustomImageUpload(file);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 px-3 md:px-6 py-2.5 flex items-center justify-between gap-3 text-stone-100">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold shadow-md">
          <ImageIcon className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight font-serif-art text-stone-100 flex items-center gap-2">
            رواق الفن التفاعلي
            <span className="text-[10px] text-amber-400 font-sans font-medium px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
              3D Spatial Studio
            </span>
          </h1>
          <p className="text-[10px] text-stone-400 hidden sm:block">
            تصاميم مكانية مستوحاة من عوالم الفن التشكيلي
          </p>
        </div>
      </div>

      {/* Horizontal Masterpiece Selector Ribbon */}
      <nav aria-label="شريط اختيار اللوحات الفنية" className="flex-1 max-w-2xl mx-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 py-1">
        {/* Personal Gallery Quick Pill */}
        <button
          onClick={onOpenPersonalGallery}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-right transition ${
            currentArtwork.isPersonal
              ? 'bg-amber-500/25 border-amber-500 text-amber-200 font-bold'
              : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:text-amber-300 hover:bg-stone-800'
          }`}
          aria-label="فتح المعرض الشخصي"
        >
          <FolderHeart className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold whitespace-nowrap">معرضي الشخصي</span>
          <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded-full">
            {savedArtworks.length}
          </span>
        </button>

        <div className="w-px h-5 bg-stone-800 mx-1 flex-shrink-0" />

        {MASTERPIECES.map(art => {
          const isSelected = art.id === currentArtwork.id;
          return (
            <button
              key={art.id}
              onClick={() => onSelectArtwork(art)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-right transition ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500/80 text-amber-200 shadow-md font-bold'
                  : 'bg-stone-900/60 border-stone-800/70 text-stone-400 hover:text-stone-200 hover:bg-stone-800/80'
              }`}
              aria-label={`اختيار لوحة ${art.titleAr}`}
            >
              {/* Color dots preview */}
              <div className="flex -space-x-1.5">
                {art.palette.slice(0, 3).map((col, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-2.5 h-2.5 rounded-full border border-stone-900"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
              <div className="text-xs font-semibold whitespace-nowrap">{art.titleAr}</div>
            </button>
          );
        })}
      </nav>

      {/* Actions: Upload & AI Creation & Audio */}
      <div className="flex items-center gap-2">
        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-xl border transition ${
            isPlayingAudio
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
          title="تشغيل / إيقاف البيئة الصوتية التأملية"
          aria-label={isPlayingAudio ? 'إيقاف الصوت' : 'تشغيل الصوت'}
        >
          {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Upload Custom Art */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium px-3 py-2 rounded-xl transition"
          aria-label="رفع لوحة أو صورة من جهازك"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">رفع لوحة خاصة</span>
        </button>

        {/* AI Art Prompt Generator */}
        <button
          onClick={onOpenAiGenerator}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs font-bold px-3 py-2 rounded-xl shadow-md transition"
          aria-label="توليد وتخصيص بالذكاء الاصطناعي"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">استلهام ذكي</span>
        </button>
      </div>
    </header>
  );
};
