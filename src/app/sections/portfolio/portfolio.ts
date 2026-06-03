import { Component, inject } from '@angular/core';
import { HeroComponent } from '../hero/hero';
import { ExperienceComponent } from '../experience/experience';
import { SkillsComponent } from '../skills/skills';
import { EducationComponent } from '../education/education';
import { InterestsComponent } from '../interests/interests';
import { EasterEggService } from '../../core/services/easter-egg.service';
import { PrintService } from '../../core/services/print.service';
import { PdfExportComponent } from '../../shared/components/pdf-export/pdf-export';

@Component({
  selector: 'app-portfolio',
  imports: [
    HeroComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    InterestsComponent,
    PdfExportComponent,
  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class PortfolioComponent {
  readonly activeEgg = inject(EasterEggService).activeEgg;
  readonly eggs = inject(EasterEggService);
  readonly print = inject(PrintService);
}
