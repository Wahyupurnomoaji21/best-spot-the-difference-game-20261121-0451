/** Merender kedua panel + marker lingkaran pada perbedaan yang ditemukan. */
import { PANEL_W, PANEL_H } from './config.js';
import { SCENES, drawScene } from './scenes.js';

/** Gambar ulang kedua panel untuk ronde tertentu. */
export function renderPanels(ctxLeft, ctxRight, sceneIndex, mods, seed) {
  drawScene(ctxLeft, sceneIndex, new Set(), seed);
  drawScene(ctxRight, sceneIndex, mods, seed);
}

/** Lingkaran marker emas dengan centang, digambar di kedua panel. */
export function drawFoundMarker(ctx, x, y, r, pulse = 0) {
  ctx.save();
  const rr = r + pulse;
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255,180,40,.9)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(x, y, rr, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#2f8a2f';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(x, y, rr + 3.5, 0, Math.PI * 2);
  ctx.stroke();
  // centang
  ctx.strokeStyle = '#fff3c4';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.4);
  ctx.lineTo(x + r * 0.5, y - r * 0.35);
  ctx.stroke();
  ctx.restore();
}

/** Cincin petunjuk berdenyut pada satu perbedaan yang belum ditemukan. */
export function drawHintRing(ctx, x, y, r, phase) {
  const pulse = 4 + Math.sin(phase) * 3;
  ctx.save();
  ctx.strokeStyle = `rgba(255, 217, 77, ${0.55 + Math.sin(phase) * 0.3})`;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 7]);
  ctx.lineDashOffset = -phase * 12;
  ctx.beginPath();
  ctx.arc(x, y, r + pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** Tanda X merah sesaat untuk klik yang salah. */
export function drawMissMark(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#ff5a4a';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(255,60,40,.8)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12); ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12); ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
  ctx.restore();
}

/** Gambar semua marker temuan di kedua panel. */
export function drawAllMarkers(ctxLeft, ctxRight, sceneIndex, foundIndices, pulseIndex = -1, pulse = 0) {
  const scene = SCENES[sceneIndex];
  for (const idx of foundIndices) {
    const d = scene.diffs[idx];
    drawFoundMarker(ctxLeft, d.x, d.y, d.r, idx === pulseIndex ? pulse : 0);
    drawFoundMarker(ctxRight, d.x, d.y, d.r, idx === pulseIndex ? pulse : 0);
  }
}
