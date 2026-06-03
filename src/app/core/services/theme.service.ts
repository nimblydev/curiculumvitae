import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark' | 'steampunk';
const THEMES: Theme[] = ['light', 'dark', 'steampunk'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly _theme = signal<Theme>(this.getInitialTheme());

  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      this.doc.documentElement.setAttribute('data-theme', this._theme());
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem('cv-theme', theme);
  }

  next(): void {
    const idx = THEMES.indexOf(this._theme());
    this.setTheme(THEMES[(idx + 1) % THEMES.length]);
  }

  private getInitialTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('cv-theme') as Theme | null;
      if (saved && THEMES.includes(saved)) return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
