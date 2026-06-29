import { TransportationType } from './transportation-type';

export interface Tour {
  id: number;
  name: string;
  from: string;
  to: string;
  transport_type: TransportationType;
  description: string;
  distance: number;
  estimated_time: number;
  route_information: string;
  creator_id: number;
  popularity: number;
  child_friendliness: number;
}
