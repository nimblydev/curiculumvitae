import { Injectable, signal } from '@angular/core';

export type FaceTrackingState = 'idle' | 'requesting' | 'streaming' | 'denied';

export interface EyePoint { x: number; y: number; }

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Centres des deux yeux (moyennés sur les 6 landmarks de contour) */
  eyes: EyePoint[];
}

// Modèles chargés depuis CDN — seulement au premier démarrage
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';
const DETECTION_MS = 100; // ~10 fps de détection, suffisant pour le parallax
const FACE_OPTIONS = { inputSize: 160 as const, scoreThreshold: 0.4 };

type FaceApi = typeof import('face-api.js');

@Injectable({ providedIn: 'root' })
export class FaceTrackingService {
  readonly state = signal<FaceTrackingState>('idle');
  readonly trackX = signal(0);
  readonly trackY = signal(0);
  readonly stream = signal<MediaStream | null>(null);
  readonly videoEl = signal<HTMLVideoElement | null>(null);
  readonly detectedFace = signal<FaceBox | null>(null);
  /** True pendant le chargement des modèles IA (~1-2s) */
  readonly modelLoading = signal(false);
  /** Message d'erreur si les modèles ne chargent pas */
  readonly modelError = signal('');

  private faceApi: FaceApi | null = null;
  private running = false;

  async start(): Promise<void> {
    const s = this.state();
    if (s === 'streaming' || s === 'requesting') return;
    this.state.set('requesting');
    this.modelError.set('');

    // ── Chargement des modèles (une seule fois, depuis CDN)
    if (!this.faceApi) {
      this.modelLoading.set(true);
      try {
        const fa = await import('face-api.js');
        await Promise.all([
          fa.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          fa.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        ]);
        this.faceApi = fa;
      } catch {
        this.modelLoading.set(false);
        this.modelError.set('Impossible de charger les modèles IA');
        this.state.set('idle');
        return;
      }
      this.modelLoading.set(false);
    }

    // ── Accès caméra
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

      this.videoEl.set(video);
      this.stream.set(mediaStream);
      this.running = true;
      this.state.set('streaming');
      void this.runDetectionLoop();
    } catch {
      this.state.set('denied');
      this.cleanup();
    }
  }

  stop(): void {
    this.running = false;
    this.cleanup();
    this.trackX.set(0);
    this.trackY.set(0);
    this.detectedFace.set(null);
    if (this.state() === 'streaming') this.state.set('idle');
  }

  toggle(): void {
    if (this.state() === 'streaming') {
      this.stop();
    } else {
      void this.start();
    }
  }

  private cleanup(): void {
    this.stream()?.getTracks().forEach(t => t.stop());
    this.stream.set(null);
    this.videoEl.set(null);
  }

  private async runDetectionLoop(): Promise<void> {
    const fa = this.faceApi!;
    const video = this.videoEl()!;
    const opts = new fa.TinyFaceDetectorOptions(FACE_OPTIONS);

    while (this.running && video) {
      try {
        const result = await fa
          .detectSingleFace(video, opts)
          .withFaceLandmarks(true); // utilise faceLandmark68TinyNet

        if (result) {
          const { x, y, width, height } = result.detection.box;
          const vw = video.videoWidth || 1;
          const vh = video.videoHeight || 1;

          // Centre de chaque œil (moyenne des 6 points de contour)
          const avg = (pts: { x: number; y: number }[]) => ({
            x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
            y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
          });

          this.detectedFace.set({
            x, y, width, height,
            eyes: [
              avg(result.landmarks.getLeftEye()),
              avg(result.landmarks.getRightEye()),
            ],
          });

          // Parallax piloté par le centre du visage
          this.trackX.set(-((x + width / 2) / vw - 0.5) * 2);
          this.trackY.set(-((y + height / 2) / vh - 0.5) * 2);
        } else {
          this.detectedFace.set(null);
        }
      } catch { /* frame non prête */ }

      await new Promise<void>(r => setTimeout(r, DETECTION_MS));
    }
  }
}
