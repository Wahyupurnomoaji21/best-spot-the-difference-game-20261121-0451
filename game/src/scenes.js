/** Tiga scene orisinal, dilukis prosedural di canvas: ruang tamu senja, taman pagi, jalan kota.
 * Setiap scene punya 7 perbedaan; panel kanan digambar dengan `mods` (Set indeks) diterapkan. */
import { PANEL_W, PANEL_H } from './config.js';
import {
  verticalGradient, radialGlow, roundRect, softEllipse, floorShadow,
  speckle, woodGrain, glassShine, vignette, glowingOrb, softCloud,
} from './paint.js';

/* ---------------------------------------------------------------- kucing, bebek, kupu-kupu */

function drawCat(ctx, x, y, s, seed) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  floorShadow(ctx, 0, 26, 34, 7, 0.3);
  ctx.fillStyle = '#e8862e';
  ctx.strokeStyle = '#b85c14';
  ctx.lineWidth = 2;
  // badan duduk
  ctx.beginPath(); ctx.ellipse(0, 0, 26, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // belang
  ctx.strokeStyle = 'rgba(150,70,10,.55)';
  for (const yy of [-16, -4, 8]) {
    ctx.beginPath(); ctx.moveTo(-22, yy); ctx.quadraticCurveTo(0, yy + 5, 22, yy); ctx.stroke();
  }
  // ekor melingkar
  ctx.strokeStyle = '#e8862e'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(22, 18); ctx.quadraticCurveTo(44, 22, 38, 2); ctx.stroke();
  // kepala + telinga
  ctx.fillStyle = '#e8862e';
  ctx.beginPath(); ctx.arc(0, -38, 19, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#b85c14'; ctx.lineWidth = 2; ctx.stroke();
  for (const ex of [-11, 11]) {
    ctx.beginPath(); ctx.moveTo(ex - 7, -50); ctx.lineTo(ex, -64); ctx.lineTo(ex + 7, -50); ctx.closePath();
    ctx.fillStyle = '#e8862e'; ctx.fill(); ctx.stroke();
  }
  // mata, hidung, kumis
  ctx.fillStyle = '#1d2b12';
  ctx.beginPath(); ctx.arc(-7, -40, 2.6, 0, Math.PI * 2); ctx.arc(7, -40, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d94f70';
  ctx.beginPath(); ctx.moveTo(-3, -32); ctx.lineTo(3, -32); ctx.lineTo(0, -28); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(60,30,10,.7)'; ctx.lineWidth = 1;
  for (const sy of [-30, -27]) {
    ctx.beginPath(); ctx.moveTo(-14, sy); ctx.lineTo(-30, sy - 3); ctx.moveTo(14, sy); ctx.lineTo(30, sy - 3); ctx.stroke();
  }
  ctx.restore();
}

function drawDuck(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.ellipse(0, 12, 26, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f6d95c';
  ctx.beginPath(); ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(13, -12, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f08a1d';
  ctx.beginPath(); ctx.moveTo(20, -13); ctx.lineTo(30, -10); ctx.lineTo(20, -7); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(15, -14, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8b93e';
  ctx.beginPath(); ctx.ellipse(-4, -2, 12, 6, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawButterfly(ctx, x, y, s, colorA, colorB, flap) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.25);
  const open = flap ? 0.85 : 0.45;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side * open, 1);
    ctx.fillStyle = colorA;
    ctx.beginPath(); ctx.ellipse(9, -7, 11, 8, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = colorB;
    ctx.beginPath(); ctx.ellipse(8, 7, 8, 6, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.beginPath(); ctx.arc(11, -8, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 9); ctx.stroke();
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-1, -8); ctx.quadraticCurveTo(-7, -15, -9, -13); ctx.moveTo(1, -8); ctx.quadraticCurveTo(7, -15, 9, -13); ctx.stroke();
  ctx.restore();
}

function drawBird(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(9, -6, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f2a541';
  ctx.beginPath(); ctx.moveTo(14, -7); ctx.lineTo(21, -4); ctx.lineTo(14, -3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1c1c1c';
  ctx.beginPath(); ctx.arc(10, -7, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-4, 2); ctx.quadraticCurveTo(-12, -6, -14, -2); ctx.stroke();
  ctx.restore();
}

/* ---------------------------------------------------------------- scene 1: ruang tamu senja */

function drawLivingRoom(ctx, mods, seed) {
  const W = PANEL_W, H = PANEL_H;
  // dinding senja + lantai kayu
  ctx.fillStyle = verticalGradient(ctx, 0, 0, W, 280, [[0, '#7a4a28'], [0.6, '#a5663a'], [1, '#c98d55']]);
  ctx.fillRect(0, 0, W, 280);
  woodGrain(ctx, 0, 272, W, 128, seed + 11, '#8a5a2e', 'rgba(60,30,8,.5)');
  speckle(ctx, 0, 272, W, 128, seed + 12, 260, 0.1);
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  ctx.fillRect(0, 268, W, 6);

  // jendela senja
  ctx.save();
  ctx.fillStyle = '#4a2c14';
  roundRect(ctx, 34, 26, 182, 196, 8); ctx.fill();
  const sky = verticalGradient(ctx, 44, 36, 162, 176, [[0, '#ff9d5c'], [0.5, '#ff7a6b'], [0.8, '#c65a7a'], [1, '#7a4a8a']]);
  ctx.fillStyle = sky;
  ctx.fillRect(44, 36, 162, 176);
  glowingOrb(ctx, 128, 128, 26, '#fff3c4', 'rgba(255,190,90,.85)');
  ctx.fillStyle = '#5a3a5e';
  ctx.beginPath(); ctx.moveTo(44, 212); ctx.quadraticCurveTo(90, 168, 125, 196); ctx.quadraticCurveTo(160, 176, 206, 212); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3a2a4a';
  ctx.beginPath(); ctx.moveTo(44, 212); ctx.quadraticCurveTo(110, 182, 206, 212); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(120, 36, 10, 176); ctx.fillRect(44, 118, 162, 10);
  glassShine(ctx, 44, 36, 162, 176, 0.12);
  ctx.restore();
  // tirai
  for (const [cx, flip] of [[22, 1], [228, -1]]) {
    ctx.save();
    ctx.translate(cx, 20); ctx.scale(flip, 1);
    ctx.fillStyle = verticalGradient(ctx, 0, 0, 34, 210, [[0, '#8a2f3c'], [1, '#5e1f2a']]);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, 0); ctx.lineTo(28, 210); ctx.lineTo(4, 210); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2;
    for (const fx of [9, 17, 25]) { ctx.beginPath(); ctx.moveTo(fx, 4); ctx.lineTo(fx - 3, 206); ctx.stroke(); }
    ctx.restore();
  }

  // jam dinding — perbedaan 0: jarum jam menunjuk 10 vs 2
  ctx.save();
  ctx.translate(300, 72);
  ctx.fillStyle = radialGlow(ctx, 0, 0, 46, 'rgba(255,220,150,.35)', 'rgba(255,220,150,0)');
  ctx.beginPath(); ctx.arc(0, 0, 46, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f5ead6'; ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3a2a1a';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(Math.cos(a) * 23, Math.sin(a) * 23, i % 3 === 0 ? 2.4 : 1.2, 0, Math.PI * 2); ctx.fill();
  }
  const hourAngle = mods.has(0) ? (2 / 12) * Math.PI * 2 - Math.PI / 2 : (10 / 12) * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hourAngle) * 15, Math.sin(hourAngle) * 15); ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(-0.5) * 22, Math.sin(-0.5) * 22); ctx.stroke();
  ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // lukisan berbingkai — perbedaan 1: bulan sabit vs matahari bulat
  ctx.save();
  ctx.translate(452, 52);
  ctx.fillStyle = '#3a2410'; roundRect(ctx, -6, -6, 102, 76, 4); ctx.fill();
  ctx.fillStyle = '#d9a441'; roundRect(ctx, -3, -3, 96, 70, 3); ctx.fill();
  const pic = verticalGradient(ctx, 0, 0, 90, 64, [[0, '#2a4a7a'], [0.6, '#7a9ac5'], [1, '#d9b078']]);
  ctx.fillStyle = pic; ctx.fillRect(0, 0, 90, 64);
  if (mods.has(1)) {
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.arc(66, 18, 11, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = '#f5ead6';
    ctx.beginPath(); ctx.arc(66, 18, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a4a7a';
    ctx.beginPath(); ctx.arc(71, 15, 10, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#3a5a3a';
  ctx.beginPath(); ctx.moveTo(0, 64); ctx.lineTo(26, 34); ctx.lineTo(48, 64); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a4a2a';
  ctx.beginPath(); ctx.moveTo(34, 64); ctx.lineTo(62, 28); ctx.lineTo(90, 64); ctx.closePath(); ctx.fill();
  ctx.restore();

  // karpet
  ctx.save();
  ctx.fillStyle = '#7a2f2f';
  ctx.beginPath(); ctx.ellipse(215, 348, 165, 36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d9a441'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(215, 348, 140, 28, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(217,164,65,.6)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(215, 348, 108, 20, 0, 0, Math.PI * 2); ctx.stroke();
  speckle(ctx, 60, 318, 310, 60, seed + 21, 180, 0.12, true);
  ctx.restore();

  // sofa
  ctx.save();
  floorShadow(ctx, 440, 336, 105, 12, 0.35);
  ctx.fillStyle = '#5a3a22';
  roundRect(ctx, 330, 232, 215, 96, 14); ctx.fill();
  ctx.fillStyle = '#6e4a2c';
  roundRect(ctx, 330, 232, 215, 44, 14); ctx.fill();
  ctx.fillStyle = '#7d5a36';
  roundRect(ctx, 322, 252, 26, 76, 10); ctx.fill();
  roundRect(ctx, 519, 252, 26, 76, 10); ctx.fill();
  ctx.fillStyle = '#8a6a42';
  roundRect(ctx, 352, 268, 82, 52, 10); ctx.fill();
  roundRect(ctx, 440, 268, 82, 52, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(436, 268); ctx.lineTo(436, 320); ctx.stroke();
  // bantal — perbedaan 6: kuning mustard vs teal
  ctx.fillStyle = mods.has(6) ? '#2f8a7a' : '#e8a91d';
  ctx.save(); ctx.translate(474, 250); ctx.rotate(-0.12);
  roundRect(ctx, -26, -22, 52, 44, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.25)';
  ctx.beginPath(); ctx.arc(-8, -8, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(340, 328, 10, 14); ctx.fillRect(520, 328, 10, 14);
  ctx.restore();

  // lampu berdiri — perbedaan 5: menyala vs mati
  ctx.save();
  ctx.translate(508, 0);
  ctx.fillStyle = '#2a1a0c'; ctx.fillRect(505 - 508 + 3, 150, 6, 186);
  ctx.fillStyle = '#2a1a0c'; ctx.beginPath(); ctx.ellipse(6, 338, 18, 5, 0, 0, Math.PI * 2); ctx.fill();
  if (!mods.has(5)) {
    ctx.fillStyle = radialGlow(ctx, 6, 132, 90, 'rgba(255,200,110,.5)', 'rgba(255,200,110,0)');
    ctx.beginPath(); ctx.arc(6, 132, 90, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = mods.has(5) ? '#6a5a4a' : '#ffb84d';
  ctx.beginPath(); ctx.moveTo(-16, 108); ctx.lineTo(28, 108); ctx.lineTo(22, 152); ctx.lineTo(-10, 152); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();

  // meja kopi
  ctx.save();
  floorShadow(ctx, 325, 336, 95, 9, 0.3);
  woodGrain(ctx, 232, 292, 190, 14, seed + 31, '#6a4423', 'rgba(40,20,5,.5)');
  ctx.fillStyle = '#4a2c14'; ctx.fillRect(240, 306, 10, 28); ctx.fillRect(404, 306, 10, 28);
  // cangkir — perbedaan 2: teal vs merah koral
  ctx.save();
  ctx.translate(296, 282);
  ctx.fillStyle = mods.has(2) ? '#e85a4a' : '#2f8a8a';
  ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-13, -8, 26, 10);
  ctx.strokeStyle = mods.has(2) ? '#e85a4a' : '#2f8a8a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(15, 0, 6, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.fillStyle = '#f5ead6'; ctx.beginPath(); ctx.ellipse(0, -8, 12, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c98d55'; ctx.beginPath(); ctx.ellipse(0, -8, 9, 2.4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // tumpukan buku — perbedaan 4: 3 buku vs 2 buku
  ctx.save();
  ctx.translate(372, 0);
  const bookColors = ['#a63a3a', '#2f6a4a', '#3a5a8a'];
  const bookCount = mods.has(4) ? 2 : 3;
  for (let i = 0; i < bookCount; i++) {
    const y = 290 - i * 9;
    ctx.fillStyle = bookColors[i];
    roundRect(ctx, -26, y - 8, 56, 9, 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillRect(26, y - 8, 4, 9);
  }
  ctx.restore();
  ctx.restore();

  // tanaman sudut kiri
  ctx.save();
  ctx.translate(52, 316);
  ctx.fillStyle = '#a63a2a';
  ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(13, 26); ctx.lineTo(-13, 26); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7a2a1e'; ctx.fillRect(-18, 0, 36, 6);
  ctx.strokeStyle = '#2f6a2a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (const [dx, dy, ex, ey] of [[-4, -6, -26, -44], [0, -6, -2, -52], [4, -6, 24, -40], [-2, -6, -14, -58], [3, -6, 16, -56]]) {
    ctx.beginPath(); ctx.moveTo(dx, dy); ctx.quadraticCurveTo((dx + ex) / 2, (dy + ey) / 2 - 8, ex, ey); ctx.stroke();
  }
  ctx.fillStyle = '#3a7a2f';
  for (const [lx, ly] of [[-26, -44], [-2, -52], [24, -40], [-14, -58], [16, -56]]) {
    ctx.beginPath(); ctx.ellipse(lx, ly, 8, 5, 0.6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  // kucing — perbedaan 3: ada vs hilang
  if (!mods.has(3)) drawCat(ctx, 148, 322, 0.9, seed);
  vignette(ctx, W, H, 0.2);
}

/* ---------------------------------------------------------------- scene 2: taman pagi */

function drawGarden(ctx, mods, seed) {
  const W = PANEL_W, H = PANEL_H;
  ctx.fillStyle = verticalGradient(ctx, 0, 0, W, 250, [[0, '#8ec9e8'], [0.55, '#cfeec9'], [1, '#ffe9b0']]);
  ctx.fillRect(0, 0, W, 250);
  glowingOrb(ctx, 492, 58, 24, '#fff8d0', 'rgba(255,230,130,.8)');
  // matahari — perbedaan 2: sinar ada vs hilang
  if (!mods.has(2)) {
    ctx.strokeStyle = 'rgba(255,210,90,.9)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(492 + Math.cos(a) * 32, 58 + Math.sin(a) * 32);
      ctx.lineTo(492 + Math.cos(a) * 44, 58 + Math.sin(a) * 44);
      ctx.stroke();
    }
  }
  softCloud(ctx, 130, 52, 1.1, 'rgba(255,255,255,.9)');
  softCloud(ctx, 330, 88, 0.8, 'rgba(255,255,255,.75)');
  softCloud(ctx, 480, 130, 0.6, 'rgba(255,255,255,.6)');

  // pagar kayu latar
  ctx.fillStyle = '#b08a5a';
  ctx.fillRect(0, 216, W, 10); ctx.fillRect(0, 238, W, 8);
  ctx.fillStyle = '#c9a06a';
  for (let x = 6; x < W; x += 34) ctx.fillRect(x, 204, 22, 52);
  ctx.fillStyle = 'rgba(0,0,0,.12)';
  for (let x = 6; x < W; x += 34) ctx.fillRect(x, 204, 3, 52);

  // rumput
  ctx.fillStyle = verticalGradient(ctx, 0, 250, W, 150, [[0, '#6ab84a'], [0.5, '#4e9a38'], [1, '#3a7a2c']]);
  ctx.fillRect(0, 250, W, 150);
  speckle(ctx, 0, 252, W, 146, seed + 41, 420, 0.14, true);
  speckle(ctx, 0, 252, W, 146, seed + 42, 300, 0.1);

  // jalan batu
  ctx.fillStyle = '#d9c9a8';
  for (let i = 0; i < 4; i++) {
    const y = 300 + i * 26;
    ctx.beginPath(); ctx.ellipse(268 + (i % 2) * 14 - 7, y, 26, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  // pohon besar
  ctx.save();
  ctx.fillStyle = '#6a4423';
  ctx.beginPath(); ctx.moveTo(78, 300); ctx.quadraticCurveTo(84, 220, 78, 178); ctx.lineTo(104, 178); ctx.quadraticCurveTo(98, 230, 106, 300); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a3a1e';
  ctx.beginPath(); ctx.moveTo(88, 220); ctx.quadraticCurveTo(120, 200, 150, 196); ctx.lineTo(150, 206); ctx.quadraticCurveTo(118, 214, 90, 232); ctx.closePath(); ctx.fill();
  const greens = ['#3f8a2f', '#4e9a38', '#5fae45', '#357a28'];
  const blobs = [[92, 128, 58], [48, 158, 42], [140, 156, 44], [92, 168, 48], [120, 110, 38], [60, 112, 34]];
  blobs.forEach(([bx, by, br], i) => {
    ctx.fillStyle = greens[i % greens.length];
    ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
  });
  speckle(ctx, 30, 70, 160, 120, seed + 43, 160, 0.12, true);
  // burung di dahan — perbedaan 6: ada vs tidak
  if (!mods.has(6)) drawBird(ctx, 196, 152, 1, '#3a5a8a');
  // rumah burung — perbedaan 3: pintu bundar vs kotak
  ctx.save();
  ctx.translate(128, 196);
  ctx.fillStyle = '#8a5a2e'; ctx.fillRect(-16, -6, 32, 30);
  ctx.fillStyle = '#a63a2a';
  ctx.beginPath(); ctx.moveTo(-20, -6); ctx.lineTo(0, -22); ctx.lineTo(20, -6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a1a0c';
  if (mods.has(3)) ctx.fillRect(-6, 6, 12, 12);
  else { ctx.beginPath(); ctx.arc(0, 12, 6, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#c9a06a'; ctx.fillRect(-16, 20, 22, 4);
  ctx.restore();
  ctx.restore();

  // kolam + bebek — perbedaan 0: bebek ada vs hilang
  ctx.save();
  ctx.fillStyle = verticalGradient(ctx, 20, 322, 200, 56, [[0, '#7ec9e8'], [1, '#2f7ab8']]);
  ctx.beginPath(); ctx.ellipse(118, 350, 108, 28, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8a6a42'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(118, 350, 108, 28, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5;
  for (const [rx, ry, rw] of [[80, 344, 30], [150, 358, 36], [118, 364, 26]]) {
    ctx.beginPath(); ctx.ellipse(rx, ry, rw, 3, 0, 0, Math.PI * 2); ctx.stroke();
  }
  if (!mods.has(0)) drawDuck(ctx, 118, 342, 0.9);
  ctx.restore();

  // bangku taman — perbedaan 5: bilah tengah ada vs hilang
  ctx.save();
  ctx.translate(400, 0);
  floorShadow(ctx, 0, 356, 78, 8, 0.3);
  ctx.fillStyle = '#5a3a1e';
  ctx.fillRect(-52, 318, 10, 38); ctx.fillRect(42, 318, 10, 38);
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(-58, 292, 116, 10);
  if (!mods.has(5)) ctx.fillRect(-58, 306, 116, 10);
  ctx.fillRect(-58, 278, 116, 9);
  ctx.fillStyle = '#6a4423';
  ctx.fillRect(-58, 260, 8, 34); ctx.fillRect(50, 260, 8, 34);
  ctx.restore();

  // bunga — perbedaan 4: 5 bunga vs 4 bunga (yang di tengah, x=360, hilang)
  const flowerSpots = [[300, 372], [330, 380], [360, 370], [520, 372], [488, 382]];
  const visibleFlowers = flowerSpots.filter((_, i) => !(mods.has(4) && i === 2));
  visibleFlowers.forEach(([fx, fy], i) => {
    ctx.save();
    ctx.translate(fx, fy);
    ctx.strokeStyle = '#2f7a2f'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.stroke();
    const petalColors = ['#ff6b9a', '#ffd94d', '#ff8a5c', '#c98af0', '#ff6b6b'];
    ctx.fillStyle = petalColors[i % petalColors.length];
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 7, Math.sin(a) * 7 - 4, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath(); ctx.arc(0, -4, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
  // bunga liar kecil di kiri bawah
  for (const [fx, fy, c] of [[36, 384, '#ff6b9a'], [58, 390, '#ffd94d'], [20, 392, '#c98af0']]) {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.arc(fx, fy, 1.8, 0, Math.PI * 2); ctx.fill();
  }

  // kupu-kupu — perbedaan 1: oranye vs ungu
  if (mods.has(1)) drawButterfly(ctx, 428, 228, 1, '#8a5cf0', '#5c3ad9', true);
  else drawButterfly(ctx, 428, 228, 1, '#ff8a2e', '#ffd94d', true);
  vignette(ctx, W, H, 0.16);
}

/* ---------------------------------------------------------------- scene 3: jalan kota */

function drawCity(ctx, mods, seed) {
  const W = PANEL_W, H = PANEL_H;
  ctx.fillStyle = verticalGradient(ctx, 0, 0, W, 260, [[0, '#2a2350'], [0.55, '#6a3a6a'], [0.85, '#e87a4a'], [1, '#ffb84d']]);
  ctx.fillRect(0, 0, W, 260);
  // bulan — perbedaan 1: purnama vs sabit
  if (mods.has(1)) {
    ctx.fillStyle = '#f5ead6';
    ctx.beginPath(); ctx.arc(482, 56, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a2350';
    ctx.beginPath(); ctx.arc(490, 50, 18, 0, Math.PI * 2); ctx.fill();
  } else {
    glowingOrb(ctx, 482, 56, 20, '#fff8d0', 'rgba(255,240,180,.7)');
    ctx.fillStyle = 'rgba(200,180,140,.5)';
    ctx.beginPath(); ctx.arc(476, 50, 4, 0, Math.PI * 2); ctx.arc(490, 62, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (const [sx, sy, sr] of [[60, 40, 1.6], [150, 70, 1.3], [250, 34, 1.8], [360, 80, 1.4], [420, 30, 1.5], [90, 110, 1.2], [540, 110, 1.3]]) {
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  }

  // gedung-gedung
  const buildings = [
    { x: 0, w: 120, top: 90, color: '#3a2f55', lit: [[20, 120], [70, 120], [20, 170], [70, 210]] },
    { x: 140, w: 150, top: 130, color: '#2f2a4a', lit: [[160, 160], [210, 160], [260, 200], [210, 220]] },
    { x: 310, w: 110, top: 110, color: '#453a5e', lit: [[330, 140], [380, 180], [330, 220]] },
    { x: 440, w: 120, top: 150, color: '#2f2a4a', lit: [[460, 180], [510, 180], [460, 220]] },
  ];
  for (const b of buildings) {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.top, b.w, 280 - b.top);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(b.x, b.top, b.w, 4);
    for (const [wx, wy] of b.lit) {
      // jendela — perbedaan 5: satu jendela menyala vs gelap
      const isTarget = wx === 260 && wy === 200;
      const lit = isTarget ? !mods.has(5) : true;
      ctx.fillStyle = lit ? '#ffd94d' : '#1c1830';
      ctx.fillRect(wx, wy, 18, 22);
      ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1;
      ctx.strokeRect(wx, wy, 18, 22);
      if (lit) {
        ctx.fillStyle = 'rgba(255,217,77,.25)';
        ctx.fillRect(wx - 3, wy - 3, 24, 28);
      }
    }
    speckle(ctx, b.x, b.top, b.w, 280 - b.top, seed + b.x, 60, 0.08, true);
  }

  // trotoar + jalan
  ctx.fillStyle = '#7a7268'; ctx.fillRect(0, 272, W, 26);
  ctx.fillStyle = '#3a3632'; ctx.fillRect(0, 298, W, 102);
  ctx.fillStyle = '#55504a'; ctx.fillRect(0, 298, W, 3);
  ctx.fillStyle = '#e8d94d';
  for (let x = 12; x < W; x += 56) ctx.fillRect(x, 348, 30, 5);

  // toko + awning — perbedaan 3: merah-putih vs teal-putih
  ctx.save();
  ctx.fillStyle = '#5a3a5e';
  ctx.fillRect(392, 232, 140, 66);
  ctx.fillStyle = '#f5ead6';
  ctx.fillRect(404, 252, 44, 46); ctx.fillRect(462, 252, 58, 46);
  ctx.strokeStyle = '#3a2a4a'; ctx.lineWidth = 2;
  ctx.strokeRect(404, 252, 44, 46); ctx.strokeRect(462, 252, 58, 46);
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(404, 252, 44, 6); ctx.fillRect(462, 252, 58, 6);
  const stripeA = mods.has(3) ? '#2f8a7a' : '#c0392b';
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i % 2 === 0 ? stripeA : '#f5ead6';
    ctx.beginPath();
    ctx.moveTo(392 + i * 20, 232);
    ctx.lineTo(392 + (i + 1) * 20, 232);
    ctx.lineTo(392 + (i + 1) * 20 - 6, 252);
    ctx.lineTo(392 + i * 20 - 6, 252);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#f5ead6';
  roundRect(ctx, 404, 206, 116, 20, 5); ctx.fill();
  ctx.fillStyle = '#2a1a0c'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('TOKO KOPI', 462, 220);
  ctx.restore();

  // lampu jalan
  ctx.save();
  ctx.translate(64, 0);
  ctx.fillStyle = radialGlow(ctx, 0, 178, 70, 'rgba(255,200,110,.45)', 'rgba(255,200,110,0)');
  ctx.beginPath(); ctx.arc(0, 178, 70, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#22201e'; ctx.fillRect(-3, 178, 6, 122);
  ctx.fillStyle = '#2a2825';
  ctx.beginPath(); ctx.moveTo(-3, 178); ctx.quadraticCurveTo(-3, 164, 10, 164); ctx.lineTo(10, 170); ctx.quadraticCurveTo(4, 170, 4, 178); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.ellipse(14, 172, 8, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // lampu lalu lintas — perbedaan 0: hijau vs merah menyala
  ctx.save();
  ctx.translate(330, 0);
  ctx.fillStyle = '#22201e'; ctx.fillRect(-3, 196, 6, 104);
  ctx.fillStyle = '#1c1a18';
  roundRect(ctx, -14, 176, 28, 62, 8); ctx.fill();
  const lights = [
    { y: 188, color: '#ff5a4a', on: mods.has(0) },
    { y: 207, color: '#ffd94d', on: false },
    { y: 226, color: '#4ae08a', on: !mods.has(0) },
  ];
  for (const l of lights) {
    if (l.on) {
      ctx.fillStyle = radialGlow(ctx, 0, l.y, 18, l.color, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(0, l.y, 18, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = l.on ? l.color : '#3a3632';
    ctx.beginPath(); ctx.arc(0, l.y, 7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  // mobil — perbedaan 2: merah vs biru
  ctx.save();
  ctx.translate(178, 296);
  floorShadow(ctx, 0, 26, 62, 7, 0.4);
  const carColor = mods.has(2) ? '#2f6ab8' : '#c0392b';
  ctx.fillStyle = carColor;
  roundRect(ctx, -58, -6, 116, 22, 9); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-40, -6); ctx.lineTo(-28, -24); ctx.lineTo(28, -24); ctx.lineTo(44, -6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#bfe3f0';
  ctx.beginPath();
  ctx.moveTo(-30, -9); ctx.lineTo(-22, -21); ctx.lineTo(-2, -21); ctx.lineTo(-2, -9); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -21); ctx.lineTo(24, -21); ctx.lineTo(34, -9); ctx.lineTo(4, -9); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillRect(-56, -4, 112, 4);
  ctx.fillStyle = '#1c1a18';
  ctx.beginPath(); ctx.arc(-34, 16, 11, 0, Math.PI * 2); ctx.arc(34, 16, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a8a8a';
  ctx.beginPath(); ctx.arc(-34, 16, 5, 0, Math.PI * 2); ctx.arc(34, 16, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff8d0';
  ctx.beginPath(); ctx.arc(56, 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // genangan — perbedaan 6: ada vs kering
  if (!mods.has(6)) {
    ctx.save();
    ctx.fillStyle = 'rgba(140,180,220,.35)';
    ctx.beginPath(); ctx.ellipse(300, 366, 52, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,110,.5)';
    ctx.beginPath(); ctx.ellipse(288, 364, 14, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(300, 366, 40, 6, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  // sepeda — perbedaan 4: ada vs hilang
  if (!mods.has(4)) {
    ctx.save();
    ctx.translate(508, 330);
    ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-16, 0, 11, 0, Math.PI * 2); ctx.arc(16, 0, 11, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, 0); ctx.lineTo(-2, -16); ctx.lineTo(14, -16); ctx.lineTo(16, 0);
    ctx.moveTo(-2, -16); ctx.lineTo(6, 0); ctx.lineTo(-16, 0);
    ctx.moveTo(14, -16); ctx.lineTo(20, -22); ctx.moveTo(-2, -16); ctx.lineTo(-8, -22);
    ctx.stroke();
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(-10, -24, 8, 3); ctx.fillRect(16, -24, 8, 3);
    ctx.restore();
  }
  vignette(ctx, W, H, 0.24);
}

/* ---------------------------------------------------------------- metadata */

export const SCENES = [
  {
    id: 'living-room',
    title: 'Senja di Ruang Tamu',
    hint: 'Perhatikan jam, lukisan, cangkir, dan si kucing…',
    draw: drawLivingRoom,
    diffs: [
      { x: 300, y: 72, r: 30, label: 'Jarum jam berubah' },
      { x: 452, y: 52, r: 34, label: 'Bulan jadi matahari di lukisan' },
      { x: 296, y: 282, r: 20, label: 'Warna cangkir berubah' },
      { x: 148, y: 322, r: 34, label: 'Kucing menghilang' },
      { x: 372, y: 282, r: 26, label: 'Satu buku hilang' },
      { x: 508, y: 130, r: 30, label: 'Lampu padam' },
      { x: 474, y: 250, r: 26, label: 'Warna bantal berubah' },
    ],
  },
  {
    id: 'garden',
    title: 'Taman di Pagi Hari',
    hint: 'Hitung bunganya, cari bebek dan kupu-kupunya…',
    draw: drawGarden,
    diffs: [
      { x: 118, y: 342, r: 26, label: 'Bebek di kolam hilang' },
      { x: 428, y: 228, r: 22, label: 'Kupu-kupu berubah warna' },
      { x: 492, y: 58, r: 32, label: 'Sinar matahari hilang' },
      { x: 128, y: 208, r: 16, label: 'Pintu rumah burung berubah' },
      { x: 360, y: 370, r: 24, label: 'Satu bunga hilang' },
      { x: 400, y: 300, r: 30, label: 'Bilah bangku hilang' },
      { x: 196, y: 152, r: 20, label: 'Burung di dahan hilang' },
    ],
  },
  {
    id: 'city-street',
    title: 'Jalanan Kota di Malam Hari',
    hint: 'Lampu lalu lintas, bulan, mobil, dan toko kopi…',
    draw: drawCity,
    diffs: [
      { x: 330, y: 207, r: 20, label: 'Lampu lalu lintas berubah' },
      { x: 482, y: 56, r: 26, label: 'Bulan purnama jadi sabit' },
      { x: 178, y: 296, r: 32, label: 'Warna mobil berubah' },
      { x: 450, y: 242, r: 28, label: 'Warna awning toko berubah' },
      { x: 508, y: 330, r: 24, label: 'Sepeda hilang' },
      { x: 269, y: 211, r: 18, label: 'Jendela gedung gelap' },
      { x: 300, y: 366, r: 26, label: 'Genangan air mengering' },
    ],
  },
];

/** Gambar satu scene ke ctx; `mods` = Set indeks perbedaan yang diterapkan (panel kanan). */
export function drawScene(ctx, sceneIndex, mods, seed) {
  const scene = SCENES[sceneIndex];
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  scene.draw(ctx, mods, seed);
}
