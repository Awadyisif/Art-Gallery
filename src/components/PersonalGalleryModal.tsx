import React from 'react';
import { SavedArtwork, Artwork } from '../types/art';
import { savedArtworkToArtwork } from '../utils/personalGallery';
import { X, Trash2, Eye, Plus, Sparkles, FolderHeart, Calendar, Palette } from 'lucide-react';

interface PersonalGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedArtworks: SavedArtwork[];
  onSelectSavedArtwork: (artwork: Artwork) => void;
  onDeleteArtwork: (id: string) => void;
  onUploadClick: () => void;
}

export const PersonalGalleryModal: React.FC<PersonalGalleryModalProps> = ({
  isOpen,
  onClose,
  savedArtworks,
  onSelectSavedArtwork,
  onDeleteArtwork,
  onUploadClick
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="المعرض الشخصي للوحات المحفوظة"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-stone-800 bg-stone-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-stone-100 font-serif-art">
                  معرضي الشخصي المخصص
                </h2>
                <span className="text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  {savedArtworks.length} {savedArtworks.length === 1 ? 'لوحة' : 'لوحات'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                لوحاتك المرفوعة والمحفوظة في المتصفح للعودة إليها وتجربتها في الفضاء ثلاثي الأبعاد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onUploadClick}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md"
              aria-label="رفع لوحة جديدة إلى المعرض الشخصي"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة لوحة جديدة</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition"
              aria-label="إغلاق المعرض الشخصي"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {savedArtworks.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 shadow-inner">
                <FolderHeart className="w-10 h-10 text-amber-500/60" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-base font-bold text-stone-200">معرضك الشخصي لا يزال شاغراً</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  ارفع أي لوحة فنية أو صورة من جهازك، وسيقوم النظام تلقائياً بحفظها محلياً في متصفحك (localStorage) مع استخراج تناغماتها اللونية لتتمكن من العودة إليها في أي وقت.
                </p>
              </div>
              <button
                onClick={onUploadClick}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
              >
                <Plus className="w-4 h-4" />
                رفع لوحة خاصة الآن
              </button>
            </div>
          ) : (
            /* Grid of Saved Personal Artworks */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedArtworks.map(saved => (
                <div
                  key={saved.id}
                  className="group relative bg-stone-900/60 border border-stone-800 hover:border-amber-500/60 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col shadow-md hover:shadow-xl"
                >
                  {/* Image Preview with Aspect Ratio */}
                  <div className="relative w-full aspect-[4/3] bg-stone-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={saved.dataUrl}
                      alt={saved.titleAr}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => {
                          onSelectSavedArtwork(savedArtworkToArtwork(saved));
                          onClose();
                        }}
                        className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg transition"
                        aria-label={`عرض لوحة ${saved.titleAr} في الفضاء ثلاثي الأبعاد`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>عرض في المشهد</span>
                      </button>
                      <button
                        onClick={() => onDeleteArtwork(saved.id)}
                        className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl shadow-lg transition"
                        title="حذف من المعرض الشخصي"
                        aria-label={`حذف لوحة ${saved.titleAr}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Card Footer */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-stone-200 line-clamp-1 group-hover:text-amber-300 transition">
                        {saved.titleAr}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                        <Calendar className="w-3 h-3 text-stone-500" />
                        <span>{saved.dateSaved || 'محفوظة في المتصفح'}</span>
                      </div>
                    </div>

                    {/* Extracted Palette Swatch Dots */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                      <div className="flex items-center gap-1">
                        <Palette className="w-3 h-3 text-stone-500" />
                        <span className="text-[10px] text-stone-400">التناغم اللوني:</span>
                      </div>
                      <div className="flex -space-x-1">
                        {saved.palette.slice(0, 5).map((col, cIdx) => (
                          <span
                            key={cIdx}
                            className="w-3 h-3 rounded-full border border-stone-900"
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/70 flex items-center justify-between text-xs text-stone-400">
          <span>يتم الحفظ محلياً في ذاكرة التخزين للمتصفح (localStorage) دون مشاركة مع خوادم خارجية.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium rounded-xl transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
