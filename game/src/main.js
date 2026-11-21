/** Temukan 7 Perbedaan — alur permainan: 3 ronde, skor, timer, petunjuk, layar menang. */
import {
  DIFFS_PER_ROUND, ROUNDS_TOTAL, POINTS_PER_FIND, POINTS_WRONG_CLICK,
  POINTS_HINT, HINTS_PER_ROUND, TIME_BONUS_PER_SECOND, TIME_BONUS_CAP,
} from './config.js';
import { SCENES } from './scenes.js';
import { renderPanels, drawAllMarkers, drawHintRing, drawMissMark } from './render.js';
import { InputController } from './input.js';
import { SoundBank } from './audio.js';
import { readShotParams, PLAY_PRESET, END_PRESET } from './shots.js';

const $ = (id) => document.getElementById(id);
const canvasLeft = $('canvasLeft');
const canvasRight = $('canvasRight');
const ctxLeft = canvasLeft.getContext('2d');
const ctxRight = canvasRight.getContext('2d');

const sounds = new SoundBank();
const { shot, seed } = readShotParams();

const state = {
  screen: 'start',
  roundIndex: 0,
  found: new Set(),
  score: 0,
  roundScore: 0,
  roundStart: 0,
  totalElapsed: 0,
  misses: 0,
  hintsUsed: 0,
  hintsLeft: HINTS_PER_ROUND,
  hintTarget: -1,
  hintUntil: 0,
  pulseIndex: -1,
  pulseUntil: 0,
  missMark: null,
  timerId: 0,
};

let input = null;

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function allMods() {
  return new Set(SCENES[state.roundIndex].diffs.map((_, i) => i));
}

function renderAll() {
  renderPanels(ctxLeft, ctxRight, state.roundIndex, allMods(), seed);
  drawAllMarkers(ctxLeft, ctxRight, state.roundIndex, state.found, state.pulseIndex,
    state.pulseIndex >= 0 ? 3 + Math.sin(performance.now() / 90) * 2 : 0);
  if (state.hintTarget >= 0) {
    const d = SCENES[state.roundIndex].diffs[state.hintTarget];
    const phase = performance.now() / 240;
    drawHintRing(ctxLeft, d.x, d.y, d.r, phase);
    drawHintRing(ctxRight, d.x, d.y, d.r, phase);
  }
  if (state.missMark) drawMissMark(ctxLeft, state.missMark.x, state.missMark.y);
}

function updateHud() {
  $('hudRound').textContent = `${state.roundIndex + 1} / ${ROUNDS_TOTAL}`;
  $('hudFound').textContent = `${state.found.size} dari ${DIFFS_PER_ROUND}`;
  $('hudScore').textContent = String(state.score);
  $('hudTime').textContent = formatTime((Date.now() - state.roundStart) / 1000);
  $('hintLeft').textContent = `(${state.hintsLeft})`;
  const scene = SCENES[state.roundIndex];
  $('roundName').textContent = `Ronde ${state.roundIndex + 1} — ${scene.title}`;
  $('roundHint').textContent = scene.hint;
  $('footScene').textContent = `Ronde ${state.roundIndex + 1} dari ${ROUNDS_TOTAL} — ${scene.title}`;
}

let toastTimer = 0;
function toast(message, kind = '') {
  const el = $('toast');
  el.textContent = message;
  el.className = `show ${kind}`.trim();
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { el.className = ''; }, 2200);
}

function showOverlay(which) {
  for (const id of ['startScreen', 'roundScreen', 'winScreen']) $(id).hidden = id !== which;
  state.screen = which === 'startScreen' ? 'start' : which === 'roundScreen' ? 'roundClear' : 'win';
  if (input) input.setActive(which === null);
}

function hideOverlays() {
  for (const id of ['startScreen', 'roundScreen', 'winScreen']) $(id).hidden = true;
  state.screen = 'playing';
  if (input) input.setActive(true);
}

