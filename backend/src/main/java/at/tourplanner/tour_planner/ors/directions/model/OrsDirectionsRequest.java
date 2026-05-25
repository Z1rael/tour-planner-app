package at.tourplanner.tour_planner.ors.directions.model;

import java.util.List;

public record OrsDirectionsRequest(
        List<List<Double>> coordinates
) {
}
