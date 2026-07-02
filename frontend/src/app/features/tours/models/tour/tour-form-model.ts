import { GeocodeDTO } from "../../../map/services/models/geocode-dto";
import { TransportationType } from "./transportation-type";

export interface TourFormModel {
    name: string;
    transport_type: TransportationType;
    from: GeocodeDTO;
    to: GeocodeDTO;
    description: string;
}