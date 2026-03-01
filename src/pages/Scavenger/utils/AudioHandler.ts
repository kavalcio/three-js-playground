type PlayOptions = {
  reverb?: string | null;
  loop?: boolean;
  offset?: number;
  lowpass?: number | null;
  volume?: number;
};

export class AudioHandler {
  audioContext: AudioContext | null;
  buffers: Record<string, AudioBuffer>;
  reverbs: Record<string, AudioBuffer>;
  initialized: boolean;
  activeSources: Record<string, AudioBufferSourceNode[]>;
  pausedAt: Record<string, number>;
  startedAt: Record<string, number>;
  looping: Record<string, boolean>;
  _synthCutoff: Record<string, number>;

  constructor() {
    this.audioContext = null;
    this.buffers = {};
    this.reverbs = {};
    this.initialized = false;
    this.activeSources = {};
    this.pausedAt = {};
    this.startedAt = {};
    this.looping = {};
    this._synthCutoff = {};
  }

  async init(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.initialized = true;
    }
  }

  async load(name: string, url: string): Promise<string> {
    if (!this.initialized) await this.init();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
    this.buffers[name] = audioBuffer;
    return name;
  }

  async loadReverbImpulse(name: string, url: string): Promise<void> {
    if (!this.initialized) await this.init();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const impulseBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
    this.reverbs[name] = impulseBuffer;
  }

  play(
    name: string,
    {
      reverb = null,
      loop = false,
      offset = 0,
      lowpass = null,
      volume = 1.0,
    }: PlayOptions = {},
  ): AudioBufferSourceNode | undefined {
    if (!this.initialized || !this.buffers[name]) return;
    const source = this.audioContext!.createBufferSource();
    source.buffer = this.buffers[name];
    source.loop = !!loop;

    let lastNode: AudioNode = source;
    // Reverb
    if (reverb && this.reverbs[reverb]) {
      const convolver = this.audioContext!.createConvolver();
      convolver.buffer = this.reverbs[reverb];
      lastNode.connect(convolver);
      lastNode = convolver;
    }
    // Low pass filter (use default for synthesized hiss if not provided)
    let effectiveLowpass = lowpass;
    if (lowpass == null && this._synthCutoff[name]) {
      effectiveLowpass = this._synthCutoff[name];
    }
    if (effectiveLowpass && typeof effectiveLowpass === 'number') {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = effectiveLowpass;
      lastNode.connect(filter);
      lastNode = filter;
    }
    // Gain (volume)
    let gainNode: GainNode | null = null;
    if (typeof volume === 'number' && volume >= 0 && volume <= 2) {
      gainNode = this.audioContext!.createGain();
      gainNode.gain.value = volume;
      lastNode.connect(gainNode);
      lastNode = gainNode;
    }
    lastNode.connect(this.audioContext!.destination);
    source.start(0, offset);

    // Track for pause/resume and gain for fading
    if (!this.activeSources[name]) this.activeSources[name] = [];
    this.activeSources[name].push(source);
    // Attach gainNode to source for fading
    (source as any)._gainNode = gainNode;
    this.startedAt[name] = this.audioContext!.currentTime - offset;
    this.looping[name] = !!loop;

    // Clean up when ended (for non-looping)
    source.onended = () => {
      this.activeSources[name] = (this.activeSources[name] || []).filter(
        (s) => s !== source,
      );
    };

    return source;
  }

  /**
   * Fade the volume of a sound up/down.
   * @param name The name of the sound
   * @param duration Fade duration in seconds
   * @param targetVolume Final volume (default 1.0)
   */
  async fade(
    name: string,
    duration: number = 1,
    targetVolume: number = 1.0,
  ): Promise<void> {
    if (!this.activeSources[name] || !this.activeSources[name].length) return;
    for (const source of this.activeSources[name]) {
      const gainNode = (source as any)._gainNode as GainNode | undefined;
      if (!gainNode) return;
      gainNode.gain.cancelScheduledValues(this.audioContext!.currentTime);
      gainNode.gain.setValueAtTime(
        gainNode.gain.value,
        this.audioContext!.currentTime,
      );
      gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        this.audioContext!.currentTime + duration,
      );
    }
  }

  pause(name: string): void {
    if (!this.activeSources[name] || !this.activeSources[name].length) return;
    // Stop all sources and record pause time
    const now = this.audioContext!.currentTime;
    this.activeSources[name].forEach((source) => source.stop());
    // Calculate pause position
    this.pausedAt[name] = now - (this.startedAt[name] || 0);
    this.activeSources[name] = [];
  }

  resume(name: string, options: PlayOptions = {}): void {
    if (!this.buffers[name] || this.activeSources[name]?.length) return;
    const offset = this.pausedAt[name] || 0;
    const loop = this.looping[name] || false;
    this.play(name, { ...options, loop, offset });
  }

  stop(name: string): void {
    if (!this.activeSources[name]) return;
    this.activeSources[name].forEach((source) => source.stop());
    this.activeSources[name] = [];
    this.pausedAt[name] = 0;
  }

  /**
   * Synthesize a looping hiss sound and store it as a buffer under the given name.
   * @param name The name to store the hiss sound under
   * @param duration Duration of the buffer in seconds (default 1.0 for seamless loop)
   * @param volume Volume of the hiss (0.0 to 1.0, default 0.2)
   * @param cutoff Lowpass filter frequency in Hz (default 3000)
   */
  async synthesizeHiss(
    name: string,
    duration: number = 1.0,
    volume: number = 0.2,
    cutoff: number = 3000,
  ): Promise<void> {
    if (!this.initialized) await this.init();
    const sampleRate = this.audioContext!.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = this.audioContext!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    // White noise
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * volume;
    }
    // Optional: fade edges for seamless loop
    // const fadeLen = Math.floor(sampleRate * 0.01); // 10ms fade
    // for (let i = 0; i < fadeLen; i++) {
    //   const fade = i / fadeLen;
    //   data[i] *= fade;
    //   data[length - 1 - i] *= fade;
    // }
    // Store buffer
    this.buffers[name] = buffer;
    // Optionally, store cutoff for default playback
    this._synthCutoff[name] = cutoff;
  }
}
