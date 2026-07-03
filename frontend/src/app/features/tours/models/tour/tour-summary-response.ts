export interface TourSummaryResponse {
    tour_id: number;
    name: string;
    from_address: string;
    to_address: string;
    transport_type_name: string;
    distance_km: number;
    estimated_time_s: number;
    popularity: number;
    child_friendliness: number;
    creator_id: number;
}
