export interface TourSummary {
  id: number;
  name: string;
  from: string;
  to: string;
  transport_type: string; // or a kind of enum i have not come to a decision yet
  creator_id: number;
}
