import { Component, inject, signal } from '@angular/core';
import { CV_DATA } from '../../core/data/cv.data';
import { EasterEggService } from '../../core/services/easter-egg.service';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.html',
  styleUrl: './interests.scss',
})
export class InterestsComponent {
  readonly interests = CV_DATA.interests;
  private readonly eggs = inject(EasterEggService);

  private clickCounts = new Map<string, number>();
  private clickTimers = new Map<string, ReturnType<typeof setTimeout>>();

  onInterestClick(easterId: string | undefined): void {
    if (!easterId) return;

    const count = (this.clickCounts.get(easterId) ?? 0) + 1;
    this.clickCounts.set(easterId, count);

    const existing = this.clickTimers.get(easterId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => this.clickCounts.set(easterId, 0), 1500);
    this.clickTimers.set(easterId, timer);

    if (count >= 3) {
      this.clickCounts.set(easterId, 0);
      this.eggs.trigger(easterId);
    }
  }
}
