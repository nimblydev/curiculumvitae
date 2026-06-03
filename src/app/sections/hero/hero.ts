import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CV_DATA } from '../../core/data/cv.data';
import { ThemeSwitcherComponent } from '../../shared/components/theme-switcher/theme-switcher';
import { EasterEggService } from '../../core/services/easter-egg.service';
import { PrintService } from '../../core/services/print.service';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, ThemeSwitcherComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  readonly cv = CV_DATA;
  private readonly eggs = inject(EasterEggService);
  readonly print = inject(PrintService);
  readonly activeEgg = inject(EasterEggService).activeEgg;

  onNameClick(): void {
    this.eggs.trigger('name-click');
  }
}
