import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EasterEggService } from './core/services/easter-egg.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private readonly easterEggs = inject(EasterEggService);
  readonly theme = inject(ThemeService);

  ngOnInit(): void {
    this.easterEggs.init();
  }
}
