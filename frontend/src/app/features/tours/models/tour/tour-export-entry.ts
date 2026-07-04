import { TourLogResponse } from "../log/tour-log-response";

export interface TourExportEntry {
    name: string;
    description: string;
    fromAddress: string;
    toAddress: string;
    transportTypeName: string;
    distanceKm: number;
    estimatedTimeS: number;
    logs: TourLogResponse[];
}
