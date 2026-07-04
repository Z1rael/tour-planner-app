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

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class TourLogController {

    private final TourLogService tourLogService;

    // POST /api/logs
    @PostMapping
    public ResponseEntity<TourLogResponse> createLog(
            @RequestBody @Valid CreateTourLogRequest request,
            @AuthenticationPrincipal User user
    ) {
        TourLog log = tourLogService.createLog(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(TourLogResponse.from(log, user));
    }

    // GET /api/logs?tourId=...
    @GetMapping
    public ResponseEntity<List<TourLogResponse>> getLogs(
            @RequestParam(required = false) Long tourId,
            @AuthenticationPrincipal User user
    ) {
        List<TourLogResponse> logs;

        // return either all logs from the user or for a specified tour
        if (tourId == null) {
            logs = tourLogService.getAllLogsForUser(user).stream()
                    .map(tl -> TourLogResponse.from(
                            tl,
                            user
                    ))
                    .toList();
        } else {
            logs = tourLogService.getLogsForTour(tourId).stream()
                    .map(tl -> TourLogResponse.from(
                            tl,
                            user
                    ))
                    .toList();
        }

        return ResponseEntity.ok(logs);
    }

    // GET /api/logs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<TourLogResponse> getLog(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(TourLogResponse.from(tourLogService.getLog(id), user));
    }

    // PATCH /api/logs/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<TourLogResponse> updateLog(
            @PathVariable Long id,
            @RequestBody @Valid UpdateTourLogRequest request,
            @AuthenticationPrincipal User user
    ) {
        TourLog log = tourLogService.updateLog(id, request, user);
        return ResponseEntity.ok(TourLogResponse.from(log, user));
    }

    // DELETE /api/logs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        tourLogService.deleteLog(id, user);
        return ResponseEntity.noContent().build();
    }

    // GET /api/logs/search?q=...
    @GetMapping("/search")
    public ResponseEntity<List<TourLogResponse>> search(
            @RequestParam String q,
            @AuthenticationPrincipal User user
    ) {
        List<TourLogResponse> results = tourLogService.searchLogs(q, user).stream()
                .map(tl -> TourLogResponse.from(
                        tl,
                        user
                ))
                .toList();
        return ResponseEntity.ok(results);
    }
}