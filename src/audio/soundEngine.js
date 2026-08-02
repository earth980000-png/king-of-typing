// Web Audio API 기반 아케이드 레트로 사운드 엔진 + BGM 시스템

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isBGMPlaying = false;
    this._bgmNodes = [];
    this._bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 약공격 (Punch)
  playPunch() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // 중공격 (Kick)
  playKick() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // 강공격 (Fireball / Heavy Hit)
  playFireball() {
    this.init();
    const now = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(now + 0.3);
  }

  // 5콤보 달성 & KOF 필살기 화면 암전 컷인 사운드
  playSuperSpecial() {
    this.init();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.5);
  }

  // 콤보 상승 효과음
  playComboChime(count) {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 440 + count * 50;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.15);
  }

  // 승리 환호 사운드
  playVictory() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);
      gain.gain.setValueAtTime(0.3, now + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.25);
    });
  }

  // 뽑기 캡슐 오픈 사운드
  playGachaReveal(grade) {
    this.init();
    if (grade === 'Legendary') {
      this.playSuperSpecial();
    } else {
      this.playComboChime(5);
    }
  }

  // ======== BGM 시스템 ========
  startBGM() {
    if (this.isBGMPlaying) return;
    this.init();
    this.isBGMPlaying = true;
    this._playBGMLoop();
  }

  _playBGMLoop() {
    if (!this.isBGMPlaying) return;
    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, now);
    masterGain.connect(this.ctx.destination);

    // Bass line (aggressive square wave pattern)
    const bassNotes = [55, 55, 65.41, 65.41, 73.42, 73.42, 65.41, 55];
    bassNotes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.5);
      g.gain.setValueAtTime(0.35, now + i * 0.5);
      g.gain.setValueAtTime(0.25, now + i * 0.5 + 0.2);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.5 + 0.48);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now + i * 0.5);
      osc.stop(now + i * 0.5 + 0.48);
      this._bgmNodes.push(osc);
    });

    // Lead melody (aggressive sawtooth)
    const melodyNotes = [220, 261.63, 293.66, 329.63, 349.23, 329.63, 293.66, 261.63,
                         220, 246.94, 329.63, 392, 349.23, 293.66, 261.63, 220];
    melodyNotes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.25);
      g.gain.setValueAtTime(0.15, now + i * 0.25);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.25 + 0.22);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now + i * 0.25);
      osc.stop(now + i * 0.25 + 0.23);
      this._bgmNodes.push(osc);
    });

    // Percussion (noise hits on beats)
    for (let i = 0; i < 8; i++) {
      const bufSize = this.ctx.sampleRate * 0.06;
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) d[j] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 4000;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.3, now + i * 0.5);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.5 + 0.05);
      noise.connect(filter);
      filter.connect(g);
      g.connect(masterGain);
      noise.start(now + i * 0.5);
      noise.stop(now + i * 0.5 + 0.06);
      this._bgmNodes.push(noise);
    }

    // Loop every 4 seconds
    this._bgmTimer = setTimeout(() => {
      this._bgmNodes = [];
      this._playBGMLoop();
    }, 4000);
  }

  stopBGM() {
    this.isBGMPlaying = false;
    if (this._bgmTimer) {
      clearTimeout(this._bgmTimer);
      this._bgmTimer = null;
    }
    this._bgmNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    this._bgmNodes = [];
  }
}

export const soundEngine = new SoundEngine();
