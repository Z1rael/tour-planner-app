import { GeocodeDTO } from "../../../map/services/models/geocode-dto";

export interface TourResponse {
    tour_id: number;
    name: string;
    description: string;
    from_geocode: GeocodeDTO;
    to_geocode: GeocodeDTO;
    transport_type_name: string;
    distance_km: number;
    estimated_time_s: number;
    route_geo_json: string;
    image_path: string | null;
    popularity: number;
    child_friendliness: number;
    is_owner: boolean;
}