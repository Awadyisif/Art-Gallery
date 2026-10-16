import { Artwork } from '../types/art';

export interface DeepCuratorialInsight {
  analysisTitleAr: string;
  harmonicCritiqueAr: string;
  brushstrokeAnalysisAr: string;
  architecturalStagingAr: string;
  lightingPrescriptionAr: string;
  emotionalAuraAr: string;
  poeticTributeAr: string;
  suggestedKeywordsAr: string[];
}

/**
 * Returns deep curatorial insights using AI if available,
 * or immediate rich museum-grade analytical knowledge base.
 */
export async function getArtisticCritique(artwork: Artwork): Promise<DeepCuratorialInsight> {
  // Check if GEMINI_API_KEY is available in client env
  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env.VITE_GEMINI_API_KEY || 
                 (import.meta as unknown as { env: Record<string, string> }).env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Dynamic import to avoid build errors if not configured
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `أنت كبير أمناء المتاحف العالمية وناقد فني خبير متخصص في تاريخ الفن وعمارة الفضاءات المتحفية والتصميم المكاني الثلاثي الأبعاد.
قم بتحليل اللوحة الفنية التالية لتقديم أفضل توجيه مكاني وتقني وتنويري لعرضها:
- عنوان اللوحة: ${artwork.titleAr} (${artwork.titleEn})
- الفنان: ${artwork.artistAr} (${artwork.artistEn})
- السنة والحركة: ${artwork.year} - ${artwork.movementAr}
- تقنية الفرشاة: ${artwork.brushTechniqueAr}
- الألوان الأساسية: ${artwork.palette.join(', ')}

المطلوب: توليد تحليل نقدي مكاني وتنويري فائق العمق باللغة العربية بتنسيق JSON حصراً يحتوي المفاتيح التالية:
{
  "analysisTitleAr": "عنوان نقد شاعري مكثف",
  "harmonicCritiqueAr": "تحليل للتناغم اللوني وتوزيع الكتل البصرية والنسبة الذهبية",
  "brushstrokeAnalysisAr": "تفكيك لطبيعة ضربات الفرشاة وملمس السطح (Impasto أو Sfumato أو غيره) وتفاعلها مع الضوء",
  "architecturalStagingAr": "التوصيف المعماري الأمثل للجدار والمحيط المكاني (عرض الحائط أو طاولة العرض) وأنسب خامات الديكور",
  "lightingPrescriptionAr": "وصفة الإضاءة المتحفية الدقيقة: درجة كلفن، شدة اللوكس، زاوية السقوط لمنع الوهج السطحي",
  "emotionalAuraAr": "الأثر النفسي والوجداني الذي يشعه العمل في الفضاء المحيط",
  "poeticTributeAr": "تأمل فلسفي شاعري قصير من سطرين حول خلود العمل الفني",
  "suggestedKeywordsAr": ["كلمة 1", "كلمة 2", "كلمة 3", "كلمة 4"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as DeepCuratorialInsight;
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini API call fallback to built-in deep analytical engine:', err);
    }
  }

  // High-fidelity fallback analytical knowledge base for instant response
  return generateDeterministicCuratorialInsight(artwork);
}

export function generateDeterministicCuratorialInsight(artwork: Artwork): DeepCuratorialInsight {
  const isDark = artwork.palette[0].startsWith('#0') || artwork.palette[0].startsWith('#1');

  return {
    analysisTitleAr: `السيمفونية المكانية: تفكيك الرؤية التشكيلية لـ "${artwork.titleAr}"`,
    harmonicCritiqueAr: `ترتكز اللوحة على موازنة لونية استثنائية بين التناغم الحار والبارد؛ حيث تلعب النغمات (${artwork.palette.slice(0, 3).join(', ')}) دور المركز الثقيل الذي يجذب البصر نحو بؤرة الحركة، مع توزيع تدريجي يحافظ على توازن الكتلة البصرية وفق مبادئ النسبة الذهبية والتناسب الكوني.`,
    brushstrokeAnalysisAr: `تظهر على سطح الكانفاس بوضوح ملامح ${artwork.brushTechniqueAr}. هذا التوزيع اللوني يصنع احتكاكاً ميكانيكياً بين ذرات الصباغ والنسيج الكتاني، مما يولد تدرجات دقيقة في الانعكاس الظلي تتغير مع حركة المتلقي داخل الغرفة.`,
    architecturalStagingAr: isDark
      ? `يُنصح بعرض اللوحة فوق جدار من خشب الجوز الداكن أو الخرسانة المعمارية الرمادية الفاتحة لتحقيق تباين هادئ وأنيق يبرز إشراق النغمات الذهبية، مع مسافة خلوص لا تقل عن 1.2 متر من حواف الأثاث المحيط.`
      : `يُفضل وضعها فوق جدار أبيض متحفي ناعم خالي من اللمعان (Eggshell Gallery White) لتمكين درجات اللون الباستيلية والهادئة من التنفس والامتداد في الفضاء المعماري.`,
    lightingPrescriptionAr: `المعيار المتحفي المثالي هو إضاءة سبوتلايت (Spotlight) مركزة موجهة بدرجة حرارة ${artwork.recommendedLightTemp} كلفن وبزاوية ميل 32 درجة عمودية، مما يقضي على الوهج الزجاجي المباشر ويُسقط ظلالاً ناعمة مجهرية تبرز ثلاثية أبعاد ضربات الفرشاة (Micro-relief).`,
    emotionalAuraAr: `تبث اللوحة حالة من التأمل العميق الذي يهدئ الحواس وينقل الفراغ الداخلي من مجرد غرفة عادية إلى محراب فني ملهم يدعو للتفكر والارتقاء الجمالي.`,
    poeticTributeAr: `في سكون اللون تتلاشى تخوم الزمان، ويبقى النور شاهداً على ومضة من سر الوجود وخلود الروح الإنسانية.`,
    suggestedKeywordsAr: [
      artwork.movementAr.split(' ')[0],
      'تناغم لوني',
      'إضاءة متحفية',
      'عمق مكاني',
      'أصالة تشكيلية'
    ]
  };
}
