import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EasterEggService } from './core/services/easter-egg.service';
import { ThemeService } from './core/services/theme.service';
import { SteampunkCursorComponent } from './shared/components/steampunk-cursor/steampunk-cursor';
import { CylinderEffectService } from './core/services/cylinder-effect.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SteampunkCursorComponent],
  template: `
    <router-outlet />
    @if (isSteampunk()) {
      <app-steampunk-cursor />
    }
  `,
})
export class App implements OnInit {
  private readonly easterEggs = inject(EasterEggService);
  private readonly cylinder = inject(CylinderEffectService);
  private readonly themeService = inject(ThemeService);

  readonly isSteampunk = computed(() => this.themeService.theme() === 'steampunk');

  ngOnInit(): void {
    this.easterEggs.init();
  }
}
