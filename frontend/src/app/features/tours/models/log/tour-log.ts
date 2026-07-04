export interface TourLog {
  id: number;
  tour_id: number;
  comment: string;
  timestamp: string; // ISO datetime
  difficulty: number; // 1-5
  total_distance_km: number;
  total_time_m: number;
  rating: number; // 1-5
  creator_id: number;
  isOwner: boolean;
}
