package at.tourplanner.tour_planner.features.tour;

import at.tourplanner.tour_planner.api.dto.tour.CreateTourRequest;
import at.tourplanner.tour_planner.api.dto.tour.TourResponse;
import at.tourplanner.tour_planner.api.dto.tour.UpdateTourRequest;
import at.tourplanner.tour_planner.features.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ResponseEntity<List<TourResponse>> getTours(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(tourService.getTours(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourResponse> getTourById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        Tour tour = tourService.getTour(user, id);
        return ResponseEntity.ok(TourResponse.from(tour));
    }

    @PostMapping
    public ResponseEntity<TourResponse> createTour(
            @RequestBody @Valid CreateTourRequest request,
            @AuthenticationPrincipal User user
    ) throws Exception {
       Tour tour = tourService.createTour(request, user);
       return ResponseEntity.status(HttpStatus.CREATED).body(TourResponse.from(tour));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourResponse> updateTour(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid UpdateTourRequest request
    ) throws Exception {
            return ResponseEntity.ok(TourResponse.from(tourService.updateTour(id, request, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        tourService.deleteTour(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TourResponse>> searchTours(
            @AuthenticationPrincipal User user,
            @RequestParam String query
    ) {
        return ResponseEntity.ok(tourService.searchTours(user, query));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTours(
            @AuthenticationPrincipal User user,
            @RequestParam String format
    ) {
        byte[] exportData = tourService.exportTours(user, format);
        return ResponseEntity.ok(exportData);
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importTours(
            @AuthenticationPrincipal User user,
            @RequestParam String format
    ) {
        tourService.importTours(user, format);
        return ResponseEntity.ok().build();
    }

}
