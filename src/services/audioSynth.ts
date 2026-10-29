// Web Audio API Synthesizer for Ambient Study Sounds & Chimes
// No external MP3 downloads required! Completely self-contained and offline-ready.

class AudioSynthService {
  private ctx: AudioContext | null = null;
  private currentTrack: string | null = null;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  public stopAmbient() {
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore already stopped
      }
    });
    this.activeNodes = [];
    this.currentTrack = null;
  }

  // Play gentle bell chime when a Pomodoro session or Break finishes
  public playSessionChime(type: 'work_finish' | 'break_finish' = 'work_finish') {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const baseFreq = type === 'work_finish' ? 528 : 659.25; // 528Hz (Focus/Calm) or E5
      const harmonicFreq = type === 'work_finish' ? 880 : 1046.5;

      [baseFreq, harmonicFreq].forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.15 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 2.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 3.0);
      });
    } catch (e) {
      console.error('Error playing chime:', e);
    }
  }

  // Ambient soundscape generators
  public playAmbient(track: 'alpha' | 'rain' | 'whitenoise' | 'brownnoise' | 'cafe') {
    this.stopAmbient();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentTrack = track;

    if (track === 'alpha') {
      this.playBinauralAlpha();
    } else if (track === 'rain') {
      this.playRain();
    } else if (track === 'brownnoise') {
      this.playBrownNoise();
    } else if (track === 'whitenoise') {
      this.playWhiteNoise();
    } else if (track === 'cafe') {
      this.playCafeHum();
    }
  }

  // Binaural Alpha (10 Hz beat difference: 210Hz Left, 200Hz Right)
  private playBinauralAlpha() {
    if (!this.ctx || !this.masterGain) return;

    const merger = this.ctx.createChannelMerger(2);

    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(200, this.ctx.currentTime); // 200Hz

    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(210, this.ctx.currentTime); // 210Hz -> 10Hz beat

    const gainL = this.ctx.createGain();
    gainL.gain.setValueAtTime(0.25, this.ctx.currentTime);
    const gainR = this.ctx.createGain();
    gainR.gain.setValueAtTime(0.25, this.ctx.currentTime);

    oscL.connect(gainL);
    gainL.connect(merger, 0, 0);

    oscR.connect(gainR);
    gainR.connect(merger, 0, 1);

    merger.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.activeNodes.push(
      { stop: () => oscL.stop(), disconnect: () => oscL.disconnect() },
      { stop: () => oscR.stop(), disconnect: () => oscR.disconnect() },
      { disconnect: () => merger.disconnect() }
    );
  }

  // Realistic Gentle Rain Synthesizer using dynamic filtered noise buffer
  private playRain() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to simulate raindrops on glass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);

    // LFO to create gentle wave swells
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.25, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
    lfo.connect(filter.frequency);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.activeNodes.push(
      { stop: () => whiteNoise.stop(), disconnect: () => whiteNoise.disconnect() },
      { stop: () => lfo.stop(), disconnect: () => lfo.disconnect() },
      { disconnect: () => rainGain.disconnect() }
    );
  }

  // Deep Brown Noise for intense ADHD and distraction blocking
  private playBrownNoise() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start();

    this.activeNodes.push(
      { stop: () => noiseSource.stop(), disconnect: () => noiseSource.disconnect() },
      { disconnect: () => gain.disconnect() }
    );
  }

  // Clean White Noise
  private playWhiteNoise() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start();

    this.activeNodes.push(
      { stop: () => noiseSource.stop(), disconnect: () => noiseSource.disconnect() },
      { disconnect: () => gain.disconnect() }
    );
  }

  // Cozy Cafe ambience simulator (warm muffled rumble & gentle murmur frequencies)
  private playCafeHum() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start();

    this.activeNodes.push(
      { stop: () => noiseSource.stop(), disconnect: () => noiseSource.disconnect() },
      { disconnect: () => gain.disconnect() }
    );
  }
}

export const audioSynth = new AudioSynthService();
