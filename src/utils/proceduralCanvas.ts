import { Artwork } from '../types/art';

/**
 * Procedurally generates high-resolution canvas artworks with zero 404 dependencies.
 */
export function renderArtworkToCanvas(
  canvas: HTMLCanvasElement,
  artwork: Artwork,
  targetWidth = 1024,
  customImage?: HTMLImageElement
): void {
  const height = Math.round(targetWidth / artwork.aspectRatio);
  canvas.width = targetWidth;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // If custom uploaded image exists, draw it
  if (customImage && customImage.complete && customImage.naturalWidth > 0) {
    ctx.drawImage(customImage, 0, 0, targetWidth, height);
    applyCanvasGrain(ctx, targetWidth, height, 0.08);
    return;
  }

  // Otherwise procedural masterpiece synthesis
  switch (artwork.generatorStyle) {
    case 'starry':
      drawStarryNight(ctx, targetWidth, height);
      break;
    case 'wave':
      drawGreatWave(ctx, targetWidth, height);
      break;
    case 'lilies':
      drawWaterLilies(ctx, targetWidth, height);
      break;
    case 'kiss':
      drawTheKiss(ctx, targetWidth, height);
      break;
    case 'clocks':
      drawPersistenceOfMemory(ctx, targetWidth, height);
      break;
    case 'abstract':
      drawCompositionVIII(ctx, targetWidth, height);
      break;
    case 'islamic':
      drawAndalusianGirih(ctx, targetWidth, height);
      break;
    case 'sfumato':
      drawSfumatoRenaissance(ctx, targetWidth, height);
      break;
    default:
      drawGenerativeAbstract(ctx, targetWidth, height, artwork.palette);
      break;
  }

  // Apply subtle artistic linen canvas texture overlay
  applyCanvasGrain(ctx, targetWidth, height, 0.12);
}

