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
                List.of(request.fromGeocode().lng(), request.fromGeocode().lat()),   // ORS expects [lng, lat] I think
                List.of(request.toGeocode().lng(), request.toGeocode().lat())
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
        tour.setFromAddress(request.fromGeocode().label());
        tour.setToAddress(request.toGeocode().label());
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

    public Tour getTourForUser(Long tourId, User user) {
        return tourRepository.findByIdAndUserId(tourId, user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Tour not found: " + tourId));
    }

    @Transactional
    public Tour updateTour(Long tourId, UpdateTourRequest request, User user) {
        // Inline — don't call getTourForUser, load directly in this transaction
        Tour tour = tourRepository.findByIdAndUserId(tourId, user.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("Tour not found: " + tourId));

        if (!request.name().equals(tour.getName())) {
            tour.setName(request.name());
        }

        if (!request.description().equals(tour.getDescription())) {
            tour.setDescription(request.description());
        }


        transportTypeRepository.findByTransportationName(request.profile())
                .ifPresent((tt) -> {
                    if (!tt.equals(tour.getTransportType())) {
                        tour.setTransportType(tt);
                    }
                });

        if (!request.fromGeocode().label().equals(tour.getFromAddress()) || !request.toGeocode().label().equals(tour.getToAddress())) {

            String routingProfile = request.profile() != null ? request.profile() : tour.getTransportType() != null
                                                                                    ? tour.getTransportType().getTransportationName() : "foot-walking";

            // request the new route from ors
            OrsDirectionsRequest orsRequest = new OrsDirectionsRequest(List.of(
                    List.of(request.fromGeocode().lng(), request.fromGeocode().lat()),
                    List.of(request.toGeocode().lng(), request.toGeocode().lat())
            ));
            OrsDirectionsResponse orsResponse = orsDirectionsClient.getDirections(routingProfile, orsRequest);
            OrsDirectionsFeature feature = orsResponse.features().getFirst();

            tour.setRoute(buildLineString(feature.geometry().coordinates()));
            tour.setDistanceKm(feature.properties().summary().distance() / 1000.0);
            tour.setEstimatedTimeS((long) feature.properties().summary().duration());
        }

        if (!request.fromGeocode().label().equals(tour.getFromAddress())) {
            tour.setFromAddress(request.fromGeocode().label());
        }

        if (!request.toGeocode().label().equals(tour.getToAddress())) {
            tour.setToAddress(request.toGeocode().label());
        }

        log.info("About to save tour [{}] name='{}' from='{}' to='{}'",
                tour.getTourId(), tour.getName(), tour.getFromAddress(), tour.getToAddress());
        return tourRepository.saveAndFlush(tour);  // saveAndFlush forces immediate write
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

    /*
     child-friendliness score in [0, 1]
     derived from inverse average difficulty, scaled total time & scaled distance
     all three axes normalized to [0,1] before averaging:
       - difficulty 1 = best, 5 = worst  (inverted)
       - time       <=60 min = best, >= 240 min = worst
       - distance   <= 5 km  = best, >= 30 km  = worst
     returns 0 if no logs (unknown friendliness)
     */
    public double getChildFriendliness(Tour tour) {
        List<TourLog> logs = tour.getLogs();
        if (logs.isEmpty()) return 0.0;

        double avgDifficulty = logs.stream().mapToInt(TourLog::getDifficulty).average().orElse(3.0);
        double avgTimeMin = logs.stream().mapToLong(TourLog::getTotalTimeS).average().orElse(3600) / 60.0;
        double avgDistKm = logs.stream()
                .mapToLong(l -> l.getTotalDistanceKm() != null ? l.getTotalDistanceKm() : 0L)
                .average().orElse(10.0);

        double diffScore = 1.0 - (avgDifficulty - 1.0) / 4.0;
        double timeScore = 1.0 - clamp((avgTimeMin - 60.0) / 180.0);
        double distScore = 1.0 - clamp((avgDistKm - 5.0) / 25.0);

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