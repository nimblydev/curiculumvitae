import { Component, inject, HostListener } from '@angular/core';
import { PrintService } from '../../../core/services/print.service';

@Component({
  selector: 'app-pdf-export',
  templateUrl: './pdf-export.html',
  styleUrl: './pdf-export.scss',
})
export class PdfExportComponent {
  readonly print = inject(PrintService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.print.close();
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as Element).classList.contains('modal-backdrop')) {
      this.print.close();
    }
  }
}
