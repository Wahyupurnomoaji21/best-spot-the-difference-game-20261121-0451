/** Helper lukis prosedural: gradasi, cahaya, bayangan lembut, dan tekstur butir. */
import { mulberry32 } from './random.js';

/** Gradasi vertikal multi-stop. */
export function verticalGradient(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  return g;
}

/** Gradasi radial untuk cahaya / highlight. */
export function radialGlow(ctx, cx, cy, r, inner, outer) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  return g;
}

/** Persegi membulat. */
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Elips terisi dengan bayangan lembut di bawahnya. */
export function softEllipse(ctx, cx, cy, rx, ry, fill) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Bayangan lantai berbentuk elips gelap transparan. */
export function floorShadow(ctx, cx, cy, rx, ry, alpha = 0.28) {
  ctx.save();
  ctx.fillStyle = `rgba(10, 6, 2, ${alpha})`;
  ctx.filter = 'blur(6px)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Butir tekstur acak (bintik halus) di dalam persegi — memberi kesan nyata, bukan datar. */
export function speckle(ctx, x, y, w, h, seed, count, alpha, light = false) {
  const rng = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const px = x + rng() * w;
    const py = y + rng() * h;
    const r = 0.4 + rng() * 1.4;
    ctx.fillStyle = light
      ? `rgba(255, 240, 200, ${alpha * (0.3 + rng() * 0.7)})`
      : `rgba(20, 10, 4, ${alpha * (0.3 + rng() * 0.7)})`;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Serat kayu: garis-garis lengkung halus searah sumbu x. */
export function woodGrain(ctx, x, y, w, h, seed, base, dark) {
  const rng = mulberry32(seed);
  ctx.save();
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    ctx.globalAlpha = 0.12 + rng() * 0.16;
    ctx.beginPath();
    const yy = y + (i + 0.5) * (h / 9) + (rng() - 0.5) * 4;
    ctx.moveTo(x, yy);
    ctx.bezierCurveTo(x + w * 0.3, yy + (rng() - 0.5) * 8, x + w * 0.7, yy + (rng() - 0.5) * 8, x + w, yy);
    ctx.stroke();
  }
  ctx.restore();
}

/** Highlight kaca / kilau: garis putih transparan diagonal. */
export function glassShine(ctx, x, y, w, h, alpha = 0.16) {
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.12, y);
  ctx.lineTo(x + w * 0.34, y);
  ctx.lineTo(x + w * 0.08, y + h);
  ctx.lineTo(x - w * 0.14, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Vignette: tepi gelap halus agar gambar terasa seperti foto. */
export function vignette(ctx, w, h, strength = 0.22) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(8,4,0,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** Matahari / bulan bercahaya dengan halo. */
export function glowingOrb(ctx, cx, cy, r, core, halo) {
  ctx.save();
  ctx.fillStyle = radialGlow(ctx, cx, cy, r * 3.2, halo, 'rgba(255,180,80,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, r * 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = radialGlow(ctx, cx, cy, r, core, halo);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Awan lembut dari beberapa lingkaran. */
export function softCloud(ctx, x, y, scale, fill) {
  ctx.save();
  ctx.fillStyle = fill;
  for (const [dx, dy, r] of [[0, 0, 20], [22, 4, 16], [-22, 5, 15], [8, -10, 15], [-8, -8, 13]]) {
    ctx.beginPath();
    ctx.arc(x + dx * scale, y + dy * scale, r * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
