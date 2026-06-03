import { Component } from '@angular/core';
import { CV_DATA } from '../../core/data/cv.data';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {
  readonly skillGroups = CV_DATA.skillGroups;
}
