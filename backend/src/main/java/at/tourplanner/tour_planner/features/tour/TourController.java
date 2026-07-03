package at.tourplanner.tour_planner.features.tour;

import at.tourplanner.tour_planner.api.dto.export.TourExportEntry;
import at.tourplanner.tour_planner.api.dto.tour.CreateTourRequest;
import at.tourplanner.tour_planner.api.dto.tour.TourResponse;
import at.tourplanner.tour_planner.api.dto.tour.TourSummaryResponse;
import at.tourplanner.tour_planner.api.dto.tour.UpdateTourRequest;
import at.tourplanner.tour_planner.features.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    // POST /api/tours
    @PostMapping
    public ResponseEntity<TourResponse> createTour(
            @RequestBody @Valid CreateTourRequest request,
            @AuthenticationPrincipal User user
    ) {
        Tour tour = tourService.createTour(request, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(TourResponse.from(tour,
                        tourService.getPopularity(tour),
                        tourService.getChildFriendliness(tour)));
    }

    // GET /api/tours
    @GetMapping
    public ResponseEntity<List<TourSummaryResponse>> getTours(
            @AuthenticationPrincipal User user
    ) {
        List<TourSummaryResponse> tours = tourService.getToursForUser(user).stream()
                .map(t -> TourSummaryResponse.from(t,
                        tourService.getPopularity(t),
                        tourService.getChildFriendliness(t)))
                .toList();
        return ResponseEntity.ok(tours);
    }

    // GET /api/tours/{id}
    @GetMapping("/{id}")
    public ResponseEntity<TourResponse> getTour(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        Tour tour = tourService.getTourForUser(id, user);
        return ResponseEntity.ok(TourResponse.from(tour,
                tourService.getPopularity(tour),
                tourService.getChildFriendliness(tour)));
    }

    // PATCH /api/tours/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<TourResponse> updateTour(
            @PathVariable Long id,
            @RequestBody @Valid UpdateTourRequest request,
            @AuthenticationPrincipal User user
    ) {
        Tour tour = tourService.updateTour(id, request, user);
        return ResponseEntity.ok(TourResponse.from(tour,
                tourService.getPopularity(tour),
                tourService.getChildFriendliness(tour)));
    }

    // DELETE /api/tours/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        tourService.deleteTour(id, user);
        return ResponseEntity.noContent().build();
    }

    // GET /api/tours/search?q=...
    @GetMapping("/search")
    public ResponseEntity<List<TourSummaryResponse>> search(
            @RequestParam String q,
            @AuthenticationPrincipal User user
    ) {
        List<TourSummaryResponse> results = tourService.searchTours(q, user).stream()
                .map(t -> TourSummaryResponse.from(t,
                        tourService.getPopularity(t),
                        tourService.getChildFriendliness(t)))
                .toList();
        return ResponseEntity.ok(results);
    }

    // GET /api/tours/export  – returns JSON array as download
    @GetMapping("/export")
    public ResponseEntity<List<TourExportEntry>> exportTours(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(tourService.exportTours(user));
    }

    // POST /api/tours/import
    @PostMapping("/import")
    public ResponseEntity<List<TourSummaryResponse>> importTours(
            @RequestBody List<TourExportEntry> entries,
            @AuthenticationPrincipal User user
    ) {
        List<TourSummaryResponse> imported = tourService.importTours(entries, user).stream()
                .map(t -> TourSummaryResponse.from(t, 0, 0.0))
                .toList();
        return ResponseEntity.status(HttpStatus.CREATED).body(imported);
    }
}