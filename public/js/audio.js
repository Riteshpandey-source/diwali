// ========================================================
// DIWALI PROCEDURAL WEB AUDIO SYNTHESIZER
// High fidelity procedural sound effects & festive tanpura ambient drone.
// Zero external file dependencies - 100% reliable everywhere.
// ========================================================

class FestiveAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.7;
    this.fxEnabled = true;
    this.musicEnabled = true;
    this.isMusicPlaying = false;
    this.ambientNodes = [];
    this.musicInterval = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported in this browser', e);
    }
  }

  ensureContext() {
    try {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        const p = this.ctx.resume();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      }
    } catch (e) {
      // Ignored: AudioContext will resume on next user gesture
    }
  }

  setVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, Number(val) || 0.7));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // ========================================================
  // PROCEDURAL SOUND EFFECTS
  // ========================================================

  // 1. Diya lighting sweet chime (528 Hz Solfeggio Love frequency)
  playDiyaChime() {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const freqs = [528, 792, 1056, 1584];
      
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        
        const amp = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(amp, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 + idx * 0.3);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t);
        osc.stop(t + 1.6);
      });
    } catch (e) {
      console.warn('[FestiveAudioEngine] playDiyaChime error:', e);
    }
  }

  // 2. Temple Brass Bell (Deep resonant gong with harmonics)
  playTempleBell() {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const partials = [
        { f: 220, g: 0.3, d: 2.8 },
        { f: 442, g: 0.22, d: 2.2 },
        { f: 660, g: 0.15, d: 1.8 },
        { f: 885, g: 0.1, d: 1.4 },
        { f: 1320, g: 0.06, d: 1.0 }
      ];

      partials.forEach(p => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.f, t);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(p.g, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + p.d);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t);
        osc.stop(t + p.d);
      });
    } catch (e) {
      console.warn('[FestiveAudioEngine] playTempleBell error:', e);
    }
  }

  // 3. Rocket Whistle & Boom
  playRocketLaunch() {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // Ascending whistle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(2400, t + 0.85);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(3200, t + 0.85);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.88);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.9);
    } catch (e) {
      console.warn('[FestiveAudioEngine] playRocketLaunch error:', e);
    }
  }

  // Compatibility alias for 3D fireworks
  playRocketWhistle() {
    this.playRocketLaunch();
  }

  playExplosion(size = 'large') {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const dur = size === 'large' ? 1.6 : 0.9;
      
      // Noise burst
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * (dur * 0.4)));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(100, t + dur);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(t);

      // Deep sub-bass thud
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(120, t);
      sub.frequency.exponentialRampToValueAtTime(35, t + 0.5);

      subGain.gain.setValueAtTime(0.4, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      sub.connect(subGain);
      subGain.connect(this.masterGain);

      sub.start(t);
      sub.stop(t + 0.6);

      // Crackle scatter
      this.playCrackleScatter(t + 0.15, size === 'large' ? 14 : 7);
    } catch (e) {
      console.warn('[FestiveAudioEngine] playExplosion error:', e);
    }
  }

  // Compatibility alias for 3D fireworks
  playFireworkBurst(size = 'large') {
    this.playExplosion(size);
  }

  // 4. Anar (Flowerpot Fountain) Continuous Whoosh and Crackle
  playAnarFountain(durationMs = 3500) {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const durSec = durationMs / 1000;

      // Filtered rushing air sound
      const bufferSize = Math.floor(this.ctx.sampleRate * durSec);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.Q.value = 2.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.3);
      gain.gain.setValueAtTime(0.25, t + durSec - 0.5);
      gain.gain.linearRampToValueAtTime(0.001, t + durSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(t);
      noise.stop(t + durSec);

      // Multi crackles during fountain
      const crackleInterval = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        this.playCrackleScatter(this.ctx.currentTime, 4);
      }, 180);

      setTimeout(() => clearInterval(crackleInterval), durationMs);
    } catch (e) {
      console.warn('[FestiveAudioEngine] playAnarFountain error:', e);
    }
  }

  // Compatibility alias for 3D fireworks
  playAnarHiss(durationMs = 3500) {
    this.playAnarFountain(durationMs);
  }

  // 5. Chakri (Ground Spinner) Whirring Buzz
  playChakriSpin(durationMs = 3000) {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const durSec = durationMs / 1000;

      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.exponentialRampToValueAtTime(950, t + 0.8);
      osc.frequency.exponentialRampToValueAtTime(350, t + durSec);

      // LFO for spinning rotation effect
      lfo.frequency.setValueAtTime(12, t);
      lfo.frequency.linearRampToValueAtTime(22, t + 1);
      lfo.frequency.linearRampToValueAtTime(6, t + durSec);
      lfoGain.gain.setValueAtTime(80, t);

      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.2);
      gain.gain.setValueAtTime(0.18, t + durSec - 0.4);
      gain.gain.linearRampToValueAtTime(0.001, t + durSec);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      lfo.start(t);
      osc.stop(t + durSec);
      lfo.stop(t + durSec);
    } catch (e) {
      console.warn('[FestiveAudioEngine] playChakriSpin error:', e);
    }
  }

  // 6. Sparkler (Phuljhadi) Fizzing sparks
  playSparklerSpark() {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800 + Math.random() * 800, t);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // 7. Crackle scatter bursts
  playCrackleScatter(startTime, count = 8) {
    if (!this.ctx) return;
    for (let i = 0; i < count; i++) {
      const crackleTime = startTime + Math.random() * 0.4;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 + Math.random() * 1400, crackleTime);
      
      gain.gain.setValueAtTime(0.06 + Math.random() * 0.04, crackleTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, crackleTime + 0.03);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(crackleTime);
      osc.stop(crackleTime + 0.04);
    }
  }

  // 8. Coin Earned Happy Arpeggio
  playCoinChime() {
    if (!this.fxEnabled || this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6 (festive Raag Yaman aura)
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);
      
      gain.gain.setValueAtTime(0, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.45);
    });
  }

  // ========================================================
  // PROCEDURAL AMBIENT TANPURA & BANSURI FLUTE DRONE
  // ========================================================
  startFestiveAmbientMusic() {
    if (this.isMusicPlaying || !this.musicEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    
    // Tanpura Drone in D (Sa - Pa - Sa - Sa: D3, A2, D4)
    const baseFreq = 146.83; // D3
    const droneFreqs = [baseFreq * 0.5, baseFreq * 0.75, baseFreq, baseFreq * 2];

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    droneGain.connect(this.masterGain);
    this.ambientNodes.push(droneGain);

    droneFreqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Lowpass filter for warm classical sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(droneGain);
      osc.start();
      this.ambientNodes.push(osc);
    });

    // Meditative Bansuri flute notes every 5-8 seconds
    // Raag Bhupali / Yaman notes: D, E, F#, A, B, D
    const ragaNotes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
    
    this.musicInterval = setInterval(() => {
      if (!this.isMusicPlaying || !this.musicEnabled || this.isMuted || !this.ctx) return;
      this.playFluteNote(ragaNotes[Math.floor(Math.random() * ragaNotes.length)]);
    }, 4500);
  }

  playFluteNote(freq) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    // Warm vibrato
    vibrato.frequency.setValueAtTime(5.5, t);
    vibratoGain.gain.setValueAtTime(3.5, t);
    vibrato.connect(osc.frequency);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    vibrato.start(t);
    osc.start(t);
    vibrato.stop(t + 3.3);
    osc.stop(t + 3.3);
  }

  stopFestiveAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];
  }
}

// Global Audio Engine Instance
window.festiveAudio = new FestiveAudioEngine();
