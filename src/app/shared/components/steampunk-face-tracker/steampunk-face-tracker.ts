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
    <div class="sft" [class]="'sft--' + ft.state()">

      <button
        class="sft__btn"
        style="pointer-events: auto"
        [attr.aria-label]="label()"
        [attr.title]="label()"
        (click)="ft.toggle()">

        <!-- Monocle / loupe steampunk -->
        <svg class="sft__icon" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
             aria-hidden="true">
          <circle cx="10" cy="10" r="7"/>
          <!-- reflet de lentille -->
          <path d="M7 7.5a3.5 3.5 0 0 1 3-2.5" stroke-width="1.2" opacity="0.55"/>
          <!-- manche -->
          <line x1="15.2" y1="15.2" x2="21" y2="21" stroke-width="2.4"/>
          <!-- vis / ornement -->
          <circle cx="21" cy="21" r="1" fill="currentColor" stroke="none"/>
        </svg>

        @if (ft.state() === 'requesting') {
          <span class="sft__spinner" aria-hidden="true"></span>
        }

        @if (ft.state() === 'active') {
          <span class="sft__dot" aria-hidden="true"></span>
        }
      </button>

      @if (ft.state() === 'active') {
        <div class="sft__preview-wrap" aria-hidden="true">
          <video #preview class="sft__preview" autoplay muted playsinline></video>
          <div class="sft__preview-rim"></div>
          <!-- réticule -->
          <svg class="sft__reticle" viewBox="0 0 80 80" fill="none"
               stroke="rgba(200,131,42,0.55)" stroke-width="1">
            <circle cx="40" cy="40" r="30"/>
            <line x1="40" y1="5" x2="40" y2="20"/>
            <line x1="40" y1="60" x2="40" y2="75"/>
            <line x1="5" y1="40" x2="20" y2="40"/>
            <line x1="60" y1="40" x2="75" y2="40"/>
            <circle cx="40" cy="40" r="3" fill="rgba(200,131,42,0.4)" stroke="none"/>
          </svg>
        </div>
      }

      <span class="sft__label" aria-hidden="true">{{ label() }}</span>
    </div>
  `,
  styles: `
    .sft--unavailable {
      display: none;
    }

    .sft {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      z-index: 9000;
    }

    /* ── Bouton principal ── */
    .sft__btn {
      position: relative;
      width: 48px;
      height: 48px;
      border: 2px solid #7a4e1e;
      border-radius: 50%;
      background: color-mix(in srgb, #2a1a08 80%, transparent);
      color: #c8832a;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color .25s, border-color .25s, box-shadow .25s, background .25s;
      box-shadow: 0 2px 8px rgba(0,0,0,.5),
                  inset 0 1px 0 rgba(255,210,120,.12);
    }

    .sft__btn:hover {
      color: #d4a855;
      border-color: #c8832a;
      box-shadow: 0 0 12px rgba(200,131,42,.4),
                  inset 0 1px 0 rgba(255,210,120,.2);
    }

    .sft__icon {
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }

    /* ── États ── */
    .sft--active .sft__btn {
      color: #56e06a;
      border-color: #3aad4a;
      box-shadow: 0 0 14px rgba(86,224,106,.35),
                  inset 0 1px 0 rgba(100,255,130,.15);
    }

    .sft--denied .sft__btn {
      color: #e05656;
      border-color: #ad3a3a;
      box-shadow: 0 0 10px rgba(224,86,86,.25);
      cursor: not-allowed;
      opacity: .7;
    }

    .sft--denied .sft__btn::after {
      content: '';
      position: absolute;
      inset: 10px;
      border: 1.5px solid #e05656;
      border-radius: 50%;
      transform: rotate(45deg);
      pointer-events: none;
    }

    /* ── Spinner (requesting) ── */
    .sft__spinner {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 2px solid transparent;
      border-top-color: #d4a855;
      animation: sft-spin .8s linear infinite;
    }

    @keyframes sft-spin { to { transform: rotate(360deg); } }

    /* ── Point actif ── */
    .sft__dot {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #56e06a;
      box-shadow: 0 0 6px #56e06a;
      animation: sft-pulse 2s ease-in-out infinite;
    }

    @keyframes sft-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: .6; transform: scale(.75); }
    }

    /* ── Preview vidéo ── */
    .sft__preview-wrap {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #7a4e1e;
      box-shadow: 0 0 12px rgba(200,131,42,.3),
                  inset 0 0 8px rgba(0,0,0,.6);
    }

    .sft__preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scaleX(-1); /* miroir naturel */
      filter: sepia(.35) contrast(1.1);
    }

    .sft__preview-rim {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: radial-gradient(
        ellipse at 30% 25%,
        rgba(255,210,120,.12) 0%,
        transparent 60%
      );
      pointer-events: none;
    }

    .sft__reticle {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    /* ── Étiquette ── */
    .sft__label {
      font-size: 10px;
      letter-spacing: .04em;
      color: #9a6e3a;
      white-space: nowrap;
      text-transform: uppercase;
      font-family: 'Courier New', monospace;
      text-shadow: 0 1px 3px rgba(0,0,0,.8);
      transition: color .25s;
    }

    .sft--active .sft__label  { color: #56e06a; }
    .sft--denied  .sft__label { color: #e05656; }
    .sft--requesting .sft__label { color: #d4a855; }
  `,
})
export class SteampunkFaceTrackerComponent implements OnDestroy {
  readonly ft = inject(FaceTrackingService);

  readonly label = computed(() => {
    switch (this.ft.state()) {
      case 'idle':       return 'Suivi optique';
      case 'requesting': return 'Initialisation…';
      case 'active':     return 'Suivi actif';
      case 'denied':     return 'Accès refusé';
      default:           return '';
    }
  });

  private readonly previewRef = viewChild<ElementRef<HTMLVideoElement>>('preview');

  constructor() {
    effect(() => {
      const el = this.previewRef()?.nativeElement;
      const stream = this.ft.stream();
      if (el) {
        el.srcObject = stream;
        if (stream) el.play().catch(() => {});
      }
    });
  }

  ngOnDestroy(): void {
    this.ft.stop();
  }
}
