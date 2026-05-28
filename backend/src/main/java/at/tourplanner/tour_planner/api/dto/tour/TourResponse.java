package at.tourplanner.tour_planner.api.dto.tour;

import at.tourplanner.tour_planner.features.tour.Tour;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

public record TourResponse(
        Long tourId,
        String name,
        String description,
        double distanceKm,
        long estimatedTimeS,
        String routeGeoJson
) {
    public static TourResponse from(Tour tour) {
        return new TourResponse(
                tour.getTourId(),
                tour.getName(),
                tour.getDescription(),
                tour.getDistanceKm(),
                tour.getEstimatedTimeS(),
                new GeoJsonWriter().write(tour.getRoute())
        );
    }
}
