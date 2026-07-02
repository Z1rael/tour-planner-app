import { OrsGeometry } from "./ors-geometry";
import { OrsSummary } from "./ors-summary";

export interface OrsFeature {
    geometry: OrsGeometry;
    properties: { summary: OrsSummary };
}
