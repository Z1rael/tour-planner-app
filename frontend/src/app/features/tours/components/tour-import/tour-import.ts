import { Component, inject, signal } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { TourExportEntry } from '../../models/tour/tour-export-entry';
import { TourSummaryResponse } from '../../models/tour/tour-summary-response';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tour-import',
  standalone: true,
  imports: [],
  templateUrl: './tour-import.html',
  styleUrl: './tour-import.css',
})
export class TourImport {
  private readonly tourFacade = inject(TourFacade);
  activeModal = inject(NgbActiveModal);

  error = signal<string | null>(null);
  importing = signal(false);

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.error.set(null);
    this.importing.set(true);

    try {
      const text = await file.text();
      const entries = this.validate(JSON.parse(text));

      this.tourFacade.importTours(entries).subscribe({
        next: (imported => {
          this.importing.set(false);
          console.log('Imported entries from file');
          this.activeModal.close(imported);
        }),
        error: (err) => {
          this.importing.set(false);
          this.error.set('Import failed: ' + (err.error?.message ?? err.message));
        },
      });
    } catch {
      this.importing.set(false);
      this.error.set('Invalid file format')
    } finally {
      input.value = '';
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }

  private validate(data: unknown): TourExportEntry[] {
    if (!Array.isArray(data)) {
      throw new Error('Expected ab array of tours')
    }
    return data as TourExportEntry[];
  }
}
