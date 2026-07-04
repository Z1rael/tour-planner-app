import { inject, Service } from '@angular/core';
import { TourExportEntry } from '../models/tour/tour-export-entry';
import { TourService } from './tour.service';

@Service()
export class TourExportService {
    private tourApi = inject(TourService);

    exportAll(): void {
        this.tourApi.exportTours().subscribe({
            next: (entries) => this.downloadJson(entries),
            error: (err) => console.error('Export failed', err),
        });
    }

    private downloadJson(entries: TourExportEntry[]): void {
        const json = JSON.stringify(entries, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `tours-export-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }
}
