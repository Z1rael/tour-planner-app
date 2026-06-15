package at.tourplanner.tour_planner.features.tourlog;

import at.tourplanner.tour_planner.api.dto.tourlog.CreateTourLogRequest;
import at.tourplanner.tour_planner.api.dto.tourlog.TourLogResponse;
import at.tourplanner.tour_planner.api.dto.tourlog.UpdateTourLogRequest;
import at.tourplanner.tour_planner.features.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours/{tourId}/logs")
@RequiredArgsConstructor
public class TourLogController {

    private final TourLogService tourLogService;

    @GetMapping
    public ResponseEntity<List<TourLogResponse>> getLogs(
            @PathVariable Long tourId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(tourLogService.getLogs(tourId, user));
    }

    @GetMapping("/{logId}")
    public ResponseEntity<TourLogResponse> getLog(
            @PathVariable Long tourId,
            @PathVariable Long logId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(tourLogService.getLog(tourId, logId, user));
    }

    @PostMapping
    public ResponseEntity<TourLogResponse> createLog(
            @PathVariable Long tourId,
            @RequestBody @Valid CreateTourLogRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tourLogService.createLog(tourId, request, user));
    }

    @PutMapping("/{logId}")
    public ResponseEntity<TourLogResponse> updateLog(
            @PathVariable Long tourId,
            @PathVariable Long logId,
            @RequestBody @Valid UpdateTourLogRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(tourLogService.updateLog(tourId, logId, request, user));
    }

    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long tourId,
            @PathVariable Long logId,
            @AuthenticationPrincipal User user) {
        tourLogService.deleteLog(tourId, logId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TourLogResponse>> search(
            @PathVariable Long tourId,
            @RequestParam String q,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(tourLogService.search(tourId, q, user));
    }
}