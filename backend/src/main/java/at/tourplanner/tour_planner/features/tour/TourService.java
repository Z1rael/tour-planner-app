package at.tourplanner.tour_planner.features.tour;

import at.tourplanner.tour_planner.api.dto.tour.CreateTourRequest;
import at.tourplanner.tour_planner.api.dto.tour.TourResponse;
import at.tourplanner.tour_planner.api.dto.tour.UpdateTourRequest;
import at.tourplanner.tour_planner.features.transporttype.TransportType;
import at.tourplanner.tour_planner.features.transporttype.TransportTypeRepository;
import at.tourplanner.tour_planner.features.user.User;
import at.tourplanner.tour_planner.ors.directions.OrsDirectionsClient;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsFeature;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsRequest;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsResponse;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.geojson.GeoJsonReader;
import org.locationtech.jts.io.geojson.GeoJsonWriter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final TransportTypeRepository transportTypeRepository;
    private final OrsDirectionsClient orsDirectionsClient;
    private final ObjectMapper objectMapper;

    public Tour createTour(CreateTourRequest request, User user) throws ParseException {
        OrsDirectionsRequest orsRequest = new OrsDirectionsRequest(List.of(
                List.of(request.fromLng(), request.fromLat()),
                List.of(request.toLng(), request.toLat())
        ));

        OrsDirectionsResponse orsResponse = orsDirectionsClient.getDirections(request.profile(), orsRequest);

        OrsDirectionsFeature feature = orsResponse.features().getFirst();

        LineString route = buildLineString(feature.geometry().coordinates());
        Optional<TransportType> optTransportType = transportTypeRepository.findByTransportationName(request.profile());


        Tour tour = new Tour();
        tour.setUser(user);
        tour.setName(request.name());
        tour.setDescription(request.description());
        tour.setRoute(route);
        tour.setDistanceKm(feature.properties().summary().distance() / 1000.0);
        tour.setEstimatedTimeS((long) feature.properties().summary().duration());
        optTransportType.ifPresent(tour::setTransportType);

        tourRepository.save(tour);

        return tour;
    }

    public List<TourResponse> getTours(User user) {
        return tourRepository.findByUserUserId(user.getUserId())
                .stream().map(TourResponse::from).toList();
    }

    public Tour getTour(User user, Long id) {
        return tourRepository.findByTourIdAndUserUserId(id, user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));
    }

    public TourResponse updateTour(Long id, UpdateTourRequest request, User user) {
        Tour tour = findOwnedOrThrow(id, user);
        if (request.name() != null)        tour.setName(request.name());
        if (request.description() != null) tour.setDescription(request.description());
        return TourResponse.from(tourRepository.save(tour));
    }

    public void deleteTour(Long id, User user) {
        Tour tour = findOwnedOrThrow(id, user);
        tourRepository.delete(tour);
    }

    public List<TourResponse> search(String query, User user) {
        return tourRepository.searchByUserId(user.getUserId(), query)
                .stream().map(TourResponse::from).toList();
    }

    public byte[] exportToJson(User user) {
        try {
            List<Tour> tours = tourRepository.findByUserUserId(user.getUserId());
            // Serialize geometry as GeoJSON string per tour
            List<Map<String, Object>> payload = tours.stream().map(t -> Map.<String, Object>of(
                    "name", t.getName(),
                    "description", t.getDescription() != null ? t.getDescription() : "",
                    "distanceKm", t.getDistanceKm(),
                    "estimatedTimeS", t.getEstimatedTimeS(),
                    "routeGeoJson", new GeoJsonWriter().write(t.getRoute()),
                    "transportType", t.getTransportType() != null
                            ? t.getTransportType().getTransportationName() : ""
            )).toList();
            return objectMapper.writeValueAsBytes(payload);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Export failed", e);
        }
    }

    public List<TourResponse> importFromJson(byte[] data, User user) {
        try {
            List<Map<String, Object>> payload =
                    objectMapper.readValue(data, objectMapper.getTypeFactory()
                            .constructCollectionType(List.class, Map.class));

            List<Tour> saved = payload.stream().map(entry -> {
                Tour tour = new Tour();
                tour.setUser(user);
                tour.setName((String) entry.get("name"));
                tour.setDescription((String) entry.get("description"));
                tour.setDistanceKm(((Number) entry.get("distanceKm")).doubleValue());
                tour.setEstimatedTimeS(((Number) entry.get("estimatedTimeS")).longValue());

                // Re-parse the stored GeoJSON back to a JTS LineString
                String geoJson = (String) entry.get("routeGeoJson");
                try {
                    org.locationtech.jts.io.geojson.GeoJsonReader reader =
                            new org.locationtech.jts.io.geojson.GeoJsonReader();
                    tour.setRoute((LineString) reader.read(geoJson));
                } catch (Exception ex) {
                    throw new RuntimeException("Bad routeGeoJson in import", ex);
                }

                String transport = (String) entry.get("transportType");
                if (transport != null && !transport.isBlank()) {
                    transportTypeRepository.findByTransportationName(transport)
                            .ifPresent(tour::setTransportType);
                }
                return tourRepository.save(tour);
            }).toList();

            return saved.stream().map(TourResponse::from).toList();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Import failed: " + e.getMessage(), e);
        }
    }

    //helpers

    private Tour findOwnedOrThrow(Long id, User user) {
        return tourRepository.findByTourIdAndUserUserId(id, user.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tour not found"));
    }

    private LineString buildLineString(List<List<Double>> coordinates) {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        Coordinate[] coords = coordinates.stream()
                .map(c -> new Coordinate(c.getFirst(), c.get(1)))
                .toArray(Coordinate[]::new);

        return geometryFactory.createLineString(coords);
    }

}
