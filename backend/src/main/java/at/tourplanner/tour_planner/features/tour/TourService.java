package at.tourplanner.tour_planner.features.tour;

import at.tourplanner.tour_planner.api.dto.export.TourExportEntry;
import at.tourplanner.tour_planner.api.dto.tour.CreateTourRequest;
import at.tourplanner.tour_planner.api.dto.tour.UpdateTourRequest;
import at.tourplanner.tour_planner.api.dto.tourlog.TourLogResponse;
import at.tourplanner.tour_planner.features.tourlog.TourLog;
import at.tourplanner.tour_planner.features.transporttype.TransportType;
import at.tourplanner.tour_planner.features.transporttype.TransportTypeRepository;
import at.tourplanner.tour_planner.features.user.User;
import at.tourplanner.tour_planner.ors.directions.OrsDirectionsClient;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsFeature;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsRequest;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final TransportTypeRepository transportTypeRepository;
    private final OrsDirectionsClient orsDirectionsClient;

    // CRUD
    @Transactional
    public Tour createTour(CreateTourRequest request, User user) {
        OrsDirectionsRequest orsRequest = new OrsDirectionsRequest(List.of(
                List.of(request.fromLng(), request.fromLat()),   // ORS expects [lng, lat]
                List.of(request.toLng(), request.toLat())
        ));
        OrsDirectionsResponse orsResponse = orsDirectionsClient.getDirections(request.profile(), orsRequest);
        OrsDirectionsFeature feature = orsResponse.features().getFirst();

        LineString route = buildLineString(feature.geometry().coordinates());
        TransportType transportType = transportTypeRepository
                .findByTransportationName(request.profile())
                .orElse(null);

        Tour tour = new Tour();
        tour.setUser(user);
        tour.setName(request.name());
        tour.setDescription(request.description());
        tour.setFromAddress(request.fromAddress());
        tour.setToAddress(request.toAddress());
        tour.setRoute(route);
        tour.setDistanceKm(feature.properties().summary().distance() / 1000.0);
        tour.setEstimatedTimeS((long) feature.properties().summary().duration());
        tour.setTransportType(transportType);

        tourRepository.save(tour);
        log.info("Created tour [{}] for user [{}]", tour.getTourId(), user.getUserId());
        return tour;
    }

    @Transactional(readOnly = true)
    public List<Tour> getToursForUser(User user) {
        return tourRepository.findByUserId(user.getUserId());
    }

    @Transactional(readOnly = true)
    public Tour getTourForUser(Long tourId, User user) {
        return tourRepository.findByIdAndUserId(tourId, user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Tour not found: " + tourId));
    }

    @Transactional
    public Tour updateTour(Long tourId, UpdateTourRequest request, User user) {
        Tour tour = getTourForUser(tourId, user);

        if (request.name() != null)        tour.setName(request.name());
        if (request.description() != null) tour.setDescription(request.description());

        // Re-route only when coordinates && profile are all provided
        boolean hasCoords = request.fromLat() != null && request.fromLng() != null
                && request.toLat() != null && request.toLng() != null;
        if (hasCoords && request.profile() != null) {
            OrsDirectionsRequest orsRequest = new OrsDirectionsRequest(List.of(
                    List.of(request.fromLng(), request.fromLat()),
                    List.of(request.toLng(), request.toLat())
            ));
            OrsDirectionsResponse orsResponse = orsDirectionsClient.getDirections(request.profile(), orsRequest);
            OrsDirectionsFeature feature = orsResponse.features().getFirst();
            tour.setRoute(buildLineString(feature.geometry().coordinates()));
            tour.setDistanceKm(feature.properties().summary().distance() / 1000.0);
            tour.setEstimatedTimeS((long) feature.properties().summary().duration());

            transportTypeRepository.findByTransportationName(request.profile())
                    .ifPresent(tour::setTransportType);
        }

        log.info("Updated tour [{}]", tourId);
        return tourRepository.save(tour);
    }

    @Transactional
    public void deleteTour(Long tourId, User user) {
        Tour tour = getTourForUser(tourId, user);
        tourRepository.delete(tour);
        log.info("Deleted tour [{}]", tourId);
    }

    // computed stuff
    public int getPopularity(Tour tour) {
        return tour.getLogs().size();
    }

    /**
     * Child-friendliness score in [0, 1].
     * Derived from the inverse average difficulty, scaled total time & scaled distance.
     * All three axes are normalised to [0,1] before averaging:
     *   - difficulty 1 → best, 5 → worst  (inverted)
     *   - time       ≤ 60 min → best, ≥ 240 min → worst
     *   - distance   ≤ 5 km  → best, ≥ 30 km  → worst
     * Returns 0 if there are no logs (unknown friendliness).
     */
    public double getChildFriendliness(Tour tour) {
        List<TourLog> logs = tour.getLogs();
        if (logs.isEmpty()) return 0.0;

        double avgDifficulty = logs.stream().mapToInt(TourLog::getDifficulty).average().orElse(3.0);
        double avgTimeMin    = logs.stream().mapToLong(TourLog::getTotalTimeS).average().orElse(3600) / 60.0;
        double avgDistKm     = logs.stream()
                .mapToDouble(l -> l.getTotalDistanceKm().doubleValue())
                .average().orElse(10.0);

        double diffScore = 1.0 - (avgDifficulty - 1.0) / 4.0;           
        double timeScore = 1.0 - clamp((avgTimeMin - 60.0) / 180.0);    
        double distScore = 1.0 - clamp((avgDistKm  -  5.0) /  25.0);   

        return (diffScore + timeScore + distScore) / 3.0;
    }

    // search
    @Transactional(readOnly = true)
    public List<Tour> searchTours(String query, User user) {
        return tourRepository.searchByUserId(user.getUserId(), query);
    }

    // export & import
    @Transactional(readOnly = true)
    public List<TourExportEntry> exportTours(User user) {
        return tourRepository.findByUserId(user.getUserId()).stream()
                .map(tour -> new TourExportEntry(
                        tour.getName(),
                        tour.getDescription(),
                        tour.getFromAddress(),
                        tour.getToAddress(),
                        tour.getTransportType() != null ? tour.getTransportType().getTransportationName() : null,
                        tour.getDistanceKm() != null ? tour.getDistanceKm() : 0,
                        tour.getEstimatedTimeS() != null ? tour.getEstimatedTimeS() : 0,
                        tour.getLogs().stream().map(TourLogResponse::from).toList()
                ))
                .toList();
    }

    @Transactional
    public List<Tour> importTours(List<TourExportEntry> entries, User user) {
        return entries.stream().map(entry -> {
            Tour tour = new Tour();
            tour.setUser(user);
            tour.setName(entry.name());
            tour.setDescription(entry.description());
            tour.setFromAddress(entry.fromAddress());
            tour.setToAddress(entry.toAddress());
            tour.setDistanceKm(entry.distanceKm());
            tour.setEstimatedTimeS(entry.estimatedTimeS());
            transportTypeRepository.findByTransportationName(entry.transportTypeName())
                    .ifPresent(tour::setTransportType);
            // note: route geometry & logs are not re-imported to avoid re-geocoding costs
            tourRepository.save(tour);
            log.info("Imported tour [{}] for user [{}]", tour.getName(), user.getUserId());
            return tour;
        }).toList();
    }

    // hlpers 

    private LineString buildLineString(List<List<Double>> coordinates) {
        GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate[] coords = coordinates.stream()
                .map(c -> new Coordinate(c.get(0), c.get(1)))
                .toArray(Coordinate[]::new);
        return gf.createLineString(coords);
    }

    private static double clamp(double value) {
        return Math.max(0.0, Math.min(1.0, value));
    }
}