import { Injectable, signal, inject } from '@angular/core';
import { ThemeService } from './theme.service';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

@Injectable({ providedIn: 'root' })
export class EasterEggService {
  private readonly themeService = inject(ThemeService);

  readonly activeEgg = signal<string | null>(null);

  private konamiBuffer: string[] = [];
  private idleTimer: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    this.printConsoleMessage();
    this.listenKonami();
    this.listenIdle();
  }

  trigger(id: string, durationMs = 4000): void {
    this.activeEgg.set(id);
    setTimeout(() => this.activeEgg.set(null), durationMs);
  }

  dismiss(): void {
    this.activeEgg.set(null);
  }

  private printConsoleMessage(): void {
    console.log('%c👋 Salut, recruteur curieux !', 'font-size:18px;font-weight:bold;color:#c8832a;');
    console.log('%cCe CV est fait en Angular 22 · Signals · Zoneless · Three.js\nEssaie le Konami Code 🎮', 'font-size:13px;color:#94a3b8;');
    console.log('%c↑ ↑ ↓ ↓ ← → ← → B A', 'font-size:16px;color:#60a5fa;font-weight:bold;');
    console.log('%c...ou clique 3× sur le canyoning 🏔', 'font-size:13px;color:#94a3b8;');
  }

  private listenKonami(): void {
    document.addEventListener('keydown', (e) => {
      this.konamiBuffer.push(e.key);
      if (this.konamiBuffer.length > KONAMI.length) this.konamiBuffer.shift();
      if (this.konamiBuffer.join(',') === KONAMI.join(',')) {
        this.konamiBuffer = [];
        this.themeService.setTheme('steampunk');
        this.trigger('konami', 6000);
      }
    });
  }

  private listenIdle(): void {
    const reset = () => {
      if (this.idleTimer) clearTimeout(this.idleTimer);
      if (this.activeEgg() === 'idle') this.activeEgg.set(null);
      this.idleTimer = setTimeout(() => this.trigger('idle', 10000), 45000);
    };
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(e =>
      document.addEventListener(e, reset, { passive: true })
    );
    reset();
  }
}
