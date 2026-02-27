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

  constructor() {
    this.audioContext = null;
    this.buffers = {};
    this.reverbs = {};
    this.initialized = false;
    this.activeSources = {};
    this.pausedAt = {};
    this.startedAt = {};
    this.looping = {};
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
    // Low pass filter
    if (lowpass && typeof lowpass === 'number') {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = lowpass;
      lastNode.connect(filter);
      lastNode = filter;
    }
    // Gain (volume)
    if (typeof volume === 'number' && volume >= 0 && volume <= 2) {
      const gainNode = this.audioContext!.createGain();
      gainNode.gain.value = volume;
      lastNode.connect(gainNode);
      lastNode = gainNode;
    }
    lastNode.connect(this.audioContext!.destination);
    source.start(0, offset);

    // Track for pause/resume
    if (!this.activeSources[name]) this.activeSources[name] = [];
    this.activeSources[name].push(source);
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
}
