import { TransportationType } from './transportation-type';

export interface Tour {
  id: number;
  name: string;
  from: string;
  to: string;
  transport_type: TransportationType;
  description: string;
  distance: number; // both are calculated by the backend so hard to mock rn
  estimated_time: number; // both are calculated by the backend so hard to mock rn
  route_information: string; // this is the geoJSON string from ORS but this is hard to replicate without backend
  creator_id: number;
}
