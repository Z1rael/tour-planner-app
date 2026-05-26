package at.tourplanner.tour_planner.ors.geocode;

import at.tourplanner.tour_planner.api.dto.geocode.GeocodeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/geocode")
@RequiredArgsConstructor
public class GeocodeController {

    private final GeocodeService geocodeService;

    @GetMapping
    public ResponseEntity<List<GeocodeDTO>> search(
            @RequestParam String query
    ) {
        return ResponseEntity.ok(geocodeService.search(query));
    }
}
