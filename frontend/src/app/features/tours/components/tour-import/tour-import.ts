import { Component, inject, signal } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { TourExportEntry } from '../../models/tour/tour-export-entry';
import { DialogRef } from '@angular/cdk/dialog';
import { TourSummaryResponse } from '../../models/tour/tour-summary-response';

@Component({
  selector: 'app-tour-import',
  standalone: true,
  imports: [],
  templateUrl: './tour-import.html',
  styleUrl: './tour-import.css',
})
export class TourImport {
  private readonly tourFacade = inject(TourFacade);
  private dialogRef = inject(DialogRef<TourSummaryResponse[]>);

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
      const parsed = JSON.parse(text);
      const entries = this.validate(parsed);

      this.tourFacade.importTours(entries).subscribe({
        next: (imported => {
          this.importing.set(false);
          console.log('Imported entries from file');
        }),
        error: (err) => {
          this.importing.set(false);
          this.error.set('Import failed: ' + (err.error?.message ?? err.message));
        },
      });
    } catch (err) {
      this.importing.set(false);
      this.error.set('Invalid file format')
    } finally {
      input.value = '';
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  private validate(data: unknown): TourExportEntry[] {
    if (!Array.isArray(data)) throw new Error('Expected an array of tours');
    const [first] = data;
    if (first && (typeof first.name !== 'string' || typeof first.distanceKm !== 'number')) {
      throw new Error('File does not match expected tour export format');
    }
    return data as TourExportEntry[];
  }
}
