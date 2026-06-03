import { Component, inject } from '@angular/core';
import { HeroComponent } from '../hero/hero';
import { ExperienceComponent } from '../experience/experience';
import { SkillsComponent } from '../skills/skills';
import { EducationComponent } from '../education/education';
import { InterestsComponent } from '../interests/interests';
import { EasterEggService } from '../../core/services/easter-egg.service';

@Component({
  selector: 'app-portfolio',
  imports: [
    HeroComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    InterestsComponent,
  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class PortfolioComponent {
  readonly activeEgg = inject(EasterEggService).activeEgg;
  readonly eggs = inject(EasterEggService);
}
