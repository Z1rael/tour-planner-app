package at.tourplanner.tour_planner.api.dto.tour;

import at.tourplanner.tour_planner.features.tour.Tour;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

public record TourResponse(
        Long tourId,
        String name,
        String description,
        String fromAddress,
        String toAddress,
        String transportTypeName,
        double distanceKm,
        long estimatedTimeS,
        String routeGeoJson,
        String imagePath,
        int popularity,           // number of logs
        double childFriendliness  // 0.0 – 1.0, higher = more child-friendly
) {
    public static TourResponse from(Tour tour, int popularity, double childFriendliness) {
        String geoJson = null;
        try {
                if (tour.getRoute() != null) {
                geoJson = new GeoJsonWriter().write(tour.getRoute());
                }
        } catch (Exception e) {
                geoJson = null;
        }
        return new TourResponse(
                tour.getTourId(),
                tour.getName(),
                tour.getDescription(),
                tour.getFromAddress(),
                tour.getToAddress(),
                tour.getTransportType() != null ? tour.getTransportType().getTransportationName() : null,
                tour.getDistanceKm() != null ? tour.getDistanceKm() : 0,
                tour.getEstimatedTimeS() != null ? tour.getEstimatedTimeS() : 0,
                geoJson,
                tour.getImagePath(),
                popularity,
                childFriendliness
        );
    }
}