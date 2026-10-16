import React, { useState } from 'react';
import {
  DisplayMode,
  FrameStyle,
  MattingStyle,
  WallTexture,
  TableSurface,
  SceneConfig,
  LightingPreset
} from '../types/art';
import {
  Maximize2,
  Minimize2,
  SunMedium,
  Palette,
  Box,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Eye
} from 'lucide-react';

interface CollapsibleBottomDockProps {
  config: SceneConfig;
  onChangeConfig: (newConfig: Partial<SceneConfig>) => void;
  onOpenCritique: () => void;
  onTakeSnapshot: () => void;
}

type TabType = 'mode' | 'frame' | 'lighting' | 'surfaces' | 'depth';

export const CollapsibleBottomDock: React.FC<CollapsibleBottomDockProps> = ({
  config,
  onChangeConfig,
  onOpenCritique,
  onTakeSnapshot
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('mode');

  return (
    <aside
      aria-label="شريط التحكم في المشهد الفني"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[94vw] max-w-4xl z-30 transition-transform duration-300 ease-out ${
        isCollapsed ? 'translate-y-[calc(100%-40px)]' : 'translate-y-0'
      }`}
    >
      {/* Top Toggle Bar */}
      <div className="flex justify-between items-center mb-1.5 px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 text-xs bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-amber-300 px-3 py-1.5 rounded-full border border-stone-800 shadow-md transition"
            aria-label={isCollapsed ? 'إظهار لوحة التحكم' : 'إخفاء لوحة التحكم'}
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>إظهار لوحة التحكم</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>إخفاء (وضع السينما الكامل)</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCritique}
            className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 px-3.5 py-1.5 rounded-full shadow-lg font-bold transition"
            aria-label="فتح التوصيف الفني المعمق"
          >
            <Eye className="w-3.5 h-3.5 text-stone-950" />
            <span>إدراك الأوصاف والتوجيه الفني</span>
          </button>
        </div>

        <button
          onClick={onTakeSnapshot}
          className="flex items-center gap-1 text-xs bg-stone-900/90 hover:bg-stone-800 text-stone-300 px-3 py-1.5 rounded-full border border-stone-800 shadow-md transition"
          aria-label="التقاط صورة للمشهد"
        >
          <Maximize2 className="w-3 h-3 text-amber-400" />
          <span>لقطة المشهد</span>
        </button>
      </div>

      {/* Main Dock Container */}
      <div className="bg-stone-950/95 border border-stone-800/90 rounded-2xl shadow-2xl p-3 md:p-4 text-stone-200">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2.5 mb-3 overflow-x-auto gap-1">
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setActiveTab('mode')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'mode'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              أوضاع العرض
            </button>

            <button
              onClick={() => setActiveTab('frame')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'frame'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              الإطار والمقاس
            </button>

            <button
              onClick={() => setActiveTab('lighting')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'lighting'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5" />
              الإضاءة والجو
            </button>

            <button
              onClick={() => setActiveTab('surfaces')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'surfaces'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              خامات الفضاء
            </button>

            <button
              onClick={() => setActiveTab('depth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'depth'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              العمق والدوران
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="min-h-[64px] flex items-center">
          {/* 1. Display Mode Tab */}
          {activeTab === 'mode' && (
            <div className="w-full flex flex-wrap items-center gap-2">
              {[
                { id: 'wall', label: 'عرض الحائط (Gallery Wall)', desc: 'جدار المتحف الفاخر' },
                { id: 'table', label: 'عرض الطاولة (Desktop & Easel)', desc: 'حامل فني على مكتب' },
                { id: 'spatial3d', label: 'العرض الفضائي ثلاثي الأبعاد', desc: 'طبقات طافية وتفاعل مكاني' },
                { id: 'derive', label: 'استنباط الخلفيات والواجهات', desc: 'مولد التصاميم والجزيئات' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => onChangeConfig({ displayMode: mode.id as DisplayMode })}
                  className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl border text-right transition ${
                    config.displayMode === mode.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  <div className="text-xs font-bold">{mode.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{mode.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* 2. Frame & Dimensions Tab */}
          {activeTab === 'frame' && (
            <div className="w-full space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'ornate-gold', label: 'إطار ذهبي مزخرف' },
                  { id: 'minimal-black', label: 'إطار أسود ناعم' },
                  { id: 'natural-oak', label: 'خشب بلوط طبيعي' },
                  { id: 'floating-canvas', label: 'كانفاس عائم (مفتوح)' },
                  { id: 'acrylic-block', label: 'قالب أكريليك زجاجي' }
                ].map(frame => (
                  <button
                    key={frame.id}
                    onClick={() => onChangeConfig({ frameStyle: frame.id as FrameStyle })}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition ${
                      config.frameStyle === frame.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    {frame.label}
                  </button>
                ))}
              </div>

              {/* Matting and Scale Sliders */}
              <div className="flex items-center gap-4 text-xs pt-1 border-t border-stone-900">
                <span className="text-stone-400">حاشية باسبارتو:</span>
                {(['none', 'thin', 'wide'] as MattingStyle[]).map(m => (
                  <button
                    key={m}
                    onClick={() => onChangeConfig({ matting: m })}
                    className={`px-2.5 py-1 rounded text-xs border ${
                      config.matting === m
                        ? 'bg-stone-800 border-amber-400 text-amber-200'
                        : 'border-stone-800 text-stone-400'
                    }`}
                  >
                    {m === 'none' ? 'بدون' : m === 'thin' ? 'رفيعة' : 'عريضة'}
                  </button>
                ))}

                <div className="flex-1 flex items-center gap-2 mr-4">
                  <span className="text-stone-400 whitespace-nowrap">المقاس:</span>
                  <input
                    type="range"
                    min="0.7"
                    max="1.6"
                    step="0.05"
                    value={config.scale}
                    onChange={e => onChangeConfig({ scale: Number(e.target.value) })}
                    className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-stone-400 text-[11px]">{Math.round(config.scale * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Lighting & Ambience Tab */}
          {activeTab === 'lighting' && (
            <div className="w-full space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'museum-spot', label: 'المتحف الملكي (3000K)' },
                  { id: 'daylight', label: 'ضوء النهار المحايد (5200K)' },
                  { id: 'golden-hour', label: 'الساعة الذهبية (2400K)' },
                  { id: 'dramatic-ambient', label: 'أجواء خافتة درامية' },
                  { id: 'cyber-modern', label: 'ستوديو حديث معاصر' }
                ].map(light => (
                  <button
                    key={light.id}
                    onClick={() => onChangeConfig({ lightingPreset: light.id as LightingPreset })}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition ${
                      config.lightingPreset === light.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    {light.label}
                  </button>
                ))}
              </div>

              {/* Sliders for Intensity and Angle */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-t border-stone-900">
                <div className="flex items-center gap-2">
                  <span className="text-stone-400">شدة الإضاءة:</span>
                  <input
                    type="range"
                    min="0.4"
                    max="2.4"
                    step="0.1"
                    value={config.lightIntensity}
                    onChange={e => onChangeConfig({ lightIntensity: Number(e.target.value) })}
                    className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-stone-400 text-[11px]">{config.lightIntensity.toFixed(1)}x</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400">زاوية الكشاف:</span>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    step="5"
                    value={config.lightAngle}
                    onChange={e => onChangeConfig({ lightAngle: Number(e.target.value) })}
                    className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-stone-400 text-[11px]">{config.lightAngle}°</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Surfaces Tab */}
          {activeTab === 'surfaces' && (
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-stone-400 whitespace-nowrap">جدار العرض:</span>
                {[
                  { id: 'gallery-white', label: 'أبيض متحفي' },
                  { id: 'warm-plaster', label: 'جص دافئ' },
                  { id: 'industrial-concrete', label: 'خرسانة معمارية' },
                  { id: 'luxury-walnut', label: 'خشب جوز داكن' },
                  { id: 'classic-molding', label: 'زخارف باريسية' },
                  { id: 'dark-obsidian', label: 'سبج أسود داكن' }
                ].map(w => (
                  <button
                    key={w.id}
                    onClick={() => onChangeConfig({ wallTexture: w.id as WallTexture })}
                    className={`py-1 px-2.5 rounded-lg text-xs font-medium border whitespace-nowrap transition ${
                      config.wallTexture === w.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              {/* Table Top Surface Selector */}
              <div className="flex items-center gap-2 pt-1 border-t border-stone-900">
                <span className="text-xs text-stone-400 whitespace-nowrap">سطح الطاولة:</span>
                {[
                  { id: 'marble-white', label: 'رخام أبيض مصقول' },
                  { id: 'natural-wood', label: 'خشب دافئ' },
                  { id: 'smoked-glass', label: 'زجاج مدخن' },
                  { id: 'matte-slate', label: 'حجر أردواز مطفي' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => onChangeConfig({ tableSurface: t.id as TableSurface })}
                    className={`py-1 px-2.5 rounded-lg text-xs font-medium border whitespace-nowrap transition ${
                      config.tableSurface === t.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}

                <button
                  onClick={() => onChangeConfig({ showProps: !config.showProps })}
                  className={`mr-auto py-1 px-3 rounded-lg text-xs font-medium border transition ${
                    config.showProps
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  {config.showProps ? 'إخفاء مقعد المتحف' : 'إظهار مقعد المتحف'}
                </button>
              </div>
            </div>
          )}

          {/* 5. Depth & 3D Spatial Tab */}
          {activeTab === 'depth' && (
            <div className="w-full flex flex-col md:flex-row items-center gap-4 text-xs">
              <div className="flex-1 flex items-center gap-3 w-full">
                <span className="text-stone-400 whitespace-nowrap">انفصال الطبقات ثلاثية الأبعاد (Exploded Depth):</span>
                <input
                  type="range"
                  min="0"
                  max="2.0"
                  step="0.1"
                  value={config.depthSeparation}
                  onChange={e => onChangeConfig({ depthSeparation: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-amber-300 font-mono text-[11px]">{config.depthSeparation.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onChangeConfig({ autoRotate: !config.autoRotate })}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition ${
                    config.autoRotate
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  {config.autoRotate ? 'إيقاف الدوران التلقائي' : 'تفعيل الدوران التلقائي'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
