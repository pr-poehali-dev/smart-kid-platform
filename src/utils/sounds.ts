class SoundManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playCorrect() {
    if (!this.audioContext) return;
    
    this.playTone(523.25, 0.1, 'sine');
    setTimeout(() => this.playTone(659.25, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(783.99, 0.2, 'sine'), 200);
  }

  playWrong() {
    if (!this.audioContext) return;
    
    this.playTone(200, 0.15, 'square');
    setTimeout(() => this.playTone(150, 0.2, 'square'), 150);
  }

  playClick() {
    if (!this.audioContext) return;
    this.playTone(800, 0.05, 'sine');
  }

  playComplete() {
    if (!this.audioContext) return;
    
    const melody = [523.25, 587.33, 659.25, 783.99, 880.00];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine'), i * 100);
    });
  }

  playCollect() {
    if (!this.audioContext) return;
    
    this.playTone(880, 0.1, 'sine');
    setTimeout(() => this.playTone(1046.5, 0.1, 'sine'), 50);
  }
}

export const soundManager = new SoundManager();
