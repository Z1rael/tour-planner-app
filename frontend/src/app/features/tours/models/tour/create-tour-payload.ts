import { GeocodeDTO } from "../../../map/services/models/geocode-dto";

export interface CreateTourPayload {
    name: string;
    description?: string;
    fromGeocode: GeocodeDTO;
    toGeocode: GeocodeDTO;
    profile: string;
}