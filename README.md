# Temukan 7 Perbedaan — Senja, Taman & Kota

[![make.fun](https://make.fun/badge/bounty/best-spot-the-difference-game-20261121-0451)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun entry](https://make.fun/badge/entry/best-spot-the-difference-game-20261121-0451)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun game](https://make.fun/badge/game/best-spot-the-difference-game-20261121-0451)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Entri untuk kompetisi [Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) di make.fun.

## Permainan

Dua gambar nyaris identik berdampingan — temukan **7 perbedaan** di setiap ronde.
Tiga ronde, tiga tempat yang dilukis prosedural di canvas (gradasi senja, bayangan
lembut, tekstur butir, kilau kaca — tanpa satu pun file gambar):

1. **Senja di Ruang Tamu** — jam dinding, lukisan bulan, cangkir, kucing oranye,
   tumpukan buku, lampu berdiri, dan bantal sofa.
2. **Taman di Pagi Hari** — bebek di kolam, kupu-kupu, sinar matahari, rumah burung,
   bunga, bilah bangku, dan burung di dahan.
3. **Jalanan Kota di Malam Hari** — lampu lalu lintas, bulan purnama, mobil,
   awning toko kopi, sepeda, jendela gedung, dan genangan air.

## Cara main

- **Mouse:** klik perbedaan pada gambar mana pun; temuan ditandai lingkaran emas + centang.
- **Keyboard:** panah gerakkan bidikan, **Enter / Spasi** pilih, **H** petunjuk (−50 poin,
  3× per ronde), **R** ulangi ronde, **M** suara.
- **Skor:** +100 per temuan, klik salah −10, bonus waktu sampai +600 per ronde.
- **Suara:** efek WebAudio (oscillator) — tanpa file audio.

## Menjalankan

```sh
cd game && python3 -m http.server 8080
# buka http://localhost:8080/index.html
```

Mode screenshot deterministik: `?shot=start|play|end&seed=1` — `play` menampilkan
tengah permainan (3 dari 7 ditemukan), `end` menampilkan layar menang.

## Penyerahan

`main.ts` (Node 22, stdlib saja) menyalin `game/` + `screenshots/` ke `/output`
dan menulis `dossier.json` via `vendor/makefun-game.ts`.

## Lisensi

MIT — lihat [LICENSE](LICENSE).