function startRound(index) {
  state.roundIndex = index;
  state.found = new Set();
  state.roundScore = 0;
  state.hintsLeft = HINTS_PER_ROUND;
  state.hintTarget = -1;
  state.pulseIndex = -1;
  state.missMark = null;
  state.roundStart = Date.now();
  window.clearInterval(state.timerId);
  state.timerId = window.setInterval(updateHud, 500);
  hideOverlays();
  renderAll();
  updateHud();
}

function startGame() {
  sounds.unlock();
  sounds.playClick();
  state.score = 0;
  state.totalElapsed = 0;
  state.misses = 0;
  state.hintsUsed = 0;
  startRound(0);
  toast('Ronde 1 — temukan 7 perbedaan!');
}

function timeBonus(elapsedSeconds) {
  return Math.max(0, TIME_BONUS_CAP - Math.floor(elapsedSeconds) * TIME_BONUS_PER_SECOND);
}

function roundCleared() {
  const elapsed = (Date.now() - state.roundStart) / 1000;
  state.totalElapsed += elapsed;
  const bonus = timeBonus(elapsed);
  state.score += bonus;
  sounds.playRoundClear();
  window.clearInterval(state.timerId);
  updateHud();
  if (state.roundIndex + 1 >= ROUNDS_TOTAL) {
    showWin();
    return;
  }
  $('roundClearTitle').textContent = `Ronde ${state.roundIndex + 1} Tuntas!`;
  $('roundClearText').textContent =
    `Semua 7 perbedaan di “${SCENES[state.roundIndex].title}” ditemukan dalam ${formatTime(elapsed)}.`;
  $('roundClearTime').textContent = formatTime(elapsed);
  $('roundClearBonus').textContent = `+${bonus}`;
  $('roundClearScore').textContent = String(state.score);
  showOverlay('roundScreen');
}

function gradeFor(score) {
  if (score >= 2600) return 'Peringkat: Mata Elang — tak ada yang lolos';
  if (score >= 2200) return 'Peringkat: Pengamat Ulung';
  if (score >= 1800) return 'Peringkat: Detektif Cermat';
  return 'Peringkat: Pemula Bermata Tajam';
}

function showWin() {
  sounds.playWin();
  $('winTime').textContent = formatTime(state.totalElapsed);
  $('winMiss').textContent = String(state.misses);
  $('winHints').textContent = String(state.hintsUsed);
  $('winScore').textContent = String(state.score);
  $('winGrade').textContent = gradeFor(state.score);
  showOverlay('winScreen');
}

function nearestDiff(x, y) {
  const diffs = SCENES[state.roundIndex].diffs;
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < diffs.length; i++) {
    if (state.found.has(i)) continue;
    const d = diffs[i];
    const dist = Math.hypot(x - d.x, y - d.y);
    if (dist < d.r + 10 && dist < bestDist) { best = i; bestDist = dist; }
  }
  return best;
}

function onPick(x, y) {
  if (state.screen !== 'playing') return;
  sounds.unlock();
  const idx = nearestDiff(x, y);
  if (idx >= 0) {
    state.found.add(idx);
    state.score += POINTS_PER_FIND;
    state.roundScore += POINTS_PER_FIND;
    state.pulseIndex = idx;
    state.pulseUntil = performance.now() + 700;
    sounds.playFound();
    const label = SCENES[state.roundIndex].diffs[idx].label;
    toast(`✓ Ketemu! ${label}  +${POINTS_PER_FIND}`, 'good');
    renderAll();
    updateHud();
    if (state.found.size >= DIFFS_PER_ROUND) {
      window.setTimeout(roundCleared, 650);
    }
    return;
  }
  state.score = Math.max(0, state.score + POINTS_WRONG_CLICK);
  state.roundScore = Math.max(0, state.roundScore + POINTS_WRONG_CLICK);
  state.misses += 1;
  state.missMark = { x, y };
  sounds.playWrong();
  toast('Bukan di situ — −10 poin', 'bad');
  for (const panel of [$('panelLeft'), $('panelRight')]) {
    panel.classList.remove('shake');
    void panel.offsetWidth;
    panel.classList.add('shake');
  }
  renderAll();
  updateHud();
  window.setTimeout(() => { state.missMark = null; renderAll(); }, 550);
}

