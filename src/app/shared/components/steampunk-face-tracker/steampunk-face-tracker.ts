import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  effect,
  viewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { FaceTrackingService } from '../../../core/services/face-tracking.service';

@Component({
  selector: 'app-steampunk-face-tracker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'pointer-events: none' },
  template: `
    <div class="lcd" [class]="'lcd--' + ft.state()">

      <!-- ── En-tête ── -->
      <header class="lcd__header">
        <svg class="lcd__gear" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5
            3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.93s-.03-.62-.07-.93l2.03-1.58
            c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7
            -1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54
            c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47
            .12.61l2.03 1.58c-.05.31-.09.63-.09.94s.04.63.09.94l-2.03 1.58c-.18.14-.23.4-.12
            .6l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.39 1.03.71 1.62.94l.36 2.54
            c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.23 1.13-.55 1.62-.94
            l2.39.96c.22.07.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58z"/>
        </svg>
        <span class="lcd__title">TÉLÉ-OPTIQUE</span>
        <span class="lcd__status-dot"></span>
        <span class="lcd__status-text">{{ statusText() }}</span>
      </header>

      <!-- ── Écran ── -->
      <div class="lcd__screen-wrap">
        @if (ft.state() === 'streaming') {
          <canvas #lcdCanvas class="lcd__canvas" width="200" height="150"></canvas>
          <div class="lcd__scanlines" aria-hidden="true"></div>
          <div class="lcd__vignette" aria-hidden="true"></div>
        } @else {
          <div class="lcd__idle">
            @if (ft.modelLoading()) {
              <span class="lcd__spinner"></span>
              <span class="lcd__idle-text">CHARGEMENT IA…</span>
            } @else if (ft.state() === 'requesting') {
              <span class="lcd__spinner"></span>
              <span class="lcd__idle-text">ACCÈS CAMÉRA…</span>
            } @else if (ft.state() === 'denied') {
              <span class="lcd__idle-icon">⊘</span>
              <span class="lcd__idle-text">ACCÈS REFUSÉ</span>
            } @else if (ft.modelError()) {
              <span class="lcd__idle-icon">⊘</span>
              <span class="lcd__idle-text">ERREUR MODÈLES</span>
            } @else {
              <span class="lcd__idle-icon">⊡</span>
              <span class="lcd__idle-text">FLUX COUPÉ</span>
            }
          </div>
        }
      </div>

      <!-- ── Données de position ── -->
      @if (ft.state() === 'streaming') {
        <div class="lcd__data">
          <div class="lcd__row">
            <span class="lcd__lbl">X</span>
            <div class="lcd__track">
              <div class="lcd__fill"
                [style.left]="fillLeft(ft.trackX())"
                [style.width]="fillWidth(ft.trackX())"></div>
              <div class="lcd__center-mark"></div>
            </div>
            <span class="lcd__val">{{ fmtX() }}</span>
          </div>
          <div class="lcd__row">
            <span class="lcd__lbl">Y</span>
            <div class="lcd__track">
              <div class="lcd__fill"
                [style.left]="fillLeft(ft.trackY())"
                [style.width]="fillWidth(ft.trackY())"></div>
              <div class="lcd__center-mark"></div>
            </div>
            <span class="lcd__val">{{ fmtY() }}</span>
          </div>
          <div class="lcd__mode">
            ⟢ YEUX + VISAGE
          </div>
        </div>
      }

      <!-- ── Bouton ── -->
      <button
        class="lcd__btn"
        style="pointer-events: auto"
        (click)="ft.toggle()"
        [attr.aria-label]="btnLabel()">
        {{ btnLabel() }}
      </button>

    </div>
  `,
  styles: `
    /* ══ Conteneur principal ══════════════════════════════════════ */
    .lcd {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 240px;
      background: #120900;
      border: 2px solid #7a4e1e;
      border-radius: 4px;
      box-shadow:
        0 0 0 1px #3a200a,
        0 4px 24px rgba(0,0,0,.7),
        inset 0 1px 0 rgba(255,210,120,.08);
      font-family: 'Courier New', monospace;
      font-size: 11px;
      color: #56e06a;
      letter-spacing: .04em;
      z-index: 9000;
      overflow: hidden;
    }

    /* coins boulonnés */
    .lcd::before, .lcd::after {
      content: '';
      position: absolute;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #7a4e1e;
      box-shadow: inset 0 1px 2px rgba(0,0,0,.6), 0 0 3px rgba(200,131,42,.3);
    }
    .lcd::before { top: 5px; left: 5px; }
    .lcd::after  { top: 5px; right: 5px; }

    /* ══ En-tête ════════════════════════════════════════════════ */
    .lcd__header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px 6px 14px;
      background: linear-gradient(180deg, #1e0e04 0%, #120900 100%);
      border-bottom: 1px solid #3a200a;
    }

    .lcd__gear {
      width: 12px; height: 12px;
      fill: #c8832a;
      flex-shrink: 0;
      animation: lcd-gear 8s linear infinite;
    }
    @keyframes lcd-gear { to { transform: rotate(360deg); } }

    .lcd__title {
      flex: 1;
      font-size: 10px;
      font-weight: bold;
      color: #c8832a;
      letter-spacing: .1em;
    }

    .lcd__status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #3a3a3a;
      flex-shrink: 0;
      transition: background .3s, box-shadow .3s;
    }
    .lcd--streaming .lcd__status-dot {
      background: #56e06a;
      box-shadow: 0 0 6px #56e06a;
      animation: lcd-pulse 2s ease-in-out infinite;
    }
    .lcd--requesting .lcd__status-dot {
      background: #d4a855;
      box-shadow: 0 0 6px #d4a855;
    }
    .lcd--denied .lcd__status-dot { background: #e05656; }

    @keyframes lcd-pulse {
      0%,100% { opacity: 1; }
      50%      { opacity: .4; }
    }

    .lcd__status-text {
      font-size: 9px;
      color: #7a6a50;
      white-space: nowrap;
    }
    .lcd--streaming  .lcd__status-text { color: #56e06a; }
    .lcd--requesting .lcd__status-text { color: #d4a855; }
    .lcd--denied     .lcd__status-text { color: #e05656; }

    /* ══ Écran ══════════════════════════════════════════════════ */
    .lcd__screen-wrap {
      position: relative;
      background: #000;
      aspect-ratio: 4/3;
      overflow: hidden;
      border-top: 1px solid #2a1508;
      border-bottom: 1px solid #2a1508;
    }

    .lcd__canvas {
      display: block;
      width: 100%;
      height: 100%;
      filter: sepia(.7) hue-rotate(72deg) saturate(2) brightness(.85);
      image-rendering: auto;
    }

    .lcd__scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent 2px,
        rgba(0,0,0,.18) 2px,
        rgba(0,0,0,.18) 4px
      );
      pointer-events: none;
    }

    .lcd__vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,.65) 100%);
      pointer-events: none;
    }

    .lcd__badge {
      position: absolute;
      bottom: 5px;
      left: 6px;
      font-size: 9px;
      color: rgba(86,224,106,.5);
      letter-spacing: .06em;
    }

    /* écran éteint */
    .lcd__idle {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #050300;
    }

    .lcd__idle-icon {
      font-size: 28px;
      color: #2a1a08;
    }
    .lcd--denied .lcd__idle-icon { color: #5a1a1a; }

    .lcd__idle-text {
      font-size: 10px;
      color: #3a2a18;
      letter-spacing: .1em;
    }
    .lcd--denied     .lcd__idle-text { color: #7a2a2a; }
    .lcd--requesting .lcd__idle-text { color: #8a6a20; }

    .lcd__spinner {
      width: 22px; height: 22px;
      border-radius: 50%;
      border: 2px solid #3a200a;
      border-top-color: #d4a855;
      animation: lcd-spin .8s linear infinite;
    }
    @keyframes lcd-spin { to { transform: rotate(360deg); } }

    /* ══ Données ════════════════════════════════════════════════ */
    .lcd__data {
      padding: 8px 10px 6px;
      border-top: 1px solid #1a0e04;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .lcd__row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .lcd__lbl {
      width: 10px;
      color: #c8832a;
      font-size: 10px;
      flex-shrink: 0;
    }

    .lcd__track {
      position: relative;
      flex: 1;
      height: 5px;
      background: rgba(86,224,106,.08);
      border: 1px solid rgba(86,224,106,.2);
      border-radius: 1px;
    }

    .lcd__fill {
      position: absolute;
      top: 0;
      height: 100%;
      background: rgba(86,224,106,.7);
      min-width: 2px;
      transition: left .08s linear, width .08s linear;
    }

    .lcd__center-mark {
      position: absolute;
      left: 50%;
      top: -1px;
      width: 1px;
      height: calc(100% + 2px);
      background: rgba(86,224,106,.5);
    }

    .lcd__val {
      width: 38px;
      text-align: right;
      color: #56e06a;
      font-size: 10px;
      flex-shrink: 0;
    }

    .lcd__mode {
      font-size: 9px;
      color: #5a4a30;
      letter-spacing: .06em;
      padding-top: 2px;
      border-top: 1px solid #1a0e04;
    }
    .lcd--streaming .lcd__mode { color: #7a6a40; }

    /* ══ Bouton ═════════════════════════════════════════════════ */
    .lcd__btn {
      display: block;
      width: 100%;
      padding: 7px 0;
      background: linear-gradient(180deg, #1e0e04 0%, #140900 100%);
      border: none;
      border-top: 1px solid #3a200a;
      color: #c8832a;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      letter-spacing: .1em;
      cursor: pointer;
      text-transform: uppercase;
      transition: color .2s, background .2s;
    }
    .lcd__btn:hover {
      background: linear-gradient(180deg, #2a1508 0%, #1a0a02 100%);
      color: #d4a855;
    }
    .lcd--streaming .lcd__btn { color: #56e06a; }
    .lcd--streaming .lcd__btn:hover { color: #78f08a; }
    .lcd--denied .lcd__btn { color: #e05656; }
  `,
})
export class SteampunkFaceTrackerComponent implements OnDestroy {
  readonly ft = inject(FaceTrackingService);

