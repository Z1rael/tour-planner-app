export interface TourLog {
  id: number;
  tour_id: number;
  comment: string;
  timestamp: string; // ISO datetime
  difficulty: number; // 1-5
  total_distance: number;
  total_time: number;
  rating: number; // 1-5
}
