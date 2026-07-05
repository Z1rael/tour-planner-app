package at.tourplanner.tour_planner.api.dto.export;

import at.tourplanner.tour_planner.api.dto.tourlog.TourLogResponse;
import at.tourplanner.tour_planner.features.tour.Tour;
import at.tourplanner.tour_planner.features.user.User;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

import java.util.List;

public record TourExportEntry(
        String name,
        String description,
        String fromAddress,
        String toAddress,
        String transportTypeName,
        double distanceKm,
        long estimatedTimeS,
        String route,
        List<TourLogResponse> logs
) {
    public static TourExportEntry from(Tour tour, User user) {
        String geoJson = null;
        try {
            if (tour.getRoute() != null) {
                geoJson = new GeoJsonWriter().write(tour.getRoute());
            }
        } catch (Exception e) {
            geoJson = null;
        }

        return new TourExportEntry(
                tour.getName(),
                tour.getDescription(),
                tour.getFromAddress(),
                tour.getToAddress(),
                tour.getTransportType().getTransportationName(),
                tour.getDistanceKm(),
                tour.getEstimatedTimeS(),
                geoJson,
                tour.getLogs().stream()
                        .map(tl -> TourLogResponse.from(tl, user))
                        .toList()
        );
    }
}