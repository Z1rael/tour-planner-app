import { GeoJSON } from 'geojson';
import { TransportationType } from './transportation-type';

export interface Tour {
  id: number;
  tourName: string;
  tourDescription?: string;
  transportationType: TransportationType;

  distance: number;
  estimatedTime: number;
  route: GeoJSON;

  //TODO(felix): frontend computed values?
  popularity?: number;
  childFriendliness?: number;
}