  readonly statusText = computed(() => {
    switch (this.ft.state()) {
      case 'idle':       return 'PRÊT';
      case 'requesting': return 'INIT…';
      case 'streaming':  return 'ACTIF';
      case 'denied':     return 'REFUSÉ';
    }
  });

  readonly btnLabel = computed(() =>
    this.ft.state() === 'streaming' ? '⏹ Couper le flux' : '▶ Activer le flux'
  );

  readonly fmtX = computed(() => this.ft.trackX().toFixed(2));
  readonly fmtY = computed(() => this.ft.trackY().toFixed(2));

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('lcdCanvas');
  private rafId = 0;
  private drawActive = false;

  constructor() {
    // Démarre/stoppe la boucle de rendu selon la disponibilité du canvas et de la vidéo.
    // On utilise setTimeout pour sortir du contexte de l'effect et ne pas déclencher
    // le draw loop dans le même microtask que la mise à jour des signaux.
    effect(() => {
      const canvas = this.canvasRef()?.nativeElement;
      const hasVideo = !!this.ft.videoEl();
      if (canvas && hasVideo) {
        setTimeout(() => {
          if (!this.drawActive) {
            this.drawActive = true;
            this.rafId = requestAnimationFrame(this.drawFrame);
          }
        }, 0);
      } else {
        this.drawActive = false;
      }
    });
  }

