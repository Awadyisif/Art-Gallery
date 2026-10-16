import React from 'react';
import { Artwork, SceneConfig } from '../types/art';
import { Download, X, Share2, Sparkles } from 'lucide-react';

interface SnapshotModalProps {
  dataUrl: string | null;
  artwork: Artwork;
  config: SceneConfig;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  dataUrl,
  artwork,
  config,
  onClose
}) => {
  if (!dataUrl) return null;

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `rawaq-exhibit-${artwork.id}-${config.displayMode}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="معاينة وتنزيل لقطة المشهد"
    >
      <div className="relative w-full max-w-2xl bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl p-5 text-stone-100 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold">لقطة العرض المكاني ثلاثي الأبعاد</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
            aria-label="إغلاق المعاينة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snapshot Image Preview */}
        <div className="relative w-full rounded-xl overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center max-h-[60vh]">
          <img
            src={dataUrl}
            alt={`لقطة شاشة لمعرض ${artwork.titleAr}`}
            className="w-full h-auto object-contain max-h-[58vh]"
          />
        </div>

        {/* Artwork Info & Staging Parameters Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 pt-1">
          <div>
            <span className="font-semibold text-stone-200">{artwork.titleAr}</span> • {artwork.artistAr} ({artwork.year})
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800 text-amber-300">
              {config.displayMode === 'wall' ? 'عرض الحائط' : config.displayMode === 'table' ? 'عرض الطاولة' : 'العرض الفضائي'}
            </span>
            <span className="bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800 text-stone-300">
              {artwork.recommendedLightTemp}K
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200 transition"
          >
            إغلاق
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl shadow-lg transition"
            aria-label="تنزيل الصورة عالية الدقة"
          >
            <Download className="w-4 h-4" />
            تنزيل الصورة بجودة عالية (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};
