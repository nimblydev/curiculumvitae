import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label';

@Component({
  selector: 'app-steampunk-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'pointer-events: none' },
  template: `
    <div
      class="stcursor"
      [style.transform]="transform()"
      [class.stcursor--hover]="hovering()"
      [class.stcursor--click]="clicking()">

      <svg class="stcursor__gear" viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1
          3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.93
          0-.31-.03-.62-.07-.93l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32
          c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54
          c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54
          c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87
          c-.12.21-.08.47.12.61l2.03 1.58c-.05.31-.09.63-.09.94s.04.63.09.94
          l-2.03 1.58c-.18.14-.23.4-.12.6l1.92 3.32c.12.22.37.29.59.22l2.39-.96
          c.5.39 1.03.71 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84
          c.24 0 .44-.17.47-.41l.36-2.54c.59-.23 1.13-.55 1.62-.94l2.39.96
          c.22.07.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58z"/>
      </svg>

      <div class="stcursor__cross">
        <span class="stcursor__cross-h"></span>
        <span class="stcursor__cross-v"></span>
      </div>

      <div class="stcursor__dot"></div>
    </div>
  `,
  styles: `
    .stcursor {
      position: fixed;
      top: 0; left: 0;
      width: 44px; height: 44px;
      margin: -22px 0 0 -22px;
      z-index: 99999;
      pointer-events: none;
      will-change: transform;
    }

    .stcursor__gear {
      position: absolute;
      inset: 0;
      color: #c8832a;
      filter: drop-shadow(0 0 6px rgba(200,131,42,0.55));
      animation: stgear 5s linear infinite;
      transition: filter 0.2s;
    }

    .stcursor--hover .stcursor__gear {
      animation-duration: 1.2s;
      color: #d4a855;
      filter: drop-shadow(0 0 10px rgba(212,168,85,0.8));
    }

    .stcursor--click .stcursor__gear {
      animation-duration: 0.25s;
      color: #e8c06a;
      filter: drop-shadow(0 0 14px rgba(232,192,106,1));
    }

    .stcursor__cross {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stcursor__cross-h,
    .stcursor__cross-v {
      position: absolute;
      background: #d4a855;
      opacity: 0.75;
      border-radius: 1px;
      transition: opacity 0.2s;
    }

    .stcursor__cross-h { width: 28%; height: 1.5px; }
    .stcursor__cross-v { height: 28%; width: 1.5px; }

    .stcursor--hover .stcursor__cross-h,
    .stcursor--hover .stcursor__cross-v { opacity: 1; }

    .stcursor__dot {
      position: absolute;
      top: 50%; left: 50%;
      width: 5px; height: 5px;
      margin: -2.5px 0 0 -2.5px;
      border-radius: 50%;
      background: #d4a855;
      box-shadow: 0 0 6px #d4a855;
      transition: transform 0.15s;
    }

    .stcursor--click .stcursor__dot {
      transform: scale(1.8);
    }

    @keyframes stgear {
      to { transform: rotate(360deg); }
    }
  `,
})
export class SteampunkCursorComponent implements OnInit, OnDestroy {
  private readonly _x = signal(-100);
  private readonly _y = signal(-100);
  readonly clicking = signal(false);
  readonly hovering = signal(false);

  readonly transform = computed(() => `translate(${this._x()}px,${this._y()}px)`);

  private readonly onMove = (e: MouseEvent) => {
    this._x.set(e.clientX);
    this._y.set(e.clientY);
  };
  private readonly onDown = () => this.clicking.set(true);
  private readonly onUp = () => this.clicking.set(false);
  private readonly onOver = (e: MouseEvent) =>
    this.hovering.set(!!(e.target as Element).closest(INTERACTIVE));

  ngOnInit(): void {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', this.onMove, { passive: true });
    document.addEventListener('mousedown', this.onDown);
    document.addEventListener('mouseup', this.onUp);
    document.addEventListener('mouseover', this.onOver, { passive: true });
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mousedown', this.onDown);
    document.removeEventListener('mouseup', this.onUp);
    document.removeEventListener('mouseover', this.onOver);
  }
}
