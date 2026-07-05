export interface TourLogResponse {
    tour_log_id: number;
    tour_id: number;
    comment: string;
    difficulty: number;
    rating: number;
    total_time_s: number; // in s
    total_distance_km: number; // in km
    log_date: string;
    is_owner: boolean;
}