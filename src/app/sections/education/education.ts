import { Component } from '@angular/core';
import { CV_DATA } from '../../core/data/cv.data';

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class EducationComponent {
  readonly education = CV_DATA.education;
}
