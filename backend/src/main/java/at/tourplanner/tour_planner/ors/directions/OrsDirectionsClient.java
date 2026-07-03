package at.tourplanner.tour_planner.ors.directions;

import at.tourplanner.tour_planner.ors.config.OrsClientConfig;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsRequest;
import at.tourplanner.tour_planner.ors.directions.model.OrsDirectionsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ors-directions", url = "${ors.url}", configuration = OrsClientConfig.class)
public interface OrsDirectionsClient {

    @PostMapping("/v2/directions/{profile}/geojson")
    OrsDirectionsResponse getDirections(
            @PathVariable("profile") String profile,
            @RequestBody OrsDirectionsRequest request
    );
}
