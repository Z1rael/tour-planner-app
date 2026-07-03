package at.tourplanner.tour_planner.ors.geocode;

import at.tourplanner.tour_planner.api.dto.geocode.GeocodeDTO;
import at.tourplanner.tour_planner.ors.geocode.model.OrsGeocodeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeocodeService {

    private final OrsGeocodeClient orsGeocodeClient;

    public List<GeocodeDTO> search(String query) {
        OrsGeocodeResponse response = orsGeocodeClient.search(query, 5);

        return response.features().stream()
                .map(feature -> new GeocodeDTO(
                        feature.properties().label(),
                        feature.geometry().coordinates().get(1),
                        feature.geometry().coordinates().getFirst()
                ))
                .toList();
    }
}
