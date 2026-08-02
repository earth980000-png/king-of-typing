// Web Audio API 기반 오락실 KOF 감성 리얼 타격/피격 사운드 엔진

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

  // 1. 약공격 타격음 (Light Punch Smack - 찰진 오락실 펀치)
  playPunch() {
    this.init();
    const now = this.ctx.currentTime;

    // Body impact (low frequency pitch drop)
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(280, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

    bodyGain.gain.setValueAtTime(0.6, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.ctx.destination);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.12);

    // Smack noise snap
    const bufSize = this.ctx.sampleRate * 0.08;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.value = 1.5;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.08);
  }

  // 2. 중공격 타격음 (Heavy Kick Impact - 묵직한 복부 타격)
  playKick() {
    this.init();
    const now = this.ctx.currentTime;

    // Sub bass punch
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(320, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.2);

    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.2);

    // Crack smack
    const bufSize = this.ctx.sampleRate * 0.12;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.2));

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.12);
  }

  // 3. 강공격/필살기 폭발음 (Heavy Fireball / Special Explosion)
  playFireball() {
    this.init();
    const now = this.ctx.currentTime;

    // Massive boom bass
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sawtooth';
    boomOsc.frequency.setValueAtTime(200, now);
    boomOsc.frequency.exponentialRampToValueAtTime(20, now + 0.38);

    boomGain.gain.setValueAtTime(0.9, now);
    boomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);

    boomOsc.start(now);
    boomOsc.stop(now + 0.38);

    // Fire blast noise
    const bufSize = this.ctx.sampleRate * 0.35;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.35);
  }

  // 4. 피격 피격음 (Hurt / Damage Taken Sound)
  playHurt() {
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 5. 5콤보 KOF 필살기 암전 연출 사운드
  playSuperSpecial() {
    this.init();
    const now = this.ctx.currentTime;
    
    // Pitch sweep riser
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(850, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);

    // Boom echo
    setTimeout(() => this.playFireball(), 150);
  }

  // 콤보 상승 효과음
  playComboChime(count) {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 480 + count * 60;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.14);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // 승리 환호 사운드
  playVictory() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      gain.gain.setValueAtTime(0.35, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.3);
    });
  }

  // 뽑기 오픈 사운드
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

    // Percussion
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
