import { GeocodeDTO } from '../../features/map/services/ors-geocode.service';
import { TransportationType } from './transportation-type';

export interface Tour {
  id: number;
  name: string;
  fromGeocode: GeocodeDTO;
  toGeocode: GeocodeDTO;
  transport_type: TransportationType;
  description: string;
  distance: number;
  estimated_time: number;
  route_information: string;
  creator_id: number;
  popularity: number;
  child_friendliness: number;
}