function useHint() {
  if (state.screen !== 'playing') return;
  if (state.hintsLeft <= 0) { toast('Petunjuk habis untuk ronde ini', 'bad'); return; }
  const remaining = SCENES[state.roundIndex].diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  state.hintsUsed += 1;
  state.score = Math.max(0, state.score + POINTS_HINT);
  state.roundScore = Math.max(0, state.roundScore + POINTS_HINT);
  state.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintUntil = performance.now() + 2600;
  sounds.playHint();
  toast('💡 Petunjuk: lihat lingkaran berdenyut  −50 poin');
  updateHud();
}

function restartRound() {
  if (state.screen !== 'playing' && state.screen !== 'roundClear') return;
  state.score = Math.max(0, state.score - state.roundScore);
  startRound(state.roundIndex);
  toast('Ronde diulang dari awal');
}

function toggleMute() {
  sounds.unlock();
  const muted = sounds.toggleMute();
  $('muteBtn').textContent = muted ? '🔇' : '🔊';
  toast(muted ? 'Suara dimatikan (M)' : 'Suara dinyalakan (M)');
}

function onAction(action) {
  if (action === 'hint') useHint();
  else if (action === 'restart') restartRound();
  else if (action === 'mute') toggleMute();
  else if (action === 'confirm' && state.screen === 'start') startGame();
}

function animationLoop() {
  const now = performance.now();
  if (state.pulseIndex >= 0 && now > state.pulseUntil) state.pulseIndex = -1;
  if (state.hintTarget >= 0 && now > state.hintUntil) state.hintTarget = -1;
  if (state.screen === 'playing' && (state.pulseIndex >= 0 || state.hintTarget >= 0)) renderAll();
  requestAnimationFrame(animationLoop);
}

function applyShotPreset() {
  if (shot === 'play') {
    state.roundIndex = PLAY_PRESET.roundIndex;
    state.found = new Set(PLAY_PRESET.foundIndices);
    state.score = PLAY_PRESET.score;
    state.roundStart = Date.now() - PLAY_PRESET.elapsedSeconds * 1000;
    state.timerId = window.setInterval(updateHud, 500);
    hideOverlays();
    renderAll();
    updateHud();
    return true;
  }
  if (shot === 'end') {
    state.roundIndex = ROUNDS_TOTAL - 1;
    state.found = new Set(SCENES[ROUNDS_TOTAL - 1].diffs.map((_, i) => i));
    state.score = END_PRESET.score;
    state.totalElapsed = END_PRESET.elapsedSeconds;
    state.misses = END_PRESET.misses;
    state.hintsUsed = END_PRESET.hintsUsed;
    $('winTime').textContent = formatTime(END_PRESET.elapsedSeconds);
    $('winMiss').textContent = String(END_PRESET.misses);
    $('winHints').textContent = String(END_PRESET.hintsUsed);
    $('winScore').textContent = String(END_PRESET.score);
    $('winGrade').textContent = gradeFor(END_PRESET.score);
    renderAll();
    updateHud();
    showOverlay('winScreen');
    return true;
  }
  return false;
}

function init() {
  input = new InputController({
    stage: $('stage'),
    canvasLeft,
    canvasRight,
    cursorEl: $('cursor'),
    onPick,
    onAction,
  });
  $('playBtn').addEventListener('click', startGame);
  $('nextBtn').addEventListener('click', () => { sounds.playClick(); startRound(state.roundIndex + 1); });
  $('againBtn').addEventListener('click', startGame);
  $('hintBtn').addEventListener('click', () => { sounds.unlock(); useHint(); });
  $('muteBtn').addEventListener('click', toggleMute);
  $('restartBtn').addEventListener('click', restartRound);
  state.roundStart = Date.now();
  renderAll();
  updateHud();
  if (!applyShotPreset()) {
    showOverlay('startScreen');
  }
  requestAnimationFrame(animationLoop);
}

init();