function drawStarryNight(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Deep night sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#0a192f');
  skyGrad.addColorStop(0.5, '#1e3a8a');
  skyGrad.addColorStop(0.8, '#0f172a');
  skyGrad.addColorStop(1, '#020617');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Swirling celestial sky vortexes
  ctx.lineWidth = Math.max(3, w * 0.007);
  for (let swirl = 0; swirl < 4; swirl++) {
    const cx = w * (0.3 + swirl * 0.2);
    const cy = h * (0.28 + (swirl % 2) * 0.12);
    const radius = w * 0.22;
    for (let r = 20; r < radius; r += 12) {
      ctx.beginPath();
      const color = r % 24 === 0 ? '#fbbf24' : r % 16 === 0 ? '#60a5fa' : '#38bdf8';
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.65;
      ctx.arc(cx, cy, r, 0.2, Math.PI * 1.8, false);
      ctx.stroke();
    }
  }

  // Glowing Stars and halos
  const stars = [
    { x: w * 0.15, y: h * 0.18, r: 24, c: '#fef08a' },
    { x: w * 0.35, y: h * 0.15, r: 28, c: '#fde047' },
    { x: w * 0.62, y: h * 0.22, r: 32, c: '#f59e0b' },
    { x: w * 0.88, y: h * 0.16, r: 40, c: '#fbbf24' }, // Crescent Moon area
    { x: w * 0.75, y: h * 0.38, r: 20, c: '#fef08a' }
  ];

  for (const s of stars) {
    const radial = ctx.createRadialGradient(s.x, s.y, 2, s.x, s.y, s.r * 1.8);
    radial.addColorStop(0, '#ffffff');
    radial.addColorStop(0.3, s.c);
    radial.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Impasto dashes around stars
    for (let a = 0; a < Math.PI * 2; a += 0.4) {
      const rx = s.x + Math.cos(a) * s.r * 1.2;
      const ry = s.y + Math.sin(a) * s.r * 1.2;
      ctx.fillStyle = '#fde047';
      ctx.fillRect(rx - 2, ry - 2, 5, 5);
    }
  }

  // Glowing Crescent Moon
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(w * 0.88, h * 0.16, 26, 0.4, Math.PI * 1.7);
  ctx.arc(w * 0.86, h * 0.16, 20, Math.PI * 1.7, 0.4, true);
  ctx.fill();

  // Distant Alpine hills
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#0f2744';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.65);
  ctx.bezierCurveTo(w * 0.25, h * 0.58, w * 0.5, h * 0.68, w * 0.75, h * 0.6);
  ctx.lineTo(w, h * 0.64);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();

  // Village rooftops and church steeple
  ctx.fillStyle = '#081426';
  ctx.fillRect(w * 0.35, h * 0.72, w * 0.5, h * 0.28);
  ctx.fillStyle = '#eab308';
  for (let i = 0; i < 18; i++) {
    const vx = w * (0.38 + (i % 6) * 0.08);
    const vy = h * (0.76 + Math.floor(i / 6) * 0.07);
    ctx.fillRect(vx, vy, 6, 8); // village candlelit windows
  }

  // Church Spire
  ctx.fillStyle = '#030712';
  ctx.beginPath();
  ctx.moveTo(w * 0.55, h * 0.52);
  ctx.lineTo(w * 0.58, h * 0.78);
  ctx.lineTo(w * 0.52, h * 0.78);
  ctx.fill();

  // Foreground Cypress Tree (Dominant towering silhouette)
  ctx.fillStyle = '#05130e';
  ctx.beginPath();
  ctx.moveTo(w * 0.12, h);
  ctx.bezierCurveTo(w * 0.08, h * 0.6, w * 0.16, h * 0.35, w * 0.18, h * 0.12);
  ctx.bezierCurveTo(w * 0.22, h * 0.3, w * 0.26, h * 0.65, w * 0.28, h);
  ctx.fill();

  // Flame-like cypress brush strokes
  ctx.strokeStyle = '#0f382c';
  ctx.lineWidth = 4;
  for (let y = h * 0.2; y < h; y += 18) {
    ctx.beginPath();
    ctx.moveTo(w * 0.14, y);
    ctx.bezierCurveTo(w * 0.18, y - 20, w * 0.22, y - 10, w * 0.24, y + 10);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
}

function drawGreatWave(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Sky: soft cream / parchment beige
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  skyGrad.addColorStop(0, '#e5d9c5');
  skyGrad.addColorStop(0.7, '#f4ece1');
  skyGrad.addColorStop(1, '#dfe7ec');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Mount Fuji in the low center background
  const fujiX = w * 0.52;
  const fujiY = h * 0.68;
  const fujiBaseW = w * 0.18;
  const fujiH = h * 0.18;

  // Fuji Snow cap
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(fujiX, fujiY - fujiH);
  ctx.lineTo(fujiX + fujiBaseW * 0.35, fujiY - fujiH * 0.4);
  ctx.lineTo(fujiX - fujiBaseW * 0.35, fujiY - fujiH * 0.4);
  ctx.fill();

  // Fuji Dark base
  ctx.fillStyle = '#1e3a5f';
  ctx.beginPath();
  ctx.moveTo(fujiX - fujiBaseW * 0.35, fujiY - fujiH * 0.4);
  ctx.lineTo(fujiX + fujiBaseW * 0.35, fujiY - fujiH * 0.4);
  ctx.lineTo(fujiX + fujiBaseW, fujiY);
  ctx.lineTo(fujiX - fujiBaseW, fujiY);
  ctx.fill();

  // Distant rolling swells (Indigo / Prussian Blue)
  ctx.fillStyle = '#164e63';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.75);
  ctx.bezierCurveTo(w * 0.3, h * 0.72, w * 0.6, h * 0.82, w, h * 0.74);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();

  // Slender Japanese Wooden Skiff (Oshiokuri-bune boat)
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.ellipse(w * 0.46, h * 0.78, w * 0.12, 6, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Midground secondary crest
  ctx.fillStyle = '#0e7490';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.68);
  ctx.bezierCurveTo(w * 0.25, h * 0.55, w * 0.4, h * 0.75, w * 0.6, h * 0.85);
  ctx.lineTo(0, h);
  ctx.fill();

  // Foreground Giant Cresting Wave
  ctx.fillStyle = '#082f49';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.3);
  ctx.bezierCurveTo(w * 0.2, h * 0.05, w * 0.45, h * 0.12, w * 0.52, h * 0.38);
  ctx.bezierCurveTo(w * 0.38, h * 0.5, w * 0.3, h * 0.6, w * 0.2, h);
  ctx.lineTo(0, h);
  ctx.fill();

  // Wave Prussian Blue interior bands
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(w * 0.05, h * 0.45);
  ctx.bezierCurveTo(w * 0.22, h * 0.18, w * 0.42, h * 0.22, w * 0.48, h * 0.42);
  ctx.stroke();

  // Foam claws / tendrils (white frothing fingers)
  ctx.fillStyle = '#ffffff';
  for (let claw = 0; claw < 16; claw++) {
    const angle = 0.2 + (claw / 16) * 1.6;
    const px = w * 0.48 + Math.cos(angle) * w * 0.14 - claw * 4;
    const py = h * 0.34 - Math.sin(angle) * h * 0.22;
    ctx.beginPath();
    ctx.arc(px, py, 6 + (claw % 3) * 3, 0, Math.PI * 2);
    ctx.fill();
    // Claw finger hook
    ctx.fillRect(px - 10, py, 15, 4);
  }

  // Sea Spray Dots
  for (let d = 0; d < 70; d++) {
    const sx = w * (0.28 + Math.random() * 0.45);
    const sy = h * (0.15 + Math.random() * 0.4);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Traditional artist signature cartouche (top left)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(w * 0.07, h * 0.08, w * 0.09, h * 0.18);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(w * 0.07, h * 0.08, w * 0.09, h * 0.18);
  // Red vermilion seal
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(w * 0.09, h * 0.2, 14, 14);
}

