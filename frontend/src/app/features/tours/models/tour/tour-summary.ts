export interface TourSummary {
  id: number;
  name: string;
  from: string;
  to: string;
  transportType: string; // or a kind of enum i have not come to a decision yet
  distanceKm: number;
  estimatedTimeS: number;
  popularity: number;
  childFriendliness: number;
  creatorId: number;
}
