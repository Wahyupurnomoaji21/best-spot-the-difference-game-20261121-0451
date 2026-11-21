/** RNG deterministik (mulberry32) agar tekstur dan screenshot stabil per seed. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Angka acak 0..1 dari seed + salt string, stabil antar pemanggilan. */
export function seededValue(seed, salt) {
  let h = 2166136261 >>> 0;
  const s = `${seed}:${salt}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return mulberry32(h)();
}

/** Ambil bilangan bulat [min, max] dari fungsi acak. */
export function intBetween(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}
