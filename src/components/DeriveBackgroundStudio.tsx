import React, { useEffect, useRef, useState } from 'react';
import { Artwork } from '../types/art';
import { generateCssVariables, getContrastRatio } from '../utils/artEngine';
import { Copy, Check, Download, Sparkles, Layers, Sliders, Smartphone, Monitor, Square } from 'lucide-react';

interface DeriveBackgroundStudioProps {
  artwork: Artwork;
  onClose?: () => void;
}

type WallpaperRatio = 'mobile' | 'desktop' | 'square';
type PosterLayout = 'minimal' | 'poster' | 'gradient';

export const DeriveBackgroundStudio: React.FC<DeriveBackgroundStudioProps> = ({ artwork }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [wallpaperRatio, setWallpaperRatio] = useState<WallpaperRatio>('mobile');
  const [posterLayout, setPosterLayout] = useState<PosterLayout>('poster');
  const [particleDensity, setParticleDensity] = useState<number>(80);
  const [speed, setSpeed] = useState<number>(1);
  const animFrameRef = useRef<number | null>(null);

  // Animated Background Particle / Wave Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    // Generate dynamic particles inspired by the artwork
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      angle: number;
      spin: number;
    }[] = [];

    for (let i = 0; i < particleDensity; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 2 + Math.random() * 6,
        color: artwork.palette[i % artwork.palette.length],
        alpha: 0.3 + Math.random() * 0.6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015 * speed;

      // Deep atmospheric background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, artwork.palette[0] || '#0f172a');
      bgGrad.addColorStop(0.5, artwork.palette[1] || '#1e293b');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render artistic fluid flow or swirling celestial currents
      if (artwork.generatorStyle === 'starry') {
        // Swirling vortexes
        ctx.lineWidth = 2.5;
        for (let s = 0; s < 3; s++) {
          const cx = width * (0.25 + s * 0.3);
          const cy = height * (0.35 + (s % 2) * 0.2);
          for (let r = 30; r < 140; r += 20) {
            ctx.beginPath();
            ctx.strokeStyle = artwork.palette[(s + Math.floor(r / 20)) % artwork.palette.length];
            ctx.globalAlpha = 0.25;
            ctx.arc(cx, cy, r, time * 0.5, time * 0.5 + Math.PI * 1.4);
            ctx.stroke();
          }
        }
      } else if (artwork.generatorStyle === 'wave') {
        // Rolling sinusoidal wave ribbons
        for (let w = 0; w < 4; w++) {
          ctx.beginPath();
          ctx.fillStyle = artwork.palette[(w + 1) % artwork.palette.length];
          ctx.globalAlpha = 0.18;
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 20) {
            const y = height * (0.55 + w * 0.1) + Math.sin(x * 0.008 + time + w) * 35;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();
        }
      } else if (artwork.generatorStyle === 'islamic') {
        // Sacred geometric pulsing rings
        const cx = width / 2;
        const cy = height / 2;
        ctx.strokeStyle = artwork.palette[2] || '#f59e0b';
        ctx.lineWidth = 1.5;
        for (let ring = 1; ring <= 5; ring++) {
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          const r = ring * 45 + Math.sin(time) * 10;
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw and update particles
      particles.forEach(p => {
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        p.angle += p.spin * speed;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (artwork.generatorStyle === 'kiss' || artwork.generatorStyle === 'abstract') {
          // Geometric shards / gold flakes
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
        } else {
          // Glowing soft orbs
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [artwork, particleDensity, speed]);

  const copyCssVars = () => {
    const css = generateCssVariables(artwork);
    navigator.clipboard.writeText(css);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const copyHexValue = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // Export Wallpaper image download
  const downloadWallpaper = () => {
    const exportCanvas = document.createElement('canvas');
    let w = 1080;
    let h = 1920; // 9:16 mobile
    if (wallpaperRatio === 'desktop') {
      w = 1920;
      h = 1080; // 16:9
    } else if (wallpaperRatio === 'square') {
      w = 1440;
      h = 1440; // 1:1
    }

    exportCanvas.width = w;
    exportCanvas.height = h;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, artwork.palette[0] || '#0f172a');
    bgGrad.addColorStop(0.5, artwork.palette[1] || '#1e293b');
    bgGrad.addColorStop(1, '#050505');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Draw artistic elements based on layout
    if (posterLayout === 'poster') {
      // Elegant gallery margin
      const margin = w * 0.08;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

      // Typography
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(w * 0.05)}px Cairo, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(artwork.titleAr, w / 2, h * 0.78);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = `${Math.round(w * 0.028)}px Cairo, sans-serif`;
      ctx.fillText(`${artwork.artistAr} • ${artwork.year}`, w / 2, h * 0.83);

      // Color Swatch Bar in poster
      const swatchW = w * 0.5;
      const startX = (w - swatchW) / 2;
      const singleW = swatchW / artwork.palette.length;
      artwork.palette.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(startX + i * singleW, h * 0.88, singleW, 14);
      });
    }

    // Trigger download
    const link = document.createElement('a');
    link.download = `rawaq-${artwork.id}-${wallpaperRatio}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-stone-950 text-stone-100 overflow-hidden" data-testid="derive-studio">
      {/* Visual Canvas Simulator */}
      <div className="relative flex-1 h-64 md:h-full bg-stone-900 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        <div className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-800 text-xs font-medium text-amber-300 flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          استنباط خلفية تفاعلية حية
        </div>

        {/* Floating Quick Download Pill */}
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 flex items-center gap-2">
          <button
            onClick={downloadWallpaper}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl shadow-lg transition"
            aria-label="تحميل الخلفية المستنبطة"
          >
            <Download className="w-4 h-4" />
            تحميل كخلفية شاشة
          </button>
        </div>
      </div>

      {/* Control & Palettes Panel */}
      <div className="w-full md:w-96 border-t md:border-t-0 md:border-r border-stone-800 bg-stone-950 p-5 pb-36 md:pb-6 overflow-y-auto space-y-6">
        <div>
          <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            استنباط الألوان ومنظومة التصميم
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            مستخلصة بدقة من لوحة &quot;{artwork.titleAr}&quot; لتطبيقات الويب وواجهات المستخدم.
          </p>
        </div>

        {/* Color Swatches Grid */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-stone-400 block">النغمات اللونية المستنبطة (انقر للنسخ)</label>
          <div className="grid grid-cols-5 gap-2">
            {artwork.palette.map((hex, idx) => {
              const contrastOnWhite = getContrastRatio(hex, '#ffffff');
              return (
                <button
                  key={idx}
                  onClick={() => copyHexValue(hex)}
                  className="group flex flex-col items-center gap-1 p-1 rounded-lg border border-stone-800 hover:border-amber-500 transition relative"
                  title={`${hex} - نسبة التباين: ${contrastOnWhite}:1`}
                  aria-label={`نسخ اللون ${hex}`}
                >
                  <div
                    className="w-full h-10 rounded-md shadow-inner transition group-hover:scale-105"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-[10px] font-mono text-stone-400">{hex}</span>
                  {copiedHex === hex && (
                    <span className="absolute -top-6 bg-stone-900 border border-stone-700 text-amber-300 text-[10px] px-1.5 py-0.5 rounded shadow">
                      تم النسخ!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Copy CSS Variables Button */}
        <div>
          <button
            onClick={copyCssVars}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold py-2.5 rounded-xl transition"
            aria-label="نسخ متغيرات CSS"
          >
            {copiedCss ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">تم نسخ متغيرات CSS (:root)</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>نسخ منظومة ألوان CSS لمتغيرات الواجهة</span>
              </>
            )}
          </button>
        </div>

        {/* Wallpaper Export Configuration */}
        <div className="space-y-3 pt-3 border-t border-stone-900">
          <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-500" />
            تخصيص مقاس وخلفية الشاشة
          </label>

          {/* Aspect Ratio Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setWallpaperRatio('mobile')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition ${
                wallpaperRatio === 'mobile'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              هاتف (9:16)
            </button>
            <button
              onClick={() => setWallpaperRatio('desktop')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition ${
                wallpaperRatio === 'desktop'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              حاسوب (16:9)
            </button>
            <button
              onClick={() => setWallpaperRatio('square')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition ${
                wallpaperRatio === 'square'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              مربع (1:1)
            </button>
          </div>

          {/* Layout Mode */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPosterLayout('poster')}
              className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                posterLayout === 'poster'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
              }`}
            >
              ملصق متحفي مع هوية العمل
            </button>
            <button
              onClick={() => setPosterLayout('minimal')}
              className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                posterLayout === 'minimal'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800'
              }`}
            >
              خلفية فنية مجردة نقية
            </button>
          </div>

          {/* Particle Density & Speed sliders */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-stone-400">
              <span>كثافة حركة الجزيئات</span>
              <span>{particleDensity}</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              value={particleDensity}
              onChange={e => setParticleDensity(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-stone-400">
              <span>سرعة المحاكاة التفاعلية</span>
              <span>{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
