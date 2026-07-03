import { GeocodeDTO } from "../../../map/services/models/geocode-dto";

export interface UpdateTourPayload {
    name: string;
    description?: string;
    fromGeocode: GeocodeDTO;
    toGeocode: GeocodeDTO;
    profile: string;
}