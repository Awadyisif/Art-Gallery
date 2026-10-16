import { Artwork } from '../types/art';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentType: string = '';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playAmbiance(artwork: Artwork) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.isPlaying = true;
    this.currentType = artwork.ambientSoundType;

    switch (artwork.ambientSoundType) {
      case 'ocean':
        this.startOceanAmbiance();
        break;
      case 'ripples':
        this.startWaterRipplesAmbiance();
        break;
      case 'breeze':
        this.startBreezeAmbiance();
        break;
      case 'crystal':
        this.startCrystalAmbiance();
        break;
      case 'mystic':
        this.startMysticAmbiance();
        break;
      default:
        this.startMuseumReverbAmbiance();
        break;
    }
  }

  public stop() {
    this.isPlaying = false;
    // Stop all active timers & oscillators
    this.activeNodes.forEach(item => {
      if (typeof item === 'number') {
        window.clearInterval(item);
      } else {
        try {
          if ('stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
            (item as AudioScheduledSourceNode).stop();
          }
          item.disconnect();
        } catch {
          // ignore already stopped
        }
      }
    });
    this.activeNodes = [];
  }

  public toggle(artwork: Artwork): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playAmbiance(artwork);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  // --- Procedural Ambiance Generators ---

  private startOceanAmbiance() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Pink noise ocean swell
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.08;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    // LFO to modulate wave surge
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // one wave every 8 seconds
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(260, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.35, ctx.currentTime);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, lfo, filter, waveGain, lfoGain);
  }

  private startBreezeAmbiance() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Low gentle breeze wind whistle
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(220, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.12, ctx.currentTime);

    // Modulate pitch gently like mountain breeze
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(40, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start();
    lfo.start();
    this.activeNodes.push(osc, lfo, filter, oscGain, lfoGain);
  }

  private startWaterRipplesAmbiance() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Peaceful soft water drop interval
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      const baseFreq = 500 + Math.random() * 400;
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(baseFreq, now);
      dropOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.12);

      dropGain.gain.setValueAtTime(0.08, now);
      dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      dropOsc.connect(dropGain);
      dropGain.connect(this.masterGain);

      dropOsc.start(now);
      dropOsc.stop(now + 0.26);
    }, 1800);

    this.activeNodes.push(interval);
  }

  private startCrystalAmbiance() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Harmonic pentatonic golden bells
    const frequencies = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.6);
    }, 2400);

    this.activeNodes.push(interval);
  }

  private startMysticAmbiance() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Sacred meditation drone (108Hz / 216Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const droneGain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(108, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(216.5, ctx.currentTime); // subtle binaural beat

    droneGain.gain.setValueAtTime(0.12, ctx.currentTime);

    osc1.connect(droneGain);
    osc2.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    this.activeNodes.push(osc1, osc2, droneGain);
  }

  private startMuseumReverbAmbiance() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Subtle low room frequency
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    this.activeNodes.push(osc, gain);
  }
}

export const audioAmbiance = new AudioManager();