function drawWaterLilies(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Atmospheric water surface gradient
  const pondGrad = ctx.createLinearGradient(0, 0, w, h);
  pondGrad.addColorStop(0, '#134e4a');
  pondGrad.addColorStop(0.35, '#047857');
  pondGrad.addColorStop(0.65, '#3b82f6');
  pondGrad.addColorStop(0.85, '#a855f7');
  pondGrad.addColorStop(1, '#0f766e');
  ctx.fillStyle = pondGrad;
  ctx.fillRect(0, 0, w, h);

  // Broad horizontal impressionist water reflection strokes
  for (let y = 0; y < h; y += 14) {
    ctx.fillStyle = y % 28 === 0 ? 'rgba(147, 197, 253, 0.22)' : 'rgba(216, 180, 254, 0.25)';
    ctx.fillRect(0, y, w, 9);
  }

  // Floating Lily Pads (Ellipses in clusters with notch cuts)
  const padClusters = [
    { x: w * 0.2, y: h * 0.35, r: 42, count: 5 },
    { x: w * 0.65, y: h * 0.28, r: 55, count: 6 },
    { x: w * 0.42, y: h * 0.68, r: 64, count: 7 },
    { x: w * 0.82, y: h * 0.72, r: 70, count: 5 }
  ];

  for (const group of padClusters) {
    for (let p = 0; p < group.count; p++) {
      const px = group.x + (p % 3) * 38 - 30;
      const py = group.y + Math.floor(p / 3) * 22;
      const radX = group.r * (0.8 + (p % 2) * 0.3);
      const radY = radX * 0.38;

      // Lily pad base
      ctx.fillStyle = p % 2 === 0 ? '#14532d' : '#166534';
      ctx.beginPath();
      ctx.ellipse(px, py, radX, radY, 0, 0.2, Math.PI * 1.85);
      ctx.lineTo(px, py);
      ctx.fill();

      // Rim highlight
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Blooming Lotus / Lily Blossoms
      if (p % 2 === 1) {
        const flowerX = px + radX * 0.4;
        const flowerY = py - 4;
        ctx.fillStyle = '#fbcfe8';
        for (let petal = 0; petal < 6; petal++) {
          const pa = (petal / 6) * Math.PI;
          ctx.beginPath();
          ctx.ellipse(flowerX + Math.cos(pa) * 9, flowerY - Math.sin(pa) * 11, 4, 8, pa, 0, Math.PI * 2);
          ctx.fill();
        }
        // Golden flower center
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(flowerX, flowerY - 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Weeping willow branch reflections dropping from top edge
  ctx.strokeStyle = 'rgba(20, 83, 45, 0.45)';
  ctx.lineWidth = 3;
  for (let x = 0; x < w; x += 35) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 20, h * 0.2, x - 15, h * 0.35, x + 5, h * 0.45);
    ctx.stroke();
  }
}

function drawTheKiss(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Gilded background with gold leaf speckles and dark bronze edges
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.1, w * 0.5, h * 0.45, w * 0.7);
  bg.addColorStop(0, '#fef08a');
  bg.addColorStop(0.3, '#eab308');
  bg.addColorStop(0.7, '#a16207');
  bg.addColorStop(1, '#292524');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Field of wildflowers at base
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, h * 0.78, w, h * 0.22);
  const colors = ['#f43f5e', '#38bdf8', '#fbbf24', '#ffffff', '#a855f7'];
  for (let f = 0; f < 120; f++) {
    const fx = Math.random() * w;
    const fy = h * 0.78 + Math.random() * h * 0.22;
    ctx.fillStyle = colors[f % colors.length];
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central Lovers' Silhouetted Mantle / Robe (Iconic Klimt Gold Column)
  const centerX = w * 0.5;
  const topY = h * 0.25;
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.ellipse(centerX, h * 0.52, w * 0.24, h * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Man's Robe: Black and Grey Geometric Rectangles
  for (let r = 0; r < 28; r++) {
    const rx = centerX - w * 0.18 + (r % 4) * (w * 0.08);
    const ry = topY + Math.floor(r / 4) * (h * 0.06);
    ctx.fillStyle = r % 2 === 0 ? '#18181b' : '#ffffff';
    ctx.fillRect(rx, ry, 14, 28);
  }

  // Woman's Robe: Concentric Circles and Floral Ovals
  for (let c = 0; c < 24; c++) {
    const cx = centerX + (c % 3) * (w * 0.06);
    const cy = topY + h * 0.12 + Math.floor(c / 3) * (h * 0.06);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lovers' Heads and Embracing Hands
  // Man head
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(centerX - 18, topY + 12, 28, 0, Math.PI * 2);
  ctx.fill();

  // Woman head tilted upwards
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(centerX + 18, topY + 24, 26, 0, Math.PI * 2);
  ctx.fill();
  // Woman's golden hair flowing down
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.ellipse(centerX + 26, topY + 44, 16, 28, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Golden Halo wrapping their heads
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(centerX, topY + 18, 48, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPersistenceOfMemory(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Desert sunset sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
  sky.addColorStop(0, '#f97316');
  sky.addColorStop(0.4, '#fde047');
  sky.addColorStop(0.7, '#67e8f9');
  sky.addColorStop(1, '#0284c7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.55);

  // Cadaqués rocky cliffs on the horizon
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h * 0.45);
  ctx.lineTo(w * 0.75, h * 0.32);
  ctx.lineTo(w * 0.9, h * 0.38);
  ctx.lineTo(w, h * 0.3);
  ctx.lineTo(w, h * 0.55);
  ctx.lineTo(w * 0.6, h * 0.55);
  ctx.fill();

  // Sea water mirror
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(w * 0.45, h * 0.45, w * 0.55, h * 0.1);

  // Surreal beach foreground (matte earth beige)
  ctx.fillStyle = '#a8a29e';
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  // Geometric wooden table block on left
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.58);
  ctx.lineTo(w * 0.32, h * 0.68);
  ctx.lineTo(w * 0.32, h);
  ctx.lineTo(0, h);
  ctx.fill();

  // Dead olive tree trunk on table
  ctx.fillStyle = '#3f3f46';
  ctx.fillRect(w * 0.08, h * 0.28, 14, h * 0.4);
  // Branch extending out
  ctx.beginPath();
  ctx.moveTo(w * 0.08, h * 0.35);
  ctx.lineTo(w * 0.26, h * 0.38);
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#3f3f46';
  ctx.stroke();

  // 1. Melting watch draped over tree branch
  drawMeltingWatch(ctx, w * 0.2, h * 0.38, 38, 55, '#f8fafc', '#d97706');

  // 2. Melting watch hanging over table edge
  drawMeltingWatch(ctx, w * 0.24, h * 0.68, 55, 65, '#f8fafc', '#0284c7');

  // 3. Melting watch on bizarre sleeping creature in center
  drawMeltingWatch(ctx, w * 0.54, h * 0.72, 60, 48, '#f8fafc', '#ea580c');

  // Solid orange pocket watch closed with ants
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.arc(w * 0.16, h * 0.72, 16, 0, Math.PI * 2);
  ctx.fill();
  // Black ants crawling on it
  ctx.fillStyle = '#000000';
  for (let a = 0; a < 8; a++) {
    ctx.fillRect(w * 0.16 + (a % 3) * 5 - 5, h * 0.72 + Math.floor(a / 3) * 4 - 4, 2.5, 2.5);
  }
}

function drawMeltingWatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  faceColor: string,
  rimColor: string
) {
  ctx.fillStyle = faceColor;
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(x - rx, y);
  ctx.bezierCurveTo(x - rx, y - ry * 0.6, x + rx * 0.5, y - ry * 0.7, x + rx, y);
  ctx.bezierCurveTo(x + rx, y + ry * 1.2, x - rx * 0.3, y + ry * 1.4, x - rx, y);
  ctx.fill();
  ctx.stroke();

  // Clock hands (limp bent hands)
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 4);
  ctx.bezierCurveTo(x + 10, y + 6, x + 18, y + 15, x + 16, y + 24);
  ctx.stroke();

  // Roman numerals dots
  ctx.fillStyle = '#3f3f46';
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI;
    ctx.fillRect(x + Math.cos(angle) * (rx * 0.6), y + Math.sin(angle) * (ry * 0.6), 3, 3);
  }
}

function drawCompositionVIII(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Light Bauhaus canvas ground
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  // Large dominant black and purple circle (top left)
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(w * 0.22, h * 0.3, w * 0.14, 0, Math.PI * 2);
  ctx.fill();
  // Inner red circle
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(w * 0.22, h * 0.3, w * 0.08, 0, Math.PI * 2);
  ctx.fill();
  // Purple halo
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(w * 0.22, h * 0.3, w * 0.16, 0, Math.PI * 2);
  ctx.stroke();

  // Angular intersecting dynamic lines across canvas
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.05, h * 0.85);
  ctx.lineTo(w * 0.85, h * 0.15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.95);
  ctx.lineTo(w * 0.95, h * 0.45);
  ctx.stroke();

  // Intersecting checkerboard grid lines
  ctx.lineWidth = 1.5;
  for (let l = 0; l < 8; l++) {
    ctx.beginPath();
    ctx.moveTo(w * 0.4 + l * 18, h * 0.3);
    ctx.lineTo(w * 0.5 + l * 18, h * 0.7);
    ctx.stroke();
  }

  // Floating colorful spheres and triangles
  const shapes = [
    { x: w * 0.65, y: h * 0.35, r: 35, c: '#0284c7' },
    { x: w * 0.82, y: h * 0.62, r: 28, c: '#eab308' },
    { x: w * 0.45, y: h * 0.75, r: 24, c: '#16a34a' },
    { x: w * 0.55, y: h * 0.22, r: 18, c: '#ea580c' }
  ];

  for (const s of shapes) {
    ctx.fillStyle = s.c;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Sharp acute triangles
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.6);
  ctx.lineTo(w * 0.42, h * 0.4);
  ctx.lineTo(w * 0.48, h * 0.65);
  ctx.closePath();
  ctx.fill();
}

function drawAndalusianGirih(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Lapis lazuli deep background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.5;
  const maxRadius = Math.min(w, h) * 0.44;

  // Concentric decorative polygons
  const points = 12; // 12-pointed Islamic star
  
  // Outer circle ring with gold beads
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Emerald green backdrop ring
  ctx.fillStyle = 'rgba(5, 150, 105, 0.35)';
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // Draw 12-pointed Star Interlacing Strapwork (Girih lines)
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let pass = 0; pass < 2; pass++) {
    const starR = maxRadius * (pass === 0 ? 0.78 : 0.52);
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i * Math.PI * 2) / points - Math.PI / 2;
      const x = cx + Math.cos(angle) * starR;
      const y = cy + Math.sin(angle) * starR;

      const innerAngle = angle + (Math.PI / points);
      const ix = cx + Math.cos(innerAngle) * (starR * 0.55);
      const iy = cy + Math.sin(innerAngle) * (starR * 0.55);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fillStyle = pass === 0 ? '#1e3a8a' : '#047857';
    ctx.fill();
    ctx.stroke();
  }

  // Central Gold Rosette & Floral Arabesque
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Inset star
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  for (let i = 0; i <= 8; i++) {
    const a = (i * Math.PI * 2) / 8;
    const r = i % 2 === 0 ? maxRadius * 0.16 : maxRadius * 0.08;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.fill();

  // Corner Arabesques
  const corners = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: 0, y: h },
    { x: w, y: h }
  ];
  for (const c of corners) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(c.x, c.y, maxRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawSfumatoRenaissance(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Atmospheric umber and olive background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#27221a');
  grad.addColorStop(0.4, '#4a4031');
  grad.addColorStop(0.7, '#242b1f');
  grad.addColorStop(1, '#171511');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Distant Renaissance misty mountains & bridge
  ctx.fillStyle = '#3f4e3c';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.45);
  ctx.bezierCurveTo(w * 0.25, h * 0.35, w * 0.4, h * 0.48, w * 0.6, h * 0.4);
  ctx.lineTo(w, h * 0.42);
  ctx.lineTo(w, h * 0.6);
  ctx.lineTo(0, h * 0.6);
  ctx.fill();

  // Winding aqua blue river
  ctx.strokeStyle = '#477b72';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.52);
  ctx.bezierCurveTo(w * 0.3, h * 0.48, w * 0.25, h * 0.42, w * 0.4, h * 0.38);
  ctx.stroke();

  // Mona Lisa Enigmatic Silhouette (shoulders & veil)
  const cx = w * 0.5;
  ctx.fillStyle = '#191512';
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.82, w * 0.32, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sfumato Neck & Face with subtle smoky transitions
  ctx.fillStyle = '#a68a68';
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.42, w * 0.16, h * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark hair framing face
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(cx - w * 0.14, h * 0.45, 18, h * 0.16, 0.1, 0, Math.PI * 2);
  ctx.ellipse(cx + w * 0.14, h * 0.45, 18, h * 0.16, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // The Enigmatic Smile (curved subtle shade)
  ctx.strokeStyle = '#57422f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, h * 0.44, 18, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Eyes with sfumato sockets
  ctx.fillStyle = '#3c2f23';
  ctx.beginPath();
  ctx.ellipse(cx - 22, h * 0.38, 8, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 22, h * 0.38, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawGenerativeAbstract(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[]
) {
  // Rich gradient based on custom palette
  const grad = ctx.createLinearGradient(0, 0, w, h);
  palette.forEach((color, i) => {
    grad.addColorStop(i / (palette.length - 1), color);
  });
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Dynamic sweeping arcs
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = palette[i % palette.length];
    ctx.lineWidth = 12 + i * 4;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(w * (0.2 + (i % 3) * 0.3), h * (0.3 + (i % 2) * 0.4), w * 0.25, 0, Math.PI * 1.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
}

/**
 * Applies procedural linen/canvas weave and subtle noise grain
 */
function applyCanvasGrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number
): void {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const factor = intensity * 255;

  for (let i = 0; i < data.length; i += 4) {
    const px = (i / 4) % w;
    const py = Math.floor((i / 4) / w);
    // Cross weave effect
    const weave = ((px % 4 === 0 ? 1 : 0) + (py % 4 === 0 ? 1 : 0)) * 6;
    const noise = (Math.random() - 0.5) * factor + weave;

    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Generates an oil impasto normal map from canvas texture for 3D realism
 */
export function generateNormalMapFromCanvas(
  sourceCanvas: HTMLCanvasElement,
  strength = 1.8
): HTMLCanvasElement {
  const normCanvas = document.createElement('canvas');
  normCanvas.width = 512;
  normCanvas.height = Math.round(512 / (sourceCanvas.width / sourceCanvas.height));
  const normCtx = normCanvas.getContext('2d');
  if (!normCtx) return normCanvas;

  // Draw scaled down version for fast normal calculation
  normCtx.drawImage(sourceCanvas, 0, 0, normCanvas.width, normCanvas.height);
  const imgData = normCtx.getImageData(0, 0, normCanvas.width, normCanvas.height);
  const data = imgData.data;
  const w = normCanvas.width;
  const h = normCanvas.height;

  // Sobel filter to create normal vectors
  const output = normCtx.createImageData(w, h);
  const out = output.data;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      // Luminance samples
      const lLeft = data[(y * w + (x - 1)) * 4];
      const lRight = data[(y * w + (x + 1)) * 4];
      const lTop = data[((y - 1) * w + x) * 4];
      const lBottom = data[((y + 1) * w + x) * 4];

      const dx = ((lRight - lLeft) / 255) * strength;
      const dy = ((lBottom - lTop) / 255) * strength;
      const dz = 1.0;

      // Normalize
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = (dx / len) * 0.5 + 0.5;
      const ny = (-dy / len) * 0.5 + 0.5;
      const nz = (dz / len) * 0.5 + 0.5;

      out[idx] = Math.round(nx * 255);
      out[idx + 1] = Math.round(ny * 255);
      out[idx + 2] = Math.round(nz * 255);
      out[idx + 3] = 255;
    }
  }

  normCtx.putImageData(output, 0, 0);
  return normCanvas;
}
