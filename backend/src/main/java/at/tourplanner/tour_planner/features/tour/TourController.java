package at.tourplanner.tour_planner.features.tour;

import at.tourplanner.tour_planner.api.dto.tour.CreateTourRequest;
import at.tourplanner.tour_planner.api.dto.tour.TourResponse;
import at.tourplanner.tour_planner.features.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @PostMapping
    public ResponseEntity<TourResponse> createTour(
            @RequestBody @Valid CreateTourRequest request) throws Exception { // TODO(Felix): add AuthenticationPrincipal later

       // Tour tour = tourService.createTour(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new TourResponse(
                1L,
                "TestTour",
                "ladiladila",
                420,
                69,
                ""
        ));
    }
}
