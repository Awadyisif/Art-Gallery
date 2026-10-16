import React, { useState, useEffect } from 'react';
import { Artwork, SceneConfig } from '../types/art';
import { getArtisticCritique, DeepCuratorialInsight } from '../services/geminiArtAdvisor';
import { getStagingRecommendation } from '../utils/artEngine';
import {
  X,
  Sparkles,
  Compass,
  CheckCircle2,
  Wand2,
  Share2,
  BookOpen,
  Info,
  SlidersHorizontal,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';
import { audioAmbiance } from '../utils/audioAmbiance';

interface ArtCritiqueDrawerProps {
  artwork: Artwork;
  config: SceneConfig;
  isOpen: boolean;
  onClose: () => void;
  onApplyStagingRecommendation: (recommendedConfig: Partial<SceneConfig>) => void;
}

export const ArtCritiqueDrawer: React.FC<ArtCritiqueDrawerProps> = ({
  artwork,
  isOpen,
  onClose,
  onApplyStagingRecommendation
}) => {
  const [insight, setInsight] = useState<DeepCuratorialInsight | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadInsight();
      setIsPlayingAudio(audioAmbiance.getIsPlaying());
    }
  }, [artwork, isOpen]);

  const loadInsight = async () => {
    setIsLoadingAi(true);
    try {
      const data = await getArtisticCritique(artwork);
      setInsight(data);
    } catch {
      // handled
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleApplyStaging = () => {
    const rec = getStagingRecommendation(artwork);
    onApplyStagingRecommendation({
      wallTexture: artwork.recommendedWallStyle as SceneConfig['wallTexture'],
      frameStyle: rec.frameStyleRecommendation as SceneConfig['frameStyle'],
      lightIntensity: 1.3
    });
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const toggleAmbianceSound = () => {
    const active = audioAmbiance.toggle(artwork);
    setIsPlayingAudio(active);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="إدراك الأوصاف والتوجيه الفني للوحة"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-stone-800 bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-stone-100 font-serif-art">
                إدراك الأوصاف الفنية وتوجيه العرض المكاني
              </h2>
              <p className="text-xs text-stone-400">
                {artwork.titleAr} ({artwork.year}) • {artwork.artistAr}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Ambiance Toggle */}
            <button
              onClick={toggleAmbianceSound}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                isPlayingAudio
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="تشغيل البيئة الصوتية المستوحاة من اللوحة"
              aria-label="البيئة الصوتية التناغمية"
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">البيئة الصوتية</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition"
              aria-label="إغلاق نافذة الأوصاف الفنية"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Quick Curatorial Staging Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-stone-950 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5" />
                الإعداد المكاني والتنويري الموصى به للعرض
              </span>
              <p className="text-xs text-stone-300 mt-1">
                تطبيق الإضاءة المتحفية ({artwork.recommendedLightTemp}K) وخامة الجدار والإطار الأمثل لمطابقة المعايير المتحفية العالمية فوراً.
              </p>
            </div>
            <button
              onClick={handleApplyStaging}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                applied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تم تطبيق الإعداد على المشهد!
                </>
              ) : (
                <>
                  <SlidersHorizontal className="w-4 h-4" />
                  تطبيق الإعداد التلقائي المثالي
                </>
              )}
            </button>
          </div>

          {/* Deep Description Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Harmonization & Visual Depth */}
            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                التناغم اللوني والنسبة التشكيلية
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {insight?.harmonicCritiqueAr || 'جاري استخلاص التوازن اللوني...'}
              </p>
            </div>

            {/* 2. Brushstroke & Impasto Technique */}
            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                تحليل ضربات الفرشاة وملمس السطح (Impasto)
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {artwork.brushTechniqueAr}
              </p>
              <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/80">
                مؤشر بروز الملمس المجهري للكانفاس: <span className="text-amber-300 font-mono">{(artwork.textureRelief * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* 3. Architectural Staging */}
            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                التوصيف المعماري للمحيط والجدار
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {insight?.architecturalStagingAr || 'جاري استقراء النمط المعماري...'}
              </p>
            </div>

            {/* 4. Museum Lighting Prescription */}
            <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                وصفة الإضاءة المتحفية وزاوية السقوط
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {insight?.lightingPrescriptionAr || 'زاوية إضاءة 32 إلى 35 درجة لتفادي الوهج السطحي.'}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-400 border-t border-stone-800/80">
                <span>حرارة اللون الموصى بها:</span>
                <span className="text-amber-300 font-semibold">{artwork.recommendedLightTemp}K</span>
              </div>
            </div>
          </div>

          {/* Historical Context & Curator Review */}
          <div className="p-4 rounded-xl bg-stone-900/30 border border-stone-800/80 space-y-2">
            <h4 className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-500" />
              السياق التاريخي والوجداني للوحة
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {artwork.historicalContextAr}
            </p>
            {insight?.poeticTributeAr && (
              <blockquote className="mt-3 p-3 bg-stone-950/70 border-r-2 border-amber-500 rounded-l-lg text-xs italic text-amber-200/90 font-serif-art">
                &ldquo;{insight.poeticTributeAr}&rdquo;
              </blockquote>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={loadInsight}
              disabled={isLoadingAi}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition"
              aria-label="تحديث التحليل الذكي"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isLoadingAi ? 'جاري الاستقراء الفني...' : 'استقراء فني معمق جديد'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl transition"
            aria-label="إغلاق"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
