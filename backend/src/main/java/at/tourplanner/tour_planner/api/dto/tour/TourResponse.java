package at.tourplanner.tour_planner.api.dto.tour;

import at.tourplanner.tour_planner.features.tour.Tour;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

public record TourResponse(
        Long tourId,
        String name,
        String description,
        double distanceKm,
        long estimatedTimeS,
        String routeGeoJson,

        double fromLat,
        double fromLng,
        double toLat,
        double toLng,

        String transportType,
        int popularity,
        double childFriendliness
) {
    public static TourResponse from(Tour tour) {
        String transport = tour.getTransportType()!=null ? tour.getTransportType().getTransportationName() : null;
        int logCount = tour.getLogs() != null ? tour.getLogs().size() : 0;
        
        double childFriendliness = 0.0;
        if (tour.getLogs() != null && !tour.getLogs().isEmpty()) {
            double avgDifficulty = tour.getLogs().stream()
                    .filter(l -> l.getDifficulty() != null)
                    .mapToInt(l -> l.getDifficulty())
                    .average().orElse(3.0);
            // Invert: low difficulty = more child-friendly
            childFriendliness = Math.round((6.0 - avgDifficulty) * 10.0) / 10.0;
        }
        
        return new TourResponse(
                tour.getTourId(),
                tour.getName(),
                tour.getDescription(),
                tour.getDistanceKm(),
                tour.getEstimatedTimeS(),
                new GeoJsonWriter().write(tour.getRoute()),
                transport,
                logCount,
                childFriendliness
        );
    }
}
