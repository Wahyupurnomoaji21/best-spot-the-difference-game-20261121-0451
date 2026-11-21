/** Mode screenshot deterministik: ?shot=start|play|end&seed=1
 *  start = layar judul · play = tengah permainan (3 dari 7 ditemukan, marker terlihat)
 *  end   = layar menang dengan skor akhir. Dipakai saat mengambil screenshot. */
import { SHOT_PARAM, SEED_PARAM } from './config.js';

export function readShotParams() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get(SHOT_PARAM);
  const seedRaw = Number.parseInt(params.get(SEED_PARAM) ?? '1', 10);
  const seed = Number.isFinite(seedRaw) ? seedRaw : 1;
  if (shot === 'start' || shot === 'play' || shot === 'end') return { shot, seed };
  return { shot: null, seed };
}

/** Keadaan permainan yang dipakai preset `play`: 3 temuan, skor 300, waktu 01:23. */
export const PLAY_PRESET = {
  foundIndices: [0, 2, 4],
  score: 300,
  elapsedSeconds: 83,
  roundIndex: 0,
};

/** Keadaan permainan yang dipakai preset `end`: semua ronde tuntas. */
export const END_PRESET = {
  score: 2740,
  elapsedSeconds: 342,
  misses: 4,
  hintsUsed: 2,
  grade: 'Peringkat: Mata Elang — Pengamat Ulung',
};
