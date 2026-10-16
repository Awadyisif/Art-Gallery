import React, { useState } from 'react';
import { Artwork } from '../types/art';
import { Sparkles, X, Wand2, Palette, Flame, Check } from 'lucide-react';

interface AiArtGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNewArtwork: (newArtwork: Artwork) => void;
}

const CREATIVE_PRESETS = [
  {
    titleAr: 'شفق الصحراء السديمي',
    style: 'abstract' as const,
    palette: ['#4a0e17', '#9d0208', '#d00000', '#ffba08', '#3f37c9'],
    desc: 'تفاعل لوني ناري مستوحى من كثبان الربع الخالي تحت سماء كونية مرصعة بالنجوم.'
  },
  {
    titleAr: 'واحة الزمرد والضباب',
    style: 'lilies' as const,
    palette: ['#081c15', '#1b4332', '#2d6a4f', '#74c69d', '#d8f3dc'],
    desc: 'رؤية انطباعية شتوية لغابة مطيرة يمتزج فيها بخار الندى مع انعكاسات الطحالب.'
  },
  {
    titleAr: 'مقرنصات النور السيبراني',
    style: 'islamic' as const,
    palette: ['#03071e', '#370617', '#6a040f', '#e85d04', '#faa307'],
    desc: 'دمج معاصر بين الهندسة النجمية الأندلسية وألوان الطاقة الرقمية المتوهجة.'
  },
  {
    titleAr: 'رقائق الذهب والحرير الأسود',
    style: 'kiss' as const,
    palette: ['#000814', '#001d3d', '#ffd60a', '#ffc300', '#fdf0d5'],
    desc: 'تناغم أرستقراطي بين السواد العميق والرقائق الذهبية الساطعة على غرار كليمت.'
  }
];

export const AiArtGeneratorModal: React.FC<AiArtGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyNewArtwork
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const preset = CREATIVE_PRESETS[selectedPresetIndex];
      const customTitle = prompt.trim() || preset.titleAr;

      const newArt: Artwork = {
        id: `ai-art-${Date.now()}`,
        titleAr: customTitle,
        titleEn: `Inspired Vision: ${customTitle}`,
        artistAr: 'الذكاء الاصطناعي والإبداع البشري',
        artistEn: 'Generative AI & Human Curation',
        year: '2026',
        movementAr: 'الفن التوليدي المعاصر (Generative Spatial Art)',
        movementEn: 'Contemporary Generative Art',
        descriptionAr: `عمل فني ابتكاري مستوحى من الوصف: "${customTitle}". يستعرض تفاعلاً فريداً بين كتل الألوان والإضاءة المكانية ثلاثية الأبعاد.`,
        descriptionEn: `A custom generative visual composition crafted around: "${customTitle}".`,
        palette: preset.palette,
        brushTechniqueAr: 'ضربات رقمية متعددة الطبقات تمزج بين النتوء الزيتي والانسيابية الحركية.',
        textureRelief: 0.65,
        aspectRatio: 1.25,
        recommendedLightTemp: 3200,
        recommendedWallStyle: 'industrial-concrete',
        historicalContextAr: 'تكوين فضائي تفاعلي صُمم خصيصاً عبر منصة رواق الفن لاستكشاف آفاق جديدة في العرض والتصميم المكاني.',
        curatorCritiqueAr: 'يستفيد العمل من إضاءة ستوديو مركزية تبرز التباين الحاد بين الألوان وتنعكس بانسيابية فوق خامات الجدران المعمارية.',
        generatorStyle: preset.style,
        ambientSoundType: 'crystal'
      };

      onApplyNewArtwork(newArt);
      setIsGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="استلهام عمل فني بالذكاء الاصطناعي"
    >
      <div className="relative w-full max-w-xl bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-100 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">استلهام عمل فني بالذكاء الاصطناعي</h3>
              <p className="text-xs text-stone-400">ابتكار لوحة فنية جديدة مع منظومة الألوان ومواصفات العرض المكاني</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Prompt input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-300 block">
            صِف الرؤية أو المشهد التشكيلي الذي ترغب باستنباطه:
          </label>
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="مثال: شفق بحري هادئ بألوان فيروزية وذهبية بأسلوب الانطباعية..."
            className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none transition"
          />
        </div>

        {/* Creative Style Presets */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-stone-300 block">
            أو اختر نموذجاً من التناغمات التشكيلية الجاهزة:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {CREATIVE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPresetIndex(idx)}
                className={`p-3 rounded-xl border text-right transition ${
                  selectedPresetIndex === idx
                    ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                    : 'bg-stone-900/50 border-stone-800 text-stone-300 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold">{p.titleAr}</span>
                  {selectedPresetIndex === idx && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                {/* Palette preview */}
                <div className="flex gap-1 mb-1.5">
                  {p.palette.map((c, ci) => (
                    <span key={ci} className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-1">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Trigger */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200 transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl shadow-lg transition"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isGenerating ? 'جاري استنباط العمل الفني...' : 'توليد وعرض اللوحة الآن'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
