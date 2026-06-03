import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrintService {
  readonly isOpen = signal(false);

  open(): void { this.isOpen.set(true); }
  close(): void { this.isOpen.set(false); }

  print(): void {
    this.close();
    // Laisse le temps à la modal de se fermer avant d'ouvrir le dialog print
    setTimeout(() => window.print(), 150);
  }
}
