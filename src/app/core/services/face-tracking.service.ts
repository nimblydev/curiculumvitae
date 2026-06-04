import { Injectable, signal } from '@angular/core';

export type FaceTrackingState = 'unavailable' | 'idle' | 'requesting' | 'active' | 'denied';

interface DetectedFace {
  boundingBox: DOMRectReadOnly;
}

// Shape Detection API — Chrome/Edge uniquement
declare class FaceDetector {
  constructor(options?: { maxDetectedFaces?: number; fastMode?: boolean });
  detect(source: HTMLVideoElement): Promise<DetectedFace[]>;
}

const DETECTION_INTERVAL_MS = 80; // ~12 fps

@Injectable({ providedIn: 'root' })
export class FaceTrackingService {
  readonly state = signal<FaceTrackingState>(
    typeof window !== 'undefined' && 'FaceDetector' in window ? 'idle' : 'unavailable'
  );
  /** Position horizontale normalisée −1..1 (gauche..droite) */
  readonly trackX = signal(0);
  /** Position verticale normalisée −1..1 (haut..bas) */
  readonly trackY = signal(0);
  readonly stream = signal<MediaStream | null>(null);

  private video: HTMLVideoElement | null = null;
  private detector: FaceDetector | null = null;
  private running = false;

  constructor() {
    if (this.state() === 'idle') {
      try {
        this.detector = new FaceDetector({ maxDetectedFaces: 1, fastMode: true });
      } catch {
        this.state.set('unavailable');
      }
    }
  }

  async start(): Promise<void> {
    const s = this.state();
    if (s === 'active' || s === 'requesting' || s === 'unavailable') return;
    this.state.set('requesting');

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
        audio: false,
      });

      const video = document.createElement('video');
      video.srcObject = mediaStream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      await video.play();

      this.video = video;
      this.stream.set(mediaStream);
      this.running = true;
      this.state.set('active');
      void this.runLoop();
    } catch {
      this.state.set('denied');
      this.cleanup();
    }
  }

  stop(): void {
    if (this.state() === 'unavailable') return;
    this.running = false;
    this.cleanup();
    this.trackX.set(0);
    this.trackY.set(0);
    if (this.state() === 'active') this.state.set('idle');
  }

  toggle(): void {
    if (this.state() === 'active') {
      this.stop();
    } else {
      void this.start();
    }
  }

  private cleanup(): void {
    this.stream()?.getTracks().forEach(t => t.stop());
    this.stream.set(null);
    this.video = null;
  }

  private async runLoop(): Promise<void> {
    while (this.running && this.video && this.detector) {
      try {
        const faces = await this.detector.detect(this.video);
        if (faces.length > 0) {
          const { x, y, width, height } = faces[0].boundingBox;
          const vw = this.video.videoWidth || 1;
          const vh = this.video.videoHeight || 1;
          // Inversion X : caméra frontale non miroir — visage à droite = utilisateur à droite
          this.trackX.set(-((x + width / 2) / vw - 0.5) * 2);
          this.trackY.set(-((y + height / 2) / vh - 0.5) * 2);
        }
      } catch { /* pas de visage détecté */ }

      await new Promise<void>(r => setTimeout(r, DETECTION_INTERVAL_MS));
    }
  }
}
