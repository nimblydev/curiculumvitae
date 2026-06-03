import { Component, inject } from '@angular/core';
import { ThemeService, Theme } from '../../../core/services/theme.service';

const THEME_META: Record<Theme, { label: string; icon: string }> = {
  light: { label: 'Clair', icon: '☀' },
  dark: { label: 'Sombre', icon: '☾' },
  steampunk: { label: 'Steampunk', icon: '⚙' },
};

@Component({
  selector: 'app-theme-switcher',
  template: `
    <div class="switcher" role="group" aria-label="Choisir le thème">
      @for (t of themes; track t) {
        <button
          class="btn"
          [class.active]="themeService.theme() === t"
          [title]="meta[t].label"
          [attr.aria-pressed]="themeService.theme() === t"
          (click)="themeService.setTheme(t)">
          {{ meta[t].icon }}
        </button>
      }
    </div>
  `,
  styles: `
    .switcher {
      display: flex;
      gap: 4px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 4px;
    }
    .btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
    }
    .btn:hover { background: var(--border); color: var(--text); }
    .btn.active { background: var(--primary); color: #fff; }
  `,
})
export class ThemeSwitcherComponent {
  readonly themeService = inject(ThemeService);
  readonly themes: Theme[] = ['light', 'dark', 'steampunk'];
  readonly meta = THEME_META;
}