  fillLeft(v: number): string {
    return v >= 0 ? '50%' : `${(50 + v * 50).toFixed(1)}%`;
  }

  fillWidth(v: number): string {
    return `${(Math.abs(v) * 50).toFixed(1)}%`;
  }

  ngOnDestroy(): void {
    this.drawActive = false;
    cancelAnimationFrame(this.rafId);
    this.ft.stop();
  }

  private readonly drawFrame = () => {
    if (!this.drawActive) return;

    const canvas = this.canvasRef()?.nativeElement;
    const video = this.ft.videoEl();

    if (canvas && video && video.readyState >= 2) {
      const ctx = canvas.getContext('2d')!;
      const W = canvas.width;
      const H = canvas.height;

      // Miroir vidéo
      ctx.save();
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, W, H);
      ctx.restore();

      const face = this.ft.detectedFace();
      const vw = video.videoWidth || 1;
      const vh = video.videoHeight || 1;
      const sx = W / vw;
      const sy = H / vh;

      if (face) {
        // Inverser X pour le miroir
        const rx = W - (face.x + face.width) * sx;
        const ry = face.y * sy;
        const rw = face.width * sx;
        const rh = face.height * sy;
        const bl = 9;

        // ── Crochets de ciblage
        ctx.strokeStyle = 'rgba(86,224,106,0.95)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rx,           ry + bl); ctx.lineTo(rx,      ry); ctx.lineTo(rx + bl,      ry);
        ctx.moveTo(rx + rw - bl, ry);      ctx.lineTo(rx + rw, ry); ctx.lineTo(rx + rw,      ry + bl);
        ctx.moveTo(rx + rw,      ry + rh - bl); ctx.lineTo(rx + rw, ry + rh); ctx.lineTo(rx + rw - bl, ry + rh);
        ctx.moveTo(rx + bl,      ry + rh); ctx.lineTo(rx,      ry + rh); ctx.lineTo(rx,      ry + rh - bl);
        ctx.stroke();

        // ── Croix centrale (centre du visage)
        const cx = rx + rw / 2;
        const cy = ry + rh / 2;
        ctx.strokeStyle = 'rgba(86,224,106,0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
        ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
        ctx.stroke();

        // ── Croix sur les yeux (landmarks si disponibles)
        if (face.eyes && face.eyes.length > 0) {
          for (const eye of face.eyes) {
            const ex = W - eye.x * sx;  // miroir X
            const ey = eye.y * sy;
            const arm = 7;

            // Cercle de ciblage
            ctx.strokeStyle = 'rgba(86,224,106,0.9)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ex, ey, 5, 0, Math.PI * 2);
            ctx.stroke();

            // Croix +
            ctx.beginPath();
            ctx.moveTo(ex - arm, ey); ctx.lineTo(ex - 6, ey);
            ctx.moveTo(ex + 6,   ey); ctx.lineTo(ex + arm, ey);
            ctx.moveTo(ex, ey - arm); ctx.lineTo(ex, ey - 6);
            ctx.moveTo(ex, ey + 6);   ctx.lineTo(ex, ey + arm);
            ctx.stroke();

            // Point central
            ctx.fillStyle = 'rgba(86,224,106,1)';
            ctx.beginPath();
            ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Pas de landmark œil → point au centre uniquement
          ctx.fillStyle = 'rgba(86,224,106,0.85)';
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Mire d'attente (pas de visage détecté)
        const cx = W / 2;
        const cy = H / 2;
        ctx.strokeStyle = 'rgba(86,224,106,0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy); ctx.lineTo(cx + 18, cy);
        ctx.moveTo(cx, cy - 18); ctx.lineTo(cx, cy + 18);
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    this.rafId = requestAnimationFrame(this.drawFrame);
  };
}
