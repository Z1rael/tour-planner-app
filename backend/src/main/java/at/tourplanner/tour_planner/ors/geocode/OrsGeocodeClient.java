package at.tourplanner.tour_planner.ors.geocode;

import at.tourplanner.tour_planner.ors.config.OrsClientConfig;
import at.tourplanner.tour_planner.ors.geocode.model.OrsGeocodeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ors-geocode", url = "${ors.url}", configuration = OrsClientConfig.class)
public interface OrsGeocodeClient {

    @GetMapping("/geocode/search")
    OrsGeocodeResponse search(
            @RequestParam("text") String query,
            @RequestParam(value = "size", defaultValue = "5") int size
    );
}
