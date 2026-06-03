import { Injectable, inject, effect } from '@angular/core';
import { ThemeService } from './theme.service';

const MAX_ROT_X = 6;   // degrés horizontal
const MAX_ROT_Y = 2.5; // degrés vertical
const EASE = 0.055;    // lerp coefficient — plus bas = plus fluide

@Injectable({ providedIn: 'root' })
export class CylinderEffectService {
  private readonly themeService = inject(ThemeService);

  private targetX = 0;
  private targetY = 0;
  private curX = 0;
  private curY = 0;
  private rafId = 0;
  private active = false;

  init(): void {
    effect(() => {
      if (this.themeService.theme() === 'steampunk') {
        this.start();
      } else {
        this.deactivate();
      }
    });
  }

  private start(): void {
    if (this.active) return;
    this.active = true;
    document.addEventListener('mousemove', this.onMove, { passive: true });
    this.rafId = requestAnimationFrame(this.tick);
  }

  private deactivate(): void {
    this.active = false;
    document.removeEventListener('mousemove', this.onMove);
    cancelAnimationFrame(this.rafId);
    // Retour à zéro progressif
    this.targetX = 0;
    this.targetY = 0;
    this.rafId = requestAnimationFrame(this.resetTick);
  }

  private readonly onMove = (e: MouseEvent) => {
    // -1..1 centré sur le milieu de l'écran
    this.targetX = ((e.clientX / window.innerWidth) - 0.5) * 2 * MAX_ROT_X;
    this.targetY = ((e.clientY / window.innerHeight) - 0.5) * -2 * MAX_ROT_Y;
  };

  private readonly tick = () => {
    if (!this.active) return;
    this.lerp();
    this.apply();
    this.rafId = requestAnimationFrame(this.tick);
  };

  private readonly resetTick = () => {
    this.lerp();
    this.apply();
    if (Math.abs(this.curX) > 0.02 || Math.abs(this.curY) > 0.02) {
      this.rafId = requestAnimationFrame(this.resetTick);
    } else {
      const root = document.documentElement;
      root.style.removeProperty('--cyl-x');
      root.style.removeProperty('--cyl-y');
      root.style.removeProperty('--para-x');
      root.style.removeProperty('--para-y');
    }
  };

  private lerp(): void {
    this.curX += (this.targetX - this.curX) * EASE;
    this.curY += (this.targetY - this.curY) * EASE;
  }

  private apply(): void {
    const root = document.documentElement;
    root.style.setProperty('--cyl-x', `${this.curX.toFixed(3)}deg`);
    root.style.setProperty('--cyl-y', `${this.curY.toFixed(3)}deg`);
    // Parallax en px — différents multiplicateurs dans le CSS
    root.style.setProperty('--para-x', `${(this.curX / MAX_ROT_X * 24).toFixed(2)}px`);
    root.style.setProperty('--para-y', `${(this.curY / MAX_ROT_Y * 10).toFixed(2)}px`);
  }
}
