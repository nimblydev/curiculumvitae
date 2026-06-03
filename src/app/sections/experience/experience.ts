import { Component, signal } from '@angular/core';
import { CV_DATA } from '../../core/data/cv.data';
import type { Experience } from '../../core/data/cv.types';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceComponent {
  readonly experiences = CV_DATA.experiences;
  readonly expanded = signal<string | null>('uness');

  toggle(id: string): void {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  isExpanded(id: string): boolean {
    return this.expanded() === id;
  }
}
