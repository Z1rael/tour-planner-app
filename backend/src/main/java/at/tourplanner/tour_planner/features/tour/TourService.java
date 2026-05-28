package at.tourplanner.tour_planner.features.tour;

import at.tourplanner.tour_planner.api.dto.tour.CreateTourRequest;
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
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;
    private final TransportTypeRepository transportTypeRepository;
    private final OrsDirectionsClient orsDirectionsClient;

    public Tour createTour(CreateTourRequest request, User user) throws ParseException {
        OrsDirectionsRequest orsRequest = new OrsDirectionsRequest(List.of(
                List.of(request.fromLat(), request.fromLng()),
                List.of(request.toLat(), request.toLng())
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


    private LineString buildLineString(List<List<Double>> coordinates) {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        Coordinate[] coords = coordinates.stream()
                .map(c -> new Coordinate(c.getFirst(), c.get(1)))
                .toArray(Coordinate[]::new);

        return geometryFactory.createLineString(coords);
    }

}
