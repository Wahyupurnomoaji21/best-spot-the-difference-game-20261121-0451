/** Suara permainan via WebAudio oscillator — tanpa file audio sama sekali. */
export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
    this.enabled = false;
  }

  unlock() {
    if (this.enabled) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.context = new AC();
      this.enabled = true;
    } catch (err) {
      this.enabled = false;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, startAt, duration, type, volume) {
    if (!this.enabled || this.muted || !this.context) return;
    if (this.context.state === 'suspended') void this.context.resume();
    const now = this.context.currentTime + startAt;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  playClick() { this.tone(660, 0, 0.06, 'triangle', 0.08); }
  playFound() {
    this.tone(523.25, 0, 0.14, 'sine', 0.16);
    this.tone(783.99, 0.09, 0.2, 'sine', 0.16);
    this.tone(1046.5, 0.18, 0.26, 'sine', 0.12);
  }
  playWrong() { this.tone(160, 0, 0.18, 'sawtooth', 0.07); }
  playHint() { this.tone(880, 0, 0.12, 'sine', 0.1); this.tone(1174.66, 0.1, 0.16, 'sine', 0.1); }
  playRoundClear() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * 0.11, 0.22, 'triangle', 0.14));
  }
  playWin() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => this.tone(f, i * 0.13, 0.3, 'triangle', 0.13));
  }
}
