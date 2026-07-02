export interface CreateTourLogPayload {
    tour_id: number;
    comment: string;
    difficulty: number;
    rating: number;
    total_time_s: number;
    total_distance_km: number;
}